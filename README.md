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

Add our Github mirror remote to your local repo:

    git remote add github git@github.com:pa-digital/pa-digital-recruitment.git

Then add a post-commit hook to push to the repo each time you commit (.git/hooks/post-commit):

    #!/bin/sh
    git push github -f --mirror
