// Export all functions from this file
const getFileFromImages = require('./getFileFromImages');
const handlePromises = require('./handlePromises');
const logActionConfiguration = require('./logActionConfiguration'); // Import the new method

// Assign name properties for each function
getFileFromImages.name = 'getFileFromImages';
handlePromises.name = 'handlePromises';
logActionConfiguration.name = 'logActionConfiguration'; // Assign name for the new method

module.exports = {
    getFileFromImages,
    handlePromises,
    logActionConfiguration, // Export the new method
};
