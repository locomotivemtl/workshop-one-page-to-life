import modular from 'modujs';
import * as modules from './modules';
import { debounce } from './utils/tickers'
import { $html } from './utils/dom';
import { nestedRAF } from './utils/html'
import { CUSTOM_EVENT, CSS_CLASS } from './config'
import { gridHelper } from './utils/grid-helper'

const app = new modular({
    modules: modules,
});

// Events handling
// ==========================================================================

// Bind window resize event with default vars
const resizeEndEvent = new CustomEvent(CUSTOM_EVENT.RESIZE_END)
window.addEventListener('resize', debounce(() => {
    $html.style.setProperty('--vw', `${document.documentElement.clientWidth * 0.01}px`)
    window.dispatchEvent(resizeEndEvent)
}, 200))

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

// Init functions
// ==========================================================================
function postInit() {
    $html.classList.add(CSS_CLASS.LOADED);
    $html.classList.add(CSS_CLASS.READY);
    $html.classList.remove(CSS_CLASS.LOADING);
}

function init() {
    gridHelper?.();

    app.init(app);

    if(window.model3dLoadPromise) {
        window.model3dLoadPromise.then(() => {
            nestedRAF(() => {
                postInit();
            }, 7);
        })
    } else {
        postInit();
    }
}
