const chalk = require('chalk');

// Function to handle an array of promises and log results or errors
const handlePromises = async (promises) => {
    const totalPromises = promises.length;

    for (let i = 0; i < totalPromises; i++) {
        const promise = promises[i];
        const methodName = promise.name || 'Unknown Method'; // Get method name (if available)

        // Calculate progress percentage
        const percentage = Math.round(((i + 1) / totalPromises) * 100);

        try {
            const result = await promise;  // Wait for the promise to resolve

            // Log result with green color and percentage progress
            console.log(
                chalk.blue(`handlePromises :: ${methodName} :: ${i + 1} of ${totalPromises} :: ${percentage}%`) +
                chalk.green(`\n${methodName} :: result`, result)
            );
        } catch (error) {
            // Log error with red color and percentage progress
            console.error(
                chalk.blue(`handlePromises :: ${methodName} :: ${i + 1} of ${totalPromises} :: ${percentage}%`) +
                chalk.red(`\n${methodName} :: error, ${error.message}`)
            );
        }
    }
};

module.exports = handlePromises;
