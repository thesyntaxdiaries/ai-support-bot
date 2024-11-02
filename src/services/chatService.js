const { OpenAI } = require('openai');
const { analyzeMessageSentiment } = require('../utils/sentiment');
const { logger } = require('../utils/logger');
const axios = require('axios');

class ChatService {
    constructor() {
        if (!process.env.OPENAI_API_KEY) {
            throw new Error('OpenAI API key is not configured');
        }

        try {
            this.openai = new OpenAI({
                apiKey: process.env.OPENAI_API_KEY
            });
        } catch (error) {
            logger.error('Failed to initialize OpenAI:', error);
            throw error;
        }

        this.conversations = new Map();
        this.baseURL = 'http://localhost:3001';
    }

    async handleCustomerQuery(message, userId) {
        try {
            const history = this.getConversationHistory(userId);
            const sentiment = analyzeMessageSentiment(message);

            const productInfo = await this.extractProductInfo(message);
            let response;

            if (productInfo.isProductQuery) {
                response = await this.handleProductQuery(productInfo);
            } else {
                response = await this.generateResponse(message, history, sentiment);
            }

            this.updateHistory(userId, message, response);

            return {
                response,
                sentiment: sentiment.score,
                needsHuman: this.checkHumanNeed(sentiment.score, message)
            };
        } catch (error) {
            logger.error('Error handling customer query:', error);
            return this.getDefaultResponse();
        }
    }

    async extractProductInfo(message) {
        const colorKeywords = ['blue', 'red', 'black', 'color', 'colours', 'colors'];
        const queryKeywords = ['have', 'available', 'stock', 'find'];

        const words = message.toLowerCase().split(' ');
        const colors = colorKeywords.filter(color => words.includes(color));
        const isProductQuery = queryKeywords.some(keyword => words.includes(keyword));

        let productName = null;
        if (isProductQuery || colors.length > 0) {
            try {
                const response = await axios.get(`${this.baseURL}/products`);
                const products = response.data;
                productName = products.find(p =>
                    words.some(word => p.name.toLowerCase().includes(word))
                )?.name;
            } catch (error) {
                logger.error('Error fetching products:', error);
            }
        }

        return {
            isProductQuery: isProductQuery || colors.length > 0,
            colors,
            productName
        };
    }

    async handleProductQuery(productInfo) {
        if (!productInfo.productName) {
            return "I'd be happy to help you check product availability. Could you please specify which product you're interested in?";
        }

        try {
            const response = await axios.get(`${this.baseURL}/products`);
            const product = response.data.find(p =>
                p.name.toLowerCase().includes(productInfo.productName.toLowerCase())
            );

            if (!product) {
                return `I couldn't find a product matching '${productInfo.productName}'. Could you please provide the exact product name?`;
            }

            if (productInfo.colors.length > 0) {
                const color = productInfo.colors[0];
                const variant = product.variants.find(v =>
                    v.color.toLowerCase() === color.toLowerCase()
                );

                if (!variant) {
                    const availableColors = product.variants.map(v => v.color);
                    return `The ${product.name} is not available in ${color}. However, it is available in: ${availableColors.join(', ')}. Would you like to check any of these colors?`;
                }

                return `Yes! The ${product.name} is available in ${color}. We have ${variant.stock} units in stock in sizes ${variant.sizes.join(', ')}. Would you like to know more about any specific size?`;
            }

            const availableColors = product.variants.map(v => v.color);
            return `The ${product.name} is available in the following colors: ${availableColors.join(', ')}. Which color would you like to check?`;
        } catch (error) {
            logger.error('Error handling product query:', error);
            return "I'm sorry, I'm having trouble checking product information right now. Please try again later.";
        }
    }

    async generateResponse(message, history, sentiment) {
        const { relevantHistory, context } = this.optimizePrompt(message, history);

        try {
            const completion = await this.openai.chat.completions.create({
                model: 'gpt-3.5-turbo',
                messages: [
                    {
                        role: 'system',
                        content: `You are a helpful customer service representative for an e-commerce store. 
                                Be professional, concise, and friendly. If you can't help, offer to escalate 
                                to a human agent. Previous context: ${context}`
                    },
                    ...this.formatHistory(relevantHistory),
                    { role: 'user', content: message }
                ],
                max_tokens: 150,
                temperature: 0.7
            });

            return completion.choices[0].message.content;
        } catch (error) {
            logger.error('Error generating OpenAI response:', error);
            return this.getDefaultResponse().response;
        }
    }

    getConversationHistory(userId) {
        return this.conversations.get(userId) || [];
    }

    updateHistory(userId, message, response) {
        const history = this.getConversationHistory(userId);

        history.push({
            message,
            response,
            timestamp: new Date(),
            sentiment: analyzeMessageSentiment(message).score
        });

        if (history.length > 10) history.shift();
        this.conversations.set(userId, history);
    }

    optimizePrompt(message, history) {
        const relevantHistory = history.slice(-3);
        const context = this.summarizeContext(history.slice(0, -3));
        return { relevantHistory, context };
    }

    formatHistory(history) {
        return history.flatMap(entry => [
            { role: 'user', content: entry.message },
            { role: 'assistant', content: entry.response }
        ]);
    }

    summarizeContext(history) {
        if (!history.length) return '';
        return 'Previous interactions summary: ' +
            history.map(h => `${h.message} -> ${h.response}`).join('; ');
    }

    checkHumanNeed(sentimentScore, message) {
        return sentimentScore < -0.5 ||
            message.toLowerCase().includes('human') ||
            message.toLowerCase().includes('agent');
    }

    getDefaultResponse() {
        return {
            response: "I apologize, but I'm having trouble processing your request. Please try again or contact our human support team.",
            sentiment: 0,
            needsHuman: true
        };
    }
}

module.exports = { ChatService };