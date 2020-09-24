class MobileMenu {

  constructor() {
    const firstFocusableEl = document.querySelector('.mobile-menu__first-link'),
          lastFocusableEl = document.querySelector('.mobile-menu__last-link'),
          mobileLinks = document.querySelectorAll('.mobile-menu__link'),
          KEYCODE_TAB = 9,
          menuButton = document.querySelector('.mobile-menu__button')
    let ariaExpanded = menuButton.getAttribute('aria-expanded');

    document.addEventListener('keydown', function(e) {
      let isTabPressed = (e.key === 'Tab' || e.keyCode === KEYCODE_TAB);

      if (!isTabPressed || !ariaExpanded || (isTabPressed && (ariaExpanded === false))) { 
        return; 
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
      if (ariaExpanded) {
        for (let i = 0; i < mobileLinks.length; i++) {
          mobileLinks[i].tabIndex = 0;
        }
      } else {
        for (let i = 0; i < mobileLinks.length; i++) {
          mobileLinks[i].tabIndex = -1;
        }
      }
    });
  }
}

export default MobileMenu;