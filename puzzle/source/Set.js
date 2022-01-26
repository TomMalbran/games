import Piece        from "./Piece.js";

// Utils
import Utils        from "../../utils/Utils.js";



/**
 * Puzzle Set
 */
export default class Set {

    /**
     * Puzzle Puzzle constructor
     * @param {Piece}    piece
     * @param {...Piece} otherPieces
     */
    constructor(piece, ...otherPieces) {
        this.id       = `s${Utils.rand(0, 999999)}`;
        this.list     = [];
        this.matrix   = [[ piece ]];

        this.startRow = piece.row;
        this.endRow   = piece.row + 1;
        this.rowCount = 1;

        this.startCol = piece.col;
        this.endCol   = piece.col + 1;
        this.colCount = 1;

        this.top      = piece.top;
        this.left     = piece.left;
        this.metrics  = piece.metrics;

        this.element           = document.createElement("div");
        this.element.className = "set";

        this.insertPiece(piece);
        for (const otherPiece of otherPieces) {
            this.addPiece(otherPiece);
        }
    }

    /**
     * Initializes the Set in the Table
     * @param {Number} top
     * @param {Number} left
     * @returns {Void}
     */
    initInTable(top, left) {
        this.top  = top;
        this.left = left;
        this.translate();
    }

    /**
     * Destroys the Set references
     * @returns {Void}
     */
    destroy() {
        Utils.removeElement(this.element);
        this.list    = null;
        this.matrix  = null;
        this.element = null;
    }

    /**
     * Returns the Start Row
     * @returns {Number}
     */
    get row() {
        return this.startRow;
    }

    /**
     * Returns the Start Column
     * @returns {Number}
     */
    get col() {
        return this.startCol;
    }

    /**
     * Returns the Position
     * @returns {{top: Number, left: Number}}
     */
    get pos() {
        return { top : this.top, left : this.left };
    }

    /**
     * Sets the Position
     * @param {{top: Number, left: Number}} pos
     * @returns {Void}
     */
    set pos(pos) {
        this.top  = pos.top  - this.startPos.top;
        this.left = pos.left - this.startPos.left;
    }



    /**
     * Adds a Piece to the Set
     * @param {Piece} piece
     * @returns {Void}
     */
    addPiece(piece) {
        let row   = piece.row - this.startRow;
        let col   = piece.col - this.startCol;
        let added = false;

        // Expand the Matrix
        do {
            added = false;
            if (row < 0) {
                this.matrix.unshift(Array(this.colCount).fill(null));
                this.rowCount += 1;
                this.startRow -= 1;
                this.top      -= this.metrics.scaleSize;
                row  += 1;
                added = true;

            } else if (row >= this.rowCount) {
                this.matrix.push(Array(this.colCount).fill(null));
                this.rowCount += 1;
                this.endRow   += 1;

            } else if (col < 0) {
                for (let i = 0; i < this.rowCount; i++) {
                    this.matrix[i].unshift(null);
                }
                this.colCount += 1;
                this.startCol -= 1;
                this.left     -= this.metrics.scaleSize;
                col  += 1;
                added = true;

            } else if (col >= this.colCount) {
                for (let i = 0; i < this.rowCount; i++) {
                    this.matrix[i].push(null);
                }
                this.colCount += 1;
                this.endCol   += 1;
                added = true;
            }
        } while (added);

        // Add the Piece
        this.matrix[row][col] = piece;
        this.insertPiece(piece);
        this.position();
    }

    /**
     * Adds a Set to the Set
     * @param {Set} set
     * @returns {Void}
     */
    addSet(set) {
        const startRow = Math.min(this.startRow, set.startRow);
        const endRow   = Math.max(this.endRow,   set.endRow);
        const rowCount = endRow - startRow;

        const startCol = Math.min(this.startCol, set.startCol);
        const endCol   = Math.max(this.endCol,   set.endCol);
        const colCount = endCol - startCol;

        // Create a new matrix
        const matrix = [];
        for (let row = 0; row < rowCount; row += 1) {
            matrix[row] = [];
            for (let col = 0; col < colCount; col += 1) {
                matrix[row][col] = null;
            }
        }

        // Add the pieces from the original matrixs
        for (const item of [ this, set ]) {
            for (let row = 0; row < item.matrix.length; row += 1) {
                for (let col = 0; col < item.matrix[0].length; col += 1) {
                    if (item.matrix[row][col]) {
                        const newRow = item.startRow - startRow + row;
                        const newCol = item.startCol - startCol + col;
                        matrix[newRow][newCol] = item.matrix[row][col];
                    }
                }
            }
        }

        this.matrix   = matrix;
        this.startRow = startRow;
        this.endRow   = endRow;
        this.rowCount = rowCount;
        this.startCol = startCol;
        this.endCol   = endCol;
        this.colCount = colCount;
        this.left     = Math.min(this.left, set.left);
        this.top      = Math.min(this.top,  set.top);

        for (const piece of set.list) {
            this.insertPiece(piece);
        }
        this.position();
    }

