import Animation    from "./Animation.js";
import Board        from "../board/Board.js";



/**
 * Pacman End Level Animation
 * @extends {Animation}
 */
export default class EndLevelAnimation extends Animation {

    /**
     * Pacman End Level Animation constructor
     * @param {Board}    board
     * @param {Function} callback
     */
    constructor(board, callback) {
        super(board, callback);

        this.blinks     = 0;
        this.blocksGame = true;
        this.blinkTimer = 150;
        this.endTime    = 1600;
    }



    /**
     * Does the End Level animation
     * @returns {Void}
     */
    animate() {
        if (this.time > this.blinkTimer) {
            this.board.boardCanvas.clear();
            this.board.drawBoard(this.blinks % 2 === 0);
            this.blinks     += 1;
            this.blinkTimer += 150;
        }
    }
}
