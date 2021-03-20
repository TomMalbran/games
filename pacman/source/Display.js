/**
 * The Game Display
 */
class Display {

    /**
     * The Game Display constructor
     * @param {Function} callback
     */
    constructor(callback) {
        this.container = document.querySelector("#container");
        this.display   = "mainScreen";
        this.callback  = callback;
    }

    /**
     * Gets the Game Display
     * @returns {String}
     */
    get() {
        return this.display;
    }

    /**
     * Sets the Game Display
     * @param {String} display
     * @returns {Display}
     */
    set(display) {
        this.display = display;
        return this;
    }



    /**
     * Adds the class to the design to show the Display
     * @returns {Void}
     */
    show() {
        this.container.className = this.display;
        this.callback();
    }

    /**
     * Returns true if the game is in the main screen
     * @returns {Boolean}
     */
    isMainScreen() {
        return this.display === "mainScreen";
    }

    /**
     * Returns true if the game is in a playing mode
     * @returns {Boolean}
     */
    isPlaying() {
        return [ "ready", "playing", "paused" ].includes(this.display);
    }

    /**
     * Returns true if the game is paused
     * @returns {Boolean}
     */
    isPaused() {
        return this.display === "paused";
    }
}
