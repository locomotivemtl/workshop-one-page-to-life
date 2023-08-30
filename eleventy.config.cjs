// Import required modules
const { Liquid } = require("liquidjs");
const path = require('node:path');
const fs = require('fs')

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

    eleventyConfig.addShortcode("critical_css", function() {
        return fs.readFileSync('./www/assets/styles/critical.css', 'utf-8')
    });

    // Configure options for Liquid template engine
    let options = {
        extname: '.liquid',
        dynamicPartials: true,
        root: path.resolve(__dirname, 'views'),
        layouts: path.resolve(__dirname, 'views/layouts')
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
