import Board        from "./Board.js";
import Canvas       from "./Canvas.js";
import Ghost        from "../ghosts/Ghost.js";



/**
 * Pacman Game Canvas
 * @extends {Canvas}
 */
export default class GameCanvas extends Canvas {

    /**
     * Pacman Game Canvas constructor
     * @param {Board} board
     */
    constructor(board) {
        super(board, "game");
    }



    /**
     * Draws the Ghosts Targets for testing
     * @param {Ghost[]} ghosts
     * @returns {Void}
     */
    drawTargets(ghosts) {
        this.ctx.save();
        ghosts.forEach((ghost) => {
            this.ctx.fillStyle   = ghost.bodyColor;
            this.ctx.strokeStyle = ghost.bodyColor;

            const tile = this.board.getTileXYCenter(ghost.target);
            this.ctx.beginPath();
            this.ctx.moveTo(ghost.x, ghost.y);
            this.ctx.lineTo(tile.x, tile.y);
            this.ctx.fillRect(tile.x - 4, tile.y - 4, 8, 8);
            this.ctx.stroke();
        });
        this.ctx.restore();
    }
}
