import Animation    from "./Animation.js";
import Board        from "../board/Board.js";



/**
 * Pacman Paused Animation
 * @extends {Animation}
 */
export default class PausedAnimation extends Animation {

    /**
     * Pacman Paused Animation constructor
     * @param {Board} board
     */
    constructor(board) {
        super(board);

        this.blocksGame = true;
        this.timePart   = 500;
        this.partDiv    = 5;
        this.maxSize    = 2.2;
        this.minSize    = 1.5;
        this.clearAll   = true;
    }



    /**
     * Returns true if the animation hasn't ended
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
            pos   : { x: 14, y: this.board.centerTextTop },
            alpha : 0.8,
            align : null,
        });
    }
}
