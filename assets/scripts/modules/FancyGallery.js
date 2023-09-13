import gsap from 'gsap'
import { module } from 'modujs'
import { CUSTOM_EVENT } from '../config';

export default class extends module {
    constructor(m) {
        super(m);

        // Element Selectors
        this.$sticky = this.$('sticky')[0];
        this.$grid = this.$('grid')[0];
        this.$gridItems = Array.from(this.$('grid-item'));
        this.$images = Array.from(this.$('image'));
    }

    init() {
        // Start timeline stuff
        this.computeTl();
    }

    computeTl() {
        // Create the timeline
        this.tl = gsap.timeline({});

        // Rotate our first grid item
        this.tl.to(this.$gridItems[0], { rotateZ: '360deg' })

        this.tl.progress(0); // Set progress to 0
        this.tl.pause(); // Very important to pause the timeline, we don't want it to play on its own: it's meant to be controlled by `onScrollProgress` only
    }

    // Allows to progress through our timeline relatively to the data-scroll progress given
    onScrollProgress(value) {
        this.tl?.progress?.(value);
    }

    destroy() {
        super.destroy();

        this.tl?.kill?.();
    }
}
