const { ChatService } = require('../services/chatService');
const { logger } = require('../utils/logger');

let chatService = null;

// Initialize the chat service after environment variables are loaded
const initializeChatService = () => {
    if (!chatService) {
        chatService = new ChatService();
    }
    return chatService;
};

const handleChat = async (req, res) => {
    try {
        const service = initializeChatService();
        const { message, userId } = req.body;

        if (!message || !userId) {
            return res.status(400).json({ error: 'Message and userId are required' });
        }

        const response = await service.handleCustomerQuery(message, userId);
        res.json(response);
    } catch (error) {
        logger.error('Error in chat handler:', error);
        res.status(500).json({ error: 'Failed to process chat message' });
    }
};

module.exports = { handleChat };