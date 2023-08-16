import message from '../helpers/message.js';
import { writeFile } from 'node:fs/promises';
import * as sass from 'sass';

const inputFile = 'assets/styles/main.scss'
const destFile = 'www/assets/styles/main.css'

export default async function compileStyles() {
    const timeLabel = `${destFile} compiled in`;
    console.time(timeLabel);

    try {
        const result = await sass.compileAsync(inputFile);
        await writeFile(destFile, result.css);

        if (result.css) {
            message(`Styles compiled`, 'success', timeLabel);
        } else {
            message(`${destFile} is empty`, 'notice', timeLabel);
        }
    } catch(err) {
        message(err, 'error', timeLabel);
    }
}
