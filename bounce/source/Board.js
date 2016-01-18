/**
 * Board Manager
 */
class Board {
    
    /**
     * Board Manager constructor
     * @param {function} callback
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
     * @param {function} mouseCB
     */
    start(mouseCB) {
        this.func = mouseCB;
        this.element.addEventListener("mousemove", this.func);
    }
    
    /**
     * Remove the event listeners
     */
    end() {
        this.element.removeEventListener("mousemove", this.func);
    }
    
    
    /**
     * Returns the width of the board
     * @return {number}
     */
    getWidth() {
        return this.width;
    }
    
    /**
     * Returns the width of the board
     * @return {number}
     */
    getHeight() {
        return this.height;
    }
    
    /**
     * Returns the left position of the board
     * @return {number}
     */
    getLeft() {
        return this.position.left;
    }
    
    /**
     * Returns the boarder width
     * @return {number}
     */
    getBorder() {
        return this.border;
    }
}
