import Board        from "../board/Board.js";
import Ghost        from "../ghosts/Ghost.js";



/**
 * Pacman Demo Ghost
 * @extends {Ghost}
 */
export default class DemoGhost extends Ghost {

    /**
     * Pacman Demo Ghost constructor
     * @param {Board}  board
     * @param {String} name
     * @param {String} color
     */
    constructor(board, name, color) {
        super(board);

        this.canvas = board.screenCanvas;
        this.ctx    = this.canvas.ctx;
        this.feet   = 0;

        this.name   = name;
        this.color  = color;
    }



    /**
     * Initialize some variables for the chase demo animation
     * @param {{x: Number, y: Number}} dir
     * @param {Number}                 x
     * @param {Number}                 y
     * @returns {Void}
     */
    chaseDemo(dir, x, y) {
        this.dir   = Object.create(dir);
        this.x     = x;
        this.y     = y;
        this.mode  = "chase";
        this.speed = this.level.getGhostSpeed(false);
    }

    /**
     * Initialize some variables for the frighten demo animation
     * @param {{x: Number, y: Number}} dir
     * @param {Number}                 speed
     * @returns {Void}
     */
    frightenDemo(dir, speed) {
        this.dir   = Object.create(dir);
        this.mode  = "blue";
        this.speed = speed;
    }

    /**
     * Initialize some variables for the present demo animation
     * @param {{x: Number, y: Number}} dir
     * @returns {Void}
     */
    presentDemo(dir) {
        this.dir   = Object.create(dir);
        this.x     = -this.board.ghostSize;
        this.mode  = "chase";
        this.speed = this.level.getGhostSpeed(false);
    }

    /**
     * The animation used on the Demo
     * @param {Number} speed
     * @returns {Void}
     */
    demoAnimate(speed) {
        this.x += this.dir.x * this.speed * speed;

        this.moveFeet();
        this.draw();
    }
}
