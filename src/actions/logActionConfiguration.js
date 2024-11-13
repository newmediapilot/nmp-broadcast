const chalk = require('chalk');

// Promise-based method to log ActionConfiguration
const logActionConfiguration = (config) => {
    return new Promise((resolve) => {
        // Space above the message
        console.log('\n');

        // Start comment with solid blue background and bright white text
        console.log(chalk.bgBlue.whiteBright('/* Start of ActionConfiguration log */'));

        // Log the configuration in dark gray
        console.log(chalk.bgBlack.white('Action Configuration:'));
        console.log(chalk.gray(JSON.stringify(config.configuration, null, 2)));

        // End comment with solid blue background and bright white text
        console.log(chalk.bgBlue.whiteBright('/* End of ActionConfiguration log */'));

        // Space below the message
        console.log('\n');

        // Resolve with the contents of config
        resolve(config); // Resolve with the entire config object
    });
};

module.exports = logActionConfiguration;
