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

    /** @type {Metrics} */
    #metrics;
    /** @type {Instance} */
    #instance;
    /** @type {List} */
    #list;
    /** @type {Piece[][]} */
    #matrix;

    /** @type {?HTMLElement} */
    #contentElem;
    /** @type {?HTMLElement} */
    #boardElem;


    /**
     * Puzzle Board constructor
     * @param {Metrics}  metrics
     * @param {Instance} instance
     */
    constructor(metrics, instance) {
        this.#metrics  = metrics;
        this.#instance = instance;
        this.#list     = new List(instance.getBoardPieces());

        this.#contentElem = document.querySelector(".content");
        this.#contentElem.style.display = "block";
        this.#contentElem.style.width   = Utils.toPX(metrics.boardWidth);
        this.#contentElem.style.padding = Utils.toPX(metrics.boardPadding);

        this.#boardElem = document.querySelector(".board");
        this.#boardElem.style.width  = Utils.toPX(metrics.boardWidth);
        this.#boardElem.style.height = Utils.toPX(metrics.boardHeight);

        this.#matrix = [];
        for (let row = 0; row < metrics.rows; row += 1) {
            this.#matrix[row] = [];
            for (let col = 0; col < metrics.cols; col += 1) {
                this.#matrix[row][col] = null;
            }
        }
        this.#list.forEach((elem) => this.insertPiece(elem));
    }

    /**
     * Destroys the Board
     * @returns {Void}
     */
    destroy() {
        this.#contentElem.style.display = "none";
        this.#boardElem.innerHTML       = "";
        this.#list.empty();

        this.#matrix  = [];
        this.#contentElem = null;
        this.#boardElem = null;
    }



    /**
     * Returns true if the Position is in the Board bounds
     * @param {{top: Number, left: Number}} pos
     * @returns {Boolean}
     */
    inBounds(pos) {
        return Utils.inElement(pos, this.#boardElem);
    }

    /**
     * Returns true if the position of the given Piece or Set is close enough to fit
     * @param {(Piece|Set)}                 other
     * @param {{top: Number, left: Number}} scroll
     * @returns {Boolean}
     */
    canFit(other, scroll) {
        const bounds = this.#boardElem.getBoundingClientRect();
        const fitPos = {
            top  : bounds.top  + scroll.top  + this.#metrics.scaleSize * other.row - 8,
            left : bounds.left + scroll.left + this.#metrics.scaleSize * other.col - 8,
        }
        const dist = Utils.dist(fitPos, other.pos);
        return dist < this.#metrics.delta;
    }

    /**
     * Inserts a Piece into the Board
     * @param {Piece} piece
     */
    insertPiece(piece) {
        this.#matrix[piece.row][piece.col] = piece;

        const top  = this.#metrics.scaleSize * piece.row - this.#metrics.scalePadding;
        const left = this.#metrics.scaleSize * piece.col - this.#metrics.scalePadding;

        piece.setActionID();
        piece.position(top, left);
        piece.appendTo(this.#boardElem);
    }

    /**
     * Adds a Piece to the Board
     * @param {Piece} piece
     * @returns {Void}
     */
    addPiece(piece) {
        this.insertPiece(piece);
        this.#metrics.incPlacedPiece();
        this.#list.addLast(piece);
        this.#instance.saveBoardPieces(this.#list);
    }

    /**
     * Adds a Set to the Board
     * @param {Set} set
     * @returns {Void}
     */
    addSet(set) {
        for (const piece of set.list) {
            this.insertPiece(piece);
            this.#metrics.incPlacedPiece();
            this.#list.addLast(piece);
        }
        this.#instance.saveBoardPieces(this.#list);
    }
}
