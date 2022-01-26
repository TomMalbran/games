import Utils        from "../../utils/Utils.js";



/**
 * Tetris Board
 */
export default class Board {

    /**
     * Tetris Board constructor
     * @param {Number}   tetriminoSize
     * @param {Function} onWindEnd
     */
    constructor(tetriminoSize, onWindEnd) {
        this.fieldElem = document.querySelector(".field");
        this.winkElem  = document.querySelector(".winker");

        this.tetriminoSize = tetriminoSize;
        this.onWindEnd     = onWindEnd;
        this.matrixCols    = 12;
        this.matrixRows    = 23;
        this.matrix        = [];

        this.rows      = [];
        this.lines     = [];
        this.winks     = null;

        for (let i = 0; i < this.matrixRows; i += 1) {
            this.matrix[i] = [];
            this.rows[i]   = 0;
            for (let j = 0; j < this.matrixCols; j += 1) {
                this.matrix[i][j] = this.isBorder(i, j) ? 1 : 0;
            }
        }
    }



    /**
     * Checks if there is a crash, given the Tetrimino Matrix and position
     * @param {Number}     top
     * @param {Number}     left
     * @param {Number[][]} matrix
     * @returns {Boolean}
     */
    crashed(top, left, matrix) {
        for (let i = 0; i < matrix.length; i += 1) {
            for (let j = 0; j < matrix[i].length; j += 1) {
                if (matrix[i][j] && this.matrix[top + i][left + j + 1]) {
                    return true;
                }
            }
        }
        return false;
    }

    /**
     * Adds Tetrimino Elements to the Matrix
     * @param {HTMLElement} element
     * @param {Number}      top
     * @param {Number}      left
     * @returns {Boolean}
     */
    addToMatrix(element, top, left) {
        this.matrix[top][left + 1] = element;
        this.rows[top] += 1;

        return this.rows[top] === this.matrixCols - 2;
    }

    /**
     * Removes a Row from the Matrix
     * @param {Number} line
     * @returns {Void}
     */
    removeLine(line) {
        let i = 1;
        for (; i < this.matrixCols - 1; i += 1) {
            if (this.matrix[line][i]) {
                Utils.removeElement(this.matrix[line][i]);
            }
        }

        i = line - 1;
        while (this.rows[i] > 0) {
            for (let j = 1; j < this.matrixCols - 1; j += 1) {
                this.matrix[i + 1][j] = this.matrix[i][j];
                if (this.matrix[i][j]) {
                    this.matrix[i][j].style.top = this.getTop(i + 1);
                }
            }
            this.rows[i + 1] = this.rows[i];
            i -= 1;
        }
        i += 1;
        for (let j = 1; j < this.matrixCols - 1; j += 1) {
            this.matrix[i][j] = 0;
        }
        this.rows[i] = 0;
    }



    /**
     * Adds all the elements in the Tetrimino to the board
     * @param {Number[][]} matrix
     * @param {Number}     type
     * @param {Number}     elemTop
     * @param {Number}     elemLeft
     * @returns {Number}
     */
    addElements(matrix, type, elemTop, elemLeft) {
        const lines = [];
        for (let i = 0; i < matrix.length; i += 1) {
            for (let j = 0; j < matrix[i].length; j += 1) {
                if (matrix[i][j]) {
                    const top  = elemTop  + i;
                    const left = elemLeft + j;
                    const elem = this.append(type, top, left);

                    if (this.addToMatrix(elem, top, left)) {
                        lines.push(top);
                    }
                }
            }
        }
        if (lines.length > 0) {
            this.startWink(lines);
        }
        return lines.length;
    }

    /**
     * Creates a new element and adds it to the Board
     * @param {Number} type
     * @param {Number} top
     * @param {Number} left
     * @returns {HTMLElement}
     */
    append(type, top, left) {
        const element = document.createElement("DIV");
        element.className  = `cell${type}`;
        element.style.top  = this.getTop(top);
        element.style.left = this.getLeft(left);

        this.fieldElem.appendChild(element);
        return element;
    }

    /**
     * Starts the wink animation
     * @param {Number[]} lines
     */
    startWink(lines) {
        lines.forEach((line) => {
            if (this.lines[line]) {
                this.lines[line].classList.add("wink");
            } else {
                this.lines[line] = this.createWink(line);
            }
        });
        this.winks = lines;
    }

    /**
     * Creates a new wink Element
     * @param {Number} top
     * @returns {HTMLElement}
     */
    createWink(top) {
        const element = document.createElement("div");
        element.className   = "wink";
        element.style.top   = this.getTop(top);
        element.dataset.top = String(top);

        this.winkElem.appendChild(element);

        element.addEventListener("animationend", () => {
            this.endWink();
        });
        return element;
    }

    /**
     * Ends the Wink animation
     */
    endWink() {
        if (this.winks) {
            this.winks.forEach((line) => {
                this.lines[line].classList.remove("wink");
                this.removeLine(line);
            });

            this.winks = null;
            this.onWindEnd();
        }
    }

    /**
     * Returns true if the Board is winking
     * @returns {Boolean}
     */
    isWinking() {
        return this.winks !== null;
    }



    /**
     * Returns true if the position is a border
     * @param {Number} top
     * @param {Number} left
     * @returns {Boolean}
     */
    isBorder(top, left) {
        return top === this.matrixRows  - 1 || left === 0 || left === this.matrixCols - 1;
    }

    /**
     * Returns a column so that the Tetrimino is centered in the board
     * @param {Number} cols - Number of columns of the Tetrimino
     * @returns {Number}
     */
    getMiddle(cols) {
        return Math.floor((this.matrixCols - cols - 2) / 2);
    }

    /**
     * Returns the top position for styling
     * @param {Number} top
     * @returns {String}
     */
    getTop(top) {
        return Utils.toEM((top - 2) * this.tetriminoSize);
    }

    /**
     * Returns the left position for styling
     * @param {Number} left
     * @returns {String}
     */
    getLeft(left) {
        return Utils.toEM(left * this.tetriminoSize);
    }



    /**
     * Clears the elements
     */
    clearElements() {
        this.fieldElem.innerHTML = "";
        this.winkElem.innerHTML  = "";
    }
}
