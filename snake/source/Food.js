import Board        from "./Board.js";

// Utils
import Utils        from "../../utils/Utils.js";



/**
 * Snake Food
 */
export default class Food {

    /**
     * Snake Food constructor
     * @param {Board}                        board
     * @param {{top: Number, left: Number}=} pos
     * @param {Number=}                      top
     * @param {Number=}                      left
     */
    constructor(board, pos, top, left) {
        this.board    = board;
        this.top      = top  || 0;
        this.left     = left || 0;
        this.foodTime = 1000;
        this.time     = this.foodTime;

        /** @type {HTMLElement} */
        this.element  = document.querySelector(".food");

        /** @type {HTMLElement} */
        this.body     = this.element.querySelector(".foodBody");

        /** @type {HTMLElement} */
        this.shadow   = this.element.querySelector(".foodShadow");

        if (top) {
            this.setPosition();
        } else {
            this.add(pos);
        }
    }



    /**
     * Checks if the given position is the food position and it hides it when it is
     * @param {Number} top
     * @param {Number} left
     * @returns {Boolean} True when top and left are equal to the food position
     */
    eat(top, left) {
        if (top === this.top && left === this.left) {
            return true;
        }
        return false;
    }

    /**
     * Repositions the food and resets the values
     * @param {{top: Number, left: Number}} pos
     * @returns {Void}
     */
    add(pos) {
        this.time = this.foodTime;
        this.top  = pos.top;
        this.left = pos.left;

        this.setPosition();
    }

    /**
     * Reduces the time
     * @param {Number} time
     * @returns {Void}
     */
    reduceTime(time) {
        if (this.time > 0) {
            this.time = Math.max(0, this.time - Math.round(time / 4));
            this.setTransform();
        }
    }

    /**
     * Places the food at a position
     * @returns {Void}
     */
    setPosition() {
        this.element.style.top  = this.board.getPosition(this.top);
        this.element.style.left = this.board.getPosition(this.left);
    }

    /**
     * Sets the transform to rotate the food
     * @returns {Void}
     */
    setTransform() {
        const time = (1000 - this.time) / 10;
        let   deg  = 0;
        if (time < 21) {
            deg = time * 360 / 20;
        } else if (time < 51) {
            deg = time * 720 / 50;
        } else {
            deg = time * 1080 / 99;
        }
        this.body.style.transform   = Utils.rotate(deg);
        this.shadow.style.transform = Utils.rotate(deg);
    }



    /**
     * Returns the position of the food
     * @returns {{top: Number, left: Number}}
     */
    get pos() {
        return { top : this.top, left : this.left };
    }

    /**
     * Returns the timer
     * @returns {Number}
     */
    get timer() {
        return this.time > 0 ? Math.round(this.time / 10) : 0;
    }
}
