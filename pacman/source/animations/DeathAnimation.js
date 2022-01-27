import Animation    from "./Animation.js";
import Board        from "../board/Board.js";
import Blob         from "../Blob.js";



/**
 * Pacman Death Animation
 * @extends {Animation}
 */
export default class DeathAnimation extends Animation {

    /**
     * Pacman Death Animation constructor
     * @param {Board}    board
     * @param {Function} callback
     * @param {Blob}     blob
     */
    constructor(board, callback, blob) {
        super(board, callback);

        this.blob       = blob;
        this.blocksGame = true;
        this.endTime    = 1350;
        this.x          = blob.x;
        this.y          = blob.y;
    }



    /**
     * Does the Death animation
     * @returns {Void}
     */
    animate() {
        const count = Math.round(this.time / 15);

        this.canvas.clearSavedRects();
        this.ctx.save();
        this.ctx.translate(this.x, this.y);

        if (this.time < 750) {
            this.blob.drawDeath(this.ctx, count);
        } else if (this.time < 1050) {
            this.blob.drawCircle(this.ctx, count - 50);
        } else {
            this.blob.drawCircle(this.ctx, count - 70);
        }

        this.ctx.restore();
        this.canvas.savePos(this.x, this.y);
    }
}
