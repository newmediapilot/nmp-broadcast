const chalk = require('chalk');
const ActionConfiguration = require('./ActionConfiguration'); // Correctly import ActionConfiguration

// Function to handle an array of promises and log results or errors
const handlePromises = async (promiseMethods) => {
    const totalPromises = promiseMethods.length;

    // Create a new ActionConfiguration instance to share data between methods
    const config = new ActionConfiguration();

    const resultsAndErrors = []; // To store results and errors in sequence

    for (let i = 0; i < totalPromises; i++) {
        const promiseMethod = promiseMethods[i];
        console.log("promiseMethod", promiseMethod);

        // Check if the method has a name property, otherwise stop the flow
        if (!promiseMethod.name) {
            throw new Error(`Method at index ${i} does not have a "name" property. Flow stopped.`);
        }

        const methodName = promiseMethod.name; // Get method name

        // Create the promise by invoking the method
        const promise = promiseMethod(config); // Pass config to method

        // Calculate progress percentage
        const percentage = Math.round(((i + 1) / totalPromises) * 100);

        try {
            const result = await promise;  // Wait for the promise to resolve

            // Store the result in the shared configuration object
            config.setData(methodName, result);

            // Track the result and add it to the resultsAndErrors array
            resultsAndErrors.push({ type: 'result', methodName, result });

            // Log the progress with a dark blue background and white text
            console.log(
                chalk.bgBlue.white(`handlePromises :: ${methodName} :: ${i + 1} of ${totalPromises} :: ${percentage}%`) +
                chalk.green(`\n${methodName} :: result`, result) // Green for the result value
            );
        } catch (error) {
            // Track the error and add it to the resultsAndErrors array
            resultsAndErrors.push({ type: 'error', methodName, error });

            // Log error with a dark blue background and white text
            console.error(
                chalk.bgBlue.white(`handlePromises :: ${methodName} :: ${i + 1} of ${totalPromises} :: ${percentage}%`) +
                chalk.red(`\n${methodName} :: error, ${error.message}`)
            );
        }
    }

    // After all promises are processed, log the results and errors
    console.log("\nAll tasks completed, see below for result:");

    // Log each result/error in the appropriate color
    resultsAndErrors.forEach(item => {
        if (item.type === 'error') {
            console.log(chalk.red(`${item.methodName} :: Error: ${item.error.message}`)); // Log error in red
        } else {
            console.log(chalk.blue(`${item.methodName} :: Result: ${item.result}`)); // Log result in blue
        }
    });
};

module.exports = handlePromises;
