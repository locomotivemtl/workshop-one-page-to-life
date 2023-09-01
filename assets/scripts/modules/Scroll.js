import { module } from 'modujs'
import LocomotiveScroll from 'locomotive-scroll'

export default class extends module {
    constructor(m) {
        super(m);

        this.onScrollBind = this.onScroll.bind(this)
    }

    init() {
        this.locomotiveScroll = new LocomotiveScroll({
            modularInstance: this,
            scrollCallback: this.onScrollBind,
        })
    }

    onScroll({ scroll, limit, velocity, direction, progress }) {
        // Store our LS data on window to allow global access
        window.locomotiveScrollData = { scroll, limit, velocity, direction, progress };
    }

    /**
     * Scroll to
     *
     * @param {object}
     */
    scrollTo(params) {
        let { target, options } = params

        this.locomotiveScroll?.scrollTo(target, options)
    }

    destroy() {
        super.destroy();
        this.locomotiveScroll?.destroy();
    }
}
