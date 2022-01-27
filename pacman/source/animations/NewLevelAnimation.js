import Animation    from "./Animation.js";
import Board        from "../board/Board.js";



/**
 * Pacman New Level Animation
 * @extends {Animation}
 */
export default class NewLevelAnimation extends Animation {

    /**
     * Pacman New Level Animation constructor
     * @param {Board}    board
     * @param {Function} callback
     * @param {Number}   level
     */
    constructor(board, callback, level) {
        super(board, callback);

        this.level      = level;
        this.blinks     = 0;
        this.blocksGame = true;
        this.blinkTimer = 150;
        this.endTime    = 2000;
        this.clearAll   = true;
    }



    /**
     * Does the New Level animation
     * @returns {Void}
     */
    animate() {
        const calc  = Math.round(this.time * 0.03);
        const pos   = calc < 17.15 ? calc - 2 : 15;
        const lvl   = (this.level < 10 ? "0" : "") + this.level;
        const right = this.board.cols;

        this.canvas.clear();
        this.canvas.fill(0.8);

        this.canvas.drawText({
            color : "rgb(255,255,255)",
            align : "right",
            text  : "Level",
            pos   : { x: pos, y: this.board.centerTextTop },
            size  : null,
            alpha : null,
        });
        this.canvas.drawText({
            color : "rgb(255,255,51)",
            align : "left",
            text  : lvl,
            pos   : { x: right - pos + 2, y: this.board.centerTextTop },
            size  : null,
            alpha : null,
        });
    }
}
