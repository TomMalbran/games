import Data         from "./Data.js";



/**
 * Defender Score
 */
export default class Score {

    /**
     * Defender Score constructor
     * @param {Number}   level
     * @param {Function} onGameOver
     */
    constructor(level, onGameOver) {
        this.level      = Number(level) + 1;
        this.onGameOver = onGameOver;
        this.enable     = () => {};
        this.disable    = () => {};

        this.goldElem   = document.querySelector(".gold-score");
        this.livesElem  = document.querySelector(".lives-score");
        this.timeElem   = document.querySelector(".time-score");
        this.scoreElem  = document.querySelector(".score-score");
        this.finalElem  = document.querySelector(".final-score");

        this.gold       = Data.gold;
        this.lives      = Data.lives;
        this.timer      = Data.timer;
        this.score      = 0;
        this.bonus      = 0;
        this.seconds    = Data.seconds;

        this.showScores();
    }



    /**
     * Calls the on Game Over function
     * @returns {Void}
     */
    gameOver() {
        this.onGameOver();
    }

    /**
     * Sets the functions that are called when the gold is increased or decreased
     * @param {Function} enable
     * @param {Function} disable
     * @returns {Void}
     */
    setFunctions(enable, disable) {
        this.enable  = () => enable();
        this.disable = () => disable();
    }

    /**
     * Increases the Gold by the given amount
     * @param {Number} amount
     * @returns {Void}
     */
    incGold(amount) {
        this.gold += amount;
        this.showScores();
        this.enable();
    }

    /**
     * Decreases the Gold by the given amount
     * @param {Number} amount
     * @returns {Void}
     */
    decGold(amount) {
        this.gold -= amount;
        this.showScores();
        this.disable();
    }

    /**
     * Decreases one Life
     * @returns {Void}
     */
    decLives() {
        this.lives -= 1;
        this.showScores();

        if (this.lives <= 0) {
            this.lives = 0;
            this.onGameOver();
        }
    }



    /**
     * Starts the Timer for a new Wave
     * @returns {Void}
     */
    startTimer() {
        this.addBonus();
        this.timer = Data.timer;
        this.showScores();
    }

    /**
     * Decreases the Timer by the given amount
     * @param {Number} time
     * @returns {Boolean}
     */
    decTimer(time) {
        this.seconds -= time;
        if (this.seconds <= 0) {
            this.timer   -= 1;
            this.seconds += Data.seconds;
            this.showScores();
            return true;
        }
        return false;
    }

    /**
     * Removes the Timer for the last wave
     * @returns {Void}
     */
    removeTimer() {
        this.timer = 0;
        this.showScores();
    }

    /**
     * Increases the Score byt the given amount
     * @param {Number} amount
     * @returns {Void}
     */
    incScore(amount) {
        this.score += amount;
        this.showScores();
    }

    /**
     * Adds the bonus for calling a new wave before the time ended
     * @returns {Void}
     */
    addBonus() {
        this.bonus += this.timer;
    }

    /**
     * Returns the final Time Bonus for the Final Score
     * @returns {Number}
     */
    get timeBonus() {
        return this.bonus * (this.lives <= 0 ? 0 : 1);
    }

    /**
     * Returns the total Score for the Final Score
     * @returns {Number}
     */
    get total() {
        return (this.score + this.lives * Data.livesMult + this.timeBonus) * this.level;
    }



    /**
     * Sets the Scores
     * @returns {Void}
     */
    showScores() {
        this.goldElem.innerHTML  = `Gold:  ${this.gold}`;
        this.livesElem.innerHTML = `Lives: ${this.lives}`;
        this.timeElem.innerHTML  = `Time:  ${this.timer}`;
        this.scoreElem.innerHTML = `Score: ${this.score}`;
    }

    /**
     * Sets the Final Score
     * @returns {Void}
     */
    showFinal() {
        this.finalElem.innerHTML = `
            <dt>Score</dt>
            <dd>${this.score}</dd>
            <dt>${this.lives} lives x${Data.livesMult}</dt>
            <dd>${this.lives * Data.livesMult}</dd>
            <dt>+ Time Bonus</dt>
            <dd>${this.timeBonus}</dd>
            <dt>x Multiplier</dt>
            <dd>${this.level}</dd>
            <dt>Total Score</dt>
            <dd>${this.total}</dd>
        `;
    }
}
