/**
 * PostCSS config — hugolify-theme-bootstrap
 *
 * Copy this file to the root of your Hugo project and install the dependencies:
 *   npm install -D postcss autoprefixer @fullhuman/postcss-purgecss
 *
 * Requires Hugo stats for PurgeCSS (hugo.yaml):
 *   build:
 *     writeStats: true
 *
 * Declare in your params (config/_default/params.yaml):
 *   css:
 *     postcss: "postcss.config.bootstrap.js"
 */

/* eslint-disable no-undef */
module.exports = {
  plugins: {
    autoprefixer: {},
    '@fullhuman/postcss-purgecss': {
      mode: 'all',
      content: ['./hugo_stats.json'],
      dynamicAttributes: [
        'aria-current',
        'aria-hidden',
        'aria-expanded',
        'href',
        'role',
        'type'
      ],
      safelist: {
        standard: [
          'show',
          'showing',
          'hide',
          'fade',
          /-backdrop$/,
          /^is-/,
          /^splide_/
        ],
        deep: [
          /^tobii/
        ]
      },
      defaultExtractor: (content) => {
        let els = JSON.parse(content).htmlElements;
        els = els.tags.concat(els.classes);
        return els;
      }
    }
  }
};
