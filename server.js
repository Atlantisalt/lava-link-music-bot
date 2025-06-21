const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 5000;

// Import the main bot (this will start the Discord bot)
require('./index.js');

// Middleware for parsing JSON and serving static files
app.use(express.json());
app.use(express.static('public'));

// Root endpoint with bot status
app.get('/', (req, res) => {
    res.json({
        name: 'Discord Music Bot',
        status: 'Online',
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
        memory: {
            used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024) + ' MB',
            total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024) + ' MB'
        },
        version: '1.0.0',
        features: [
            'Music Playback',
            'Queue Management',
            'Spotify Integration',
            'Volume Control',
            'Loop & Shuffle'
        ]
    });
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        uptime: Math.floor(process.uptime()),
        timestamp: new Date().toISOString(),
        service: 'discord-music-bot'
    });
});

// Status endpoint for monitoring
app.get('/status', (req, res) => {
    res.json({
        bot: {
            status: 'running',
            uptime: Math.floor(process.uptime()),
            memory: process.memoryUsage(),
            pid: process.pid
        },
        server: {
            port: port,
            environment: process.env.NODE_ENV || 'development',
            timestamp: new Date().toISOString()
        }
    });
});

// Ping endpoint for keep-alive services
app.get('/ping', (req, res) => {
    res.send('pong');
});

// API endpoint to get bot information
app.get('/api/info', (req, res) => {
    res.json({
        name: 'Discord Music Bot',
        description: 'A feature-rich Discord music bot with Lavalink support',
        commands: [
            { name: 'play', description: 'Play a song or playlist' },
            { name: 'pause', description: 'Pause the current track' },
            { name: 'resume', description: 'Resume the current track' },
            { name: 'skip', description: 'Skip the current track' },
            { name: 'stop', description: 'Stop playback and clear queue' },
            { name: 'queue', description: 'Show the current queue' },
            { name: 'nowplaying', description: 'Show current track info' },
            { name: 'volume', description: 'Adjust player volume' },
            { name: 'shuffle', description: 'Shuffle the current queue' },
            { name: 'loop', description: 'Toggle queue loop mode' },
            { name: 'help', description: 'Show help message' }
        ],
        prefix: process.env.BOT_PREFIX || '!',
        version: '1.0.0'
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Express error:', err);
    res.status(500).json({
        error: 'Internal server error',
        message: 'Something went wrong with the server'
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        error: 'Not found',
        message: 'The requested endpoint does not exist'
    });
});

// Start the server
const server = app.listen(port, '0.0.0.0', () => {
    console.log(`🌐 Web server running on port ${port}`);
    console.log(`📊 Status endpoint: http://localhost:${port}/status`);
    console.log(`💓 Health check: http://localhost:${port}/health`);
});

// Graceful shutdown handling
process.on('SIGTERM', () => {
    console.log('🔄 SIGTERM received, shutting down gracefully');
    server.close(() => {
        console.log('✅ Server closed');
        process.exit(0);
    });
});

process.on('SIGINT', () => {
    console.log('🔄 SIGINT received, shutting down gracefully');
    server.close(() => {
        console.log('✅ Server closed');
        process.exit(0);
    });
});

// Enhanced error handling
process.on('unhandledRejection', (reason, promise) => {
    console.error('🚨 Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
    console.error('🚨 Uncaught Exception:', error);
    // Don't exit immediately, let the process handle it gracefully
});

module.exports = app;
