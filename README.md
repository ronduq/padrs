# PA digital recruitment site

## Set up local development

    // install dependencies
    npm i

    // pull down a list of active jobs
    node fetch-jobs.js

    // compile assets and watch for changes
    ./node_modules/.bin/gulp watch

    // compile site and watch for changes
    npm run-script 11ty:dev

## Deploying to Netlify

There is a post-commit hook which mirrors the repo to Github (temporarily in Nick Dunn's account), which then deploys via Netlify to https://pa-digital-recruitment.netlify.app/. It's magic and brilliant.
