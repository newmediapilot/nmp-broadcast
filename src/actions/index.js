// Export all functions from this file
const postToFacebook = require('./postToFacebook');
const getFileFromImages = require('./getFileFromImages');
const handlePromises = require('./handlePromises');
const uploadToTwitter = require('./uploadToTwitter'); // Import the uploadToTwitter method

// Assign name properties for each function (useful for logging/debugging)
getFileFromImages.name = 'postToFacebook';
getFileFromImages.name = 'getFileFromImages';
handlePromises.name = 'handlePromises';
uploadToTwitter.name = 'uploadToTwitter'; // Assign name for the new method

module.exports = {
    postToFacebook,
    getFileFromImages,
    handlePromises,
    uploadToTwitter, // Export the uploadToTwitter method
};
