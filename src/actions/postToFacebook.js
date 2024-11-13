require('dotenv').config(); // Load environment variables from .env

const { chromium } = require('playwright'); // Import Playwright
const fs = require('fs');
const path = require('path');

/**
 * Posts to Facebook using Playwright, including the tweet URL in the post
 * @param {object} config - The configuration object containing the Facebook credentials and tweet URL
 * @returns {Promise<void>} - The result of the post (success or failure)
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

        // Retrieve tweet URL from the config (now it's under uploadToTwitter.result)
        const tweetUrl = config.configuration.broadcast.uploadToTwitter.result;
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

        // Step 4: Wait for the redirect to share_channel page
        await page.waitForNavigation({ waitUntil: 'domcontentloaded' }); // Wait for the page to redirect

        // Check if the URL has redirected to the share_channel page
        const currentUrl = page.url();
        if (!currentUrl.includes("share_channel")) {
            throw new Error(`Unexpected redirect. Current URL: ${currentUrl}`);
        }

        // Step 5: Wait for the text "Create a post" to appear (ensure the page is ready)
        await page.waitForSelector('text="Create a post"', { timeout: 5000 }); // Wait for "Create a post" text to appear

        // Step 6: Type the message in the textarea
        await page.fill('textarea', fullPostText); // Type the message in the textarea

        // Step 7: Submit the post (by simulating hitting Enter)
        await page.keyboard.press('Enter'); // Press Enter to submit the post

        // Step 8: Wait for a moment to ensure the post is submitted
        await page.waitForTimeout(5000); // Wait for the post to be published

        console.log('Post has been published successfully!');
        return; // No need to return anything, as this is successful
    } catch (error) {
        // Log the error and throw it so that handlePromises can catch it and log it in red
        console.error(`${methodName} :: Error posting to Facebook:`, error.message);
        throw error; // Rethrow the error to propagate it to handlePromises
    }
}

module.exports = postToFacebook;
