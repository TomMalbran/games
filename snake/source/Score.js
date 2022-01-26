import Display      from "./Display.js";

// Utils
import Utils        from "../../utils/Utils.js";



/**
 * Snake Score
 */
export default class Score {

    /**
     * Snake Score constructor
     * @param {Display} display
     */
    constructor(display) {
        this.levelNames   = [ "Easy", "Medium", "Hard", "Super" ];
        this.speedTimes   = [ 300, 200, 100, 50 ];
        this.countTime    = 500;
        this.initialCount = 4;

        this.display = display;
        this.scorer  = document.querySelector(".score");
        this.timer   = document.querySelector(".time");
        this.leveler = document.querySelector(".level");

        this.count  = 0;
        this.level  = 1;
        this.score  = 0;
        this.time   = 0;
    }



    /**
     * Sets the game level and score
     * @param {Number}  level
     * @param {Number=} score
     * @returns {Score}
     */
    set(level, score) {
        this.count = this.initialCount;
        this.level = level;
        this.score = score || 0;
        this.resetTime();
        return this;
    }

    /**
     * Shows all the things
     * @returns {Void}
     */
    show() {
        this.showLevel();
        this.showScore();
        this.showFoodTimer();
    }

    /**
     * Shows the current level in the game view
     * @returns {Void}
     */
    showLevel() {
        this.leveler.innerHTML = `Level: ${this.levelNames[this.level - 1]}`;
    }

    /**
     * Shows the score
     * @returns {Void}
     */
    showScore() {
        this.scorer.innerHTML = `Score: ${Utils.formatNumber(this.score, ",")}`;
    }

    /**
     * Shows the food timer
     * @param {(String|Number)=} time
     * @returns {Void}
     */
    showFoodTimer(time) {
        this.timer.innerHTML = time ? String(time) : "";
    }



    /**
     * Decreases the Count by 1
     * @returns {Void}
     */
    decCount() {
        this.count -= 1;
    }

    /**
     * Increases the Score
     * @param {Number} score
     * @returns {Void}
     */
    incScore(score) {
        this.score += score;
        this.showScore();
    }

    /**
     * Decreases the timer by the given amount
     * @param {Number} time
     * @returns {Void}
     */
    decTime(time) {
        this.time -= time;
    }

    /**
     * Resets the timer
     * @returns {Void}
     */
    resetTime() {
        if (this.display.isStarting) {
            this.time = this.countTime;
        } else {
            this.time = this.speedTimes[this.level - 1];
        }
    }
}
