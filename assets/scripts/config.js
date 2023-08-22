/**
 * > When using the esBuild API, all `process.env.NODE_ENV` expressions
 * > are automatically defined to `"production"` if all minification
 * > options are enabled and `"development"` otherwise. This only happens
 * > if `process`, `process.env`, and `process.env.NODE_ENV` are not already
 * > defined. This substitution is necessary to avoid code crashing instantly
 * > (since `process` is a Node API, not a web API).
 * > — https://esbuild.github.io/api/#platform
 */


// Main CSS classes used within the project
const CSS_CLASS = Object.freeze({
    LOADING: 'is-loading',
    LOADED: 'is-loaded',
    READY: 'is-ready',
    FONTS_LOADED: 'fonts-loaded',
    LAZY_CONTAINER: 'c-lazy',
    LAZY_LOADED: '-lazy-loaded',
    // ...
})

// Custom js events
const CUSTOM_EVENT = Object.freeze({
    RESIZE_END: 'loco.resizeEnd',
    // ...
})

export {
    CSS_CLASS,
    CUSTOM_EVENT
}
