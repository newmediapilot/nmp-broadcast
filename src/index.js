require('dotenv').config();

// Importing functions from the actions barrel
const { getFileFromImages, handlePromises, uploadToTwitter } = require('./actions');

// Declare the methods in an array (without invoking them)
const promises = [getFileFromImages, uploadToTwitter]; // Correct: pass function references

// Start processing promises
handlePromises(promises);
