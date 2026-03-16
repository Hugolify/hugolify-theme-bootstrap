/**
 * Tab — Bootstrap init.
 * Bridges js-tab class to Bootstrap Tab.
 */
import Tab from 'js/bootstrap/src/tab';

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.js-tab').forEach(trigger => new Tab(trigger));
});
