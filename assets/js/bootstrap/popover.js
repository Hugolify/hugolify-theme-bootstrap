/**
 * Popover — Bootstrap init.
 * Bridges js-popover class to Bootstrap Popover.
 * Maps data-popover attribute to data-bs-content.
 */
import Popover from 'js/bootstrap/src/popover';

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.js-popover').forEach(trigger => {
    if (trigger.hasAttribute('data-popover')) {
      trigger.setAttribute('data-bs-content', trigger.getAttribute('data-popover'));
    }
    new Popover(trigger);
  });
});
