// actions/getFileFromImages.js
const fs = require('fs');
const path = require('path');

// Use process.cwd() to get the current working directory (project root)
const ROOT_DIR = process.cwd();

const getFileFromImages = () => {
    const imagesDir = path.join(ROOT_DIR, 'images'); // Use ROOT_DIR constant

    // Read all files in the directory
    const files = fs.readdirSync(imagesDir);

    // Filter out non-file items and get the first image file
    const imageFiles = files.filter(file => fs.statSync(path.join(imagesDir, file)).isFile());

    // If there are any image files, return the first one
    if (imageFiles.length > 0) {
        return path.join(imagesDir, imageFiles[0]);
    } else {
        return null; // No images found
    }
};

module.exports = getFileFromImages;
