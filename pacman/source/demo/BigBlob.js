/**
 * The Big Blob Class. Used in the title animation
 * @extends {Blob}
 */
class BigBlob extends Blob {

    /**
     * The Big Blob constructor
     */
    constructor() {
        super();

        this.ctx    = Board.screenCanvas.context;
        this.radius = DemoData.title.blobRadius * Board.tileSize;
        this.x      = -this.radius;
        this.y      = DemoData.title.blobY * Board.tileSize;
        this.dir    = Object.create(DemoData.title.blobDir);
        this.mouth  = DemoData.title.blobMouth;
        this.timer  = 0;

        this.endPos = DemoData.title.endTile * Board.tileSize;
    }



    /**
     * Moves the Big Blob. Specially made for the title animation
     * @param {Number} time
     * @returns {Void}
     */
    animate(time) {
        this.timer += time;
        this.x      = Math.round(this.timer * this.endPos / DemoData.title.endTime);

        this.moveMouth();
        this.draw();
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
