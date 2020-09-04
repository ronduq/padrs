const lunr = require('lunr');
const querystring = require('query-string');

class Search {

  constructor(form) {
    if (!form.length) return;

    this.collectJobsFromDOM();

    this.params = querystring.parse(window.location.search);

    // pre-fill form elements
    if (this.params.q) form.querySelector('input[name="q"]').value = this.params.q;
    if (this.params.location) form.querySelector('select[name="location"]').value = this.params.location;
    if (this.params.capability) form.querySelector('select[name="capability"]').value = this.params.capability;

    const submitSearchForm = (e) => {
      e.preventDefault();
      this.params.q = form.querySelector('input[name="q"]').value;
      this.params.location = form.querySelector('select[name="location"]').value;
      this.params.capability = form.querySelector('select[name="capability"]').value;
      history.pushState(null, '', `${window.location.pathname}?${querystring.stringify(this.params)}`);
      this.renderSearchResults();
    }

    this.submitSearchForm = submitSearchForm.bind(this);

    // form submit
    form.addEventListener('submit', this.submitSearchForm);

    // form values change
    form.querySelectorAll('select').forEach((input) => {
      input.addEventListener('change', this.submitSearchForm);
    })

    // run search on page load
    this.renderSearchResults();
  }

  collectJobsFromDOM() {
    this.jobs = [...document.querySelectorAll('[data-search-id]')].map((element) => {
      return {
        element: element,
        id: element.getAttribute('data-search-id'),
        content: [...element.querySelectorAll('[data-search-fulltext')].map((e) => e.innerText).join(' '),
        location: element.querySelector('[data-search-location]').getAttribute('data-search-location'),
        capability: element.querySelector('[data-search-capability]').innerText
      }
    });
  }

  showResultsContainer() {
    document.querySelector('[data-search-results]').style.display = 'block';
    document.querySelector('[data-search-no-results]').style.display = 'none';

  }

  showNoResultsContainer() {
    document.querySelector('[data-search-results]').style.display = 'none';
    document.querySelector('[data-search-no-results]').style.display = 'block';
  }

  showJobSearchResult(job) {
    job.element.style.display = 'block';
  }

  hideJobSearchResult(job) {
    job.element.style.display = 'none';
  }

  filterJobs(jobs, params) {
    let filteredJobs = jobs;

    // searching by keyword
    if (params.q) {

      const self = this; // HACK
      const index = lunr(function() {
        this.field('content');
        this.ref('id');
        jobs.forEach((job) => this.add(job), this);
      });

      const results = index.search(params.q);
      const matchingJobIds = results.map((result) => result.ref);
      filteredJobs = jobs.filter((job) => matchingJobIds.includes(job.id))
    }

    if (params.location) {
      filteredJobs = filteredJobs.filter((job) => job.location === params.location)
    }

    if (params.capability) {
      filteredJobs = filteredJobs.filter((job) => job.capability === params.capability)
    }

    return filteredJobs;
  }

  renderSearchResults() {
    const isFilteredSearch = (this.params.q && this.params.q.length || this.params.location && this.params.location.length || this.params.capability && this.params.capability.length || null);
    const filteredJobs = this.filterJobs(this.jobs, this.params);

    // found some matches
    if (isFilteredSearch && filteredJobs.length) {

      this.showResultsContainer()

      this.jobs.forEach((job) => {
        if (filteredJobs.find((j) => j.id === job.id)) {
          this.showJobSearchResult(job);
        } else {
          this.hideJobSearchResult(job);
        }
      })
    }
    // no results
    else if (isFilteredSearch && !filteredJobs.length) {
      this.showNoResultsContainer()
    }
    // no filtering, show everything
    else {
      this.showResultsContainer()
      this.jobs.forEach((job) => this.showJobSearchResult(job));
    }

    // update the count of jobs
    document.querySelector('[data-search-count]').innerText = `Showing ${filteredJobs.length} role${filteredJobs.length === 1 ? '' : 's'}`
  }
}

export default Search;
