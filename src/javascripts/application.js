import Search from './components/search';

const form = document.querySelector('form[action="/jobs"][data-enabled]');
if (form) new Search(form);


const firstFocusableEl = document.querySelector('.mobile-menu__first-link'),
      lastFocusableEl = document.querySelector('.mobile-menu__last-link'),
      mobileButton = document.querySelector('.mobile-menu__button'),
      mobileLinks = document.querySelectorAll('.mobile-menu__link'),
      KEYCODE_TAB = 9,
      menuButton = document.querySelector('.mobile-menu__button')
let ariaExpanded = menuButton.getAttribute('aria-expanded');

document.addEventListener('keydown', function(e) {
    let isTabPressed = (e.key === 'Tab' || e.keyCode === KEYCODE_TAB);

    if (!isTabPressed || !ariaExpanded) { 
        return; 
    }
    console.log(ariaExpanded)
    if (isTabPressed && !ariaExpanded) { 
      for (let i=0; i < mobileLinks.length; i++) {
        mobileLinks[i].tabIndex = -1;
      }
      return; 
    }

    if (ariaExpanded) {
      for (let i=0; i < mobileLinks.length; i++) {
        mobileLinks[i].tabIndex = 0;
      }
    }

    if ( e.shiftKey ) /* shift + tab */ {
        if (document.activeElement === firstFocusableEl) {
            lastFocusableEl.focus();
            e.preventDefault();
        }
    } else /* tab */ {
        if (document.activeElement === lastFocusableEl) {
            firstFocusableEl.focus();
            e.preventDefault();
        }
    }

});

menuButton.addEventListener('click',() => {
  ariaExpanded = !ariaExpanded;
  menuButton.setAttribute("aria-expanded", ariaExpanded);
})