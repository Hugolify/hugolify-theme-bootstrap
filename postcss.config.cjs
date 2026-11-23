/**
 * PostCSS config — hugolify-theme-bootstrap
 *
 * Loaded straight from the module, no copy in the project: Hugo mounts this file
 * in assets/_jsconfig, and the module points the theme at it (hugo.yaml):
 *   params:
 *     css:
 *       postcss: "postcss.config.cjs"
 *
 * Install the dependencies:
 *   hugo mod get && hugo mod npm pack && yarn install
 *
 * Requires Hugo stats for PurgeCSS (hugo.yaml):
 *   build:
 *     writeStats: true
 *
 * Why CommonJS (.cjs), not ESM: Node runs this file from the Hugo module cache,
 * which has no node_modules, so the plugins must come from the project's
 * node_modules, which Hugo passes as NODE_PATH. require() has always read
 * NODE_PATH, on any Hugo version; ESM import ignores it, and Hugo only works
 * around that since 0.164. The .cjs extension also keeps a leftover
 * postcss.config.js at a project root from shadowing this file.
 *
 * Since Hugo 0.161, Node runs with --permission: use Node >= 24.5 or >= 22.20,
 * older releases crash (or hang Hugo) while resolving this file.
 *
 * To override, add a postcss.config.cjs at the project root: Hugo mounts it in
 * assets/_jsconfig too, and the project's assets come first.
 *
 * autoprefixer reads the project's .browserslistrc (browserslist defaults
 * without one). PostCSS runs from the project root, so ./hugo_stats.json is the
 * project's file.
 */

/* eslint-disable no-undef */
module.exports = {
  plugins: [
    require('autoprefixer')(),
    require('@fullhuman/postcss-purgecss')({
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
        // hugo_stats.json holds null tags/classes/ids until Hugo finishes
        // collecting stats (first build, or after a crashed build), so guard
        // against null to avoid "Cannot read properties of null (reading 'concat')".
        const els = JSON.parse(content).htmlElements;
        return [
          ...(els.tags || []),
          ...(els.classes || []),
          ...(els.ids || [])
        ];
      }
    })
  ]
};
