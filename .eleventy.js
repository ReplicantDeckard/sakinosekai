const markdownShortCode = require("eleventy-plugin-markdown-shortcode");

module.exports = function(eleventyConfig) {
    // eleventyConfig.htmlTemplateEngine("njk");
    eleventyConfig.addPassthroughCopy("images");
    eleventyConfig.addPassthroughCopy("*.js");
    eleventyConfig.addPassthroughCopy("*.css");
    eleventyConfig.addWatchTarget("*.js");
    eleventyConfig.addWatchTarget("*.css");
    eleventyConfig.addPlugin(markdownShortCode);
};