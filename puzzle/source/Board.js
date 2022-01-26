import Instance     from "./Instance.js";
import Metrics      from "./Metrics.js";
import Piece        from "./Piece.js";
import Set          from "./Set.js";

// Utils
import List         from "../../utils/List.js";
import Utils        from "../../utils/Utils.js";



/**
 * Puzzle Board
 */
export default class Board {

    /**
     * Puzzle Board constructor
     * @param {Metrics}  metrics
     * @param {Instance} instance
     */
    constructor(metrics, instance) {
        this.metrics  = metrics;
        this.instance = instance;

        this.list     = new List(instance.getBoardPieces());

        /** @type {HTMLElement} */
        this.content  = document.querySelector(".content");

        /** @type {HTMLElement} */
        this.element  = document.querySelector(".board");

        this.content.style.display = "block";
        this.content.style.width   = Utils.toPX(metrics.boardWidth);
        this.content.style.padding = Utils.toPX(metrics.boardPadding);
        this.element.style.width   = Utils.toPX(metrics.boardWidth);
        this.element.style.height  = Utils.toPX(metrics.boardHeight);

        this.matrix = [];
        for (let row = 0; row < metrics.rows; row += 1) {
            this.matrix[row] = [];
            for (let col = 0; col < metrics.cols; col += 1) {
                this.matrix[row][col] = null;
            }
        }
        this.list.forEach((elem) => this.insertPiece(elem));
    }

    /**
     * Destroys the Board
     * @returns {Void}
     */
    destroy() {
        this.content.style.display = "none";
        this.element.innerHTML     = "";
        this.list.empty();

        this.list    = null;
        this.matrix  = null;
        this.content = null;
        this.element = null;
    }



    /**
     * Returns true if the Position is in the Board bounds
     * @param {{top: Number, left: Number}} pos
     * @returns {Boolean}
     */
    inBounds(pos) {
        return Utils.inElement(pos, this.element);
    }

    /**
     * Returns true if the position of the given Piece or Set is close enought to fit
     * @param {(Piece|Set)}                 other
     * @param {{top: Number, left: Number}} scroll
     * @returns {Boolean}
     */
    canFit(other, scroll) {
        const bounds = this.element.getBoundingClientRect();
        const fitPos = {
            top  : bounds.top  + scroll.top  + this.metrics.scaleSize * other.row - 8,
            left : bounds.left + scroll.left + this.metrics.scaleSize * other.col - 8,
        }
        const dist = Utils.dist(fitPos, other.pos);
        return dist < this.metrics.delta;
    }

    /**
     * Inserts a Piece into the Board
     * @param {Piece} piece
     */
    insertPiece(piece) {
        this.matrix[piece.row][piece.col] = piece;

        const top  = this.metrics.scaleSize * piece.row - this.metrics.scalePadding;
        const left = this.metrics.scaleSize * piece.col - this.metrics.scalePadding;
        piece.position(top, left);
        piece.canvas.dataset.action = "";
        piece.canvas.dataset.id     = "";
        this.element.appendChild(piece.canvas);
    }

    /**
     * Adds a Piece to the Board
     * @param {Piece} piece
     * @returns {Void}
     */
    addPiece(piece) {
        this.insertPiece(piece);
        this.metrics.incPlacedPiece();
        this.list.addLast(piece);
        this.instance.saveBoardPieces(this.list);
    }

    /**
     * Adds a Set to the Board
     * @param {Set} set
     * @returns {Void}
     */
    addSet(set) {
        for (const piece of set.list) {
            this.insertPiece(piece);
            this.metrics.incPlacedPiece();
            this.list.addLast(piece);
        }
        this.instance.saveBoardPieces(this.list);
    }
}
