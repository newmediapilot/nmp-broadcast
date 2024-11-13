require('dotenv').config(); // Load environment variables from .env

const { chromium } = require('playwright'); // Import Playwright
const fs = require('fs');
const path = require('path');

/**
 * Posts to Facebook using Playwright, including the tweet URL in the post
 * @param {object} config - The configuration object containing the Facebook credentials and tweet URL
 * @returns {Promise<void>}
 */
async function postToFacebook(config) {
    const methodName = 'postToFacebook'; // Set method name for logging

    try {
        // Retrieve Facebook credentials from .env file
        const facebookUsername = process.env.FACEBOOK_USERNAME;
        const facebookPassword = process.env.FACEBOOK_PASSWORD;

        if (!facebookUsername || !facebookPassword) {
            throw new Error('Facebook credentials are missing in the .env file.');
        }

        // Retrieve tweet URL from config (this was saved by uploadToTwitter)
        const tweetUrl = config.configuration.broadcast.tweetURL;
        const postText = config.configuration.broadcast.facebook.message;

        if (!tweetUrl) {
            throw new Error('Tweet URL not found in configuration.');
        }

        // Construct the full message for Facebook (appending the tweet URL)
        const fullPostText = `${postText} ${tweetUrl}`;

        // Launch the browser in non-headless mode (visible mode)
        const browser = await chromium.launch({ headless: false }); // Set headless: false for debugging
        const page = await browser.newPage();

        // Step 1: Navigate to Facebook login page
        await page.goto('https://www.facebook.com');

        // Step 2: Log in to Facebook
        await page.fill('input[name="email"]', facebookUsername); // Fill in email
        await page.fill('input[name="pass"]', facebookPassword); // Fill in password
        await page.click('button[name="login"]'); // Click the login button
        await page.waitForNavigation(); // Wait for login to complete

        // Step 3: Navigate to the Facebook share URL
        const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(tweetUrl)}`;
        await page.goto(facebookShareUrl); // Navigate to the share URL

        // Step 4: Wait for the post textarea to be available
        await page.waitForSelector('textarea'); // Wait for any textarea element

        // Step 5: Type the message (fullPostText) in the textarea
        await page.fill('textarea', fullPostText); // Type the message in the first textarea found

        // Step 6: Submit the post (by simulating hitting Enter)
        await page.keyboard.press('Enter'); // Press Enter to submit the post

        // Step 7: Wait for a moment to ensure the post is submitted
        await page.waitForTimeout(5000); // Wait for the post to be published

        console.log('Post has been published successfully!');

        // Step 8: Close the browser
        await browser.close();
    } catch (error) {
        console.error(`${methodName} :: Error posting to Facebook:`, error.message);
    }
}

module.exports = postToFacebook;
