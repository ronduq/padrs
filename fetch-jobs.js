const fetch = require('node-fetch');
const fs = require("fs");
const _ = require("lodash");
const slugify = require("slugify");
const core = require('@actions/core');

(async() => {

  let data;

  try {
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

    data = await response.json();
  }
  catch (err) {
    core.setFailed(`Couldn't fetch jobs! ${err}`);
  }

  let jobs = data.jobs;
  if (!jobs) jobs = [];
  console.log(`${jobs.length} jobs returned`, jobs);

  const capabilities = [
    {
      name: 'Delivery',
      keywords: ['Delivery Manager', 'Agile']
    },
    {
      name: 'Design',
      keywords: ['Designer', 'Creative']
    },
    {
      name: 'Engineering & DevOps',
      keywords: ['Engineer', 'QA', 'Architect', 'Technical', 'Cloud', 'Data Scientist', 'Java', 'Developer']
    },
    {
      name: 'Transformation',
      keywords: ['Strategist', 'Digital Business']
    },
    {
      name: 'Other',
      keywords: []
    }
  ];

  const findJobCapability = (job) => {
    let capability = 'Other';
    capabilities.forEach(c => {
      if (c.keywords.some(word => job.title.toLowerCase().indexOf(word.toLowerCase()) !== -1)) {
        capability = c.name;
      }
    })
    return capability;
  }

  const stripHTML = (string) => {
    return string.replace(/(<[^>]+>|<[^>]>|<\/[^>]>)/g, '');
  }

  const truncate = (string, length) => {
    if (string.length <= length) {
      return string;
    }
    return string.slice(0, length) + '...';
  }

  const parseJobFullText = (job) => {
    const text = [];
    job.customFields.forEach((field) => {
      if (field.title.toLowerCase() === 'benefits') return;
      if (field.title.toLowerCase() === 'diversity statement') return;
      text.push(stripHTML(field.content));
    })
    return text.join(' ');
  }

  const parseOfficeName = (job) => {
    switch (job.jobFields.SLOVLIST13) {
      case 'London': return 'Victoria';
      case 'London (DIG)': return 'Farringdon';
      case 'Belfast (DIG)': return 'Belfast';
      default: return job.jobFields.SLOVLIST13;
    }
  }

  jobs.map(job => {
    const city = job.jobFields.SLOVLIST13.split('(')[0].trim();
    const country = job.jobFields.SLOVLIST15.split('(')[0].trim();
    job.id = job.jobFields.id;
    job.title = job.jobFields.jobTitle;
    job.city = city;
    job.country = country;
    job.location = `${city}, ${country}`;
    job.office = parseOfficeName(job);
    job.capability = findJobCapability(job)
    job.summary = truncate(stripHTML(job.customFields[0].content), 375)
    job.fulltext = parseJobFullText(job)
    job.contract = job.jobFields.ContractTyplabel
    job.length = job.jobFields.SLOVLIST16
    job.applyUrl = job.jobFields.applicationUrl
    job.description = job.customFields.map((field) => {
      return {
        key: slugify(field.title, { lower: true, strict: true }),
        title: field.title,
        content: field.content
          .replace(/<p> <\/p>/ig, '')
          .replace(/<p><strong><br \/> <\/strong><\/p>/ig, '')
          .replace(/<p><strong> <\/strong><\/p>/ig, '')
      }
    })
    delete job.jobFields
    delete job.customFields
    return job;
  });

  fs.writeFile('src/site/_data/jobs.json', JSON.stringify(jobs, null, 2), (err) => {});

  const knownLocations = [
    {
      city: 'London',
      country: 'UK',
    },
    {
      city: 'Belfast',
      country: 'UK'
    }
  ]

  const openJobsLocations = jobs.map(job => ({
    city: job.city,
    country: job.country
  }));

  const locationsList = _.uniqBy(_.concat(knownLocations, openJobsLocations), 'city');

  locationsList.map(location => {
    location.jobs = jobs.filter(job => job.city === location.city).length;
    return location;
  })

  capabilities.map(capability => {
    capability.jobs = jobs.filter(job => job.capability === capability.name).length;
    return capability;
  })

  fs.writeFile('src/site/_data/jobsLocations.json', JSON.stringify(locationsList, null, 2), (err) => {});

  fs.writeFile('src/site/_data/capabilities.json', JSON.stringify(capabilities, null, 2), (err) => {});
})();
