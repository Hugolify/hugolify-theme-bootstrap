/**
 * Alert — Bootstrap init.
 * Bridges js-alert-close class to Bootstrap Alert dismiss.
 */
import Alert from 'js/bootstrap/src/alert';

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.js-alert-close').forEach(btn => {
    btn.addEventListener('click', () => {
      const alert = btn.closest('.alert');
      if (alert) Alert.getOrCreateInstance(alert).close();
    });
  });
});
