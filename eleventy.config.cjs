// Import required modules
const { Liquid } = require("liquidjs");
const path = require('node:path');

// Export Eleventy configuration
module.exports = function(eleventyConfig) {
    // Function to generate a version identifier
    function generateVersion() {
        // You can use a timestamp, a hash of asset files, or any other method you prefer
        return Date.now();
    }

    // Add a filter to append the version to asset URLs
    eleventyConfig.addFilter('version', function(url) {
        const version = generateVersion();
        return `${url}?v=${version}`;
    });

    // Configure options for Liquid template engine
    let options = {
        extname: '.liquid',
        dynamicPartials: true,
        layouts: path.resolve(__dirname, 'views/layouts'),
        root: [
            path.resolve(__dirname, 'views/partials'),
            path.resolve(__dirname, 'views/snippets')
        ]
    };

    // Set Liquid template engine with specified options
    eleventyConfig.setLibrary('liquid', new Liquid(options));

    // Configure and return Eleventy settings
    return {
        templateFormats: ['liquid'],
        dir: {
            input: 'views/templates',
            output: 'www',
            data: '../../data'
        }
    };
};
