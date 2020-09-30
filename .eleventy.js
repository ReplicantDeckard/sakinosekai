const markdownShortCode = require("eleventy-plugin-markdown-shortcode");

module.exports = function(eleventyConfig) {
    // eleventyConfig.htmlTemplateEngine("njk");
    eleventyConfig.addPassthroughCopy("images");
    eleventyConfig.addPassthroughCopy("script.js");
    eleventyConfig.addPassthroughCopy("styles.css");
    eleventyConfig.addWatchTarget("script.js");
    eleventyConfig.addWatchTarget("styles.css");
    eleventyConfig.addPlugin(markdownShortCode);
};