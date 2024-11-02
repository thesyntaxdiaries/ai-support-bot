# AI Customer Support Bot

An intelligent customer support bot built with Node.js and OpenAI GPT-3.5, handling 300+ queries daily at $50/month.

![Chat Interface](https://miro.medium.com/v2/resize:fit:3842/format:webp/1*Yt-NrP-IJLq67Bqxc46Zmg.png)

## Features

- 🤖 AI-powered responses using GPT-3.5
- 📦 Product catalog integration
- 😊 Sentiment analysis
- 💬 Conversation memory
- 📱 Professional chat interface
- 📊 Real-time product availability checks
- ⚡ Fast response times (~2 seconds)
- 💰 Cost-effective ($50/month)

## Tech Stack

- Node.js & Express
- OpenAI GPT-3.5
- JSON Server (for demo database)
- Winston (logging)
- Sentiment Analysis
- TailwindCSS (UI)

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- OpenAI API key

## Installation

1. Clone the repository
```bash
git clone https://github.com/thesyntaxdiaries/ai-support-bot.git
cd ai-support-bot
```

2. Install dependencies
```bash
npm install
```

3. Create environment file
```bash
cp .env.example .env
```

4. Update `.env` with your OpenAI API key
```env
PORT=3000
OPENAI_API_KEY=your_api_key_here
NODE_ENV=development
LOG_LEVEL=info
```

## Running the Application

1. Start both API and JSON server
```bash
npm run dev:all
```

2. Open `index.html` in your browser
- Use VS Code Live Server
- Or simply double-click the file

The application will be running on:
- API Server: http://localhost:3000
- JSON Server: http://localhost:3001
- Chat Interface: Open index.html in browser

## API Endpoints

### Chat Endpoint
```bash
POST /api/chat
Content-Type: application/json

{
    "message": "Do you have the Classic T-Shirt in blue?",
    "userId": "user123"
}
```

### Health Check
```bash
GET /health
```

## Project Structure

```
ai-support-bot/
├── db.json                # Product database
├── index.html            # Chat interface
├── .env                  # Configuration
├── package.json          # Dependencies
└── src/
    ├── index.js          # Main server
    ├── routes.js         # API routes
    ├── controllers/
    │   └── chatController.js
    ├── services/
    │   ├── chatService.js
    │   └── productService.js
    └── utils/
        ├── logger.js
        └── sentiment.js
```

## Testing

Test the chat interface with these sample queries:
- "Do you have the Classic T-Shirt in blue?"
- "What's your return policy?"
- "Tell me about the Denim Jeans sizes"
- "I need help with my order"

## Cost Management

The bot is optimized to keep costs low:
- Token usage optimization
- Conversation context management
- Response caching for common queries

Monthly costs breakdown:
- OpenAI API: $25-30
- Hosting: $5-10
- Monitoring: $10

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

- OpenAI for GPT-3.5
- JSON Server team
- TailwindCSS team
