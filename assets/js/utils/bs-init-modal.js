import Modal from 'js/bootstrap/src/modal';

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.js-modal-toggle').forEach(trigger => {
    const target = document.querySelector(trigger.dataset.target);
    if (!target) return;
    trigger.setAttribute('data-bs-toggle', 'modal');
    trigger.setAttribute('data-bs-target', trigger.dataset.target);
    const instance = new Modal(target);
    trigger.addEventListener('click', () => instance.show());
  });

  document.querySelectorAll('.js-modal-close').forEach(btn => {
    btn.addEventListener('click', () => {
      const modal = btn.closest('.modal');
      if (modal) Modal.getInstance(modal)?.hide();
    });
  });
});
