/**
 * Invokers — removes the native invokers hugolify-theme writes on panel
 * buttons (popovertarget, commandfor), which the browser would act on along
 * with bootstrap/offcanvas.js and bootstrap/modal.js.
 *
 * The overrides in layouts/ already drop them, but only when this module is
 * imported before hugolify-theme/v2: this keeps a site importing in the other
 * order working.
 */
const NATIVE = ['popovertarget', 'popovertargetaction', 'commandfor', 'command'];

export const removeInvokers = (button) => {
  NATIVE.forEach((name) => button.removeAttribute(name));
};
export default removeInvokers;
