const express = require('express');
const cors = require('cors');
const { config, validateConfig } = require('./config');
const { setupRoutes } = require('./routes');
const { logger } = require('./utils/logger');

// Validate configuration before starting the server
try {
    validateConfig();
} catch (error) {
    console.error('Configuration error:', error.message);
    process.exit(1);
}

const app = express();

app.use(cors());
app.use(express.json());

// Setup routes
setupRoutes(app);

// Error handling middleware
app.use((err, req, res, next) => {
    logger.error('Unhandled error:', err);
    res.status(500).json({ error: 'Internal server error' });
});

// Start server
const port = config.port;
app.listen(port, () => {
    logger.info(`Server running on port ${port}`);
    logger.info(`Environment: ${config.nodeEnv}`);
});