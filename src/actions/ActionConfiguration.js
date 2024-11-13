const fs = require('fs');
const path = require('path');

class ActionConfiguration {
    constructor() {
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
    }

    // Load configuration from package.json
    loadConfiguration() {
        try {
            const packageJsonPath = path.join(process.cwd(), 'package.json');
            const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

            // Check if nmpBroadcast exists in the package.json
            if (packageJson.nmpBroadcast) {
                // Spread the package.json nmpBroadcast into the configuration, overriding defaults
                this.configuration.broadcast = { ...this.configuration.broadcast, ...packageJson.nmpBroadcast };
            }

            console.log('Configuration loaded:', this.configuration);
        } catch (error) {
            console.error('Error loading configuration from package.json:', error.message);
            throw error;
        }
    }

    // Add or update data in the configuration
    setData(methodName, result) {
        if (!this.configuration[methodName]) {
            this.configuration[methodName] = {}; // Initialize if it doesn't exist
        }
        this.configuration[methodName].result = result; // Set the result under the method name
    }

    // Get the stored result for a method
    getData(methodName) {
        return this.configuration[methodName] || null;
    }
}

module.exports = ActionConfiguration;
