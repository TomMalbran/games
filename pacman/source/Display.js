/**
 * Pacman Display
 */
export default class Display {

    /**
     * Pacman Display constructor
     * @param {Function} callback
     */
    constructor(callback) {
        this.container = document.querySelector("#container");
        this.current   = "mainScreen";
        this.callback  = callback;
    }

    /**
     * Sets the Game Display
     * @param {String} current
     * @returns {Display}
     */
    set(current) {
        this.current = current;
        return this;
    }



    /**
     * Adds the class to the design to show the Display
     * @returns {Void}
     */
    show() {
        this.container.className = this.current;
        this.callback();
    }

    /**
     * Returns true if the game is in the main screen
     * @returns {Boolean}
     */
    get isMainScreen() {
        return this.current === "mainScreen";
    }

    /**
     * Returns true if the game is in a playing mode
     * @returns {Boolean}
     */
    get isPlaying() {
        return [ "ready", "playing", "paused" ].includes(this.current);
    }

    /**
     * Returns true if the game is paused
     * @returns {Boolean}
     */
    get isPaused() {
        return this.current === "paused";
    }
}
