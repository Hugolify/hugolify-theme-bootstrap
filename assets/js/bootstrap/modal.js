/**
 * Modal — Bootstrap init.
 *
 * Shares the generic panel classes with the drawer (see bootstrap/offcanvas.js
 * for the split): this file claims only the triggers whose target is a .modal.
 * The js-modal-* names stay supported for existing markup.
 */
import Modal from 'js/bootstrap/src/modal';

const TOGGLE = '.js-dialog-toggle, .js-modal-toggle';
const CLOSE = '.js-dialog-close, .js-modal-close';

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll(TOGGLE).forEach(trigger => {
    const selector = trigger.dataset.target;
    const target = selector ? document.querySelector(selector) : null;
    if (!target || !target.classList.contains('modal')) return;
    const instance = Modal.getOrCreateInstance(target);
    trigger.addEventListener('click', () => instance.toggle());
  });

  document.querySelectorAll(CLOSE).forEach(btn => {
    const modal = btn.closest('.modal');
    if (!modal) return;
    btn.addEventListener('click', () => Modal.getInstance(modal)?.hide());
  });
});
