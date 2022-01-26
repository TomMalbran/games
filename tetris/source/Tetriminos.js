import Board        from "./Board.js";
import Tetrimino    from "./Tetrimino.js";
import Score        from "./Score.js";
import Sounds       from "../../utils/Sounds.js";
import Utils        from "../../utils/Utils.js";


/**
 * Tetris Tetriminos
 */
export default class Tetriminos {

    /**
     * Tetris Tetriminos constructor
     * @param {Board}    board
     * @param {Sounds}   sounds
     * @param {Score}    score
     * @param {Number}   size
     * @param {Function} onGameOver
     */
    constructor(board, sounds, score, size, onGameOver) {
        this.tetriminos = [
            { // I Tetrimino
                matrix : [
                    [[ 0, 0, 0, 0 ], [ 1, 1, 1, 1 ], [ 0, 0, 0, 0 ], [ 0, 0, 0, 0 ]],     // Rotation 1
                    [[ 0, 0, 1, 0 ], [ 0, 0, 1, 0 ], [ 0, 0, 1, 0 ], [ 0, 0, 1, 0 ]],     // Rotation 2
                    [[ 0, 0, 0, 0 ], [ 0, 0, 0, 0 ], [ 1, 1, 1, 1 ], [ 0, 0, 0, 0 ]],     // Rotation 3
                    [[ 0, 1, 0, 0 ], [ 0, 1, 0, 0 ], [ 0, 1, 0, 0 ], [ 0, 1, 0, 0 ]]      // Rotation 4
                ],
                rows : 3,        // Amount of rows at the starting position
                cols : 4         // Amount of columns at the starting position
            },
            { // J Tetrimino
                matrix : [
                    [[ 1, 0, 0 ], [ 1, 1, 1 ], [ 0, 0, 0 ]],
                    [[ 0, 1, 1 ], [ 0, 1, 0 ], [ 0, 1, 0 ]],
                    [[ 0, 0, 0 ], [ 1, 1, 1 ], [ 0, 0, 1 ]],
                    [[ 0, 1, 0 ], [ 0, 1, 0 ], [ 1, 1, 0 ]]
                ],
                rows : 2,
                cols : 3
            },
            { // L Tetrimino
                matrix : [
                    [[ 0, 0, 1 ], [ 1, 1, 1 ], [ 0, 0, 0 ]],
                    [[ 0, 1, 0 ], [ 0, 1, 0 ], [ 0, 1, 1 ]],
                    [[ 0, 0, 0 ], [ 1, 1, 1 ], [ 1, 0, 0 ]],
                    [[ 1, 1, 0 ], [ 0, 1, 0 ], [ 0, 1, 0 ]]
                ],
                rows : 2,
                cols : 3
            },
            { // O Tetrimino
                matrix : [
                    [[ 0, 1, 1, 0 ], [ 0, 1, 1, 0 ], [ 0, 0, 0, 0 ]],
                    [[ 0, 1, 1, 0 ], [ 0, 1, 1, 0 ], [ 0, 0, 0, 0 ]],
                    [[ 0, 1, 1, 0 ], [ 0, 1, 1, 0 ], [ 0, 0, 0, 0 ]],
                    [[ 0, 1, 1, 0 ], [ 0, 1, 1, 0 ], [ 0, 0, 0, 0 ]]
                ],
                rows : 2,
                cols : 4
            },
            { // S Tetrimino
                matrix : [
                    [[ 0, 1, 1 ], [ 1, 1, 0 ], [ 0, 0, 0 ]],
                    [[ 0, 1, 0 ], [ 0, 1, 1 ], [ 0, 0, 1 ]],
                    [[ 0, 0, 0 ], [ 0, 1, 1 ], [ 1, 1, 0 ]],
                    [[ 1, 0, 0 ], [ 1, 1, 0 ], [ 0, 1, 0 ]]
                ],
                rows : 2,
                cols : 3
            },
            { // T Tetrimino
                matrix : [
                    [[ 0, 1, 0 ], [ 1, 1, 1 ], [ 0, 0, 0 ]],
                    [[ 0, 1, 0 ], [ 0, 1, 1 ], [ 0, 1, 0 ]],
                    [[ 0, 0, 0 ], [ 1, 1, 1 ], [ 0, 1, 0 ]],
                    [[ 0, 1, 0 ], [ 1, 1, 0 ], [ 0, 1, 0 ]]
                ],
                rows : 2,
                cols : 3
            },
            { // Z Tetrimino
                matrix : [
                    [[ 1, 1, 0 ], [ 0, 1, 1 ], [ 0, 0, 0 ]],
                    [[ 0, 0, 1 ], [ 0, 1, 1 ], [ 0, 1, 0 ]],
                    [[ 0, 0, 0 ], [ 1, 1, 0 ], [ 0, 1, 1 ]],
                    [[ 0, 1, 0 ], [ 1, 1, 0 ], [ 1, 0, 0 ]]
                ],
                rows : 2,
                cols : 3
            }
        ];

        this.board      = board;
        this.sounds     = sounds;
        this.score      = score;
        this.size       = size;
        this.onGameOver = onGameOver;
        this.sequence   = [ 0, 1, 2, 3, 4, 5, 6 ];
        this.pointer    = this.sequence.length;

        this.actual     = this.createTetrimino().fall();
        this.next       = this.createTetrimino();
    }



