// const he = require('he');


module.exports = function(config) {
  config.setUseGitIgnore(false);
  config.addLayoutAlias('default', 'base.njk')
  return {
    dir: {
      input: "src/site",
      output: "dist",
      data: "_data"
    },
    templateFormats : ["njk", "md", "11ty.js"],
    htmlTemplateEngine : "njk",
    markdownTemplateEngine : "njk",
    passthroughFileCopy: true
  };

};
