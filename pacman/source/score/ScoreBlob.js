import Board        from "../board/Board.js";
import Blob         from "../Blob.js";



/**
 * Pacman Score Blob
 * @extends {Blob}
 */
export default class ScoreBlob extends Blob {

    /**
     * Pacman Score Blob constructor
     * @param {Board}  board
     * @param {Number} number
     */
    constructor(board, number) {
        super(board);
        this.init(board.boardCanvas);

        this.tile = { x: 19.5, y: 31.8 },
        this.x    = board.getTileCenter(this.tile.x + number * 1.4);
        this.y    = board.getTileCenter(this.tile.y);
        this.dir  = board.startingDir;
    }

    /**
     * Clears the Blob
     * @returns {Void}
     */
    clear() {
        this.ctx.clearRect(this.x - this.radius, this.y - this.radius, this.radius * 2, this.radius * 2);
    }
}
