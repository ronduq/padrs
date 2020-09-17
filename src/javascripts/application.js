import Search from './components/search';
import MobileMenu from './components/mobileMenu';

const form = document.querySelector('form[action="/jobs"][data-enabled]');
if (form) new Search(form);

new MobileMenu();

// Console Message
const styles = ['color: white', 'background: #D13339', 'padding: 20px', 'border-radius: 4px'].join(';');
const message = 'Welcome to the PA Digital Recruiting website!';
console.log('%c%s', styles, message);
