import message from '../helpers/message.js';
import { writeFile } from 'node:fs/promises';
import * as sass from 'sass';
import fs from 'fs';
import buildEleventy from '../tasks/eleventy.js'

const files = [
    {
        input: 'assets/styles/main.scss',
        output: 'www/assets/styles/main.css'
    },
    {
        input: 'assets/styles/critical.scss',
        output: 'www/assets/styles/critical.css',
        checkFileChange: true
    }
]

export default async function compileStyles() {
    for(let file of files) {
        const timeLabel = `${file.output} compiled in`;
        console.time(timeLabel);

        let oldFileContent;
        if(file.checkFileChange) {
            try {
                oldFileContent = fs.readFileSync(file.output,'utf-8')
            } catch (error) {
                // console.error(error)
            }
        }

        try {
            const result = await sass.compileAsync(file.input);
            await writeFile(file.output, result.css);

            file.checkFileChange && oldFileContent != result.css && await buildEleventy({ production: false });

            if (result.css) {
                message(`${file.input} compiled`, 'success', timeLabel);
            } else {
                message(`${file.output} is empty`, 'notice', timeLabel);
            }
        } catch(err) {
            message(err, 'error', timeLabel);
        }
    }
}
