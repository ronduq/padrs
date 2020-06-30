const lunr = require('lunr');
const querystring = require('query-string');

class Search {

  constructor(form) {
    // build data set
    this.jobs = [...document.querySelectorAll('[data-search-id]')].map((element) => {
      return {
        element: element,
        id: element.getAttribute('data-search-id'),
        content: [...element.querySelectorAll('[data-search-fulltext')].map((e) => e.innerText).join(' '),
        location: element.querySelector('[data-search-location]').getAttribute('data-search-location'),
        capability: element.querySelector('[data-search-capability]').innerText
      }
    });

    this.params = querystring.parse(window.location.search);

    // pre-fill form elements
    if (this.params.q) document.querySelector('input[name="q"]').value = this.params.q;
    if (this.params.location) document.querySelector('select[name="location"]').value = this.params.location;
    if (this.params.capability) document.querySelector('select[name="capability"]').value = this.params.capability;

    const submitSearchForm = (e) => {
      e.preventDefault();
      this.params.q = form.querySelector('input[name="q"]').value;
      this.params.location = form.querySelector('select[name="location"]').value;
      this.params.capability = form.querySelector('select[name="capability"]').value;
      history.pushState(null, '', `${window.location.pathname}?${querystring.stringify(this.params)}`);
      this.search();
    }

    this.submitSearchForm = submitSearchForm.bind(this);

    // form submit
    form.addEventListener('submit', this.submitSearchForm);

    // form values change
    form.querySelectorAll('select').forEach((input) => {
      input.addEventListener('change', this.submitSearchForm);
    })

    // run search on page load
    this.search();
  }

  search() {
    const isFilteredSearch = (this.params.q && this.params.q.length || this.params.location && this.params.location.length || this.params.capability && this.params.capability.length || null);
    let filteredJobs = this.jobs;

    // searching by keyword
    if (this.params.q) {

      const self = this; // HACK
      const index = lunr(function() {
        this.field('content');
        this.ref('id');

        self.jobs.forEach((job) => this.add(job), this);
      });

      const results = index.search(this.params.q);
      const matchingJobIds = results.map((result) => result.ref);
      filteredJobs = this.jobs.filter((job) => matchingJobIds.includes(job.id))
    }

    if (this.params.location) {
      filteredJobs = filteredJobs.filter((job) => job.location === this.params.location)
    }

    if (this.params.capability) {
      filteredJobs = filteredJobs.filter((job) => job.capability === this.params.capability)
    }

    // found some matches
    if (isFilteredSearch && filteredJobs.length) {
      this.jobs.forEach((job) => {
        if (filteredJobs.find((j) => j.id === job.id)) {
          job.element.style.display = 'block';
        } else {
          job.element.style.display = 'none';
        }
      })
    }
    // no results
    else if (isFilteredSearch) {
      this.jobs.forEach((job) => job.element.style.display = 'none');
    }
    // no filtering, show everything
    else {
      this.jobs.forEach((job) => job.element.style.display = 'block');
    }

    // update the count of jobs
    document.querySelector('[data-search-count]').innerText = `${filteredJobs.length} role${filteredJobs.length === 1 ? '' : 's'} found`
  }
}

export default Search;
