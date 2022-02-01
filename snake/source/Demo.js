import Board        from "./Board.js"

// Utils
import Utils        from "../../utils/Utils.js";



/**
 * Snake Demo
 */
export default class Demo {

    /**
     * Snake Demo constructor
     * @param {Board} board
     */
    constructor(board) {
        this.board        = board;
        this.elements     = [];
        this.pointer      = -2;
        this.rows         = 5;
        this.initialParts = 3;

        /** @type {HTMLElement} */
        this.container    = document.querySelector(".demo");
        this.width        = this.container.offsetWidth;

        for (let i = 0; i < this.rows; i += 1) {
            this.createElement(i, 0, this.rows - i - 1);
            this.createElement(i, 2, this.rows + i + 1);
        }
        this.createElement(0, 1, this.rows);
    }

    /**
     * Create each snake link element
     * @param {Number} top
     * @param {Number} left
     * @param {Number} pos
     * @returns {Void}
     */
    createElement(top, left, pos) {
        const element = this.board.createSnakeElement();
        element.style.top     = this.board.getPosition(top  + 1);
        element.style.left    = this.board.getPosition(left + 1);
        element.style.display = "none";
        this.container.appendChild(element);

        this.elements[pos] = element;
    }



    /**
     * Start the demo
     * @param {Number} level
     * @returns {Void}
     */
    start(level) {
        this.pointer = -this.initialParts;
        this.container.className = `demo demo${level}`;
    }

    /**
     * End the demo
     * @returns {Void}
     */
    end() {
        for (let i = this.pointer; i < this.pointer + this.initialParts; i += 1) {
            if (i >= 0 && i < this.elements.length) {
                this.elements[i].style.display = "none";
            }
        }
    }



    /**
     * Move the Snake
     * @returns {Void}
     */
    move() {
        if (this.pointer >= 0) {
            this.elements[this.pointer].style.display = "none";
        }
        if (this.pointer + this.initialParts < this.elements.length) {
            this.elements[this.pointer + this.initialParts].style.display = "block";
        }

        this.pointer += 1;
        if (this.pointer >= this.elements.length) {
            this.pointer = -this.initialParts;
        }
    }
}
