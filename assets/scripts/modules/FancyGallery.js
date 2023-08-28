import gsap from 'gsap'
import { module } from 'modujs'
import { CUSTOM_EVENT } from '../config';

export default class extends module {
    constructor(m) {
        super(m);

        this.$sticky = this.$('sticky')[0];
        this.$visualsContainer = this.$('visuals-container')[0];
        this.$items = Array.from(this.$('item'));
        this.$images = Array.from(this.$('image'));
    }

    init() {
        this.computeTl = this.computeTl.bind(this)
        window.addEventListener(CUSTOM_EVENT.RESIZE_END, this.computeTl);

        this.computeTl();
    }

    computeTl() {
        // Get rid of old timeline & reset everything
        const progress = this.tl?.progress?.() ?? 0;
        this.tl?.kill?.();
        this.tl = null;
        gsap.set([...this.$items,this.$images], { clearProps: 'all' })

        if(window.innerWidth < 700) return

        // RAF to make sure clearProps is effective before new computing
        requestAnimationFrame(() => {
            this.tl = gsap.timeline({});

            const singleDuration = 1;
            const containerBCR = this.$visualsContainer.getBoundingClientRect();
            const targetCoords = { // centered
                left: containerBCR.width/2,
                top: containerBCR.height/2
            };

            for(let i = 0; i < this.$items.length; i++) {
                let duration = singleDuration + .3 * i
                const item = this.$items[i]
                const image = this.$('image', item)[0];

                const { offsetTop, offsetLeft, offsetWidth, offsetHeight } = item;
                const offsetToTarget = {
                    x: targetCoords.left - offsetLeft - offsetWidth/2,
                    y: targetCoords.top - offsetTop - offsetHeight/2
                }

                const start = .075 * i;
                let rotateZ = 0;
                let scale = 1;
                let opacity = 1;
                if(i > 0) {
                    rotateZ = Math.random() * 30 - 15;
                    scale = Math.random() * 0.3 + 0.3;
                    opacity = 0.2
                }

                if(i == 0) {
                    // Scale first item after its' animation
                    this.tl.to(image, {
                        scale: 1.2,
                        duration: singleDuration + .3 * this.$items.length,
                        ease: 'power2.inOut'
                    }, 0)

                    duration = singleDuration + .3 * (this.$items.length/2);
                }

                this.tl.to(item, {
                    ...offsetToTarget,
                    rotateZ,
                    scale,
                    duration,
                    ease: 'power2.inOut'
                }, 0)

                this.tl.to(image, {
                    opacity,
                    duration: duration * 0.8,
                    ease: 'power1.in'
                }, 0)
            }

            this.tl.progress(progress)
            this.tl.pause()
        })
    }

    onScrollProgress(value) {
        this.tl?.progress?.(value)
    }

    destroy() {
        window.removeEventListener(CUSTOM_EVENT.RESIZE_END, this.computeTl);
    }
}
