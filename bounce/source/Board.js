/**
 * Board Manager
 */
class Board {

    /**
     * Board Manager constructor
     * @param {Function} callback
     */
    constructor(callback) {
        this.element  = document.querySelector(".board");
        this.width    = this.element.offsetWidth;
        this.height   = this.element.offsetHeight;
        this.position = Utils.getPosition(this.element);
        this.border   = 1;

        this.element.addEventListener("click", callback);
    }


    /**
     * Add the event listeners
     * @param {Function} mouseCB
     * @returns {Void}
     */
    start(mouseCB) {
        this.func = mouseCB;
        this.element.addEventListener("mousemove", this.func);
    }

    /**
     * Remove the event listeners
     * @returns {Void}
     */
    end() {
        this.element.removeEventListener("mousemove", this.func);
    }


    /**
     * Returns the width of the board
     * @returns {Number}
     */
    getWidth() {
        return this.width;
    }

    /**
     * Returns the width of the board
     * @returns {Number}
     */
    getHeight() {
        return this.height;
    }

    /**
     * Returns the left position of the board
     * @returns {Number}
     */
    getLeft() {
        return this.position.left;
    }

    /**
     * Returns the boarder width
     * @returns {Number}
     */
    getBorder() {
        return this.border;
    }
}
