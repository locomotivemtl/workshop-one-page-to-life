import message from '../helpers/message.js';
import esbuild from "esbuild";

const entryPoints = [
    'assets/scripts/app.js'
]
const outdir = 'www/assets/scripts/';

export default async function compileScripts() {
    const timeLabel = `Scripts compiled in`;
    console.time(timeLabel);

    try {
        await esbuild.build({
            bundle: true,
            color: true,
            sourcemap: true,
            target: [
                'es2015',
            ],
            entryPoints,
            outdir
        });

        message(`Scripts compiled`, 'success', timeLabel);
    } catch(err) {
        console.error(err)
        message(err, 'error', timeLabel);
    }
}
