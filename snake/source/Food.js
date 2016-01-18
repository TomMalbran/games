/**
 * Food Manager
 */
class Food {
    
    /**
     * Food Manager constructor
     * @param {Board} board
     * @param {?{top: number, left: number}} pos
     * @param {?number} top
     * @param {?number} left
     */
    constructor(board, pos, top, left) {
        this.board    = board;
        this.element  = document.querySelector(".food");
        this.body     = this.element.querySelector(".foodBody");
        this.shadow   = this.element.querySelector(".foodShadow");
        
        this.top      = top  || 0;
        this.left     = left || 0;
        this.foodTime = 1000;
        this.time     = this.foodTime;
        
        if (top) {
            this.setPosition();
        } else {
            this.add(pos);
        }
    }
    
    /**
     * Checks if the given position is the food position and it hides it when it is
     * @param {number} top
     * @param {number} left
     * @return {boolean} True when top and left are equal to the food position
     */
    eat(top, left) {
        if (top === this.top && left === this.left) {
            return true;
        }
        return false;
    }
    
    /**
     * Repositions the food and resets the values
     * @param {{top: number, left: number}} pos
     */
    add(pos) {
        this.time = this.foodTime;
        this.top  = pos.top;
        this.left = pos.left;
        
        this.setPosition();
    }
    
    /**
     * Reduces the time
     * @param {number} time
     */
    reduceTime(time) {
        if (this.time > 0) {
            this.time = Math.max(0, this.time - Math.round(time / 4));
            this.setTransform();
        }
    }
    
    /**
     * Places the food at a position
     */
    setPosition() {
        this.element.style.top  = this.board.getPosition(this.top);
        this.element.style.left = this.board.getPosition(this.left);
    }
    
    /**
     * Sets the transform to rotate the food
     */
    setTransform() {
        let time = (1000 - this.time) / 10, deg;
        if (time < 21) {
            deg = time * 360 / 20;
        } else if (time < 51) {
            deg = time * 720 / 50;
        } else {
            deg = time * 1080 / 99;
        }
        Utils.setTransform(this.body,   "rotate(" + deg + "deg)");
        Utils.setTransform(this.shadow, "rotate(" + deg + "deg)");
    }
    
    
    /**
     * Returns the position of the food
     * @return {{top: number, left: number}}
     */
    getPosition() {
        return { top : this.top, left : this.left };
    }
    
    /**
     * Returns the timer
     * @return {number}
     */
    getTimer() {
        return this.time > 0 ? Math.round(this.time / 10) : 0;
    }
}
