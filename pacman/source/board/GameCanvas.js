/**
 * The Game Canvas Class
 * @extends {Canvas}
 */
class GameCanvas extends Canvas {

    /**
     * The Game Canvas constructor
     */
    constructor() {
        super();
        this.init("game");
    }



    /**
     * Draws the Ghosts Targets for testing
     * @param {Array.<Ghost>} ghosts
     * @returns {Void}
     */
    drawTargets(ghosts) {
        this.ctx.save();
        ghosts.forEach((ghost) => {
            this.ctx.fillStyle   = ghost.bodyColor;
            this.ctx.strokeStyle = ghost.bodyColor;

            const tile = Board.getTileXYCenter(ghost.target);
            this.ctx.beginPath();
            this.ctx.moveTo(ghost.x, ghost.y);
            this.ctx.lineTo(tile.x, tile.y);
            this.ctx.fillRect(tile.x - 4, tile.y - 4, 8, 8);
            this.ctx.stroke();
        });
        this.ctx.restore();
    }
}
