import Board        from "../board/Board.js";
import Canvas       from "../board/Canvas.js";
import Blob         from "../Blob.js";
import Ghost        from "./Ghost.js";



/**
 * Pacman Blinky
 * @extends {Ghost}
 */
export default class Blinky extends Ghost {

    /**
     * Pacman Blinky constructor
     * @param {Board}   board
     * @param {Canvas}  canvas
     * @param {?Number} dots
     */
    constructor(board, canvas, dots) {
        super(board);

        this.paths = {
            exitPen : [
                { dir : { x:  0, y: -1 }, targetY : 11.5, next : null },
            ],
            enterPen : [
                { dir : { x: -1, y:  0 }, targetX : 14,   next : 1    },
                { dir : { x:  0, y:  1 }, targetY : 14.5, next : null },
            ],
        };

        this.id          = 0;
        this.start       = { x: 14, y: 11.5 };
        this.dir         = { x: -1, y:    0 };
        this.scatter     = { x: 25, y:   -3 };
        this.inPen       = false;
        this.color       = Blinky.color;
        this.activeElroy = dots !== null;

        this.init(canvas, dots);
    }

    /**
     * Returns the Ghost's name
     * @returns {String}
     */
    static get text() {
        return "Blinky";
    }

    /**
     * Returns the Ghost's color
     * @returns {String}
     */
    static get color() {
        return "rgb(221, 0, 0)";
    }



    /**
     * Blinky's target is always the current tile of the Blob
     * @param {Blob} blob
     * @returns {{x: Number, y: Number}}
     */
    chase(blob) {
        return blob.tile;
    }

    /**
     * Sets Blinky's "Cruise Elroy" Mode when the number of dots left reaches the target
     * @param {Number} dots
     * @returns {Void}
     */
    checkElroyDots(dots) {
        if (dots === this.level.getNumber("elroyDotsLeft1") ||
                dots === this.level.getNumber("elroyDotsLeft2")) {
            this.elroyMode += 1;
        }
    }

    /**
     * Returns true when Blinky is in "Cruise Elroy" Mode. Only used for Blinky
     * @returns {Boolean}
     */
    isElroy() {
        return this.activeElroy && this.elroyMode > 0;
    }

    /**
     * Makes it possible for Blinky to switch to "Cruise Elroy" Mode
     * @returns {Void}
     */
    activateElroy() {
        this.activeElroy = true;
    }
}
