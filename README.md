# hugolify-theme-bootstrap

Bootstrap 5 styling layer for [hugolify-theme](https://github.com/hugolify/hugolify-theme).

This module provides the CSS (Bootstrap 5 + SASS) and JavaScript (Bootstrap 5 + Vanilla JS) for hugolify-theme.
It is imported automatically by hugolify-theme — you do not need to import it directly.

## Requirements

- [Hugo extended](https://gohugo.io/installation/)
- [hugolify-theme](https://github.com/hugolify/hugolify-theme)

## Customization

### CSS

Override variables in `assets/sass/abstracts/_variables-site.sass`:

```sass
$primary: #000000
$blockquote-color: #333333
$global-spacing: 3rem
```

Add custom mixins in `assets/sass/abstracts/_mixins.sass`.

### JavaScript

Bootstrap components are opt-in via `params.yaml`. Each component is initialized on `js-*` CSS classes — no `data-bs-*` attributes needed in HTML:

```yaml
bootstrap:
  alert: false # Disable by default
  carousel: false # Use Splide JS instead
  collapse: true 
  dropdown: true 
  modal: true 
  offcanvas: true 
  popover: false # Disable by default
  scrollspy: false # Disable by default
  tab: false # Disable by default
  toast: false # Disable by default
  tooltip: false # Disable by default
```

| Class | Component |
| --- | --- |
| `.js-alert-close` | Alert dismiss |
| `.js-carousel` | Carousel |
| `.js-collapse-toggle` + `data-target` | Collapse |
| `.js-dropdown-toggle` | Dropdown |
| `.js-modal-toggle` + `data-target` | Modal open |
| `.js-modal-close` | Modal close |
| `.js-offcanvas-toggle` + `data-target` | Offcanvas open |
| `.js-offcanvas-close` | Offcanvas close |
| `.js-popover` | Popover |
| `.js-scrollspy` | Scrollspy |
| `.js-tab` | Tab |
| `.js-toast` | Toast (auto-shown) |
| `.js-tooltip` | Tooltip |

Add custom JS in:

- `assets/js/components/custom.js`
- `assets/js/features/custom.js`
- `assets/js/vendors/custom.js`

## Structure

```
assets/
├── sass/
│   ├── main.sass              # Entry point
│   ├── main-theme.sass        # Shared manifest
│   ├── site.sass              # Site overrides
│   ├── theme.sass             # Theme overrides
│   ├── abstracts/             # Variables, mixins, functions
│   ├── base/                  # Element styles
│   ├── layout/                # Header, footer, grid, sidebar
│   ├── components/            # UI components
│   ├── pages/                 # Page-specific styles
│   └── vendors/               # Bootstrap, Splide, Leaflet…
└── js/
    ├── main.js                # Entry point
    ├── bootstrap/             # Bootstrap component inits (js-* → Bootstrap)
    ├── components/            # Menu, TOC, video…
    ├── features/              # Animation, carousel, map…
    ├── blocks/                # Block-specific scripts
    └── utils/                 # Shared utilities (scrollspy…)
```

## Icon

https://icons.getbootstrap.com

## Documentation

https://www.hugolify.io/docs/

## Licensing

Hugolify is free for personal or commercial projects (MIT license)
