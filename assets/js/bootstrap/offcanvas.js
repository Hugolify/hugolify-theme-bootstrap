/**
 * Offcanvas — Bootstrap init.
 * Bridges js-offcanvas-toggle / js-offcanvas-close classes to Bootstrap Offcanvas.
 */
import Offcanvas from 'js/bootstrap/src/offcanvas';

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.js-offcanvas-toggle').forEach(trigger => {
    const target = document.querySelector(trigger.dataset.target);
    if (!target) return;
    trigger.setAttribute('data-bs-toggle', 'offcanvas');
    trigger.setAttribute('data-bs-target', trigger.dataset.target);
    const instance = new Offcanvas(target);
    trigger.addEventListener('click', () => instance.show());

    // Close on anchor link click, then navigate after offcanvas hides
    target.addEventListener('click', (e) => {
      const link = e.target.closest('a[href^="#"]');
      if (!link) return;
      e.preventDefault();
      const href = link.href;
      instance.hide();
      setTimeout(() => { location.href = href; }, 300);
    });
  });

  document.querySelectorAll('.js-offcanvas-close').forEach(btn => {
    btn.addEventListener('click', () => {
      const panel = btn.closest('[id]');
      if (panel) Offcanvas.getInstance(panel)?.hide();
    });
  });
});
