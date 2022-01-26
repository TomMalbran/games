import Ball         from "./Ball.js";



/**
 * Bounce Brick
 */
export default class Brick {

    /**
     * Bounce Brick constructor
     * @param {HTMLElement} element
     */
    constructor(element) {
        this.element = element;
        this.top     = element.offsetTop;
        this.left    = element.offsetLeft;
        this.width   = element.offsetWidth;
        this.height  = element.offsetHeight;
    }

    /**
     * Returns true if the ball crashed the brick
     * @param {Ball} ball
     * @returns {Boolean}
     */
    didCrash(ball) {
        return (
            this.bottomCrash(ball) ||
            this.leftCrash(ball)   ||
            this.rightCrash(ball)  ||
            this.topCrash(ball)
        );
    }

    /**
     * Returns if the ball crashed the bottom part of the brick
     * @param {Ball} ball
     * @returns {Boolean}
     */
    bottomCrash(ball) {
        const pos = ball.pos;
        if (this.isPointInside(pos.top, pos.left + ball.size / 2)) {
            ball.setDirTop(1);
            return true;
        }
        return false;
    }

    /**
     * Returns if the ball crashed the left part of the brick
     * @param {Ball} ball
     * @returns {Boolean}
     */
    leftCrash(ball) {
        const pos  = ball.pos;
        const top  = pos.top  + ball.size / 2;
        const left = pos.left + ball.size;

        if (this.isPointInside(top, left)) {
            ball.setDirLeft(-1);
            return true;
        }
        return false;
    }

    /**
     * Returns if the ball crashed the right part of the brick
     * @param {Ball} ball
     * @returns {Boolean}
     */
    rightCrash(ball) {
        const pos = ball.pos;
        if (this.isPointInside(pos.top + ball.size / 2, pos.left)) {
            ball.setDirLeft(-1);
            return true;
        }
        return false;
    }

    /**
     * Returns if the ball crashed the top part of the brick
     * @param {Ball} ball
     * @returns {Boolean}
     */
    topCrash(ball) {
        const pos  = ball.pos;
        const top  = pos.top  + ball.size;
        const left = pos.left + ball.size / 2;

        if (this.isPointInside(top, left)) {
            ball.setDirTop(-1);
            return true;
        }
        return false;
    }

    /**
     * Check if the given position is inside the given element
     * @param {Number} top
     * @param {Number} left
     * @returns {Boolean}
     */
    isPointInside(top, left) {
        return (
            top  >= this.top  && top  <= this.top  + this.height &&
            left >= this.left && left <= this.left + this.width
        );
    }
}
