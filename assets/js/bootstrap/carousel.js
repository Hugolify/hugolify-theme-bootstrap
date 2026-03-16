/**
 * Carousel — Bootstrap init.
 * Bridges js-carousel class to Bootstrap Carousel.
 */
import Carousel from 'js/bootstrap/src/carousel';

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.js-carousel').forEach(el => new Carousel(el));
});
