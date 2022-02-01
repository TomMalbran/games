import Instance     from "./Instance.js";

// Utils
import Utils        from "../../utils/Utils.js";



/**
 * Spider Score
 */
export default class Score {

    /**
     * The Score constructor
     * @param {Instance} instance
     * @param {Number}   suits
     */
    constructor(instance, suits) {
        this.instance        = instance;
        this.foundationScore = 260 * (Math.min(suits, 3) + 1);
        this.hintScore       = 50  * Math.min(suits, 3);

        /** @type {HTMLElement} */
        this.scoreElem       = document.querySelector(".score");

        /** @type {HTMLElement} */
        this.movesElem       = document.querySelector(".moves");

        /** @type {HTMLElement} */
        this.timerElem       = document.querySelector(".timer");
    }

    /**
     * Resets the Score
     * @returns {Void}
     */
    reset() {
        this.score = 0;
        this.moves = 0;
        this.time  = 0;

        this.drawScore();
        this.drawMoves();
        this.drawTime();
    }

    /**
     * Restores the Scores
     * @param {Number} score
     * @param {Number} moves
     * @param {Number} time
     * @returns {Void}
     */
    restore(score, moves, time) {
        this.score = score;
        this.moves = moves;
        this.time  = time;

        this.drawScore();
        this.drawMoves();
        this.drawTime();
    }

    /**
     * Starts the Timer
     * @returns {Void}
     */
    startTimer() {
        this.interval = window.setInterval(() => {
            this.time += 1;
            this.instance.saveTime(this.time);
            this.drawTime();
            this.updateScore(-1);
        }, 1000);
    }

    /**
     * Stops the Timer
     * @returns {Void}
     */
    stopTimer() {
        window.clearInterval(this.interval);
    }

    /**
     * Increases the Moves
     * @returns {Void}
     */
    incMoves() {
        this.moves += 1;
        this.instance.saveMoves(this.moves);
        this.drawMoves();
    }

    /**
     * Updates the Score by the given amount
     * @param {Number} score
     * @returns {Void}
     */
    updateScore(score) {
        this.score += score;
        this.instance.saveScore(this.score);
        this.drawScore();
    }



    /**
     * Adds the bonus Score
     * @returns {Void}
     */
    addBonus() {
        this.updateScore(Math.round(this.score / 4) + (600 - this.time) * 25);
    }

    /**
     * Adds the flip card Score
     * @returns {Void}
     */
    addFilp() {
        this.updateScore(150);
    }

    /**
     * Substracts the flip card Score
     * @returns {Void}
     */
    subTurn() {
        this.updateScore(-150);
    }

    /**
     * Adds the foundation Score
     * @returns {Void}
     */
    addFoundation() {
        this.updateScore(this.foundationScore);
    }

    /**
     * Substracts the foundation Score
     * @returns {Void}
     */
    subFoundation() {
        this.updateScore(-this.foundationScore);
    }

    /**
     * Adds the undo Score
     * @returns {Void}
     */
    addUndo() {
        this.updateScore(100);
    }

    /**
     * Substracts the undo Score
     * @returns {Void}
     */
    subUndo() {
        this.updateScore(-100);
    }

    /**
     * Substracts the hint Score
     * @returns {Void}
     */
    subHint() {
        this.updateScore(-this.hintScore);
    }



    /**
     * Draws the Score value
     * @returns {Void}
     */
    drawScore() {
        this.scoreElem.innerText = String(this.score);
    }

    /**
     * Draws the Movement value
     * @returns {Void}
     */
    drawMoves() {
        this.movesElem.innerText = String(this.moves);
    }

    /**
     * Draws the time
     * @returns {Void}
     */
    drawTime() {
        const parts = Utils.parseTime(this.time);
        this.timerElem.innerHTML = parts.join("<span>:</span>");
    }
}
