class ActionConfiguration {
    constructor() {
        // Initialize the configuration object
        this.configuration = {};
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
