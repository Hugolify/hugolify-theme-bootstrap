# hugolify-theme-bootstrap

Bootstrap 5 styling layer for [hugolify-theme](https://github.com/hugolify/hugolify-theme).

This module provides the CSS (Bootstrap 5 + SASS) and JavaScript for hugolify-theme.
It is imported automatically by hugolify-theme — you do not need to import it directly.

## Requirements

- [Hugo extended](https://gohugo.io/installation/) >= 0.141.0
- [hugolify-theme](https://github.com/hugolify/hugolify-theme)

## Customization

Override variables in `assets/sass/abstracts/_variables-site.sass`:

```sass
$primary: #your-color
$global-spacing: 3rem
```

Add custom mixins in `assets/sass/abstracts/_mixins.sass`.

## Structure

```
assets/
├── sass/
│   ├── main-theme.sass
│   ├── abstracts/        # Variables, mixins, functions
│   ├── base/             # Element styles
│   ├── layout/           # Header, footer, grid, sidebar
│   ├── components/       # UI components
│   ├── pages/            # Page-specific styles
│   └── vendors/          # Bootstrap, Splide, Leaflet…
└── js/
    ├── components/       # Menu, TOC, video…
    ├── features/         # Animation, carousel, map…
    └── blocks/           # Block-specific scripts
```

## Documentation

https://www.hugolify.io/docs/

## Licensing

Hugolify is free for personal or commercial projects (MIT license)
