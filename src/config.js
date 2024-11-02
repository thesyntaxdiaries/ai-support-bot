const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const config = {
    port: process.env.PORT || 3000,
    openaiApiKey: process.env.OPENAI_API_KEY,
    nodeEnv: process.env.NODE_ENV || 'development',
    logLevel: process.env.LOG_LEVEL || 'info'
};

// Validate required configuration
const validateConfig = () => {
    if (!config.openaiApiKey) {
        throw new Error('OPENAI_API_KEY is required but not set in environment variables');
    }
};

module.exports = { config, validateConfig };