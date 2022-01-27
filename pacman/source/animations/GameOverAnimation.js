import Animation    from "./Animation.js";
import Board        from "../board/Board.js";

// Utils
import Utils        from "../../../utils/Utils.js";



/**
 * Pacman Game Over Animation
 * @extends {Animation}
 */
export default class GameOverAnimation extends Animation {

    /**
     * Pacman Game Over constructor
     * @param {Board}   board
     * @param {Function} callback
     */
    constructor(board, callback) {
        super(board, callback);

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
            align : null,
        });
    }
}
