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
    /** @type {Boolean} */
    #onlyBorders;
    /** @type {Boolean} */
    #isSplit;
    /** @type {List} */
    #primaryList;
    /** @type {List} */
    #secondaryList;

    /** @type {?HTMLElement} */
    #drawerElem;
    /** @type {?HTMLElement} */
    #primaryElem;
    /** @type {?HTMLElement} */
    #secondaryElem;
    /** @type {?HTMLElement} */
    #bordersElem;
    /** @type {?HTMLElement} */
    #splitElem;


    /**
     * Puzzle Drawer constructor
     * @param {Metrics}  metrics
     * @param {Instance} instance
     */
    constructor(metrics, instance) {
        this.#instance = instance;

        const optimalSize   = 210;
        const minAmount     = Math.floor(optimalSize / metrics.fullSize);
        const minSize       = minAmount * metrics.fullSize;
        const maxSize       = (minAmount + 1) * metrics.fullSize;
        const cols          = Math.abs(minSize - optimalSize) < Math.abs(maxSize - optimalSize) ? minAmount : minAmount + 1;
        const finalSize     = (cols * metrics.fullSize) + (cols - 1) * 8 + 32 + 12;

        this.#drawerElem    = document.querySelector(".drawer");
        this.#primaryElem   = document.querySelector(".primary");
        this.#secondaryElem = document.querySelector(".secondary");
        this.#bordersElem   = document.querySelector(".action-borders");
        this.#splitElem     = document.querySelector(".action-split");

        this.#drawerElem.style.display                = "flex";
        this.#drawerElem.style.width                  = Utils.toPX(finalSize);
        this.#primaryElem.style.gridTemplateColumns   = `repeat(${cols}, 1fr)`;
        this.#secondaryElem.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;

        this.#onlyBorders = instance.getDrawerOnlyBorders();
        this.setOnlyBorders();

        this.#isSplit = instance.getDrawerSplit();
        this.setSplit();

        this.#primaryList = new List(instance.getDrawerPrimaries());
        this.#primaryList.forEach((piece) => {
            piece.dropInDrawer("primary");
            piece.appendTo(this.#primaryElem);
        });

        this.#secondaryList = new List(instance.getDrawerSecondaries());
        this.#secondaryList.forEach((piece) => {
            piece.dropInDrawer("secondary");
            piece.appendTo(this.#secondaryElem);
        });
    }

    /**
     * Destroys the Drawer
     * @returns {Void}
     */
    destroy() {
        this.#onlyBorders = false;
        this.setOnlyBorders();

        this.#isSplit = false;
        this.setSplit();

        this.#primaryList.empty();
        this.#secondaryList.empty();

        this.#drawerElem.style.display = "none";
        this.#primaryElem.innerHTML    = "";
        this.#secondaryElem.innerHTML  = "";

        this.#drawerElem    = null;
        this.#primaryElem   = null;
        this.#secondaryElem = null;
        this.#bordersElem   = null;
        this.#splitElem     = null;
    }



    /**
     * Toggles between showing only border pieces or all
     * @returns {Void}
     */
    toggleOnlyBorders() {
        this.#onlyBorders = !this.#onlyBorders;
        this.#instance.saveDrawerOnlyBorders(this.#onlyBorders);
        this.setOnlyBorders();
    }

    /**
     * Sets the only borders option
     * @returns {Void}
     */
    setOnlyBorders() {
        this.#bordersElem.innerHTML = this.#onlyBorders ? "<u>A</u>ll Pieces" : "Only <u>B</u>orders";
        this.#drawerElem.classList.toggle("drawer-borders", this.#onlyBorders);
    }

    /**
     * Toggles between showing one or two pieces places
     * @returns {Void}
     */
    toggleSplit() {
        this.#isSplit = !this.#isSplit;
        this.#instance.saveDrawerSplit(this.#isSplit);
        this.setSplit();
    }

    /**
     * Sets the split option
     * @returns {Void}
     */
    setSplit() {
        this.#splitElem.innerHTML = this.#isSplit ? "<u>J</u>oin" : "<u>S</u>plit";
        this.#drawerElem.classList.toggle("drawer-split", this.#isSplit);
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
     * Drops the Piece in the Drawer
     * @param {Piece}                       piece
     * @param {{top: Number, left: Number}} pos
     * @returns {Void}
     */
    dropPiece(piece, pos) {
        this.removePiece(piece);
        if (this.#isSplit && Utils.inElement(pos, this.#secondaryElem)) {
            this.dropPieceOne("secondary", this.#secondaryList, this.#secondaryElem, piece, pos);
        } else {
            this.dropPieceOne("primary", this.#primaryList, this.#primaryElem, piece, pos);
        }

        this.#instance.saveDrawerPrimaries(this.#primaryList);
        this.#instance.saveDrawerSecondaries(this.#secondaryList);
    }

    /**
     * Drops the Piece in one of the Drawer
     * @param {String}                      drawer
     * @param {List}                        list
     * @param {HTMLElement}                 container
     * @param {Piece}                       piece
     * @param {{top: Number, left: Number}} pos
     * @returns {Void}
     */
    dropPieceOne(drawer, list, container, piece, pos) {
        const closestPiece = this.findClosest(list, pos, piece.id);
        if (closestPiece) {
            container.insertBefore(piece.element, closestPiece.element);
        } else {
            piece.appendTo(container);
        }

        if (closestPiece) {
            list.addBefore(piece, (item) => item.id === closestPiece.id);
        } else {
            list.addLast(piece);
        }

        piece.dropInDrawer(drawer);
    }

    /**
     * Removes a Piece from the Drawer
     * @param {Piece} piece
     * @returns {Void}
     */
    removePiece(piece) {
        if (piece.inDrawer === "primary") {
            this.#primaryList.remove((elem) => elem.id === piece.id);
            this.#instance.saveDrawerPrimaries(this.#primaryList);
        } else if (piece.inDrawer === "secondary") {
            this.#secondaryList.remove((elem) => elem.id === piece.id);
            this.#instance.saveDrawerPrimaries(this.#secondaryList);
        }
    }



    /**
     * Finds the Piece with the given ID
     * @param {String} id
     * @returns {?Piece}
     */
    findPiece(id) {
        let piece = this.#primaryList.find((elem) => elem.id === id);
        if (!piece) {
            piece = this.#secondaryList.find((elem) => elem.id === id);
        }
        return piece;
    }

    /**
     * Finds the closest Piece to the given position
     * @param {List}                        list
     * @param {{top: Number, left: Number}} pos
     * @param {String}                      skipID
     * @returns {?Piece}
     */
    findClosest(list, pos, skipID) {
        let minDist = Number.POSITIVE_INFINITY;
        let result  = null;

        list.some((piece) => {
            if (piece.id === skipID) {
                return false;
            }

            const bounds = piece.bounds;
            if (Utils.inBounds(pos, bounds)) {
                result = piece;
                return true;
            }

            const center = {
                top  : bounds.top  + bounds.height / 2,
                left : bounds.left + bounds.width  / 2,
            };

            const dist = Utils.dist(pos, center);
            if (dist < bounds.width * 0.75 && dist < minDist) {
                minDist = dist;
                result  = piece;
            }
        });
        return result;
    }
}
