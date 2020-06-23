// const he = require('he');


module.exports = function(config) {
  config.setUseGitIgnore(false);
  config.addLayoutAlias('default', 'base.njk')
  config.addPassthroughCopy("src/robots.txt")

  return {
    dir: {
      input: "src",
      output: "dist",
      data: "_data",
      includes: "_partials"
    },
    templateFormats : ["njk", "md", "11ty.js"],
    htmlTemplateEngine : "njk",
    markdownTemplateEngine : "njk",
    passthroughFileCopy: true
  };

};
