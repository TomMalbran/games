/**
 * The Tetrimino Class
 */
class Tetrimino {
    
    /**
     * The Tetrimino constructor
     * @param {Board}  board
     * @param {number} type
     * @param {Object} data
     * @param {number} size
     */
    constructor(board, type, data, size) {
        this.tetriminer   = document.querySelectorAll(".tetriminos > div");
        this.nextElem     = document.querySelector("#next");
        this.pieceElem    = document.querySelector("#piece");
        this.ghostElem    = document.querySelector("#ghost");
        
        this.nexterWidth  = 9.6;
        this.nexterHeight = 6.3;
        this.maxRotation  = 3;
        
        this.board        = board;
        this.type         = type;
        this.data         = data;
        this.size         = size;
        this.border       = 0.2;
        this.top          = 0;
        this.left         = 0;
        this.rotation     = 0;
        this.hard         = 0;
        this.drop         = 0;
        
        this.nextElem.className  = "piece" + this.type + " rot0";
        this.nextElem.innerHTML  = this.tetriminer[this.type].innerHTML;
        this.nextElem.style.top  = (this.nexterHeight - this.data.rows * this.size - this.border) / 2 + "em";
        this.nextElem.style.left = (this.nexterWidth  - this.data.cols * this.size - this.border) / 2 + "em";
        
        this.setCubePositions();
    }
    
    
    /**
     * Sets the positions of each cube in the piece
     */
    setCubePositions() {
        let elements = this.nextElem.querySelectorAll("div");
        
        for (let i = 0; i < elements.length; i += 1) {
            elements[i].style.top  = (elements[i].dataset.top  * this.size) + "em";
            elements[i].style.left = (elements[i].dataset.left * this.size) + "em";
        }
    }
    
    /**
     * Makes the Tetrimino start falling
     * @return {Tetrimino}
     */
    fall() {
        this.left = this.board.getMiddle(this.data.cols);
        this.hard = this.getHardDrop();
        
        this.pieceElem.className = "piece" + this.type + " rot0";
        this.pieceElem.innerHTML = this.nextElem.innerHTML;
        
        this.ghostElem.className = "rot0";
        this.ghostElem.innerHTML = this.nextElem.innerHTML;
        
        this.setDropPosition();
        return this;
    }
    
    /**
     * Moves the Tetrimino one cell down
     * @return {boolean}
     */
    softDrop() {
        if (this.crashed(1, 0)) {
            return true;
        }
        
        this.top  += 1;
        this.drop += 1;
        this.setDropPosition();
        return false;
    }
    
    /**
     * Moves the Tetrimino to the bottom most possible cell
     */
    hardDrop() {
        this.top = this.getHardDrop();
        this.setDropPosition();
    }
    
    /**
     * Called when the Tetrimino crashes into the bottom of the screen or on top of another tetrimino
     * @return {number}
     */
    addElements() {
        return this.board.addElements(this.getMatrix(), this.type, this.top, this.left);
    }
    
    
    /**
     * Moves the Tetrimino one cell to the left
     */
    moveLeft() {
        if (!this.crashed(0, -1)) {
            this.left -= 1;
            this.hard  = this.getHardDrop();
            this.setDropPosition();
        }
    }
    
    /**
     * Moves the Tetrimino one cell to the right
     */
    moveRight() {
        if (!this.crashed(0, 1)) {
            this.left += 1;
            this.hard  = this.getHardDrop();
            this.setDropPosition();
        }
    }
    
    /**
     * Rotates the Tetrimino clockwise
     * @return {boolean}
     */
    rotateRight() {
        let rotation = this.rotation + 1;
        if (rotation > this.maxRotation) {
            rotation = 0;
        }
        return this.rotate(rotation);
    }
    
    /**
     * Rotates the Tetrimino anti-clockwise
     * @return {boolean}
     */
    rotateLeft() {
        let rotation = this.rotation - 1;
        if (rotation < 0) {
            rotation = this.maxRotation;
        }
        return this.rotate(rotation);
    }
    
    /**
     * Does the Tetrimino rotation
     * @param {number} rotation
     * @return {boolean}
     */
    rotate(rotation) {
        if (!this.crashed(0, 0, rotation)) {
            this.pieceElem.classList.remove("rot" + this.rotation);
            this.pieceElem.classList.add("rot" + rotation);
            this.ghostElem.classList.remove("rot" + this.rotation);
            this.ghostElem.classList.add("rot" + rotation);
            
            this.rotation = rotation;
            this.setHardDrop();
            return true;
        }
        return false;
    }
    
    /**
     * Sets the position of the Tetrimino and the Ghost
     */
    setDropPosition() {
        this.pieceElem.style.top  = this.board.getTop(this.top);
        this.pieceElem.style.left = this.board.getLeft(this.left);
        this.ghostElem.style.top  = this.board.getTop(this.hard);
        this.ghostElem.style.left = this.board.getLeft(this.left);
    }
    
    /**
     * Returns a matrix that represents the Tetrimino for the given rotation
     * @param {number=} rotation
     * @return {Array.<Array.<number>>}
     */
    getMatrix(rotation) {
        let rot = rotation || rotation === 0 ? rotation : this.rotation;
        return this.data.matrix[rot];
    }
    
    /**
     * Sets the bottom most cell
     */
    setHardDrop() {
        this.hard = this.getHardDrop();
        this.setDropPosition();
    }
    
    /**
     * Gets the bottom most cell
     * @return {number}
     */
    getHardDrop() {
        let add = 1;
        while (!this.crashed(add, 0)) {
            add += 1;
        }
        return this.top + add - 1;
    }
    
    /**
     * Returns a possible crash from the matrix
     * @param {number} addTop
     * @param {number} addLeft
     * @param {number} rotation
     * @return {boolean}
     */
    crashed(addTop, addLeft, rotation) {
        return this.board.crashed(this.top + addTop, this.left + addLeft, this.getMatrix(rotation));
    }
    
    
    /**
     * Returns the top position
     * @return {number}
     */
    getTop() {
        return this.top;
    }
    
    /**
     * Returns the drop counter
     * @return {number}
     */
    getDrop() {
        return this.drop;
    }
    
    
    /**
     * Clears the elements
     */
    clearElements() {
        this.nextElem.innerHTML  = "";
        this.pieceElem.innerHTML = "";
        this.ghostElem.innerHTML = "";
    }
}
