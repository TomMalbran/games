/**
 * Defender Display
 */
export default class Display {

    /**
     * Defender Display constructor
     */
    constructor() {
        this.current   = "mainScreen";

        /** @type {HTMLElement} */
        this.container = document.querySelector("#container");
    }

    /**
     * Sets the current and changes the container class
     * @param {String} current
     * @returns {Void}
     */
    set(current) {
        this.current = current;
        this.show();
    }

    /**
     * Changes the current to the paused version and changes the container class
     * @returns {Void}
     */
    setPause() {
        this.current = `${this.current}Paused`;
        this.show();
    }

    /**
     * Changes the container class
     * @returns {Void}
     */
    show() {
        this.container.className = this.current;
    }



    /**
     * Returns true if the current is in the "playing" mode
     * @returns {Boolean}
     */
    get isPlaying() {
        return this.current === "playing";
    }

    /**
     * Returns true if the current is in the "planning" mode
     * @returns {Boolean}
     */
    get isPlanning() {
        return this.current === "planning";
    }

    /**
     * Returns true if the current is in the "planningPaused" mode
     * @returns {Boolean}
     */
     get isPlanningPaused() {
        return this.current === "planningPaused";
    }

    /**
     * Returns true if the current is in the "playingPaused" mode
     * @returns {Boolean}
     */
    get isPlayingPaused() {
        return this.current === "playingPaused";
    }
}
