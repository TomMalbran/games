import Board        from "../board/Board.js";
import Blob         from "../Blob.js";
import Blinky       from "./Blinky.js";
import Pinky        from "./Pinky.js";
import Inky         from "./Inky.js";
import Clyde        from "./Clyde.js";



/**
 * Pacman Ghosts
 */
export default class Ghosts {

    /**
     * Pacman Ghosts constructor
     * @param {Board}   board
     * @param {?Ghosts} oldManager
     */
    constructor(board, oldManager) {
        this.level = board.level;

        // Ghosts Data
        this.globalMode  = "scatter";                   // Global Mode
        this.modeCounter = 0;                           // Amount of switchs between Scatter-Chase
        this.modeTimer   = this.level.getSwitchTime(0); // Scatter/Chase timer
        this.frightTimer = 0;                           // Frigthen timer
        this.blinksCount = 0;                           // Amount of blinks at frighten end
        this.eyesCounter = 0;                           // Amount of dead Ghost during a fright mode

        // The Ghosts
        const canvas     = board.gameCanvas;
        // @ts-ignore
        const blinkyDots = oldManager && oldManager.blinky ? oldManager.blinky.dotsCount : null;
        // @ts-ignore
        const pinkyDots  = oldManager && oldManager.pinky  ? oldManager.pinky.dotsCount  : null;
        // @ts-ignore
        const inkyDots   = oldManager && oldManager.inky   ? oldManager.inky.dotsCount   : null;
        // @ts-ignore
        const clydeDots  = oldManager && oldManager.clyde  ? oldManager.clyde.dotsCount  : null;

        this.blinky      = new Blinky(board, canvas, blinkyDots);
        this.pinky       = new Pinky(board, canvas, pinkyDots);
        this.inky        = new Inky(board, canvas, inkyDots, this.blinky);
        this.clyde       = new Clyde(board, canvas, clydeDots);
        this.ghosts      = [ this.blinky, this.pinky, this.inky, this.clyde ];

        // Pen Data
        this.penType     = !!oldManager;               // Type used to force ghosts out of the pen (false = using
                                                       // ... ghost's dot counters | true = using global dot counter)
        this.penTimer    = 0;                          // Pen Leaving Force Timer
        this.globalDots  = 0;                          // Global dots counter

        /** @type {(Blinky|Pinky|Inky|Clyde)[]} */
        this.inPen       = [ this.pinky, this.inky, this.clyde ];

        if (!this.penType) {
            this.inPen.forEach(() => this.checkDotLimit());
        }
    }



    /**
     * Animates all the Ghosts, and reduces the ghosts modes timers
     * @param {Number} time
     * @param {Number} speed
     * @param {Blob}   blob
     * @returns {Void}
     */
    animate(time, speed, blob) {
        if (this.frightTimer > 0) {
            this.frightTimer -= time;
        } else if (this.modeCounter < this.level.totalSwitches && this.modeTimer > 0) {
            this.modeTimer -= time;
        }

        this.switchMode(blob);
        this.move(speed, blob);
        this.increasePenTimer(time);
    }

    /**
     * Changes the Ghosts mode
     * @param {Blob} blob
     * @returns {Void}
     */
    switchMode(blob) {
        const oldMode = this.globalMode;
        if (this.level.isFrighten(this.globalMode) && this.frightTimer <= 0) {
            this.blinksCount -= 1;

            if (this.blinksCount >= 0) {
                this.frightTimer = this.level.blinksTimer;
                this.globalMode  = this.globalMode === "white" ? "blue" : "white";
            } else {
                this.globalMode  = this.getSwitchMode();
            }
            this.switchGhostsMode(oldMode, blob);

        } else if (this.modeTimer <= 0) {
            this.modeCounter += 1;
            this.globalMode   = this.getSwitchMode();
            this.modeTimer    = this.level.getSwitchTime(this.modeCounter);
            this.switchGhostsMode(oldMode, blob);
        }
    }

    /**
     * Changes the mode of each Ghost
     * @param {String} oldMode
     * @param {Blob}   blob
     * @returns {Void}
     */
    switchGhostsMode(oldMode, blob) {
        this.ghosts.forEach((ghost) => {
            ghost.switchMode(oldMode, this.globalMode, blob);
        });
    }

    /**
     * Moves all the Ghosts
     * @param {Number} speed
     * @param {Blob}   blob
     * @returns {Void}
     */
    move(speed, blob) {
        const mode = this.getSwitchMode();
        this.ghosts.forEach((ghost) => {
            if (ghost.move(speed, blob, mode)) {
                this.addGhostToPen(ghost);
            }
        });
    }

    /**
     * Draws all The Ghosts
     * @returns {Void}
     */
    draw() {
        this.ghosts.forEach((ghost) => ghost.draw());
    }

