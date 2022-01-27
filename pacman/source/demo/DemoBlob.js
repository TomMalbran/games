import Board        from "../board/Board.js";
import Blob         from "../Blob.js";



/**
 * Pacman Demo Blob
 * @extends {Blob}
 */
export default class DemoBlob extends Blob {

    /**
     * Pacman Demo Blob constructor
     * @param {Board} board
     */
    constructor(board) {
        super(board);
        this.init(board.screenCanvas);
    }



    /**
     * Initialize some variables for the demo animation
     * @param {{x: Number, y: Number}} dir
     * @param {Number}                 x
     * @param {Number}                 y
     * @returns {Void}
     */
    chaseDemo(dir, x, y) {
        this.dir   = Object.create(dir);
        this.x     = x;
        this.y     = y;
        this.speed = this.level.getNumber("pmSpeed");
    }

    /**
     * The second animation of the demo in Frighten mode
     * @param {{x: Number, y: Number}} dir
     * @returns {Void}
     */
    frightenDemo(dir) {
        this.dir   = Object.create(dir);
        this.speed = this.level.getNumber("pmFrightSpeed");
    }

    /**
     * The animation used on the Demo
     * @param {Number} speed
     * @returns {Boolean}
     */
    animate(speed) {
        this.x += this.dir.x * this.speed * speed;

        this.moveMouth();
        this.draw();
        return false;
    }
}
