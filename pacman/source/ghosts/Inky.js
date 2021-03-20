/**
 * The Inky Class
 * @extends {Ghost}
 */
class Inky extends Ghost {

    /**
     * The Inky constructor
     * @param {Canvas} canvas
     * @param {Number} dots
     * @param {Blinky} blinky
     */
    constructor(canvas, dots, blinky) {
        super();

        this.paths = {
            inPen    : [
                { dir : { x:  0, y: -1 }, targetY : 14, next : 1 },
                { dir : { x:  0, y:  1 }, targetY : 15, next : 0 },
            ],
            exitPen  : [
                { dir : { x:  1, y:  0 }, targetX : 14,   next : 1    },
                { dir : { x:  0, y: -1 }, targetY : 11.5, next : null },
            ],
            enterPen : [
                { dir : { x: -1, y:  0 }, targetX : 14,   next : 1    },
                { dir : { x:  0, y:  1 }, targetY : 14.5, next : 2    },
                { dir : { x: -1, y:  0 }, targetX : 12,   next : null },
            ],
        };

        this.id      = 2;
        this.start   = { x: 12, y: 14.5 };
        this.scatter = { x: 27, y:   31 };
        this.inPen   = true;
        this.color   = Inky.color;
        this.blinky  = blinky;

        this.init(canvas, dots);
        this.setPath("inPen");
    }

    /**
     * Returns the Ghost's name
     * @returns {String}
     */
    static get name() {
        return "Inky";
    }

    /**
     * Returns the Ghost's color
     * @returns {String}
     */
    static get color() {
        return "rgb(102, 255, 255)";
    }



    /**
     * Inky's target is an average of Blinky's position and the Blob's position
     * @param {Blob} blob
     * @returns {{x: Number, y: Number}}
     */
    chase(blob) {
        const offsety = blob.tile.y + 2 * blob.dir.y;
        let   offsetx = blob.tile.x + 2 * blob.dir.x;

        // Recreating bug where Up = Up+Left
        if (blob.dir.y === -1) {
            offsetx -= 2;
        }
        return {
            x : offsetx * 2 - this.blinky.tile.x,
            y : offsety * 2 - this.blinky.tile.y
        };
    }
}
