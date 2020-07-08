const fs = require('fs');

module.exports = function(config) {

  const jobs = JSON.parse(fs.readFileSync('src/site/_data/jobs.json'));
  const locations = JSON.parse(fs.readFileSync('src/site/_data/locationsList.json'))

  config.setUseGitIgnore(false);
  config.addLayoutAlias('default', 'base.njk')
  config.addPassthroughCopy("src/site/robots.txt")
  config.addPassthroughCopy("src/site/assets")

  config.addFilter('jobsCountByCity', (city) => {
    const location = locations.find(c => c.city === city)
    return location ? location.jobs : 0;
  })

  return {
    dir: {
      input: "src/site",
      output: "dist",
      data: "_data",
      includes: "_partials",
    },
    pathPrefix: "/careers/digital/",
    templateFormats : ["njk", "md", "11ty.js"],
    htmlTemplateEngine : "njk",
    markdownTemplateEngine : "njk",
    passthroughFileCopy: true
  };

};
