const fs = require('fs');
const path = require('path');

// Function to create logs directory if it doesn't exist
const createDirectoryIfNotExists = () => {
    // Create 'logs' directory at the root of the project (outside utils)
    const logsDir = path.join(__dirname, '..', 'logs');  // Use '..' to go one level up

    if (!fs.existsSync(logsDir)) {
        try {
            fs.mkdirSync(logsDir, { recursive: true });
            console.log('Created logs directory');
        } catch (err) {
            console.error(`Failed to create logs directory: ${err.message}`);
            throw new Error('Failed to create logs directory');
        }
    }
};

module.exports = createDirectoryIfNotExists;
