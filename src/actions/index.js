// Export all functions from this file
const postToFacebook = require('./postToFacebook');
const getFileFromImages = require('./getFileFromImages');
const handlePromises = require('./handlePromises');
const logActionConfiguration = require('./logActionConfiguration'); // Import the new method
const uploadToTwitter = require('./uploadToTwitter'); // Import the uploadToTwitter method

// Assign name properties for each function (useful for logging/debugging)
getFileFromImages.name = 'postToFacebook';
getFileFromImages.name = 'getFileFromImages';
handlePromises.name = 'handlePromises';
logActionConfiguration.name = 'logActionConfiguration'; // Assign name for the new method
uploadToTwitter.name = 'uploadToTwitter'; // Assign name for the new method

module.exports = {
    postToFacebook,
    getFileFromImages,
    handlePromises,
    logActionConfiguration, // Export the new method
    uploadToTwitter, // Export the uploadToTwitter method
};
