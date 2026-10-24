/**
 * Drawer — Offcanvas Bootstrap init.
 *
 * hugolify-theme emits one generic pair of classes for every panel
 * (js-dialog-toggle / js-dialog-close, see commons/dialog.html); the panel's
 * own class is what says which Bootstrap component drives it, so this file
 * claims only the triggers whose target is a .drawer — modal.js claims the
 * .modal ones. The js-drawer-* names stay supported for existing markup.
 *
 * The click is bound here rather than through data-bs-toggle="offcanvas":
 * with both, Bootstrap's data-api and this listener would fire on the same
 * click and the panel would open then close again.
 */
import Offcanvas from 'js/bootstrap/src/offcanvas';
import removeInvokers from '../utils/invokers';

const TOGGLE = '.js-dialog-toggle, .js-drawer-toggle';
const CLOSE = '.js-dialog-close, .js-drawer-close';

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll(TOGGLE).forEach(trigger => {
    const selector = trigger.dataset.target;
    const target = selector ? document.querySelector(selector) : null;
    if (!target || !target.classList.contains('drawer')) return;
    removeInvokers(trigger);
    const instance = Offcanvas.getOrCreateInstance(target);
    trigger.addEventListener('click', () => instance.toggle());
  });

  document.querySelectorAll(CLOSE).forEach(btn => {
    const panel = btn.closest('.drawer');
    if (!panel) return;
    removeInvokers(btn);
    btn.addEventListener('click', () => Offcanvas.getInstance(panel)?.hide());
  });

  // Close on anchor link click, then navigate after the drawer hides.
  // Only while it is an overlay: inline drawers (.toc, .sidebarmenu above
  // their breakpoint) must let the link navigate on its own.
  document.querySelectorAll('.drawer').forEach(drawer => {
    drawer.addEventListener('click', (e) => {
      const link = e.target.closest('a[href^="#"]');
      if (!link || !drawer.classList.contains('show')) return;
      e.preventDefault();
      const href = link.href;
      Offcanvas.getInstance(drawer)?.hide();
      setTimeout(() => { location.href = href; }, 300);
    });
  });
});
