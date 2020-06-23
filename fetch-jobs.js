const fetch = require('node-fetch');
const fs = require("fs");
const _ = require("lodash");

(async() => {

  const response = await fetch(`https://emea5-foc.lumessetalentlink.com/fo/rest/jobs?firstResult=0&maxResults=12&sortBy=52&sortOrder=desc`, {
    method: 'post',
    body: JSON.stringify({
      "searchCriteria": {
        "criteria": [
          {"key":"LOV28","values":["11606"]},
          {"key":"Resultsperpage","values":["999"]}
        ]
      }
    }),
    headers: {
      'authority': 'emea5-foc.lumessetalentlink.com',
      'lumesse-language': 'UK',
      'content-type': 'application/json',
      'username': 'QIMFK026203F3VBQBLO6GLOQP:guest:FO',
      'sec-fetch-dest': 'empty',
      'password': 'guest'
    }
  })

  const data = await response.json();
  data.jobs.map(job => {
    job.location = `${job.jobFields.SLOVLIST13.split('(')[0].trim()}, ${job.jobFields.SLOVLIST15.split('(')[0].trim()}`
    return job
  });
  fs.writeFile('src/_data/jobs.json', JSON.stringify(data.jobs, null, 2), (err) => {});

  console.log(data)

  let locations = data.jobs.map(job => ({
    cityLabel: job.jobFields.SLOVLIST13.split('(')[0].trim(),
    countryLabel: job.jobFields.SLOVLIST15.split('(')[0].trim(),
    city: job.jobFields.SLOVLIST13,
    country: job.jobFields.SLOVLIST15
  }));
  locations = _.uniqBy(locations, 'cityLabel');
  fs.writeFile('src/_data/jobsLocations.json', JSON.stringify(locations, null, 2), (err) => {});
})();



