// Global
import './utils/global';

// Bootstrap
{{ if .Site.Params.bootstrap.alert }}
    import './bootstrap/alert';
{{ end }}
{{ if .Site.Params.bootstrap.carousel }}
    import './bootstrap/carousel';
{{ end }}
{{ if .Site.Params.bootstrap.collapse }}
    import './bootstrap/collapse';
{{ end }}
{{ if .Site.Params.bootstrap.dropdown }}
    import './bootstrap/dropdown';
{{ end }}
{{ if .Site.Params.bootstrap.modal }}
    import './bootstrap/modal';
{{ end }}
{{ if .Site.Params.bootstrap.offcanvas }}
    import './bootstrap/offcanvas';
{{ end }}
{{ if .Site.Params.bootstrap.popover }}
    import './bootstrap/popover';
{{ end }}
{{ if .Site.Params.bootstrap.scrollspy }}
    import './bootstrap/scrollspy';
{{ end }}
{{ if .Site.Params.bootstrap.tab }}
    import './bootstrap/tab';
{{ end }}
{{ if .Site.Params.bootstrap.toast }}
    import './bootstrap/toast';
{{ end }}
{{ if .Site.Params.bootstrap.tooltip }}
    import './bootstrap/tooltip';
{{ end }}

// Add custom vendors
import './vendors/custom';

// Features
{{ if .Site.Params.animation }}
    import './features/animation';
{{ end }}
{{ if .Site.Params.carousel }}
    import './features/carousel';
{{ end }}
{{ if .Site.Params.map }}
    import './features/map';
{{ end }}
{{ if .Site.Params.parallax.enable }}
    import './features/parallax';
{{ end }}
{{ if .Site.Params.search.enable }}
    import './features/search';
{{ end }}
{{ if .Site.Params.vimeo }}
    import './features/vimeo';
{{ end }}
{{ if .Site.Params.youtube }}
    import './features/youtube';
{{ end }}

// Add custom features
import './features/custom';

// Blocks
{{ with .Site.Params.admin.blocks.enable }}
    {{ range . }}
        {{ if fileExists (print "assets/js/blocks/" . ".js") }}
            import './blocks/{{ . }}.js';
        {{ end }}
    {{ end }}
{{ else }}
    import './blocks/index.js';
{{ end }}

// Components
import './components/index';

// Add custom components
import './components/custom';