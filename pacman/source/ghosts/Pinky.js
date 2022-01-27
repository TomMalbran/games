import Board        from "../board/Board.js";
import Canvas       from "../board/Canvas.js";
import Blob         from "../Blob.js";
import Ghost        from "./Ghost.js";



/**
 * Pacman Pinky
 * @extends {Ghost}
 */
export default class Pinky extends Ghost {

    /**
     * Pacman Pinky constructor
     * @param {Board}   board
     * @param {Canvas}  canvas
     * @param {?Number} dots
     */
    constructor(board, canvas, dots) {
        super(board);

        this.paths = {
            inPen    : [
                { dir : { x:  0, y: -1 }, targetY : 14, next : 1 },
                { dir : { x:  0, y:  1 }, targetY : 15, next : 0 },
            ],
            exitPen  : [
                { dir : { x:  0, y: -1 }, targetY : 11.5, next : null },
            ],
            enterPen : [
                { dir : { x: -1, y:  0 }, targetX : 14,   next : 1    },
                { dir : { x:  0, y:  1 }, targetY : 14.5, next : null },
            ],
        };

        this.id      = 1;
        this.start   = { x: 14, y: 14.5 };
        this.scatter = { x:  2, y:   -3 };
        this.inPen   = true;
        this.color   = Pinky.color;

        this.init(canvas, dots);
        this.setPath("inPen");
    }

    /**
     * Returns the Ghost's name
     * @returns {String}
     */
    static get text() {
        return "Pinky";
    }

    /**
     * Returns the Ghost's color
     * @returns {String}
     */
    static get color() {
        return "rgb(255, 153, 153)";
    }



    /**
     * Pinky's target is always 4 tiles ahead of the Blob
     * @param {Blob} blob
     * @returns {{x: Number, y: Number}}
     */
    chase(blob) {
        const targety = blob.tile.y + 4 * blob.dir.y;
        let   targetx = blob.tile.x + 4 * blob.dir.x;

        // Recreating bug where Up = Up+Left
        if (blob.dir.y === -1) {
            targetx -= 4;
        }
        return { x: targetx, y: targety };
    }
}
