const axios = require('axios'); // Import axios
const cron = require('node-cron');
const dotenv = require('dotenv');
const logger = require('../Logger/logger');
dotenv.config();

/**
 * Sets up a cron job to periodically send a keep-alive request to a specified URL.
 * 
 * This function uses the `node-cron` library to schedule a task that sends an HTTPS
 * GET request to the URL specified in the environment variable `KEEP_ALIVE_URL`.
 * The task runs every 10 minutes to ensure the target service remains active, even
 * when idle for extended periods.
 * 
 * The cron job logs:
 * - A success message when the request is successfully sent.
 * - An error message if the request fails.
 * 
 * Preconditions:
 * - The `KEEP_ALIVE_URL` environment variable must be defined and valid.
 * 
 * Usage:
 * - Import and invoke the `keepAlive` function in your application to start the cron job.
 * 
 * Example:
 * ```
 * const keepAlive = require('./utils/keepAlive');
 * keepAlive();
 * ```
 * 
 * Logs:
 * - INFO: Successful keep-alive requests.
 * - ERROR: Failed keep-alive requests.
 */
const keepAlive = () => {
    const url = process.env.KEEP_ALIVE_URL;

    if (!url) {
        throw new Error('KEEP_ALIVE_URL is not defined in environment variables.');
    }

    // Scheduled cron job for every 10 minutes
    cron.schedule('*/10 * * * *', async () => {
        const maxRetries = process.env.MAX_RETRY; // Maximum number of retries
        const retryDelay = process.env.RETRY_DELAY; // Delay between retries in milliseconds

        let retries = 0;

        while (retries < maxRetries) {
            try {
                const response = await axios.get(url); // Send keep-alive request
                logger(`Keep-alive request - Sent successfully - ${url}`, 'KEEP ALIVE');
                break; // Exit retry loop on success
            } catch (err) {
                retries++;
                logger(`Keep-alive request failed: ${err.message}. Retry ${retries}/${maxRetries}`, 'ERROR');
                if (retries === maxRetries) {
                    logger(`Max retries reached. Keep-alive request failed permanently for ${url}`, 'ERROR');
                } else {
                    // Wait before retrying
                    await new Promise((resolve) => setTimeout(resolve, retryDelay));
                }
            }
        }
    });
};

module.exports = keepAlive;

