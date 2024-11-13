const fs = require('fs');
const path = require('path');

// Define root directory
const ROOT_DIR = process.cwd();
const IMAGES_DIR = path.join(ROOT_DIR, 'images'); // Folder where images are stored

// Function to get the first image file, now returning a promise
const getFileFromImages = () => {
    return new Promise((resolve, reject) => {
        try {
            // Read all files in the images directory
            const files = fs.readdirSync(IMAGES_DIR);

            // Filter out non-file items and get the first image file
            const imageFiles = files.filter(file => fs.statSync(path.join(IMAGES_DIR, file)).isFile());

            // If there are any image files, resolve with the first one
            if (imageFiles.length > 0) {
                resolve(path.join(IMAGES_DIR, imageFiles[0]));
            } else {
                reject(new Error('No image files found.'));
            }
        } catch (err) {
            reject(new Error('Error reading the images directory: ' + err.message));
        }
    });
};

module.exports = getFileFromImages;
