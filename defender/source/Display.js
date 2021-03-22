/**
 * The Display Class
 */
class Display {

    /**
     * The Display constructor
     */
    constructor() {
        this.container = document.querySelector("#container");
        this.display   = "mainScreen";
    }



    /**
     * Returns the display
     * @returns {String}
     */
    get() {
        return this.display;
    }

    /**
     * Sets the display and changes the container class
     * @param {String} display
     * @returns {Void}
     */
    set(display) {
        this.display = display;
        this.show();
    }

    /**
     * Changes the display to the paused version and changes the container class
     * @returns {Void}
     */
    setPause() {
        this.display = `${this.display}Paused`;
        this.show();
    }

    /**
     * Changes the container class
     * @returns {Void}
     */
    show() {
        this.container.className = this.display;
    }



    /**
     * Returns true if the display is in the "playing" mode
     * @returns {Boolean}
     */
    get isPlaying() {
        return this.display === "playing";
    }

    /**
     * Returns true if the display is in the "planning" mode
     * @returns {Boolean}
     */
    get isPlanning() {
        return this.display === "planning";
    }

    /**
     * Returns true if the display is in the "planningPaused" mode
     * @returns {Boolean}
     */
     get isPlanningPaused() {
        return this.display === "planningPaused";
    }

    /**
     * Returns true if the display is in the "playingPaused" mode
     * @returns {Boolean}
     */
    get isPlayingPaused() {
        return this.display === "playingPaused";
    }
}
