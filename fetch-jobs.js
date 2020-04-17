const fetch = require('node-fetch');
const fs = require("fs");

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
  fs.writeFile('src/site/_data/jobs.json', JSON.stringify(data.jobs, null, 2), (err) => {});
})();



