/**
 * The Demo Ghost Class
 * @extends {Ghost}
 */
class DemoGhost extends Ghost {

    /**
     * The Demo Ghost constructor
     * @param {String} name
     * @param {String} color
     */
    constructor(name, color) {
        super();

        this.canvas = Board.screenCanvas;
        this.ctx    = this.canvas.context;
        this.feet   = 0;

        this.name   = name;
        this.color  = color;
    }

    /**
     * Returns the Ghost's name
     * @returns {Number}
     */
    getName() {
        return this.name;
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
        this.speed = Data.getGhostSpeed(false);
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
        this.x     = -Board.ghostSize;
        this.mode  = "chase";
        this.speed = Data.getGhostSpeed(false);
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
