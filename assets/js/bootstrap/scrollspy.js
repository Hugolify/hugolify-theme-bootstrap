/**
 * Scrollspy — Bootstrap init.
 * Bridges js-scrollspy class to Bootstrap ScrollSpy.
 */
import ScrollSpy from 'js/bootstrap/src/scrollspy';

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.js-scrollspy').forEach(el => new ScrollSpy(el));
});
