// index.js
const getFileFromImages = require('./actions/getFileFromImages');

// Assign the returned path to a variable
const imagePath = getFileFromImages();

// Log the result or use it for further processing
if (imagePath) {
    console.log('Image found:', imagePath);
} else {
    console.log('No image files found.');
}
