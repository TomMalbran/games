/**
 * Bounce Mode
 */
export default class Mode {

    /**
     * Bounce Mode constructor
     */
    constructor() {
        this.mode            = "speed";
        this.shipNormalWidth = 5;
        this.shipBricksWidth = 12;
    }



    /**
     * Gets the Game Mode
     * @returns {String}
     */
    get() {
        return this.mode;
    }

    /**
     * Sets the Game Mode
     * @param {String} mode
     * @returns {Void}
     */
    set(mode) {
        this.mode = mode;
    }



    /**
     * Returns true if the mode is Speed
     * @returns {Boolean}
     */
    get isSpeedMode() {
        return this.mode === "speed";
    }

    /**
     * Returns true if the mode is Random
     * @returns {Boolean}
     */
    get isRandomMode() {
        return this.mode === "random";
    }

    /**
     * Returns true if the mode is Bricks
     * @returns {Boolean}
     */
    get isBricksMode() {
        return this.mode === "bricks";
    }

    /**
     * Returns the width of the ship depending on the mode
     * @returns {Number}
     */
    get shipWidth() {
        return this.isBricksMode ? this.shipBricksWidth : this.shipNormalWidth;
    }
}
