const express = require('express');
const dotenv = require('dotenv');
const logger = require('./Logger/logger');
const keepAlive = require('./utils/keepAlive');
const createDirectoryIfNotExists = require('./utils/create_essential_directories');

// Initialization
const app = express();
dotenv.config();
const port = process.env.PORT || 3000;
createDirectoryIfNotExists();

// Health Check Route
app.get('/health', (req, res) => {
    logger('Received a keep-alive request', 'INFO');
    res.status(200).json({message: "Keep-alive request received"});
});

// Handle 404 for undefined routes
app.use((req, res) => {
    res.status(404).json({message: 'Not Found'}, {status: "404"});
});

// Cron Job
keepAlive();

// Start Server
app.listen(port, () => {
    try {
        logger(`Server successfully started on port ${port}`, 'INFO');
        console.log('Backend is up and running!');
    } catch (err) {
        logger(`Server startup failed: ${err.message}`, 'ERROR');
        console.log(`Error during startup: ${err.message}`);
        process.exit(1);
    }
});

