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

    /**
     * Puzzle Puzzle constructor
     * @param {Sounds} sounds
     * @param {String} imageName
     * @param {Number} pieceCount
     */
    constructor(sounds, imageName, pieceCount) {
        this.sounds       = sounds;
        this.display      = "game";

        /** @type {HTMLElement} */
        this.congrats     = document.querySelector(".congrats");

        /** @type {HTMLElement} */
        this.pause        = document.querySelector(".pause");

        /** @type {HTMLElement} */
        this.preview      = document.querySelector(".preview");

        /** @type {HTMLImageElement} */
        this.image        = this.preview.querySelector("img");
        this.image.src    = `images/${imageName}.jpg`;
        this.image.alt    = imageName;
        this.image.onload = () => this.build(pieceCount);
    }

    /**
     * Builds the Puzzle
     * @param {Number} pieceCount
     * @returns {Void}
     */
    build(pieceCount) {
        this.metrics  = new Metrics(this.image, pieceCount);
        this.instance = new Instance(this.image, this.metrics);
        this.drawer   = new Drawer(this.metrics, this.instance);
        this.board    = new Board(this.metrics, this.instance);
        this.table    = new Table(this.metrics, this.instance);

        this.startTimer();
    }

    /**
     * Destroys the Puzzle
     * @returns {Void}
     */
    destroy() {
        this.congrats.style.display = "none";
        if (this.interval) {
            window.clearInterval(this.interval);
        }

        this.metrics.destroy();
        this.drawer.destroy();
        this.board.destroy();
        this.table.destroy();

        this.display  = "game";
        this.congrats = null;
        this.preview  = null;
        this.image    = null;

        this.metrics  = null;
        this.instance = null;
        this.drawer   = null;
        this.board    = null;
        this.table    = null;
    }



    /**
     * Toggles the Preview
     * @param {MouseEvent=} event
     * @returns {Void}
     */
    togglePreview(event) {
        if (this.display !== "game" && this.display !== "preview") {
            return;
        }
        if (this.preview.style.display !== "flex") {
            this.preview.style.display = "flex";
            this.display = "preview";
        } else if (event) {
            const pos = Utils.getMousePos(event);
            if (!Utils.inElement(pos, this.image)) {
                this.preview.style.display = "none";
                this.display = "game";
            }
        } else {
            this.preview.style.display = "none";
            this.display = "game";
        }
    }

    /**
     * Toggles the Pause
     * @returns {Void}
     */
    togglePause() {
        if (this.display !== "game" && this.display !== "pause") {
            return;
        }
        if (this.pause.style.display !== "block") {
            this.pause.style.display = "block";
            window.clearInterval(this.interval);
            this.display = "pause";
        } else {
            this.pause.style.display = "none";
            this.startTimer();
            this.display = "game";
        }
    }

    /**
     * Starts the Timer
     * @returns {Void}
     */
    startTimer() {
        this.interval = window.setInterval(() => {
            this.metrics.incTime();
            this.instance.saveTime(this.metrics.elapsedTime);
        }, 1000);
    }



    /**
     * Finds a Piece or Set in the Drawer or Table to pick
     * @param {MouseEvent} event
     * @param {Number}     id
     * @returns {?(Piece|Set)}
     */
    pickAny(event, id) {
        /** @type {(Piece|Set)} */
        let partial = this.drawer.findPiece(id);
        if (!partial) {
            partial = this.table.findAny(id);
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

        // Drops the Piece in the Drawer
        if (this.drawer.inBounds(pos)) {
            this.table.removePiece(piece);
            this.drawer.dropPiece(piece, pos);
            this.sounds.play("drop");
            return;
        }

        // Drops the Piece in the Table and tryes to fit it with another
        if (this.table.inBounds(pos)) {
            this.drawer.removePiece(piece);
            this.table.dropPiece(piece, pos);

            // Drops the Piece in the Board and tryes to fit it
            if (this.board.canFit(piece, this.table.scroll)) {
                this.board.addPiece(piece);
                this.table.removePiece(piece);
                this.sounds.play("piece");
                this.complete();
                return;
            }

            // Find a neighbour Piece in the Table
            const neighbourPieces = this.table.findNeighbourPieces(piece);
            for (const neighbourPiece of neighbourPieces) {
                if (neighbourPiece && neighbourPiece.canFit(piece)) {
                    const set = new Set(neighbourPiece, piece);
                    this.table.dropSet(set);
                    this.sounds.play("piece");
                    return;
                }
            }

            // Find a neighbour Set in the Table
            const neighbourSets = this.table.findNeighbourSets(piece);
            for (const neighbourSet of neighbourSets) {
                if (neighbourSet.canFit(piece)) {
                    neighbourSet.addPiece(piece);
                    this.table.removePiece(piece);
                    this.sounds.play("piece");
                    return;
                }
            }

            this.sounds.play("drop");
        }
    }

    /**
     * Drops a Set
     * @param {Set} set
     * @returns {Void}
     */
    dropSet(set) {
        let foundNeighbour = false;

        // Drops the Set in the Board and tryes to fit it
        if (this.board.canFit(set, this.table.scroll)) {
            this.table.removeSet(set);
            this.board.addSet(set);
            this.sounds.play("set");
            set.destroy();
            this.complete();
            return;
        }

        // Find a neighbour Piece in the Table
        const neighbourPieces = this.table.findNeighbourPieces(set);
        for (const neighbourPiece of neighbourPieces) {
            if (set.canFit(neighbourPiece)) {
                this.table.removePiece(neighbourPiece);
                set.addPiece(neighbourPiece);
                this.sounds.play("piece");
                foundNeighbour = true;
                break;
            }
        }

        // Find a neighbour Set in the Table
        const neighbourSets = this.table.findNeighbourSets(set);
        for (const neighbourSet of neighbourSets) {
            if (set.canFit(neighbourSet)) {
                set.addSet(neighbourSet);
                neighbourSet.destroy();
                this.table.removeSet(neighbourSet);
                this.sounds.play("set");
                foundNeighbour = true;
                break;
            }
        }

        set.drop();
        this.table.saveSets();
        if (!foundNeighbour) {
            this.sounds.play("drop");
        }
    }

    /**
     * Completes the Puzzle
     * @returns {Void}
     */
    complete() {
        if (this.metrics.isComplete) {
            this.display = "congrats";
            this.congrats.style.display = "block";
            this.sounds.play("fireworks");
            if (this.interval) {
                window.clearInterval(this.interval);
            }
        }
    }
}
