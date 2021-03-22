/**
 * The Game Over Animation
 * @extends {Animation}
 */
class GameOverAnimation extends Animation {

    /**
     * The Game Over constructor
     * @param {Canvas}   canvas
     * @param {Function} callback
     */
    constructor(canvas, callback) {
        super();

        this.canvas     = canvas;
        this.callback   = callback;
        this.blocksGame = true;
        this.endTime    = 2000;
    }



    /**
     * Does the Game Over animation
     * @returns {Void}
     */
    animate() {
        const size  = Math.round(this.endTime - this.time) / 700;
        const alpha = Math.round(this.endTime - this.time) / 2000;

        this.canvas.clear();
        this.canvas.fill(0.8);

        this.canvas.drawText({
            size  : Math.max(2, size),
            color : Utils.rgba(255, 0, 0, Math.max(0, alpha)),
            text  : "Game Over",
            pos   : { x: 14, y: 17.3 },
            alpha : 0.8,
        });
    }
}
