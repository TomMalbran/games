import Board        from "./Board.js";
import Drawer       from "./Drawer.js";
import Instance     from "./Instance.js";
import Metrics      from "./Metrics.js";
import Piece        from "./Piece.js";
import Set          from "./Set.js";
import Table        from "./Table.js";

// Utils
import Sounds       from "../../utils/Sounds.js";
import Utils        from "../../utils/Utils.js";



/**
 * Puzzle Puzzle
 */
export default class Puzzle {

    /** @type {String} */
    #display;
    /** @type {Sounds} */
    #sounds;
    /** @type {?Metrics} */
    #metrics;
    /** @type {?Instance} */
    #instance;
    /** @type {?Drawer} */
    #drawer;
    /** @type {?Board} */
    #board;
    /** @type {?Table} */
    #table;

    /** @type {HTMLElement} */
    #congratsElem;
    /** @type {HTMLElement} */
    #pauseElem;
    /** @type {HTMLElement} */
    #previewElem;
    /** @type {HTMLImageElement} */
    #imageElem;


    /**
     * Puzzle Puzzle constructor
     * @param {Sounds} sounds
     * @param {String} imageName
     * @param {Number} pieceCount
     */
    constructor(sounds, imageName, pieceCount) {
        this.#display          = "game";
        this.#sounds           = sounds;

        this.#congratsElem     = document.querySelector(".congrats");
        this.#pauseElem        = document.querySelector(".pause");
        this.#previewElem      = document.querySelector(".preview");

        const imageUrl         = imageName.match(/([0-9]+)|([a-zA-Z]+)/g).join("/");
        this.#imageElem        = this.#previewElem.querySelector("img");
        this.#imageElem.src    = `images/${imageUrl}.jpg`;
        this.#imageElem.alt    = imageName;
        this.#imageElem.onload = () => this.build(pieceCount);
    }

    /**
     * Builds the Puzzle
     * @param {Number} pieceCount
     * @returns {Void}
     */
    build(pieceCount) {
        this.#metrics  = new Metrics(this.#imageElem, pieceCount);
        this.#instance = new Instance(this.#imageElem, this.#metrics);
        this.#drawer   = new Drawer(this.#metrics, this.#instance);
        this.#board    = new Board(this.#metrics, this.#instance);
        this.#table    = new Table(this.#metrics, this.#instance);

        this.startTimer();
    }

    /**
     * Destroys the Puzzle
     * @returns {Void}
     */
    destroy() {
        this.#congratsElem.style.display = "none";
        if (this.interval) {
            window.clearInterval(this.interval);
        }

        this.#metrics.destroy();
        this.#drawer.destroy();
        this.#board.destroy();
        this.#table.destroy();

        this.#display      = "game";
        this.#congratsElem = null;
        this.#previewElem  = null;
        this.#imageElem    = null;

        this.#metrics      = null;
        this.#instance     = null;
        this.#drawer       = null;
        this.#board        = null;
        this.#table        = null;
    }



    /**
     * Returns true if the Display is Game
     * @returns {Boolean}
     */
    get isGame() {
        return this.#display === "game";
    }

