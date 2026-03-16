/**
 * Tooltip — Bootstrap init.
 * Bridges js-tooltip class to Bootstrap Tooltip.
 * Reads data-tooltip or title attribute as tooltip content.
 */
import Tooltip from 'js/bootstrap/src/tooltip';

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.js-tooltip').forEach(trigger => {
    new Tooltip(trigger, {
      title: trigger.getAttribute('data-tooltip') || trigger.getAttribute('title') || ''
    });
  });
});
