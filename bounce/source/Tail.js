import Ball         from "./Ball.js";

// Utils
import Utils        from "../../utils/Utils.js";



/**
 * Bounce Tail
 */
export default class Tail {

    /**
     * Bounce Tail constructor
     */
    constructor() {
        this.amount      = 15;
        this.minDistance = 8;
        this.elements    = [];
        this.container   = document.querySelector(".tail");
        this.container.innerHTML = "";

        for (let i = 0; i < this.amount; i += 1) {
            const div = document.createElement("DIV");
            this.container.appendChild(div);

            this.elements.push({
                element : div,
                top     : 0,
                left    : 0,
            });
        }
    }



    /**
     * Sets the initial positions of the tails elements
     * @param {Ball} ball
     * @returns {Void}
     */
    start(ball) {
        const pos = ball.pos;
        this.elements.forEach((data) => {
            data.top  = pos.top;
            data.left = pos.left;
        });
        this.setPosition();
    }

    /**
     * Move the tail
     * @param {Ball} ball
     * @returns {Void}
     */
    move(ball) {
        const first = this.elements[0];
        const pos   = ball.pos;
        let   top   = pos.top;
        let   left  = pos.left;

        if (Math.abs(top - first.top) < this.minDistance ||
                Math.abs(left - first.left) < this.minDistance) {
            return;
        }
        this.elements.forEach((data) => {
            const oldTop  = data.top;
            const oldLeft = data.left;

            data.top  = top;
            data.left = left;

            top  = oldTop;
            left = oldLeft;
        });
        this.setPosition();
    }

    /**
     * Sets the position of each element
     * @returns {Void}
     */
    setPosition() {
        this.elements.forEach((data) => {
            data.element.style.top  = Utils.toPX(data.top);
            data.element.style.left = Utils.toPX(data.left);
        });
    }
}
