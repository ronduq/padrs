import Search from './components/search';
import MobileMenu from './components/mobileMenu';

const form = document.querySelector('form[action="/jobs"][data-enabled]');
if (form) new Search(form);

new MobileMenu();

// Console Message
const styles = ['color: white', 'background: #D13339', 'padding: 20px', 'border-radius: 4px'].join(';');
const message = 'Welcome to digital careers at PA! If you\'re sniffing around these parts you\'re probably an Engineer. Check out our open roles at https://paconsulting.com/careers/digital';
console.log('%c%s', styles, message);
