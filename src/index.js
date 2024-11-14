require('dotenv').config();

// Importing functions from the actions barrel
const {getFileFromImages, handlePromises, uploadToTwitter, postToFacebook} = require('./actions');

// Start processing promises
handlePromises([
    getFileFromImages,
    uploadToTwitter,
    postToFacebook
]);
