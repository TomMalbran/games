/**
 * Bounce Board
 */
export default class Board {

    /**
     * Bounce Board constructor
     * @param {Function} callback
     */
    constructor(callback) {
        /** @type {HTMLElement} */
        this.element = document.querySelector(".board");
        this.width   = this.element.offsetWidth;
        this.height  = this.element.offsetHeight;
        this.bounds  = this.element.getBoundingClientRect();
        this.border  = 1;

        this.element.addEventListener("click", () => callback());
    }



    /**
     * Add the event listeners
     * @param {Function} callback
     * @returns {Void}
     */
    start(callback) {
        this.func = callback;
        this.element.addEventListener("mousemove", (e) => this.func(e));
    }

    /**
     * Remove the event listeners
     * @returns {Void}
     */
    end() {
        this.element.removeEventListener("mousemove", (e) => this.func(e));
    }

    /**
     * Returns the left position of the board
     * @returns {Number}
     */
    get left() {
        return this.bounds.left;
    }
}
