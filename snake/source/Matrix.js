import Board        from "./Board.js";
import Instance     from "./Instance.js";

// Utils
import Utils        from "../../utils/Utils.js";



/**
 * Snake Matrix
 */
export default class Matrix {

    /**
     * Snake Matrix constructor
     * @param {Board}       board
     * @param {Instance}    instance
     * @param {Number[][]=} matrix
     * @param {Number=}     head
     * @param {Number=}     tail
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
     * @param {Number} top
     * @param {Number} left
     * @returns {Void}
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
     * @param {Number} top
     * @param {Number} left
     * @returns {Void}
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
     * @returns {{top: Number, left: Number}}
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
     * @param {Number} top
     * @param {Number} left
     * @returns {Boolean}
     */
    crashed(top, left) {
        return this.matrix[top][left] >= this.board.borderValue;
    }

    /**
     * Returns true if the snake ate the food
     * @param {Number} top
     * @param {Number} left
     * @returns {Boolean}
     */
    ate(top, left) {
        return this.matrix[top][left] === this.board.foodValue;
    }
}
