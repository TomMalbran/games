/**
 * Board Manager
 */
class Board {

    /**
     * Board Manager constructor
     */
    constructor() {
        this._matrixRows    = 18;
        this._matrixColumns = 24;
        this._totalCells    = 354;
        this._cellSize      = 1.5;
        this._foodValue     = -3;
        this._borderValue   = -1;
        this._emptyValue    = -2;
    }

    /**
     * Returns the amount of rows in the matrix
     * @return {number}
     */
    get matrixRows() {
        return this._matrixRows;
    }

    /**
     * Returns the amount of columns in the matrix
     * @return {number}
     */
    get matrixColumns() {
        return this._matrixColumns;
    }

    /**
     * Returns the amount of cells in the matrix
     * @return {number}
     */
    get totalCells() {
        return this._totalCells;
    }

    /**
     * Returns the cell size
     * @return {number}
     */
    get cellSize() {
        return this._cellSize;
    }

    /**
     * Returns the food value in the matrix
     * @return {number}
     */
    get foodValue() {
        return this._foodValue;
    }

    /**
     * Returns the border value in the matrix
     * @return {number}
     */
    get borderValue() {
        return this._borderValue;
    }

    /**
     * Returns the empty value in the matrix
     * @return {number}
     */
    get emptyValue() {
        return this._emptyValue;
    }


    /**
     * Returns the default value to use in the matrix depending if is a border or not
     * @param {number} top
     * @param {number} left
     * @return {number}
     */
    getDefault(top, left) {
        if (top === 0 || left === 0 || top === this.matrixRows - 1 || left === this.matrixColumns - 1) {
            return this.borderValue;
        }
        return this.emptyValue;
    }

    /**
     * Transforms an x or y coordinate in the matrix into a pixel position relative to the board
     * @param {number} pos
     * @return {string}
     */
    getPosition(pos) {
        return ((pos - 1) * this.cellSize) + "em";
    }

    /**
     * Creates a new snake link and returns the element
     * @return {DOMElement}
     */
    createSnakeElement() {
        let div = document.createElement("DIV");
        div.className = "link";
        div.innerHTML = "<div class='snakeShadow'></div><div class='snakeBody'></div>";
        return div;
    }
}
