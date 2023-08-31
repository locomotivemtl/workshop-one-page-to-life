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
        // We need to handle resize because we're computing sizings/spacings in raw pixels
        this.computeTl = this.computeTl.bind(this);
        window.addEventListener(CUSTOM_EVENT.RESIZE_END, this.computeTl);

        // Start timeline stuff
        this.computeTl();
    }

    computeTl() {
        // Get rid of old timeline & reset everything
        const progress = this.tl?.progress?.() ?? 0;
        this.tl?.kill?.();
        this.tl = null; // Safety
        gsap.set([...this.$gridItems,this.$images], { clearProps: 'all' });

        // If we're on mobile-ish, we want the simplified layout w/ out any grid animation, so don't go further
        if(window.innerWidth < 700) return;

        // RAF to make sure clearProps is effective before new computing
        requestAnimationFrame(() => {

            // Create the timeline
            this.tl = gsap.timeline({});

            // Define settings
            const singleDuration = 1; // Our base timing unit
            const gridBCR = this.$grid.getBoundingClientRect();
            const targetCoords = { // Center of the grid
                left: gridBCR.width/2,
                top: gridBCR.height/2
            };

            // Loop other gridItems to animate each individually
            for(let i = 0; i < this.$gridItems.length; i++) {
                // The greater the index, the greater the duration (almost like a stagger but everyone starts at the same time)
                let duration = singleDuration + .3 * i;
                const item = this.$gridItems[i]; // Convenience
                const image = this.$('image', item)[0]; // Select the child image

                // Compute offsetToTarget
                const { offsetTop, offsetLeft, offsetWidth, offsetHeight } = item; // Extract properties for better readability
                const offsetToTarget = {
                    x: targetCoords.left - offsetLeft - offsetWidth/2,
                    y: targetCoords.top - offsetTop - offsetHeight/2
                };

                // Properties targets
                let rotateZ = Math.random() * 30 - 15, // Randomize target rotation for a more organic look (between -15 and 15)
                    scale = Math.random() * 0.3 + 0.3, // Randomize target scale for a more organic look (between .3 & .6)
                    opacity = 0.2;

                // Specific settings for first item only
                if(i == 0) {
                    rotateZ = 0;
                    scale = 1;
                    opacity = 1;
                    duration = singleDuration + .3 * (this.$gridItems.length/2);

                    // Scaling is handled on image instead of item to avoid transform conflicts & to allow different duration or easing settings
                    this.tl.to(image, {
                        scale: 1.2,
                        ease: 'power2.inOut',
                        duration: singleDuration + .3 * this.$gridItems.length
                    }, 0);
                }

                // Move the item to the target
                this.tl.to(item, {
                    ...offsetToTarget,
                    rotateZ,
                    scale,
                    duration,
                    ease: 'power2.inOut'
                }, 0);

                // Fade image out as it moves to emulate depth / distance fog
                this.tl.to(image, {
                    opacity,
                    duration: duration * 0.8,
                    ease: 'power1.in'
                }, 0);
            }

            this.tl.progress(progress); // Set progress to 0 or old progress value (if we're in a resize event)
            this.tl.pause(); // Very important to pause the timeline, we don't want it to play on its own: it's meant to be controlled by `onScrollProgress` only
        });
    }

    // Allows to progress through our timeline relatively to the data-scroll progress given
    onScrollProgress(value) {
        this.tl?.progress?.(value);
    }

    destroy() {
        window.removeEventListener(CUSTOM_EVENT.RESIZE_END, this.computeTl);
        this.tl?.kill?.();
    }
}
