import { module } from 'modujs'
import LocomotiveScroll from 'locomotive-scroll'

export default class extends module {
    constructor(m) {
        super(m);

        this.onScrollBind = this.onScroll.bind(this)
    }

    init() {
        this.scroll = new LocomotiveScroll({
            modularInstance: this,
            scrollCallback: this.onScrollBind,
        })

        // // Force scroll to top
        // if (history.scrollRestoration) {
        //     history.scrollRestoration = 'manual'
        //     window.scrollTo(0, 0)
        // }
    }

    onScroll({ scroll, limit, velocity, direction, progress }) {
        window.locomotiveScrollData = { scroll, limit, velocity, direction, progress };
    }

    scrollTo(params) {
        let { target, ...options } = params

        options = Object.assign({
            // Defaults
            duration: 1,
        }, options)

        this.scroll?.scrollTo(target, options)
    }

    destroy() {
        super.destroy()
        this.scroll?.destroy();
    }
}
