/**
 * Bricks Manager
 */
class Bricks {

    /**
     * Bricks Manager constructor
     */
    constructor() {
        this.container   = document.querySelector(".bricks");
        this.elements    = [];
        this.horizBricks = 5;
        this.vertBricks  = 4;
        this.brickHeight = 2.5;
        this.brickWidth  = 4.6;
        this.bottom      = 0;

        this.create();
    }

    /**
     * Destroys the bricks
     */
    destroy() {
        this.removeContent();
    }


    /**
     * Creates the bricks
     */
    create() {
        for (let i = 0; i < this.vertBricks; i += 1) {
            for (let j = 0; j < this.horizBricks; j += 1) {
                this.createBrick(i, j);
            }
        }

        this.elements.reverse();
        this.bottom = this.elements[0].height * this.vertBricks;

        this.container.classList.add("fade");
        window.setTimeout(() => {
            this.container.classList.remove("fade");
        }, 1000);
    }

    /**
     * Creates a single brick
     * @param {number} row
     * @param {number} column
     */
    createBrick(row, column) {
        let data = { element : document.createElement("DIV") };

        data.element.style.top  = (this.brickHeight * row)    + "em";
        data.element.style.left = (this.brickWidth  * column) + "em";
        this.container.appendChild(data.element);

        data.top    = data.element.offsetTop;
        data.left   = data.element.offsetLeft;
        data.width  = data.element.offsetWidth;
        data.height = data.element.offsetHeight;

        this.elements.push(data);
    }


    /**
     * Check if the Ball crashed any brick and remove it when it did
     * @param {Ball} ball
     * @return {boolean} True if the ball crashed a brick
     */
    crash(ball) {
        if (ball.getPosition().top > this.bottom) {
            return false;
        }

        return this.elements.some((element, index) => {
            if (this.bottomCrash(ball, element)    ||
                    this.leftCrash(ball, element)  ||
                    this.rightCrash(ball, element) ||
                    this.topCrash(ball, element)) {
                this.remove(element, index);
                return true;
            }
            return false;
        });
    }

    /**
     * If the ball crashed the bottom part of the brick, change the ball direction
     * @param {Ball} ball
     * @param {{element: DOM, top: number, left: number}} brick
     * @return {boolean} True if the ball crashed the bottom part of the brick
     */
    bottomCrash(ball, brick) {
        let pos = ball.getPosition();
        if (this.isPointInElement(pos.top, pos.left + ball.getSize() / 2, brick)) {
            ball.setDirTop(1);
            return true;
        }
        return false;
    }

    /**
     * If the ball crashed the left part of the brick, change the ball direction
     * @param {Ball} ball
     * @param {{element: DOM, top: number, left: number}} brick
     * @return {boolean} True if the ball crashed the left part of the brick
     */
    leftCrash(ball, brick) {
        let pos  = ball.getPosition(),
            top  = pos.top  + ball.getSize() / 2,
            left = pos.left + ball.getSize();

        if (this.isPointInElement(top, left, brick)) {
            ball.setDirLeft(-1);
            return true;
        }
        return false;
    }

    /**
     * If the ball crashed the right part of the brick, change the ball direction
     * @param {Ball} ball
     * @param {{element: DOM, top: number, left: number}} brick
     * @return {boolean} True if the ball crashed the right part of the brick
     */
    rightCrash(ball, brick) {
        let pos = ball.getPosition();
        if (this.isPointInElement(pos.top + ball.getSize() / 2, pos.left, brick)) {
            ball.setDirLeft(-1);
            return true;
        }
        return false;
    }

    /**
     * If the ball crashed the top part of the brick, change the ball direction
     * @param {Ball} ball
     * @param {{element: DOM, top: number, left: number}} brick
     * @return {boolean} True if the ball crashed the top part of the brick
     */
    topCrash(ball, brick) {
        let pos  = ball.getPosition(),
            top  = pos.top  + ball.getSize(),
            left = pos.left + ball.getSize() / 2;

        if (this.isPointInElement(top, left, brick)) {
            ball.setDirTop(-1);
            return true;
        }
        return false;
    }

    /**
     * Destroys a Brick at the given index
     * @param {{element: DOM, top: number, left: number}} element
     * @param {number} index
     */
    remove(element, index) {
        this.elements.splice(index, 1);

        let el = element.element;
        el.style.borderWidth = "1.5em";

        window.setTimeout(() => {
            if (el) {
                Utils.removeElement(el);
            }
        }, 500);
    }


    /**
     * Recreate the bricks and reduce the ship width
     * @return {boolean}
     */
    restart() {
        if (this.elements.length === 0) {
            this.removeContent();
            this.create();
            return true;
        }
        return false;
    }

    /**
     * Destroys all the bricks
     */
    removeContent() {
        this.container.innerHTML = "";
    }


    /**
     * Check if the given position is inside the given element
     * @param {number} top
     * @param {number} left
     * @param {{element: DOM, top: number, left: number}} element
     * @return {boolean}
     */
    isPointInElement(top, left, element) {
        return (
            top  >= element.top  && top  <= element.top  + element.height &&
            left >= element.left && left <= element.left + element.width
        );
    }
}
