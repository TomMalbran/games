import Data         from "../Data.js";

// Utils
import Utils        from "../../../utils/Utils.js";



/**
 * Defender Wall
 */
export default class Wall {

    /**
     * Defender Wall constructor
     * @param {String} className
     * @param {Number} row
     * @param {Number} col
     */
    constructor(className, row, col) {
        this.className = className;
        this.type      = null;
        this.row       = row;
        this.col       = col;
        this.width     = 1;
        this.height    = 1;
    }

    /**
     * Creates the Wall Element
     * @returns {HTMLElement}
     */
    createElement() {
        const element = document.createElement("div");
        element.className    = this.className;
        element.style.top    = Utils.toPX(this.row    * Data.squareSize);
        element.style.left   = Utils.toPX(this.col    * Data.squareSize);
        element.style.width  = Utils.toPX(this.width  * Data.squareSize);
        element.style.height = Utils.toPX(this.height * Data.squareSize);
        return element;
    }

    /**
     * Checks if it can increase the height of the wall
     * @param {Wall} other
     * @returns {Boolean}
     */
    canIncreaseHeight(other) {
        return (
            this.className === other.className &&
            this.width === other.width &&
            this.row + this.height === other.row &&
            this.col === other.col
        );
    }

    /**
     * Checks if it can increase the width of the wall
     * @param {Wall} other
     * @returns {Boolean}
     */
    canIncreaseWidth(other) {
        return (
            this.className === other.className &&
            this.height === other.height &&
            this.row === other.row &&
            this.col + this.width === other.col
        );
    }
}
