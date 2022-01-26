import Utils        from "../../utils/Utils.js";


/**
 * Tetris Score
 */
export default class Score {

    /**
     * Tetris Score constructor
     * @param {Number} level
     * @param {Number} maxInitialLevel
     */
    constructor(level, maxInitialLevel) {
        this.multipliers     = [ 40, 100, 300, 1200 ];
        this.timeInterval    = 50;
        this.linesPerLevel   = 10;
        this.maxInitialLevel = maxInitialLevel;

        this.levelElem = document.querySelector(".level .content");
        this.scoreElem = document.querySelector(".score .content");
        this.linesElem = document.querySelector(".lines .content");

        this.level    = level;
        this.score    = 0;
        this.lines    = 0;
        this.amount   = 0;
        this.timer    = this.calculateTimer();
        this.time     = this.timer;

        this.showLevel();
        this.showScore();
        this.showLines();
    }



    /**
     * Decreases the time by the given amount
     * @param {Number} time
     * @returns {Void}
     */
    decTime(time) {
        this.time -= time;
    }

    /**
     * Resets the time to the timer amount
     * @returns {Void}
     */
    resetTime() {
        this.time = this.timer;
    }



    /**
     * Adds the score for a new Piece that dropped
     * @param {Number} drop - Amount of cells the Tetrimino dropped before crashing the bottom
     * @returns {Void}
     */
    piece(drop) {
        this.score += 21 + (3 * this.level) - drop;
        this.showScore();
    }

    /**
     * Adds the score for a new Line
     * @param {Number} amount - Amount of lines completed in one move
     * @returns {Void}
     */
    line(amount) {
        this.addScore(amount);
        this.addLine(amount);
        this.addLevel(amount);
    }

    /**
     * Increases the score
     * @param {Number} amount - Amount of lines completed in one move
     * @returns {Void}
     */
    addScore(amount) {
        this.score += this.level * this.multipliers[amount - 1];
        this.showScore();
    }

    /**
     * Increases the lines
     * @param {Number} amount - Amount of lines completed in one move
     * @returns {Void}
     */
    addLine(amount) {
        this.lines += amount;
        this.showLines();
    }

    /**
     * Increases the level
     * @param {Number} amount - Amount of lines completed in one move
     * @returns {Void}
     */
    addLevel(amount) {
        this.amount += amount;
        if (this.amount >= this.linesPerLevel) {
            this.amount -= this.linesPerLevel;
            this.timer   = this.calculateTimer();
            this.level  += 1;
            this.showLevel();
        }
    }



    /**
     * Displays the level in the Game
     * @returns {Void}
     */
    showLevel() {
        this.levelElem.innerHTML = String(this.level);
    }

    /**
     * Displays the score in the Game
     * @returns {Void}
     */
    showScore() {
        this.scoreElem.innerHTML = Utils.formatNumber(this.score, ",");
    }

    /**
     * Displays the lines in the Game
     * @returns {Void}
     */
    showLines() {
        this.linesElem.innerHTML = String(this.lines);
    }



    /**
     * Calculates the time used between each soft drop
     * @returns {Number}
     */
    calculateTimer() {
        if (this.level < this.maxInitialLevel) {
            return (this.maxInitialLevel - this.level + 1) * this.timeInterval;
        }
        return this.timeInterval;
    }
}
