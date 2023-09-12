import browserSync from "browser-sync";
import buildEleventy from './tasks/eleventy.js'
import compileScripts from './tasks/scripts.js'
import compileStyles from './tasks/styles.js'

await compileScripts();
await compileStyles();
await buildEleventy({ production: false });

const server = browserSync.create();
server.init({
    open: false,
    notify: false,
    ghostMode: false,
    server: 'www',
    watch: true
}, err => {
    if(err) console.error('Error:' + err)
})

server.watch([
    'views/**/*',
    'data/**/*'
]).on('change', async () => {
    await buildEleventy({ production: false });
})

server.watch([
    'assets/scripts/**/*.js'
]).on('change', async () => {
    await compileScripts();
})

server.watch([
    'assets/styles/**/*.scss'
]).on('change', async () => {
    await compileStyles();
})
