import Instance     from "./Instance.js";
import Metrics      from "./Metrics.js";
import Piece        from "./Piece.js";
import Set          from "./Set.js";

// Utils
import List         from "../../utils/List.js";
import Utils        from "../../utils/Utils.js";



/**
 * Puzzle Table
 */
export default class Table {

    /** @type {Instance} */
    #instance;
    /** @type {List} */
    #pieces;
    /** @type {List} */
    #sets;

    /** @type {?HTMLElement} */
    #element;


    /**
     * Puzzle Table constructor
     * @param {Metrics}  metrics
     * @param {Instance} instance
     */
    constructor(metrics, instance) {
        this.#instance = instance;

        this.#pieces   = new List(instance.getTablePieces());
        this.#sets     = new List(instance.getTableSets());

        this.#element  = document.querySelector(".table");

        const bounds   = this.#element.getBoundingClientRect();
        const top      = ((metrics.boardHeight + metrics.boardPadding * 2 - bounds.height) / 2) - 20;
        const left     = (metrics.boardWidth + metrics.boardPadding * 2 - bounds.width)  / 2;
        this.#element.scrollTo(left, top);

        this.#pieces.forEach((piece) => piece.appendTo(this.#element));
        this.#sets.forEach((set) => set.appendTo(this.#element));
    }

    /**
     * Destroys the Table
     * @returns {Void}
     */
    destroy() {
        this.#pieces.forEach((piece) => piece.removeElement());
        this.#sets.forEach((set) => set.removeElement());

        this.#pieces.empty();
        this.#sets.empty();

        this.#element = null;
    }

    /**
     * Returns the Table scroll
     * @return {{top: Number, left: Number}}
     */
    get scroll() {
        return {
            top  : this.#element.scrollTop,
            left : this.#element.scrollLeft,
        };
    }



    /**
     * Returns true if the Position is in the Table bounds
     * @param {{top: Number, left: Number}} pos
     * @returns {Boolean}
     */
    inBounds(pos) {
        return Utils.inElement(pos, this.#element);
    }

    /**
     * Finds the Piece or Set with the given ID
     * @param {String} id
     * @returns {?(Piece|Set)}
     */
    findAny(id) {
        let result = this.#pieces.find((elem) => elem.id === id);
        if (!result) {
            result = this.#sets.find((elem) => elem.id === id);
        }
        return result;
    }

    /**
     * Finds a Set in the Table
     * @param {String} id
     * @returns {?Set}
     */
    findSet(id) {
        return this.#sets.find((elem) => elem.id === id);
    }

    /**
     * Finds the Pieces in the Table that is next to the given one
     * @param {(Piece|Set)} other
     * @returns {Piece[]}
     */
    findNeighborPieces(other) {
        return this.#pieces.findAll((piece) => piece.id !== other.id && other.isNeighbor(piece));
    }

    /**
     * Finds the Sets in the Table that is next to the given one
     * @param {(Piece|Set)} other
     * @returns {Set[]}
     */
    findNeighborSets(other) {
        return this.#sets.findAll((set) => set.id !== other.id && set.isNeighbor(other));
    }



    /**
     * Drops the given Piece in the Table
     * @param {Piece}                       piece
     * @param {{top: Number, left: Number}} pos
     * @returns {Void}
     */
    dropPiece(piece, pos) {
        if (piece.inDrawer) {
            this.#pieces.addLast(piece);
        }
        pos.top  += this.#element.scrollTop;
        pos.left += this.#element.scrollLeft;
        piece.dropInTable(pos);

        piece.appendTo(this.#element);
        this.savePieces();
    }

    /**
     * Drops the given Set in the Table
     * @param {Set} set
     * @returns {Void}
     */
    dropSet(set) {
        this.#sets.addLast(set);
        for (const piece of set.list) {
            this.removePiece(piece);
        }
        set.appendTo(this.#element);
        this.saveSets();
    }

    /**
     * Removes the given Piece from the Table
     * @param {Piece} piece
     * @returns {Void}
     */
    removePiece(piece) {
        if (!piece.inDrawer) {
            this.#pieces.remove((elem) => elem.id === piece.id);
            this.savePieces();
        }
    }

    /**
     * Removes the given Set from the Table
     * @param {Set} set
     * @returns {Void}
     */
    removeSet(set) {
        this.#sets.remove((elem) => elem.id === set.id);
        this.saveSets();
    }



    /**
     * Saves the Pieces
     * @returns {Void}
     */
    savePieces() {
        this.#instance.saveTablePieces(this.#pieces);
    }

    /**
     * Saves the Sets
     * @returns {Void}
     */
    saveSets() {
        this.#instance.saveTableSets(this.#sets);
    }
}
