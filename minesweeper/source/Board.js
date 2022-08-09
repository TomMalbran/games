import Cell         from "./Cell.js";

// Utils
import Utils        from "../../utils/Utils.js";

// Constants
const DIRECTIONS = [[ -1, -1 ], [ -1, 0 ], [ -1, 1 ], [ 0, -1 ], [ 0, 1 ], [ 1, -1 ], [ 1, 0 ], [ 1, 1 ]];


/**
 * Minesweeper Board
 */
export default class Board {

    /**
     * Minesweeper Board constructor
     * @param {Number} rows
     * @param {Number} cols
     * @param {Number} bombs
     */
    constructor(rows, cols, bombs) {
        this.rows      = rows;
        this.cols      = cols;
        this.bombs     = bombs;

        this.startRow  = 1;
        this.endRow    = this.startRow + rows
        this.startCol  = 1;
        this.endCol    = this.startCol + cols

        /** @type {HTMLElement} */
        this.element   = document.querySelector(".board");
        document.querySelector("body").style.setProperty("--board-cols", String(this.cols));

        /** @type {Cell[][]} */
        this.matrix    = [];

        /** @type {Cell[]} */
        this.bombCells = [];

        this.createMatrix();
    }

    /**
     * Creates the Matrix
     * @returns {Void}
     */
    createMatrix() {
        for (let row = 0; row < this.rows + 2; row++) {
            this.matrix[row] = [];
            for (let col = 0; col < this.cols + 2; col++) {
                const isBorder = row === 0 || col === 0 || row === this.rows + 1 || col === this.cols + 1;
                this.matrix[row][col] = new Cell(row, col, isBorder);
                this.matrix[row][col].createElement(this.element);
            }
        }

        while (this.bombCells.length < this.bombs) {
            const row  = Utils.rand(this.startRow, this.endRow - 1);
            const col  = Utils.rand(this.startCol, this.endCol - 1);
            const cell = this.matrix[row][col];
            if (!cell.hasBomb) {
                cell.placeBomb();
                this.bombCells.push(cell);
            }
        }

        for (let row = this.startRow; row < this.endRow; row++) {
            for (let col = this.startCol; col < this.endCol; col++) {
                let nearBombs = 0;
                for (const dir of DIRECTIONS) {
                    const newRow = row + dir[0];
                    const newCol = col + dir[1];
                    const cell   = this.matrix[newRow][newCol];
                    if (!cell.isBorder && cell.hasBomb) {
                        nearBombs += 1;
                    }
                }
                this.matrix[row][col].setNumber(nearBombs);
            }
        }
    }

    /**
     * Reveals the Cell
     * @param {Number} row
     * @param {Number} col
     * @returns {Void}
     */
    reveal(row, col) {
        const cell = this.matrix[row][col];
        if (!cell.canReveal) {
            return;
        }

        if (cell.hasBomb) {
            for (const bomb of this.bombCells) {
                if (!bomb.element) {
                    console.log(this.bombCells);
                }
                bomb.reveal();
            }
            return;
        }

        if (cell.isEmpty) {
            cell.reveal();
            for (let dir of DIRECTIONS) {
                const newRow = row + dir[0];
                const newCol = col + dir[1];
                const cell   = this.matrix[newRow][newCol];
                if (!cell.isBorder) {
                    this.reveal(newRow, newCol);
                }
            }
            return;
        }

        cell.reveal();
    }

    /**
     * Flags the Cell
     * @param {Number} row
     * @param {Number} col
     * @returns {Void}
     */
    flag(row, col) {
        const cell = this.matrix[row][col];
        if (!cell.canFlag) {
            return;
        }
        const value = cell.flag();

        for (const dir of DIRECTIONS) {
            const newRow = row + dir[0];
            const newCol = col + dir[1];
            const cell   = this.matrix[newRow][newCol];
            cell.addFlag(value);
        }
    }
}
