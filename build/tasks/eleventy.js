import message from '../helpers/message.js';
import Eleventy from "@11ty/eleventy";

let elev;
export default async function buildEleventy({ production }) {
    const timeLabel = `11ty compiled in`;
    console.time(timeLabel);

    try {
        if(!elev) {
            elev = new Eleventy();

            if(!production) {
                await elev.watch();
            }
        }

        // Disable caching to ensure a fresh build each time
        await elev.write();

        message(`11ty compiled`, 'success', timeLabel);
    } catch(err) {
        console.error(err)
        message(err, 'error', timeLabel);
    }
}
