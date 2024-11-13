const fs = require('fs');
const path = require('path');
const chalk = require('chalk'); // Import chalk for color formatting

class ActionConfiguration {
    constructor() {
        if (ActionConfiguration.instance) {
            return ActionConfiguration.instance; // Return the existing instance
        }

        // Initialize the configuration object with defaults
        this.configuration = {
            broadcast: {
                twitter: { message: 'Hello from Twitter' },
                facebook: { message: 'Hello from Facebook' },
                instagram: { message: 'Hello from Instagram' }
            }
        };

        // Load nmpBroadcast configuration from package.json
        this.loadConfiguration();

        // Ensure only one instance exists
        ActionConfiguration.instance = this;
    }

    // Load configuration from package.json
    loadConfiguration() {
        try {
            const packageJsonPath = path.join(process.cwd(), 'package.json');
            const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

            // Check if nmpBroadcast exists in the package.json
            if (packageJson.nmpBroadcast) {
                // Spread the package.json nmpBroadcast into the configuration's broadcast, overriding defaults
                this.configuration.broadcast = { ...this.configuration.broadcast, ...packageJson.nmpBroadcast };
            }

            // Log "Configuration loaded" message with a bright orange background and black text
            console.log(chalk.bgRgb(255, 165, 0).black('Configuration loaded:', JSON.stringify(this.configuration.broadcast, null, 2)));
        } catch (error) {
            console.error('Error loading configuration from package.json:', error.message);
            throw error;
        }
    }

    // Add or update data in the configuration under the broadcast key
    setData(methodName, result) {
        // Log in teal/aqua background with bright white text
        console.log(chalk.bgRgb(0, 128, 128).whiteBright(`ActionConfiguration :: setData ${methodName} :: result:`, result));

        if (!this.configuration.broadcast[methodName]) {
            this.configuration.broadcast[methodName] = {}; // Initialize if it doesn't exist
        }
        this.configuration.broadcast[methodName].result = result; // Set the result under the method name

        // Log the updated data in an "orange" background with black text (using RGB values)
        console.log(chalk.bgRgb(255, 165, 0).black(JSON.stringify(this.configuration.broadcast[methodName], null, 2))); // Use RGB for orange background

        // Log the entire configuration with a magenta background and white text after it's updated
        const configString = JSON.stringify(this.configuration, null, 2); // Convert to string
        if (configString) {
            console.log(chalk.bgMagenta.whiteBright(configString)); // Log the configuration in magenta with white text
        } else {
            console.error(chalk.bgRed.whiteBright('Error: Invalid configuration data.'));
        }
    }

    // Get the stored result for a method under the broadcast key
    getData(methodName) {
        return this.configuration.broadcast[methodName] || null;
    }
}

// Ensure only one instance exists
module.exports = ActionConfiguration;
