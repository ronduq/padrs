const fs = require('fs');

module.exports = function(config) {

  const jobs = JSON.parse(fs.readFileSync('src/site/_data/jobs.json'));
  const locations = JSON.parse(fs.readFileSync('src/site/_data/jobsLocations.json'))
  const capabilities = JSON.parse(fs.readFileSync('src/site/_data/capabilities.json'))

  config.setUseGitIgnore(false);
  config.addLayoutAlias('default', 'base.njk')
  config.addPassthroughCopy("src/site/robots.txt")
  config.addPassthroughCopy("src/site/_headers")
  config.addPassthroughCopy("src/site/04dceb9dec37d6a440662c1bf916d271.txt")
  config.addPassthroughCopy("src/site/assets")

  config.addFilter('jobsCountByCity', (city) => {
    const location = locations.find(c => c.city === city)
    return location ? location.jobs : 0;
  })

  config.addFilter('jobsCountByCapability', (name) => {
    console.log(name)
    const capability = capabilities.find(c => c.name === name)
    return capability ? capability.jobs : 0;
  })

  config.addFilter('relatedJobs', (job) => {
    const jobsInCapability = jobs.filter(j => j.capability === job.capability);
    const jobsNotCapability = jobs.filter(j => j.capability !== job.capability);
    return [...jobsInCapability, ...jobsNotCapability].slice(0, 3);
  })

  return {
    dir: {
      input: "src/site",
      output: "dist",
      data: "_data",
      includes: "_partials",
    },
    pathPrefix: "/",
    templateFormats : ["njk", "md", "11ty.js"],
    htmlTemplateEngine : "njk",
    markdownTemplateEngine : "njk",
    passthroughFileCopy: true
  };

};