    /**
     * Sets the Ghosts targets when the Blob reached a new Tile
     * @param {Blob} blob
     * @returns {Void}
     */
    setTargets(blob) {
        this.ghosts.forEach((ghost) => {
            if (ghost.shouldChangeTarget(this.globalMode)) {
                ghost.setChaseTarget(blob);
            }
        });
    }

    /**
     * Sets Blinky's "Cruise Elroy" Mode when the number of dots left reaches the target
     * @param {Number} dots
     * @returns {Void}
     */
    checkElroyDots(dots) {
        this.blinky.checkElroyDots(dots);
    }

    /**
     * Switches to Frighten mode
     * @param {Blob} blob
     * @returns {Void}
     */
    frighten(blob) {
        const oldMode    = this.globalMode;
        this.globalMode  = "blue";
        this.frightTimer = this.level.frightTime;
        this.blinksCount = this.level.blinks;
        this.eyesCounter = 0;

        this.switchGhostsMode(oldMode, blob);
    }

    /**
     * The Ghost kills the Blob or Dies from it. Returns true if the Blob died
     * @param {{x: Number, y: Number}} blobTile
     * @param {Function}               onKill
     * @param {Function}               onDie
     * @returns {Void}
     */
    crash(blobTile, onKill, onDie) {
        this.ghosts.some((ghost) => {
            const result = ghost.killOrDie(blobTile);
            if (result === "kill") {
                this.eyesCounter += 1;
                onKill(this.eyesCounter, ghost.tile);
            } else if (result === "die") {
                onDie();
            }
            return !!result;
        });
    }

    /**
     * Returns the current Scatter or Chase mode
     * @returns {String}
     */
    getSwitchMode() {
        return this.modeCounter % 2 === 0 ? "scatter" : "chase";
    }

    /**
     * Returns the current Mode, including the Fright variations
     * @returns {String}
     */
    getMode() {
        return this.globalMode;
    }

    /**
     * Returns true if the current mode is a Fright
     * @returns {Boolean}
     */
    areFrighten() {
        return this.level.isFrighten(this.globalMode);
    }



    /**
     * Increases the global dots or the first Ghost internal dots depending on the mode
     * @returns {Void}
     */
    incDotCounter() {
        if (!this.penType) {
            this.incGhostsDots();
        } else {
            this.incGlobalDots();
        }
    }

    /**
     * Increases the internal dots counter for the Ghost in the Pen array
     * @returns {Void}
     */
    incGhostsDots() {
        if (this.inPen.length > 0) {
            this.inPen[0].increaseDots();
            this.checkDotLimit();
        }
    }

    /**
     * Checks if a ghost can leave pen
     * @returns {Void}
     */
    checkDotLimit() {
        const limits = this.level.getData("penLeavingLimit");
        const ghost  = this.inPen[0];

        if (limits[ghost.id] <= ghost.dotsCount) {
            this.releaseGhostFromPen();
        }
    }

    /**
     * Increases the global dot counter and release ghosts changes type when required
     * @returns {Void}
     */
    incGlobalDots() {
        this.globalDots += 1;

        this.inPen.forEach((ghost) => {
            if (this.globalDots === this.level.getPenDotsCount(ghost.id)) {
                if (ghost.id <= 2) {
                    this.releaseGhostFromPen();
                } else {
                    this.penType    = false;
                    this.globalDots = 0;
                }
            }
        });
    }

    /**
     * Increases the Pen Timer
     * @param {Number} time
     * @returns {Void}
     */
    increasePenTimer(time) {
        this.penTimer += time;
        if (this.inPen.length > 0 && this.penTimer >= this.level.penForceTime) {
            this.releaseGhostFromPen();
            this.penTimer = 0;
        }
    }

    /**
     * Resents the Pen Timer to cero, since the Blob ate a pill and checks the Dots counters
     * @returns {Void}
     */
    resetPenTimer() {
        this.penTimer = 0;
        this.incDotCounter();
    }

    /**
     * Releases the first Ghost in the vector from Pen
     * @returns {Void}
     */
    releaseGhostFromPen() {
        const ghost = this.inPen[0];
        ghost.setPath("exitPen");
        ghost.activateElroy();

        this.inPen = this.inPen.slice(1);
    }

    /**
     * Adds the given Ghost to Pen
     * @param {(Blinky|Pinky|Inky|Clyde)} ghost
     * @returns {Void}
     */
    addGhostToPen(ghost) {
        // Blinky never stays in the Pen
        if (ghost.id === 0) {
            ghost.setPath("exitPen");
        } else {
            let i = 0;
            while (i < this.inPen.length && this.inPen[i].id <= ghost.id) {
                i += 1;
            }
            this.inPen.splice(i, 0, ghost);
            ghost.setPath("inPen");

            if (!this.penType) {
                this.checkDotLimit();
            }
        }
    }
}
