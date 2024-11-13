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

        // Step 4: Wait for the URL to change and verify we're on the "share_channel" page
        await page.waitForTimeout(3000); // Wait for 3 seconds to allow the redirect

        const currentUrl = page.url();
        if (!currentUrl.includes('share_channel')) {
            throw new Error(`Unexpected redirect. Current URL: ${currentUrl}`);
        }

        // Step 5: Wait for the "Create post" text to appear
        const postButton = await page.locator('text="Create a post"');
        await postButton.waitFor({ state: 'visible', timeout: 5000 }); // Wait for the "Create a post" button to be visible

        // Step 6: Paste the full message into the textarea
        await page.keyboard.type(fullPostText); // Paste the full post message into the textarea

        // Step 7: Click the "Share" button (a span element containing the text "Share")
        await page.evaluate(() => {
            const shareButton = [...document.querySelectorAll('span')].find(span => span.textContent === 'Share');
            if (shareButton) {
                shareButton.click(); // Click the "Share" button
            } else {
                throw new Error('Share button not found.');
            }
        });

        // Step 8: Wait for a moment to ensure the post is published
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
