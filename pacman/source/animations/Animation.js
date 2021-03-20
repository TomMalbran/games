/**
 * The Animation Base Class
 */
class Animation {

    /**
     * The Animation Base constructor
     */
    constructor() {
        this.time = 0;
    }

    /**
     * Increases the timer
     * @param {Number} time
     * @returns {Void}
     */
    incTimer(time) {
        this.time += time;
    }

    /**
     * Returns true if the animation hasn't ended
     * @returns {Boolean}
     */
    isAnimating() {
        return this.endTime > this.time;
    }

    /**
     * Returns true if the game loop stops while the animation is running
     * @returns {Boolean}
     */
    blocksGameLoop() {
        return this.blocksGame;
    }

    /**
     * Does the Animation
     * @param {Number} time
     * @returns {Void}
     */
    animate() {
        return undefined;
    }

    /**
     * Called when the animation ends
     * @returns {Void}
     */
    onEnd() {
        if (this.canvas) {
            if (this.clearAll) {
                this.canvas.clear();
            } else {
                this.canvas.clearSavedRects();
            }
        }

        if (this.callback) {
            this.callback();
        }
    }
}