    /**
     * Toggles the Preview
     * @param {MouseEvent=} event
     * @returns {Void}
     */
    togglePreview(event) {
        if (this.#display !== "game" && this.#display !== "preview") {
            return;
        }
        if (this.#previewElem.style.display !== "flex") {
            this.#previewElem.style.display = "flex";
            this.#display = "preview";
        } else if (event) {
            const pos = Utils.getMousePos(event);
            if (!Utils.inElement(pos, this.#imageElem)) {
                this.#previewElem.style.display = "none";
                this.#display = "game";
            }
        } else {
            this.#previewElem.style.display = "none";
            this.#display = "game";
        }
    }

    /**
     * Toggles the Pause
     * @returns {Void}
     */
    togglePause() {
        if (this.#display !== "game" && this.#display !== "pause") {
            return;
        }
        if (this.#pauseElem.style.display !== "block") {
            this.#pauseElem.style.display = "block";
            window.clearInterval(this.interval);
            this.#display = "pause";
        } else {
            this.#pauseElem.style.display = "none";
            this.startTimer();
            this.#display = "game";
        }
    }

    /**
     * Starts the Timer
     * @returns {Void}
     */
    startTimer() {
        this.interval = window.setInterval(() => {
            this.#metrics.incTime();
            this.#instance.saveTime(this.#metrics.elapsedTime);
        }, 1000);
    }

    /**
     * Toggles between showing only border pieces or all
     * @returns {Void}
     */
    toggleOnlyBorders() {
        this.#drawer.toggleOnlyBorders();
    }

    /**
     * Toggles between showing one or two pieces places
     * @returns {Void}
     */
    toggleDrawerSplit() {
        this.#drawer.toggleSplit();
    }



    /**
     * Finds a Piece or Set in the Drawer or Table to pick
     * @param {MouseEvent} event
     * @param {String}     id
     * @returns {?(Piece|Set)}
     */
    pickAny(event, id) {
        /** @type {(Piece|Set)} */
        let partial = this.#drawer.findPiece(id);
        if (!partial) {
            partial = this.#table.findAny(id);
        }
        if (partial) {
            partial.pick(event);
        }
        return partial;
    }

    /**
     * Drops a Piece or Set
     * @param {MouseEvent}  event
     * @param {(Piece|Set)} partial
     * @returns {Void}
     */
    dropAny(event, partial) {
        if (partial instanceof Piece) {
            this.dropPiece(event, partial);
        } else {
            this.dropSet(partial);
        }
    }

    /**
     * Drops a Piece
     * @param {MouseEvent} event
     * @param {Piece}      piece
     * @returns {Void}
     */
    dropPiece(event, piece) {
        const pos = Utils.getMousePos(event, false);
        if (pos.left < 0 || pos.top < 0) {
            return;
        }

        // Drops the Piece in the Drawer
        if (this.#drawer.inBounds(pos)) {
            this.#table.removePiece(piece);
            this.#drawer.dropPiece(piece, pos);
            this.#sounds.play("drop");
            return;
        }

        // Drops the Piece in the Table and tries to fit it with another
        if (this.#table.inBounds(pos)) {
            this.#drawer.removePiece(piece);
            this.#table.dropPiece(piece, pos);

            // Drops the Piece in the Board and tries to fit it
            if (this.#board.canFit(piece, this.#table.scroll)) {
                this.#board.addPiece(piece);
                this.#table.removePiece(piece);
                this.#sounds.play("piece");
                this.complete();
                return;
            }

            // Find a neighbors Piece in the Table
            const neighborPieces = this.#table.findNeighborPieces(piece);
            for (const neighborPiece of neighborPieces) {
                if (neighborPiece && neighborPiece.canFit(piece)) {
                    const set = new Set(this.#metrics, neighborPiece, piece);
                    this.#table.dropSet(set);
                    this.#sounds.play("piece");
                    return;
                }
            }

            // Find a neighbor Set in the Table
            const neighborSets = this.#table.findNeighborSets(piece);
            for (const neighborSet of neighborSets) {
                if (neighborSet.canFit(piece)) {
                    neighborSet.addPiece(piece);
                    this.#table.removePiece(piece);
                    this.#sounds.play("piece");
                    return;
                }
            }

            this.#sounds.play("drop");
        }
    }

    /**
     * Drops a Set
     * @param {Set} set
     * @returns {Void}
     */
    dropSet(set) {
        let foundNeighbor = false;

        // Drops the Set in the Board and tries to fit it
        if (this.#board.canFit(set, this.#table.scroll)) {
            this.#table.removeSet(set);
            this.#board.addSet(set);
            this.#sounds.play("set");
            set.destroy();
            this.complete();
            return;
        }

        // Find a neighbor Piece in the Table
        const neighborPieces = this.#table.findNeighborPieces(set);
        for (const neighborPiece of neighborPieces) {
            if (set.canFit(neighborPiece)) {
                this.#table.removePiece(neighborPiece);
                set.addPiece(neighborPiece);
                this.#sounds.play("piece");
                foundNeighbor = true;
                break;
            }
        }

        // Find a neighbor Set in the Table
        const neighborSets = this.#table.findNeighborSets(set);
        for (const neighborSet of neighborSets) {
            if (set.canFit(neighborSet)) {
                set.addSet(neighborSet);
                neighborSet.destroy();
                this.#table.removeSet(neighborSet);
                this.#sounds.play("set");
                foundNeighbor = true;
                break;
            }
        }

        set.drop();
        this.#table.saveSets();
        if (!foundNeighbor) {
            this.#sounds.play("drop");
        }
    }

    /**
     * Completes the Puzzle
     * @returns {Void}
     */
    complete() {
        if (!this.#metrics.isComplete) {
            return;
        }

        if (this.interval) {
            window.clearInterval(this.interval);
        }
        this.#display = "congrats";
        this.#congratsElem.style.display = "block";
        this.#sounds.play("fireworks");
        this.#instance.complete();
    }
}
