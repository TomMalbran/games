/**
 * The Demo Blob Class
 * @extends {Blob}
 */
class DemoBlob extends Blob {

    /**
     * The Demo Blob Cconstructor
     */
    constructor() {
        super();

        this.init(Board.screenCanvas);
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
        this.speed = Data.getLevelData("pmSpeed");
    }

    /**
     * The second animation of the demo in Frighten mode
     * @param {{x: Number, y: Number}} dir
     * @returns {Void}
     */
    frightenDemo(dir) {
        this.dir   = Object.create(dir);
        this.speed = Data.getLevelData("pmFrightSpeed");
    }

    /**
     * The animation used on the Demo
     * @param {Number} speed
     * @returns {Void}
     */
    animate(speed) {
        this.x += this.dir.x * this.speed * speed;

        this.moveMouth();
        this.draw();
    }
}
