/**
 * Tail Manager
 */
class Tail {

    /**
     * Tail Manager constructor
     */
    constructor() {
        this.amount      = 15;
        this.minDistance = 8;
        this.elements    = [];
        this.container   = document.querySelector(".tail");
        this.container.innerHTML = "";

        for (let i = 0; i < this.amount; i += 1) {
            let div = document.createElement("DIV");
            this.container.appendChild(div);

            this.elements.push({
                element : div,
                top     : 0,
                left    : 0
            });
        }
    }

    /**
     * Sets the initial positions of the tails elements
     * @param {Ball} ball
     */
    start(ball) {
        let pos = ball.getPosition();
        this.elements.forEach((data) => {
            data.top  = pos.top;
            data.left = pos.left;
        });
        this.setPosition();
    }

    /**
     * Move the tail
     * @param {Ball} ball
     */
    move(ball) {
        let oldTop, oldLeft,
            first = this.elements[0],
            pos   = ball.getPosition(),
            top   = pos.top,
            left  = pos.left;

        if (Math.abs(top - first.top) < this.minDistance ||
                Math.abs(left - first.left) < this.minDistance) {
            return;
        }
        this.elements.forEach((data) => {
            oldTop  = data.top;
            oldLeft = data.left;

            data.top  = top;
            data.left = left;

            top  = oldTop;
            left = oldLeft;
        });
        this.setPosition();
    }

    /**
     * Sets the position of each element
     */
    setPosition() {
        this.elements.forEach((data) => {
            data.element.style.top  = data.top  + "px";
            data.element.style.left = data.left + "px";
        });
    }
}
