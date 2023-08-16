import Eleventy from "@11ty/eleventy";

let elev;
export default async function buildEleventy({ production = false }) {
    if(!elev) {
        elev = new Eleventy();

        if(!production) {
            await elev.watch();
        }
    }

    // Disable caching to ensure a fresh build each time
    await elev.write();
}