    /**
     * Inserts a Piece into the Set
     * @param {Piece} piece
     * @returns {Void}
     */
    insertPiece(piece) {
        this.list.push(piece);
        this.element.appendChild(piece.canvas);
        piece.canvas.dataset.action = "set";
        piece.canvas.dataset.id     = this.id;
    }

    /**
     * Positions the Pieces in the Set and the Set
     * @returns {Void}
     */
    position() {
        for (let row = 0; row < this.rowCount; row++) {
            for (let col = 0; col < this.colCount; col++) {
                const piece = this.matrix[row][col];
                if (piece) {
                    const top  = this.metrics.scaleSize * row;
                    const left = this.metrics.scaleSize * col;
                    piece.position(top, left);
                }
            }
        }
        this.element.style.width  = this.metrics.getSizePX(this.colCount);
        this.element.style.height = this.metrics.getSizePX(this.rowCount);
        this.translate();
    }



    /**
     * Returns true if the given Piece is neighbour of the Set
     * @param {(Piece|Set)} other
     * @returns {Boolean}
     */
    isNeighbour(other) {
        if (other instanceof Piece) {
            const row = other.row - this.startRow;
            const col = other.col - this.startCol;
            if (!this.isClose(row, col)) {
                return false;
            }
            return Boolean(
                (this.matrix[row + 1] && this.matrix[row + 1][col]) ||
                (this.matrix[row - 1] && this.matrix[row - 1][col]) ||
                (this.matrix[row] && this.matrix[row][col + 1]) ||
                (this.matrix[row] && this.matrix[row][col - 1])
            );
        }
        for (const piece of other.list) {
            if (this.isNeighbour(piece)) {
                return true;
            }
        }
        return false;
    }

    /**
     * Returns true if the given row and column is in the matrix or next to it
     * @param {Number} row
     * @param {Number} col
     * @returns {Boolean}
     */
    isClose(row, col) {
        if (this.matrix[row] && this.matrix[row][col]) {
            return true;
        }
        return (
            (row >= 0  && row <  this.rowCount && col >= -1 && col <= this.colCount) ||
            (row >= -1 && row <= this.rowCount && col >=  0 && col <  this.colCount)
        );
    }

    /**
     * Returns true if the position of the given Piece or Set is close enought to fit
     * @param {(Piece|Set)} other
     * @returns {Boolean}
     */
    canFit(other) {
        if (other instanceof Piece) {
            const fitPos = this.metrics.calcPiecePos(other, this.top, this.left, this.startRow, this.startCol);
            const dist   = Utils.dist(fitPos, other.pos);
            return dist < this.metrics.delta;
        }
        for (const piece of other.list) {
            const fitPos  = this.metrics.calcPiecePos(piece, this.top, this.left, this.startRow, this.startCol);
            const realPos = { top : other.top + piece.top, left : other.left + piece.left };
            const dist    = Utils.dist(fitPos, realPos);
            if (dist < this.metrics.delta) {
                return true;
            }
        }
        return false;
    }



    /**
     * Translates the Set
     * @returns {Void}
     */
    translate() {
        this.element.style.transform = Utils.translate(this.left, this.top);
    }

    /**
     * Picks the Set
     * @param {MouseEvent} event
     * @returns {Void}
     */
    pick(event) {
        const pos     = Utils.getMousePos(event);
        this.startPos = { top : pos.top - this.top, left : pos.left - this.left };
        this.pos      = pos;

        this.element.classList.add("dragging");
        this.translate();
    }

    /**
     * Drags the Set
     * @param {MouseEvent} event
     * @returns {Void}
     */
    drag(event) {
        const pos = Utils.getMousePos(event);
        this.pos  = pos;
        this.translate();
    }

    /**
     * Drops the Set in the Board
     * @returns {Void}
     */
    drop() {
        this.element.classList.remove("dragging");
    }
}
