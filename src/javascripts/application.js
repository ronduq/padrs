import Search from './components/search';

const form = document.querySelector('form[action="/jobs"][data-enabled]');
if (form) new Search(form);


const firstFocusableEl = document.querySelector('.mobile-menu__first-link'),
      lastFocusableEl = document.querySelector('.mobile-menu__last-link'),
      mobileButton = document.querySelector('.mobile-menu__button'),
      mobileLinks = document.querySelectorAll('.mobile-menu__link'),
      KEYCODE_TAB = 9;

document.addEventListener('keydown', function(e) {
    var isTabPressed = (e.key === 'Tab' || e.keyCode === KEYCODE_TAB);
    console.log('gen key',mobileButton.checked)

    if (!isTabPressed || !mobileButton.checked) { 
        return; 
    }
    console.log(mobileButton.checked)
    if (isTabPressed && !mobileButton.checked) { 
      for (var i=0; i < mobileLinks.length; i++) {
        mobileLinks[i].tabIndex = -1;
      }
      console.log('mobile butotn not checked')
      return; 
    }

    if (mobileButton.checked) {
      for (var i=0; i < mobileLinks.length; i++) {
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