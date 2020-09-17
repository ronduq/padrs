import Search from './components/search';
import MobileMenu from './components/mobileMenu';

const form = document.querySelector('form[action="/jobs"][data-enabled]');
if (form) new Search(form);

new MobileMenu();
