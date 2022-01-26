import Utils        from "../../utils/Utils.js";



/**
 * Tetris Level
 */
export default class Level {

    /**
     * Tetris Level constructor
     * @param {Number} maxLevels
     */
    constructor(maxLevels) {
        this.levelerElem = document.querySelector(".leveler");
        this.maxLevels   = maxLevels;
        this.level       = 1;
    }



    /**
     * Returns the initial level
     * @returns {Number}
     */
    get() {
        return this.level;
    }

    /**
     * Increases the initial level
     * @returns {Void}
     */
    inc() {
        Utils.unselect();
        if (this.level < this.maxLevels) {
            this.level += 1;
            this.show();
        }
    }

    /**
     * Decreases the initial level
     * @returns {Void}
     */
    dec() {
        Utils.unselect();
        if (this.level > 1) {
            this.level -= 1;
            this.show();
        }
    }

    /**
     * Sets the initial level
     * @param {Number} level
     * @returns {Void}
     */
    choose(level) {
        if (level > 0 && level <= this.maxLevels) {
            this.level = level;
            this.show();
        }
    }



    /**
     * Sets the initial level
     * @returns {Void}
     */
    show() {
        this.levelerElem.innerHTML = String(this.level);
    }
}
