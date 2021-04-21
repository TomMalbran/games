/**
 * Puzzle Manager
 */
class Puzzle {

    /**
     * The Puzzle constructor
     * @param {Sounds} sounds
     * @param {String} imageName
     * @param {Number} pieceCount
     */
    constructor(sounds, imageName, pieceCount) {
        this.sounds       = sounds;

        this.congrats     = document.querySelector(".congrats");
        this.pause        = document.querySelector(".pause");
        this.preview      = document.querySelector(".preview");

        this.image        = this.preview.querySelector("img");
        this.image.src    = `images/${imageName}.jpg`;
        this.image.alt    = imageName;
        this.image.onload = () => this.build(pieceCount);
    }

    /**
     * Builds the Puzzle
     * @param {String} imgName
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
     * @returns {Void}
     */
    togglePreview() {
        if (this.preview.style.display !== "flex") {
            this.preview.style.display = "flex";
        } else {
            const pos = Utils.getMousePos(event);
            if (!Utils.inElement(pos, this.image)) {
                this.preview.style.display = "none";
            }
        }
    }

    /**
     * Toggles the Pause
     * @returns {Void}
     */
    togglePause() {
        if (this.pause.style.display !== "block") {
            this.pause.style.display = "block";
            window.clearInterval(this.interval);
        } else {
            this.pause.style.display = "none";
            this.startTimer();
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
     * @param {Number} id
     * @returns {?(Piece|Set)}
     */
    pickAny(id) {
        let partial = this.drawer.findPiece(id);
        if (!partial) {
            partial = this.table.findAny(id);
        }
        if (partial) {
            partial.pick();
        }
        return partial;
    }

    /**
     * Drops a Piece or Set
     * @param {Event}       event
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
            this.sounds.drop();
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
                this.sounds.piece();
                this.complete();
                return;
            }

            // Find a neighbour Piece in the Table
            const neighbourPieces = this.table.findNeighbourPieces(piece);
            for (const neighbourPiece of neighbourPieces) {
                if (neighbourPiece && neighbourPiece.canFit(piece)) {
                    const set = new Set(neighbourPiece, piece);
                    this.table.dropSet(set);
                    this.sounds.piece();
                    return;
                }
            }

            // Find a neighbour Set in the Table
            const neighbourSets = this.table.findNeighbourSets(piece);
            for (const neighbourSet of neighbourSets) {
                if (neighbourSet.canFit(piece)) {
                    neighbourSet.addPiece(piece);
                    this.table.removePiece(piece);
                    this.sounds.piece();
                    return;
                }
            }

            this.sounds.drop();
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
            this.sounds.set();
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
                this.sounds.piece();
                foundNeighbour = true;
                break;
            }
        }

        // Find a neighbour Set in the Table
        const neighbourSets = this.table.findNeighbourSets(set);
        for (const neighbourSet of neighbourSets) {
            if (set.canFit(neighbourSet, this.table)) {
                set.addSet(neighbourSet);
                neighbourSet.destroy();
                this.table.removeSet(neighbourSet);
                this.sounds.set();
                foundNeighbour = true;
                break;
            }
        }

        set.drop();
        this.table.saveSets();
        if (!foundNeighbour) {
            this.sounds.drop();
        }
    }

    /**
     * Completes the Puzzle
     * @returns {Void}
     */
    complete() {
        if (this.metrics.isComplete) {
            this.congrats.style.display = "block";
            this.sounds.fireworks();
            if (this.interval) {
                window.clearInterval(this.interval);
            }
        }
    }
}
