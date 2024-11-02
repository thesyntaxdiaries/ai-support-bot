 
const Sentiment = require('sentiment');
const sentiment = new Sentiment();

const analyzeMessageSentiment = (message) => {
  return sentiment.analyze(message);
};

module.exports = { analyzeMessageSentiment };