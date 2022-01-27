import Board        from "../board/Board.js";
import Blob         from "../Blob.js";
import DemoData     from "./DemoData.js";



/**
 * Pacman Big Blob
 * @extends {Blob}
 */
export default class BigBlob extends Blob {

    /**
     * Pacman Big Blob constructor
     * @param {Board} board
     */
    constructor(board) {
        super(board);

        this.ctx    = board.screenCanvas.ctx;
        this.radius = DemoData.title.blobRadius * board.tileSize;
        this.x      = -this.radius;
        this.y      = DemoData.title.blobY * board.tileSize;
        this.dir    = Object.create(DemoData.title.blobDir);
        this.mouth  = DemoData.title.blobMouth;
        this.timer  = 0;

        this.endPos = DemoData.title.endTile * board.tileSize;
    }



    /**
     * Moves the Big Blob. Specially made for the title animation
     * @param {Number} time
     * @returns {Boolean}
     */
    animate(time) {
        this.timer += time;
        this.x      = Math.round(this.timer * this.endPos / DemoData.title.endTime);

        this.moveMouth();
        this.draw();
        return false;
    }

    /**
     * When the Blob reaches it positions, it draws it there
     * @returns {Void}
     */
    endAnimation() {
        this.mouth = DemoData.title.blobMouth;
        this.x     = this.endPos;
        this.draw();
    }

    /**
     * Removes the Canvas Save pos, since is not required
     * @returns {Void}
     */
    savePos() {
        return undefined;
    }
}
