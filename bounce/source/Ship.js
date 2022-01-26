import Board        from "./Board.js";

// Utils
import Utils        from "../../utils/Utils.js";



/**
 * Bounce Ship
 */
export default class Ship {

    /**
     * Bounce Ship constructor
     * @param {Board}    board
     * @param {Number}   shipWidth
     * @param {Function} onMove
     */
    constructor(board, shipWidth, onMove) {
        this.board          = board;
        this.emWidth        = shipWidth;
        this.onMove         = onMove;
        this.minWidth       = 3;
        this.extraWidth     = 1;
        this.decreaseAmount = 1;
        this.keyMovement    = 10;

        /** @type {HTMLElement} */
        this.element        = document.querySelector(".ship");

        this.setWidth();

        this.top            = this.board.height - this.element.offsetHeight - 5;
        this.left           = (this.board.width - this.width) / 2;

        Utils.setPosition(this.element, this.top, this.left);
    }



    /**
     * Set the width property of the element
     * @returns {Void}
     */
    setWidth() {
        this.element.style.width = Utils.toEM(this.emWidth);
        this.actualWidth = this.element.offsetWidth;
    }

    /**
     * Set the top property of the element
     * @param {Number=} top
     * @returns {Void}
     */
    setTop(top) {
        this.element.style.top = Utils.toPX(top || this.top);
    }

    /**
     * Set the left property of the element
     * @returns {Void}
     */
    setLeft() {
        this.element.style.left = Utils.toPX(this.left);
    }

    /**
     * Move the Ship using the mouse
     * @param {MouseEvent} event
     * @returns {Void}
     */
    mouseMove(event) {
        const mouseLeft  = Utils.getMousePos(event).left;
        const halfWidth  = this.width / 2;
        const boardLeft  = this.board.left - this.board.border;
        const boardRight = this.board.left + this.board.width + this.board.border;
        const leftSide   = this.board.left + halfWidth;
        const rightSide  = this.board.left + this.board.width - halfWidth;
        let   shipLeft   = 0;

        if (mouseLeft < boardLeft || mouseLeft > boardRight) {
            return;
        }
        if (mouseLeft >= leftSide && mouseLeft <= rightSide) {
            shipLeft = mouseLeft - this.board.left - halfWidth;
        } else if (mouseLeft > rightSide) {
            shipLeft = rightSide - this.board.left - halfWidth;
        }
        this.doMove(shipLeft);
    }

    /**
     * Move the Ship using the keyboard
     * @param {Number} direction
     * @returns {Void}
     */
    keyMove(direction) {
        const maxim = this.board.width - this.width;
        let   left  = this.left + this.keyMovement * direction;

        left = Utils.clamp(left, 0, maxim);
        this.doMove(left);
    }

    /**
     * Move the Ship
     * @param {Number} left
     * @returns {Void}
     */
    doMove(left) {
        if (left !== this.left) {
            this.left = left;
            this.setLeft();
            this.onMove();
        }
    }

    /**
     * Change the Style when the ball crashes the ship
     * @returns {Void}
     */
    ballCrash() {
        this.setTop(this.top + 2);
        window.setTimeout(() => this.setTop(), 100);
    }

    /**
     * Reduce the width of the ship
     * @returns {Void}
     */
    reduceWidth() {
        if (this.emWidth > this.minWidth) {
            this.emWidth -= this.decreaseAmount;
            this.left    -= this.decreaseAmount / 2;

            this.setWidth();
            this.setLeft();
        }
    }



    /**
     * Returns the position of the Ship
     * @returns {{top: Number, left: Number}}
     */
    get pos() {
        return {
            top  : this.top,
            left : this.left - this.extraWidth / 2,
        };
    }

    /**
     * Returns the width of the Ship
     * @returns {Number}
     */
    get width() {
        return this.actualWidth + this.extraWidth;
    }
}