    /**
     * Creates a new Tetrimino
     * @returns {Tetrimino}
     */
    createTetrimino() {
        const type = this.getNextType();
        return new Tetrimino(this.board, type, this.tetriminos[type], this.size);
    }

    /**
     * Increase the current pointer and if required it creates a new permutation of the 7 Tetriminos
     * and then it returns the next type
     * @returns {Number}
     */
    getNextType() {
        if (this.pointer < this.sequence.length - 1) {
            this.pointer += 1;
        } else {
            for (let i = 0; i < this.sequence.length; i += 1) {
                const pos = Utils.rand(0, this.sequence.length - 1);
                const aux = this.sequence[pos];

                this.sequence[pos] = this.sequence[i];
                this.sequence[i]   = aux;
            }
            this.pointer = 0;
        }
        return this.sequence[this.pointer];
    }



    /**
     * Soft drops the actual tetrimino
     */
    softDrop() {
        if (this.actual.softDrop()) {
            this.crashed();
        }
    }

    /**
     * Hard drops the actual tetrimino
     */
    hardDrop() {
        this.actual.hardDrop();
        this.crashed();
        this.sounds.play("drop");
    }

    /**
     * Called when the actual tetrimino crashes
     */
    crashed() {
        if (this.actual.top === 0 || this.actual.top === 1) {
            this.onGameOver();
            return;
        }

        this.score.piece(this.actual.drop);
        const lines = this.actual.addElements();
        if (lines) {
            this.sounds.play("line");
            this.score.line(lines);
        }
        this.sounds.play("crash");
        this.dropNext();
    }

    /**
     * Drops the next tetrimino and creates a new one
     */
    dropNext() {
        this.actual = this.next.fall();
        this.next   = this.createTetrimino();
    }



    /**
     * Rotates the actual tetrimino to the right
     */
    rotateRight() {
        if (this.actual.rotateRight()) {
            this.sounds.play("rotate");
        }
    }

    /**
     * Rotates the actual tetrimino to the left
     */
    rotateLeft() {
        if (this.actual.rotateLeft()) {
            this.sounds.play("rotate");
        }
    }

    /**
     * Moves the actual tetrimino to the right
     */
    moveRight() {
        this.actual.moveRight();
    }

    /**
     * Moves the actual tetrimino to the left
     */
    moveLeft() {
        this.actual.moveLeft();
    }



    /**
     * Sets the hard drop position of the actual tetrimino
     */
    setHardDrop() {
        this.actual.setHardDrop();
    }

    /**
     * Clears the elements
     */
    clearElements() {
        this.actual.clearElements();
    }
}
