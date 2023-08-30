/**
 * Wait a number of frames before executing a callback
 * @param  {func} callback
 * @param  {int} i
 */
export function nestedRAF(callback, i) {
    requestAnimationFrame(() => {
        if(i == 0) {
            callback()
        } else {
            i--
            nestedRAF(callback, i)
        }
    })
}
