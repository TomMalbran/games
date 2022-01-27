import Animation    from "./Animation.js";
import Board        from "../board/Board.js";



/**
 * Pacman Ready Animation
 * @extends {Animation}
 */
export default class ReadyAnimation extends Animation {

    /**
     * Pacman Ready Animation constructor
     * @param {Board}    board
     * @param {Function} callback
     */
    constructor(board, callback) {
        super(board, callback);

        this.blocksGame = true;
        this.endTime    = 3000;

        this.canvas.drawText({
            color : "rgb(255, 255, 51)",
            text  : "Ready!",
            pos   : { x: 14, y: this.board.centerTextTop },
            size  : null,
            align : null,
            alpha : null,
        });
    }
}
