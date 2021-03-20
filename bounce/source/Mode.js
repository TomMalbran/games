/**
 * The Game Mode
 */
class Mode {

    /**
     * The Game Mode consructor
     */
    constructor() {
        this.mode = "speed";
        this.shipNormalWidth = 5;
        this.shipBricksWidth = 12;
    }

    /**
     * Gets the Game Mode
     * @return {string}
     */
    get() {
        return this.mode;
    }

    /**
     * Sets the Game Mode
     * @param {string} mode
     */
    set(mode) {
        this.mode = mode;
    }


    /**
     * Returns true if the mode is Speed
     * @return {boolean}
     */
    isSpeedMode() {
        return this.mode === "speed";
    }

    /**
     * Returns true if the mode is Random
     * @return {boolean}
     */
    isRandomMode() {
        return this.mode === "random";
    }

    /**
     * Returns true if the mode is Bricks
     * @return {boolean}
     */
    isBricksMode() {
        return this.mode === "bricks";
    }


    /**
     * Returns the width of the ship depending on the mode
     * @return {number}
     */
    getShipWidth() {
        return this.isBricksMode() ? this.shipBricksWidth : this.shipNormalWidth;
    }
}
