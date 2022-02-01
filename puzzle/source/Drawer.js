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

    /**
     * Puzzle Drawer constructor
     * @param {Metrics}  metrics
     * @param {Instance} instance
     */
    constructor(metrics, instance) {
        this.instance     = instance;

        this.list         = new List(instance.getDrawerPieces());
        this.onlyBorders  = false;

        /** @type {HTMLElement} */
        this.element      = document.querySelector(".drawer");

        /** @type {HTMLElement} */
        this.grid         = document.querySelector(".grid");

        /** @type {HTMLElement} */
        this.button       = document.querySelector(".drawer button");

        const optimalSize = 210;
        const minAmount   = Math.floor(optimalSize / metrics.fullSize);
        const minSize     = minAmount * metrics.fullSize;
        const maxSize     = (minAmount + 1) * metrics.fullSize;
        const cols        = Math.abs(minSize - optimalSize) < Math.abs(maxSize - optimalSize) ? minAmount : minAmount + 1;
        const finalSize   = (cols * metrics.fullSize) + (cols - 1) * 8;

        this.element.style.display          = "block";
        this.element.style.width            = Utils.toPX(finalSize);
        this.grid.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;

        this.list.forEach((elem) => this.grid.appendChild(elem.canvas));
    }

    /**
     * Destroys the Drawer
     * @returns {Void}
     */
    destroy() {
        if (this.onlyBorders) {
            this.toggleBorders();
        }
        this.grid.innerHTML        = "";
        this.element.style.display = "none";
        this.list.empty();

        this.list    = null;
        this.element = null;
        this.grid    = null;
        this.button  = null;
    }



    /**
     * Toggles between showing only border pieces or all
     * @returns {Void}
     */
    toggleBorders() {
        this.button.innerHTML = this.onlyBorders ? "Only <u>B</u>orders" : "All Pieces";
        this.grid.classList.toggle("drawer-borders");
        this.onlyBorders = !this.onlyBorders;
    }

    /**
     * Returns true if the Position is in the Drawer bounds
     * @param {{top: Number, left: Number}} pos
     * @returns {Boolean}
     */
    inBounds(pos) {
        return Utils.inElement(pos, this.element);
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
            this.grid.insertBefore(piece.canvas, closestPiece.canvas);
        } else {
            this.grid.appendChild(piece.canvas);
        }

        if (piece.inDrawer) {
            this.list.remove((item) => item.id === piece.id);
        }
        if (closestPiece) {
            this.list.addBefore(piece, (item) => item.id === closestPiece.id);
        } else {
            this.list.addLast(piece);
        }
        this.instance.saveDrawerPieces(this.list);

        piece.dropInDrawer();
    }

    /**
     * Removes a Piece from the Drawer
     * @param {Piece} piece
     * @returns {Void}
     */
    removePiece(piece) {
        if (piece.inDrawer) {
            this.list.remove((elem) => elem.id === piece.id);
            this.instance.saveDrawerPieces(this.list);
        }
    }



    /**
     * Finds the Piece with the given ID
     * @param {Number} id
     * @returns {?Piece}
     */
    findPiece(id) {
        return this.list.find((elem) => elem.id === id);
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

        this.list.some((elem) => {
            if (elem.id === skipID) {
                return false;
            }
            const bounds = elem.canvas.getBoundingClientRect();
            if (Utils.inBounds(pos, bounds)) {
                result = elem;
                return true;
            }
            const center = { top : bounds.top + bounds.height / 2, left : bounds.left + bounds.width / 2 };
            const dist   = Utils.dist(pos, center);
            if (dist < minDist) {
                minDist = dist;
                result  = elem;
            }
        });
        return result;
    }
}
