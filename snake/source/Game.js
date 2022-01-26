import Board        from "./Board.js";
import Food         from "./Food.js";
import Instance     from "./Instance.js";
import Matrix       from "./Matrix.js";
import Snake        from "./Snake.js";



/**
 * Snake Game
 */
export default class Game {

    /**
     * Snake Game constructor
     * @param {Board}    board
     * @param {Instance} instance
     * @param {Object=}  data
     */
    constructor(board, instance, data) {
        this.instance = instance;
        if (data) {
            this.matrix = new Matrix(board, instance, data.matrix, data.head, data.tail);
            this.snake  = new Snake(board, this.matrix, data.links, data.dirTop, data.dirLeft);
            this.food   = new Food(board, null, data.foodTop, data.foodLeft);
        } else {
            this.matrix = new Matrix(board, instance);
            this.snake  = new Snake(board, this.matrix);
            this.food   = new Food(board, this.matrix.addFood());
        }
    }

    /**
     * Destroys the Game
     * @returns {Void}
     */
    destroy() {
        this.matrix = null;
        this.snake  = null;
        this.food   = null;
        this.instance.destroyGame();
    }



    /**
     * Adds a Food
     * @returns {Void}
     */
    addFood() {
        this.food.add(this.matrix.addFood());
    }

    /**
     * Turns the Snake
     * @param {Number} dirTop
     * @param {Number} dirLeft
     * @returns {Void}
     */
    turnSnake(dirTop, dirLeft) {
        if (this.snake.turn(dirTop, dirLeft)) {
            this.instance.saveDirection(this.snake.direction);
        }
    }

    /**
     * Turns the Snake
     * @param {MouseEvent} event
     * @returns {Void}
     */
    mouseTurn(event) {
        if (this.snake.mouseTurn(event)) {
            this.instance.saveDirection(this.snake.direction);
        }
    }
}
