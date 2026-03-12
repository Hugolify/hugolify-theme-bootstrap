import Dropdown from 'js/bootstrap/src/dropdown';

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.js-dropdown-toggle').forEach(trigger => {
    trigger.setAttribute('data-bs-toggle', 'dropdown');
    new Dropdown(trigger);
  });
});
