import gsap from 'gsap'
import { module } from 'modujs'
import { CUSTOM_EVENT } from '../config';

export default class extends module {
    constructor(m) {
        super(m);

        this.$words = Array.from(this.$('word'));
    }

    init() {
        // this.computeTl = this.computeTl.bind(this)
        // window.addEventListener(CUSTOM_EVENT.RESIZE_END, this.computeTl);

        this.computeTl();
    }

    computeTl() {
        this.tl = gsap.timeline({});


        this.tl.from(this.$words, {
            y: '130%',
            stagger: .25,
            opacity: 0,
            duration: 1,
            ease: 'power2.out'
        })

        this.tl.progress(0)
        this.tl.pause()
    }

    onScrollProgress(value) {
        this.tl?.progress?.(value)
    }

    destroy() {
        // window.removeEventListener(CUSTOM_EVENT.RESIZE_END, this.computeTl);
    }
}
