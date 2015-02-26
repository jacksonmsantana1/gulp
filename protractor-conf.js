exports.config = {
  seleniumAddress: 'http://localhost:4444/wd/hub',
    // Capabilities to be passed to the webdriver instance.
    capabilities: {
     'browserName': 'chrome'
    },

    /**
     * This should point to your running app instance, for relative path resolution in tests.
     */
    baseUrl: 'http://localhost:8000'
};
