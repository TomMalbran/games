import Utils        from "../../utils/Utils.js";



/**
 * Snake Board
 */
export default class Board {

    /**
     * Snake Board constructor
     */
    constructor() {
        this.matrixRows    = 18;
        this.matrixColumns = 24;
        this.totalCells    = 354;
        this.cellSize      = 1.5;
        this.foodValue     = -3;
        this.borderValue   = -1;
        this.emptyValue    = -2;
    }



    /**
     * Returns the default value to use in the matrix depending if is a border or not
     * @param {Number} top
     * @param {Number} left
     * @returns {Number}
     */
    getDefault(top, left) {
        if (top === 0 || left === 0 || top === this.matrixRows - 1 || left === this.matrixColumns - 1) {
            return this.borderValue;
        }
        return this.emptyValue;
    }

    /**
     * Transforms an x or y coordinate in the matrix into a pixel position relative to the board
     * @param {Number} pos
     * @returns {String}
     */
    getPosition(pos) {
        return Utils.toEM((pos - 1) * this.cellSize);
    }

    /**
     * Creates a new snake link and returns the element
     * @returns {HTMLElement}
     */
    createSnakeElement() {
        const div = document.createElement("DIV");
        div.className = "link";
        div.innerHTML = `<div class="snakeShadow"></div><div class="snakeBody"></div>`;
        return div;
    }
}
