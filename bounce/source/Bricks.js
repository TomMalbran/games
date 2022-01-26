import Ball         from "./Ball.js";
import Brick        from "./Brick.js";

// Utils
import Utils        from "../../utils/Utils.js";



/**
 * Bounce Bricks
 */
export default class Bricks {

    /**
     * Bounce Bricks constructor
     */
    constructor() {
        this.container   = document.querySelector(".bricks");
        this.bricks      = [];
        this.horizBricks = 5;
        this.vertBricks  = 4;
        this.brickHeight = 2.5;
        this.brickWidth  = 4.6;
        this.bottom      = 0;

        this.create();
    }

    /**
     * Destroys the bricks
     * @returns {Void}
     */
    destroy() {
        this.removeContent();
    }



    /**
     * Creates the bricks
     * @returns {Void}
     */
    create() {
        for (let i = 0; i < this.vertBricks; i += 1) {
            for (let j = 0; j < this.horizBricks; j += 1) {
                this.createBrick(i, j);
            }
        }

        this.bricks.reverse();
        this.bottom = this.bricks[0].height * this.vertBricks;

        this.container.classList.add("fade");
        window.setTimeout(() => {
            this.container.classList.remove("fade");
        }, 1000);
    }

    /**
     * Creates a single brick
     * @param {Number} row
     * @param {Number} column
     * @returns {Void}
     */
    createBrick(row, column) {
        const element = document.createElement("DIV");

        element.style.top  = Utils.toEM(this.brickHeight * row);
        element.style.left = Utils.toEM(this.brickWidth  * column);
        this.container.appendChild(element);
        this.bricks.push(new Brick(element));
    }



    /**
     * Check if the Ball crashed any brick and remove it when it did
     * @param {Ball} ball
     * @returns {Boolean} True if the ball crashed a brick
     */
    crash(ball) {
        if (ball.pos.top > this.bottom) {
            return false;
        }
        return this.bricks.some((brick, index) => {
            if (brick.didCrash(ball)) {
                this.remove(brick, index);
                return true;
            }
            return false;
        });
    }

    /**
     * Destroys a Brick at the given index
     * @param {Brick}  brick
     * @param {Number} index
     * @returns {Void}
     */
    remove(brick, index) {
        this.bricks.splice(index, 1);

        const el = brick.element;
        el.style.borderWidth = "1.5em";

        window.setTimeout(() => {
            if (el) {
                Utils.removeElement(el);
            }
        }, 500);
    }



    /**
     * Recreate the bricks and reduce the ship width
     * @returns {Boolean}
     */
    restart() {
        if (this.bricks.length === 0) {
            this.removeContent();
            this.create();
            return true;
        }
        return false;
    }

    /**
     * Destroys all the bricks
     * @returns {Void}
     */
    removeContent() {
        this.container.innerHTML = "";
    }
}
