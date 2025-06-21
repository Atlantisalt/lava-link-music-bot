const express = require('express');
const app = express();
const port = process.env.PORT || 5000;

// Simple keep-alive endpoint
app.get('/', (req, res) => {
    res.json({
        status: 'Bot is alive!',
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
        memory: process.memoryUsage(),
        version: '1.0.0'
    });
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        uptime: process.uptime(),
        timestamp: new Date().toISOString()
    });
});

// Start the server
app.listen(port, '0.0.0.0', () => {
    console.log(`🚀 Keep-alive server running on port ${port}`);
});

module.exports = app;
