const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const fs = require('fs').promises;
const path = require('path');

dotenv.config();

// Ensure logs directory exists
async function ensureLogsDirectory() {
  try {
    const logsDir = path.join(__dirname, 'logs');
    await fs.mkdir(logsDir, { recursive: true });
    console.log('📁 Logs directory ready:', logsDir);
  } catch (error) {
    console.error('Failed to create logs directory:', error);
  }
}

ensureLogsDirectory();

const app = express();
const PORT = 3001; // Fixed port to avoid conflicts

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Routes
app.use('/api/generate', require('./routes/generate'));
app.use('/api/export', require('./routes/export'));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'Server is running', timestamp: new Date().toISOString() });
});

// Test Google AI API
app.post('/api/test-google', async (req, res) => {
  try {
    const { apiKey, model = 'gemini-1.5-flash' } = req.body;
    const axios = require('axios');
    
    console.log('Testing Google AI API with model:', model);
    
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
    console.log('Test URL:', url);
    
    const requestBody = {
      contents: [{
        parts: [{ text: "Hello, please respond with 'API is working!' and nothing else." }]
      }],
      generationConfig: {
        temperature: 0.1,
        maxOutputTokens: 100,
      }
    };
    
    const response = await axios.post(url, requestBody, {
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 30000
    });
    
    console.log('Google AI Test Response:', JSON.stringify(response.data, null, 2));
    
    if (response.data.candidates && response.data.candidates[0]) {
      const text = response.data.candidates[0].content.parts[0].text;
      res.json({ 
        success: true, 
        message: 'API is working!',
        response: text,
        fullData: response.data 
      });
    } else {
      res.json({ 
        success: false, 
        error: 'No candidates in response',
        fullData: response.data 
      });
    }
    
  } catch (error) {
    console.error('Google AI Test Error Details:');
    console.error('Status:', error.response?.status);
    console.error('Data:', JSON.stringify(error.response?.data, null, 2));
    console.error('Message:', error.message);
    
    res.status(error.response?.status || 500).json({ 
      success: false,
      error: error.message, 
      details: error.response?.data,
      status: error.response?.status,
      url: error.config?.url
    });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
});

module.exports = { app };