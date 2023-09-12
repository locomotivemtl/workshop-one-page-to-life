import modular from 'modujs';
import * as modules from './modules';
import { debounce } from './utils/tickers'
import { $html } from './utils/dom';
import { nestedRAF } from './utils/html'
import { CUSTOM_EVENT, CSS_CLASS } from './config'
import { gridHelper } from './utils/grid-helper'

// Instantiate the app w/ modular
// This is the entry gate of our whole JS modules system
// It is yet to be properly launched by a call to `app.init()` but we'll wait for the load event for that
const app = new modular({
    modules: modules,
});

// Events handling
// ==========================================================================

// Listen for page load
window.addEventListener('load', (event) => {
    const $style = document.getElementById('main-css');

    if ($style) {
        if ($style.isLoaded) {
            init();
        } else {
            $style.addEventListener('load', (event) => {
                init();
            });
        }
    } else {
        console.warn('The "main-css" stylesheet not found');
    }
});

// Bind window resize event with default vars
const resizeEndEvent = new CustomEvent(CUSTOM_EVENT.RESIZE_END)
function onResize() {
    $html.style.setProperty('--vw', `${document.documentElement.clientWidth * 0.01}px`)
    $html.style.setProperty('--vh', `${document.documentElement.clientHeight * 0.01}px`)
    window.dispatchEvent(resizeEndEvent)
}
window.addEventListener('resize', debounce(onResize, 200))
onResize();

// Init functions
// ==========================================================================
function postInit() {
    $html.classList.add(CSS_CLASS.LOADED);
    $html.classList.add(CSS_CLASS.READY);
    $html.classList.remove(CSS_CLASS.LOADING);
}

function init() {
    gridHelper?.();

    // Init our app, will call `.init()` on all modules currently on page
    app.init(app);

    // If we have a promise for a the 3dmodel, wait for it to complete before calling postInit to prevent jittering (caused by the 3d model instanciation) on our intro
    if(window.model3dLoadPromise) {
        window.model3dLoadPromise.then(() => {
            nestedRAF(() => { // Along with the promise, we also wait for 7 frames (arbitrary) to let the browser a chance to get back to reality after the hard 3d model instanciation process. Again, a small hack to prevent jittering and keep our intro smooth
                postInit();
            }, 7);
        })
    } else {
        postInit();
    }
}
