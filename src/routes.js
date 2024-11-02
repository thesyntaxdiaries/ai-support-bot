 
const { handleChat } = require('./controllers/chatController');

const setupRoutes = (app) => {
  app.post('/api/chat', handleChat);
  
  app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
  });
};

module.exports = { setupRoutes };