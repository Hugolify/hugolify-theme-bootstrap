/**
 * Search — focuses the input when the search panel opens.
 *
 * Listens to modal:shown and shown.bs.offcanvas Bootstrap events.
 */
const search = document.getElementById('mainSearch');

if (search) {
    search.addEventListener('shown.bs.modal', () => {
        const input = search.querySelector('input');
        if (input) {
            input.focus();
        }
    });

    search.addEventListener('shown.bs.offcanvas', () => {
        const input = search.querySelector('input');
        if (input) {
            input.focus();
        }
    });
}