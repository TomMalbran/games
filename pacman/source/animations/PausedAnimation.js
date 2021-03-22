/**
 * The Paused Animation
 * @extends {Animation}
 */
class PausedAnimation extends Animation {

    /**
     * The Paused Animation
     * @param {Canvas} canvas
     */
    constructor(canvas) {
        super();

        this.canvas     = canvas;
        this.blocksGame = true;
        this.timePart   = 500;
        this.partDiv    = 5;
        this.maxSize    = 2.2;
        this.minSize    = 1.5;
        this.clearAll   = true;
    }



    /**
     * Returns true if the animation hasn't ended
     * @param {Number} time
     * @returns {Boolean}
     */
    get isAnimating() {
        return true;
    }

    /**
     * Animates the Paused text alternating sizes increases and decreases
     * @returns {Void}
     */
    animate() {
        const time = this.time % this.timePart;
        const anim = Math.floor(this.time / this.timePart) % 2;
        const part = time * (this.maxSize - this.minSize) / this.timePart;
        const size = anim ? this.maxSize - part : this.minSize + part;

        this.canvas.clear();
        this.canvas.fill(0.8);

        this.canvas.drawText({
            size  : size,
            color : "rgb(255, 255, 51)",
            text  : "Paused!",
            pos   : { x: 14, y: Board.centerTextTop },
            alpha : 0.8,
        });
    }
}
