import Search from './components/search';

const form = document.querySelector('form[action="/jobs"][data-enabled]');
if (form) new Search(form);
