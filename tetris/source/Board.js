/**
 * The Board Class
 */
class Board {
    
    /**
     * The Board constructor
     * @param {number}   tetriminoSize
     * @param {function} onWindEnd
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
     * @param {number} top
     * @param {number} left
     * @param {Array.<Array.<number>>} matrix
     * @return {boolean}
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
     * @param {DOMElement} element
     * @param {number} top
     * @param {number} left
     */
    addToMatrix(element, top, left) {
        this.matrix[top][left + 1] = element;
        this.rows[top] += 1;
        
        return this.rows[top] === this.matrixCols - 2;
    }
    
    /**
     * Removes a Row from the Matrix
     * @param {number} line
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
     * @param {Array.<Array.<number>>} matrix
     * @param {number} type
     * @param {number} elemTop
     * @param {number} elemLeft
     * @return {number}
     */
    addElements(matrix, type, elemTop, elemLeft) {
        let lines = [];
        
        for (let i = 0; i < matrix.length; i += 1) {
            for (let j = 0; j < matrix[i].length; j += 1) {
                if (matrix[i][j]) {
                    let top  = elemTop  + i,
                        left = elemLeft + j,
                        elem = this.append(type, top, left);
                    
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
     * @param {number} type
     * @param {number} top
     * @param {number} left
     * @return {DOMElement}
     */
    append(type, top, left) {
        let element = document.createElement("DIV");
        element.className  = "cell" + type;
        element.style.top  = this.getTop(top);
        element.style.left = this.getLeft(left);
        
        this.fieldElem.appendChild(element);
        return element;
    }
    
    /**
     * Starts the wink animation
     * @param {Array.<number>} lines
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
     * @param {number} top
     * @return {DOMElement}
     */
    createWink(top) {
        let element = document.createElement("div");
        element.className   = "wink";
        element.style.top   = this.getTop(top);
        element.dataset.top = top;
        
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
     * @return {boolean}
     */
    isWinking() {
        return this.winks !== null;
    }
    
    
    /**
     * Returns true if the position is a border
     * @param {number} top
     * @param {number} left
     * @return {boolean}
     */
    isBorder(top, left) {
        return top === this.matrixRows  - 1 || left === 0 || left === this.matrixCols - 1;
    }
    
    /**
     * Returns a column so that the Tetrimino is centered in the board
     * @param {number} cols - Number of columns of the Tetrimino
     * @return {number}
     */
    getMiddle(cols) {
        return Math.floor((this.matrixCols - cols - 2) / 2);
    }
    
    /**
     * Returns the top position for styling
     * @param {number} top
     * @return {string}
     */
    getTop(top) {
        return ((top - 2) * this.tetriminoSize) + "em";
    }
    
    /**
     * Returns the left position for styling
     * @param {number} top
     * @return {string}
     */
    getLeft(left) {
        return (left * this.tetriminoSize) + "em";
    }
    
    
    /**
     * Clears the elements
     */
    clearElements() {
        this.fieldElem.innerHTML = "";
        this.winkElem.innerHTML  = "";
    }
}
