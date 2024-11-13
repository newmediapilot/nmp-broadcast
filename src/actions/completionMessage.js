const chalk = require('chalk');

// Method to log the "Task Complete!" message in bright blue
const completionMessage = () => {
    console.log(chalk.blue('Task Complete!')); // Display in bright blue
    return Promise.resolve(true);
};

module.exports = completionMessage;
