// Import required modules
const twig = require("twig");
const fs = require('fs')
const eleventyPluginTwig = require("@factorial/eleventy-plugin-twig");

// Export Eleventy configuration
module.exports = function(eleventyConfig) {
    // Function to generate a version identifier
    function generateVersion() {
        // You can use a timestamp, a hash of asset files, or any other method you prefer
        return Date.now();
    }

    // Use twig
    eleventyConfig.addPlugin(eleventyPluginTwig, {
        twig: {
            namespaces: {
                layouts: "views/layouts",
                partials: "views/partials",
                snippets: "views/snippets"
            }
        },
        dir: {
            input: 'views/templates',
            output: 'www'
        }
    });

    // // Add a filter to append the version to asset URLs
    twig.extendFilter('version', function(url) {
        const version = generateVersion();
        return `${url}?v=${version}`;
    });

    twig.extendFunction("critical_css", function() {
        try {
            return fs.readFileSync('./www/assets/styles/critical.css', 'utf-8')
        } catch(error) {
            return '';
        }
    });

    // Configure and return Eleventy settings
    return {
        templateFormats: ['twig'],
        dir: {
            input: 'views/templates',
            output: 'www',
            data: '../../data'
        }
    };
};
