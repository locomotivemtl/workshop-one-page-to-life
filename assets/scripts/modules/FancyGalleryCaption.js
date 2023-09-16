import gsap from 'gsap'
import { module } from 'modujs'

export default class extends module {
    constructor(m) {
        super(m);
    }

    init() {
        // No need to handle resize here as nothing is computed in pixels,
        // we only use percentages so we let CSS do the work :)

        // Start timeline stuff
        this.computeTl();
    }

    computeTl() {
        // Create the timeline
        this.tl = gsap.timeline({});

        // Animation will go here

        this.tl.progress(0); // Force progress to 0 on init
        this.tl.pause(); // Very important to pause the timeline, we don't want it to play on its own: it's meant to be controlled by `onScrollProgress` only
    }

    onScrollProgress(value) {
        this.tl?.progress?.(value);
    }

    destroy() {
        super.destroy();
        this.tl?.kill?.();
    }
}
