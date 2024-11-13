require('dotenv').config(); // Load environment variables from .env

const { TwitterApi } = require('twitter-api-v2');
const fs = require('fs');
const path = require('path');

/**
 * Uploads an image and posts a tweet with text using credentials from the .env file
 * @param {object} config - The configuration object containing the Twitter API credentials and tweet message
 * @returns {Promise<void>}
 */
async function uploadToTwitter(config) {
    const methodName = 'uploadToTwitter'; // Set method name for logging

    try {
        // Extract Twitter credentials from environment variables
        const appKey = process.env.TWITTER_APP_KEY;
        const appSecret = process.env.TWITTER_APP_SECRET;
        const accessToken = process.env.TWITTER_ACCESS_TOKEN;
        const accessTokenSecret = process.env.TWITTER_ACCESS_TOKEN_SECRET;

        // Ensure that all required credentials are present
        if (!appKey || !appSecret || !accessToken || !accessTokenSecret) {
            throw new Error('Missing Twitter API credentials in .env file.');
        }

        // Initialize Twitter API client with credentials from .env
        const client = new TwitterApi({
            appKey,
            appSecret,
            accessToken,
            accessSecret: accessTokenSecret,
        });

        // Get the image path and tweet text from config
        const imagePath = config.configuration.getFileFromImages.result; // Assuming this path is provided
        const tweetText = config.configuration.broadcast.twitter.message;

        // Check if image exists
        if (!fs.existsSync(imagePath)) {
            throw new Error(`Image not found at ${imagePath}`);
        }

        // Read the image file as a buffer
        const imageBuffer = fs.readFileSync(path.resolve(imagePath));

        // Determine the MIME type of the image (defaults to jpeg if unknown)
        const mimeType = 'image/jpeg'; // You can further refine this if needed

        // Upload the image to Twitter
        const mediaId = await client.v1.uploadMedia(imageBuffer, { mimeType });

        // Post the tweet with the uploaded image
        const tweet = await client.v2.tweet({
            text: tweetText,
            media: { media_ids: [mediaId] },
        });

        console.log(`${methodName} :: Tweet posted: ${tweet.data.text}`);
    } catch (error) {
        console.error(`${methodName} :: Error posting tweet:`, error.message);
    }
}

module.exports = uploadToTwitter;
