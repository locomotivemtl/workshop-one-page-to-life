import { module } from 'modujs'

export default class extends module {
    constructor(m) {
        super(m);
    }

    init() {
        // Nothing yet
    }

    // This method will be called automatically by `data-scroll-module-progress`
    onScrollProgress(value) {
        console.log(value)
    }
}
