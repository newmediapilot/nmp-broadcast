require('dotenv').config();

// Importing functions from the actions barrel
const {getFileFromImages, handlePromises, uploadToTwitter, postToFacebook, logActionConfiguration} = require('./actions');

// Declare the methods in an array (without invoking them)
const promises = [
    getFileFromImages,
// uploadToTwitter,
// postToFacebook,
// logActionConfiguration,
];

// Start processing promises
handlePromises(promises);
