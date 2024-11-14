const chalk = require('chalk');
const ActionConfiguration = require('./ActionConfiguration'); // Correctly import ActionConfiguration
const Table = require('cli-table3'); // Import cli-table3

// Function to handle an array of promises and log progress percentage
const handlePromises = async (promiseMethods) => {
    const totalPromises = promiseMethods.length;

    // Create a new ActionConfiguration instance to share data between methods
    const config = new ActionConfiguration();

    // Array to collect the log summary
    const logSummary = [];

    // Track the completion of all promises to ensure proper logging
    for (let i = 0; i < totalPromises; i++) {
        const promiseMethod = promiseMethods[i];
        const methodName = promiseMethod.name; // Get method name

        // Create the promise by invoking the method
        const promise = promiseMethod(config); // Pass config to method

        // Calculate progress percentage
        const percentage = Math.round(((i + 1) / totalPromises) * 100);

        try {
            const result = await promise;  // Wait for the promise to resolve one at a time

            // Store the result in the shared configuration object
            config.setData(methodName, result);

            // Log the progress with a dark blue background and white text
            console.log(
                chalk.bgBlue.white(`handlePromises :: ${methodName} :: ${i + 1} of ${totalPromises} :: ${percentage}%`) +
                chalk.green(`\n${methodName} :: result`, result) // Green for the result value
            );

            // Add the result to the log summary
            logSummary.push({
                step: methodName,
                status: 'result',
                value: result,
            });
        } catch (error) {
            // Log error with a dark blue background and white text
            console.error(
                chalk.bgBlue.white(`handlePromises :: ${methodName} :: ${i + 1} of ${totalPromises} :: ${percentage}%`) +
                chalk.red(`\n${methodName} :: error, ${error.message}`)
            );

            // Add the error to the log summary
            logSummary.push({
                step: methodName,
                status: 'error',
                value: error.message,
            });
        }
    }

    // After all promises are processed, log the final message
    console.log("\nAll tasks completed.");

    // Create a table instance
    const table = new Table({
        head: ['Step', 'Status', 'Value'], // Column headers
        colWidths: [30, 20, 50], // Set column widths
    });

    // Add rows to the table
    logSummary.forEach(item => {
        table.push([item.step, item.status, item.value]);
    });

    // Log the table in the console
    console.log(table.toString());

    // Exit the process after logging the final message
    process.exit(0);
};

module.exports = handlePromises;
