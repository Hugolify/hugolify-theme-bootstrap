/**
 * Collapse — Bootstrap init.
 * Bridges js-collapse-toggle class to Bootstrap Collapse.
 */
import Collapse from 'js/bootstrap/src/collapse';

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.js-collapse-toggle').forEach(trigger => {
    const target = document.querySelector(trigger.dataset.target);
    if (!target) return;
    const instance = new Collapse(target, { toggle: false });
    trigger.addEventListener('click', () => instance.toggle());
  });
});
