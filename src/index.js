require('dotenv').config();

// Importing functions from the actions barrel
const { getFileFromImages, handlePromises, completionMessage } = require('./actions');

// Array of promises (for now, just getFileFromImages as the first member)
const promises = [getFileFromImages(), completionMessage()];

// Start processing promises
handlePromises(promises);
