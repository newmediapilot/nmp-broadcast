require('dotenv').config(); // Load environment variables from .env

const { TwitterApi } = require('twitter-api-v2');
const fs = require('fs');
const path = require('path');
const chalk = require('chalk'); // Import chalk for color formatting

/**
 * Uploads an image and posts a tweet with text using credentials from .env file
 * @param {object} config - The configuration object containing the Twitter API credentials and tweet message
 * @returns {Promise<string>} - The URL of the posted tweet
 */
function uploadToTwitter(config) {
    const methodName = 'uploadToTwitter'; // Set method name for logging

    return new Promise(async (resolve, reject) => {
        try {
            // Extract Twitter credentials from environment variables
            const appKey = process.env.TWITTER_APP_KEY;
            const appSecret = process.env.TWITTER_APP_SECRET;
            const accessToken = process.env.TWITTER_ACCESS_TOKEN;
            const accessTokenSecret = process.env.TWITTER_ACCESS_TOKEN_SECRET;

            if (!appKey || !appSecret || !accessToken || !accessTokenSecret) {
                throw new Error('Missing Twitter API credentials in .env file.');
            }

            // Check if getFileFromImages.result is set
            const imagePath = config.configuration.broadcast.getFileFromImages?.result;
            const tweetText = config.configuration.broadcast.twitter.message;

            if (!imagePath) {
                throw new Error('Image path not found in configuration.');
            }

            if (!tweetText) {
                throw new Error('Tweet text not found in configuration.');
            }

            // Ensure the image exists
            if (!fs.existsSync(imagePath)) {
                throw new Error(`Image not found at ${imagePath}`);
            }

            // Read the image file as a buffer
            const imageBuffer = fs.readFileSync(path.resolve(imagePath));

            // Determine the MIME type of the image (defaults to jpeg if unknown)
            const mimeType = 'image/jpeg'; // You can further refine this if needed

            // Initialize Twitter API client with credentials from .env
            const client = new TwitterApi({
                appKey,
                appSecret,
                accessToken,
                accessSecret: accessTokenSecret,
            });

            // Upload the image to Twitter
            const mediaId = await client.v1.uploadMedia(imageBuffer, { mimeType });

            // Post the tweet with the uploaded image
            const tweet = await client.v2.tweet({
                text: tweetText,
                media: { media_ids: [mediaId] },
            });

            // Extract the URL from the tweet's text
            const tweetUrlMatch = tweetText.match(/https?:\/\/[^\s]+/); // Regex to match any URL

            if (tweetUrlMatch && tweetUrlMatch[0]) {
                const tweetUrl = tweetUrlMatch[0]; // Extract the URL
                console.log(`${methodName} :: Tweet posted: ${tweetText}`);
                console.log(`${methodName} :: Tweet URL: ${tweetUrl}`);

                // Resolve the promise with the extracted URL
                resolve(tweetUrl); // Resolving with the tweet URL
            } else {
                throw new Error('No URL found in the tweet text.');
            }

        } catch (error) {
            // Check if the error message contains the string '429'
            if (error.message.includes('429')) {
                error.message = `[RATE_LIMITER] ${error.message}`; // Append [RATE_LIMITER] to the error message
            }

            // Log the error with a hot color background (orange) and bright white text
            console.error(
                chalk.bgRgb(255, 69, 0).whiteBright( // Orange background with bright white text
                    `${methodName} :: Error posting tweet: ${error.message}`
                )
            );
            reject(new Error(error.message)); // Reject the promise with the modified error message
        }
    });
}

module.exports = uploadToTwitter; // Make sure to export the method
