import Instance     from "./Instance.js";
import Metrics      from "./Metrics.js";
import Piece        from "./Piece.js";

// Utils
import List         from "../../utils/List.js";
import Utils        from "../../utils/Utils.js";



/**
 * Puzzle Drawer
 */
export default class Drawer {

    /** @type {Instance} */
    #instance;
    /** @type {List} */
    #list;
    /** @type {Boolean} */
    #onlyBorders;

    /** @type {?HTMLElement} */
    #drawerElem;
    /** @type {?HTMLElement} */
    #gridElem;
    /** @type {?HTMLElement} */
    #buttonElem;


    /**
     * Puzzle Drawer constructor
     * @param {Metrics}  metrics
     * @param {Instance} instance
     */
    constructor(metrics, instance) {
        this.#instance    = instance;

        this.#list        = new List(instance.getDrawerPieces());
        this.#onlyBorders = false;

        this.#drawerElem  = document.querySelector(".drawer");
        this.#gridElem    = document.querySelector(".grid");
        this.#buttonElem  = document.querySelector(".drawer button");

        const optimalSize = 210;
        const minAmount   = Math.floor(optimalSize / metrics.fullSize);
        const minSize     = minAmount * metrics.fullSize;
        const maxSize     = (minAmount + 1) * metrics.fullSize;
        const cols        = Math.abs(minSize - optimalSize) < Math.abs(maxSize - optimalSize) ? minAmount : minAmount + 1;
        const finalSize   = (cols * metrics.fullSize) + (cols - 1) * 8;

        this.#drawerElem.style.display           = "block";
        this.#drawerElem.style.width             = Utils.toPX(finalSize);
        this.#gridElem.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;

        this.#list.forEach((piece) => piece.appendTo(this.#gridElem));
    }

    /**
     * Destroys the Drawer
     * @returns {Void}
     */
    destroy() {
        if (this.#onlyBorders) {
            this.toggleBorders();
        }
        this.#gridElem.innerHTML       = "";
        this.#drawerElem.style.display = "none";
        this.#list.empty();

        this.#drawerElem = null;
        this.#gridElem   = null;
        this.#buttonElem = null;
    }



    /**
     * Toggles between showing only border pieces or all
     * @returns {Void}
     */
    toggleBorders() {
        this.#buttonElem.innerHTML = this.#onlyBorders ? "Only <u>B</u>orders" : "All Pieces";
        this.#gridElem.classList.toggle("drawer-borders");
        this.#onlyBorders = !this.#onlyBorders;
    }

    /**
     * Returns true if the Position is in the Drawer bounds
     * @param {{top: Number, left: Number}} pos
     * @returns {Boolean}
     */
    inBounds(pos) {
        return Utils.inElement(pos, this.#drawerElem);
    }

    /**
     * Drops the Piece to the Drawer
     * @param {Piece}                       piece
     * @param {{top: Number, left: Number}} pos
     * @returns {Void}
     */
    dropPiece(piece, pos) {
        const closestPiece = this.findClosest(pos, piece.id);
        if (closestPiece) {
            this.#gridElem.insertBefore(piece.element, closestPiece.element);
        } else {
            piece.appendTo(this.#gridElem);
        }

        if (piece.inDrawer) {
            this.#list.remove((item) => item.id === piece.id);
        }
        if (closestPiece) {
            this.#list.addBefore(piece, (item) => item.id === closestPiece.id);
        } else {
            this.#list.addLast(piece);
        }
        this.#instance.saveDrawerPieces(this.#list);

        piece.dropInDrawer();
    }

    /**
     * Removes a Piece from the Drawer
     * @param {Piece} piece
     * @returns {Void}
     */
    removePiece(piece) {
        if (piece.inDrawer) {
            this.#list.remove((elem) => elem.id === piece.id);
            this.#instance.saveDrawerPieces(this.#list);
        }
    }



    /**
     * Finds the Piece with the given ID
     * @param {String} id
     * @returns {?Piece}
     */
    findPiece(id) {
        return this.#list.find((elem) => elem.id === id);
    }

    /**
     * Finds the closest Piece to the given position
     * @param {{top: Number, left: Number}} pos
     * @param {String}                      skipID
     * @returns {?Piece}
     */
    findClosest(pos, skipID) {
        let minDist = Number.POSITIVE_INFINITY;
        let result  = null;

        this.#list.some((piece) => {
            if (piece.id === skipID) {
                return false;
            }

            const bounds = piece.bounds;
            if (Utils.inBounds(pos, bounds)) {
                result = piece;
                return true;
            }

            const center = {
                top  : bounds.top + bounds.height / 2,
                left : bounds.left + bounds.width / 2,
            };

            const dist = Utils.dist(pos, center);
            if (dist < minDist) {
                minDist = dist;
                result  = piece;
            }
        });
        return result;
    }
}
