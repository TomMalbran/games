/**
 * Matrix Manager
 */
class Matrix {
    
    /**
     * Matrix Manager constructor
     * @param {Board}    board
     * @param {Instance} instance
     * @param {?Array.<Array.<number>>} matrix
     * @param {?number} head
     * @param {?number} tail
     */
    constructor(board, instance, matrix, head, tail) {
        this.board    = board;
        this.instance = instance;
        
        this.head     = head !== undefined ? head : 0;
        this.tail     = tail !== undefined ? tail : 0;
        this.matrix   = matrix || [];
        
        if (!matrix) {
            for (let i = 0; i < this.board.matrixRows; i += 1) {
                this.matrix[i] = [];
                for (let j = 0; j < this.board.matrixColumns; j += 1) {
                    this.matrix[i][j] = this.board.getDefault(i, j);
                }
            }
        }
    }
    
    /**
     * Adds a snake body element
     * @param {number} top
     * @param {number} left
     */
    addSnake(top, left) {
        this.matrix[top][left] = this.tail;
        this.instance.addToMatrix(top, left, this.tail);
        
        this.tail += 1;
        if (this.tail > this.board.totalCells) {
            this.tail = 0;
        }
    }
    
    /**
     * Removes a snake body element
     * @param {number} top
     * @param {number} left
     */
    removeSnake(top, left) {
        this.matrix[top][left] = this.board.emptyValue;
        
        this.head += 1;
        if (this.head > this.board.totalCells) {
            this.head = 0;
        }
        this.instance.removeFromMatrix(top, left, this.head);
    }
    
    /**
     * Adds a new food element to the board in the first possible random position
     * @return {{top: number, left: number}}
     */
    addFood() {
        let top, left, found = true;
        do {
            top   = Utils.rand(1, this.board.matrixRows    - 2);
            left  = Utils.rand(1, this.board.matrixColumns - 2);
            found = this.matrix[top][left] >= this.board.borderValue;
        } while (found);
        
        this.matrix[top][left] = this.board.foodValue;
        this.instance.addToMatrix(top, left, this.board.foodValue);
        
        return { top : top, left : left };
    }
    
    /**
     * Returns true if the snake crashed a wall or it's own body
     * @param {number} top
     * @param {number} left
     * @return {boolean}
     */
    crashed(top, left) {
        return this.matrix[top][left] >= this.board.borderValue;
    }
    
    /**
     * Returns true if the snake ate the food
     * @param {number} top
     * @param {number} left
     * @return {boolean}
     */
    ate(top, left) {
        return this.matrix[top][left] === this.board.foodValue;
    }
}
