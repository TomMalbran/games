import Board        from "../board/Board.js";



/**
 * Pacman Animation
 */
export default class Animation {

    /**
     * Pacman Animation constructor
     * @param {Board}     board
     * @param {Function=} callback
     */
    constructor(board, callback = null) {
        this.board    = board;
        this.canvas   = board.screenCanvas;
        this.ctx      = this.canvas.ctx;
        this.callback = callback;

        this.time     = 0;
        this.endTime  = 0;
        this.clearAll = false;
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
    get isAnimating() {
        return this.endTime > this.time;
    }

    /**
     * Does the Animation
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
