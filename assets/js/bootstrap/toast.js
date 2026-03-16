/**
 * Toast — Bootstrap init.
 * Auto-shows all js-toast elements on page load.
 */
import Toast from 'js/bootstrap/src/toast';

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.js-toast').forEach(el => new Toast(el).show());
});
