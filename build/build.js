import buildEleventy from './tasks/eleventy.js';
import compileScripts from './tasks/scripts.js';
import compileStyles from './tasks/styles.js';

buildEleventy({ production: true });
compileScripts();
compileStyles();
