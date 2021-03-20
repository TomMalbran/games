/**
 * Snake Manager
 */
class Snake {

    /**
     * Snake Manager constructor
     * @param {Board}   board
     * @param {Matrix}  matrix
     * @param {?Array.<{top: number, left: number}>} links
     * @param {?number} dirTop
     * @param {?number} dirLeft
     */
    constructor(board, matrix, links, dirTop, dirLeft) {
        this.board      = board;
        this.matrix     = matrix;

        this.container  = document.querySelector(".snake");
        this.position   = Utils.getPosition(this.container);
        this.queue      = new Queue();
        this.dirTop     = dirTop  !== undefined ? dirTop  : 1;
        this.dirLeft    = dirLeft !== undefined ? dirLeft : 0;
        this.newDir     = false;
        this.initialPos = { top : 3, left : 11 };

        this.container.innerHTML = "";

        if (links) {
            links.forEach((link) => {
                this.addLink(this.board.createSnakeElement(), link.top, link.left);
            });
        }
    }

    /**
     * Moves the snake
     * @return {string} The result of the movement
     */
    move() {
        let pos = this.getPosition();

        if (this.matrix.crashed(pos.top, pos.left)) {
            return "crashed";
        }
        if (this.matrix.ate(pos.top, pos.left)) {
            this.newLink(pos.top, pos.left);
            return "ate";
        }
        if (this.queue.size() < 3) {
            this.newLink(pos.top, pos.left);
        } else {
            this.moveLink(pos.top, pos.left);
        }
        this.newDir = false;

        return "";
    }

    /**
     * Creates a new Element to the snake
     * @param {number} top
     * @param {number} left
     */
    newLink(top, left) {
        this.addLink(this.board.createSnakeElement(), top, left);
        this.matrix.addSnake(top, left);
    }

    /**
     * Move the last link to head of the snake
     * @param {number} top
     * @param {number} left
     */
    moveLink(top, left) {
        let first = this.queue.dequeue();
        this.addLink(first.element, top, left);

        this.matrix.removeSnake(first.top, first.left);
        this.matrix.addSnake(top, left);
    }

    /**
     * Adds a link to the head of the snake
     * @param {DOMElement} element
     * @param {number}     top
     * @param {number}     left
     */
    addLink(element, top, left) {
        element.style.top  = this.board.getPosition(top);
        element.style.left = this.board.getPosition(left);

        this.queue.enqueue({
            element : element,
            top     : top,
            left    : left
        });
        this.container.appendChild(element);
    }


    /**
     * Change the direction of the snake
     * @param {number} dirTop
     * @param {number} dirLeft
     * @return {boolean} True if the snake changed direction
     */
    turn(dirTop, dirLeft) {
        if (((!this.dirTop && dirTop) || (!this.dirLeft && dirLeft)) && !this.newDir) {
            this.dirTop  = dirTop;
            this.dirLeft = dirLeft;
            this.newDir  = true;
            return true;
        }
        return false;
    }

    /**
     * Turns the snake using the mouse
     * @param {Event} event
     * @return {boolean} True if the snake changed direction
     */
    mouseTurn(event) {
        let mouse = Utils.getMousePos(event),
            last  = this.queue.last(),
            cell  = this.board.cellSize,
            top   = Math.floor((mouse.top  - this.position.top)  / cell),
            left  = Math.floor((mouse.left - this.position.left) / cell),
            dtop  = top  - last.top,
            dleft = left - last.left,
            can   = false;

        if (Math.abs(dtop) > Math.abs(dleft)) {
            can = this.turn(dtop < 0 ? -1 : 1, 0);
            if (!can) {
                can = this.turn(0, dleft < 0 ? -1 : 1);
            }
        } else {
            can = this.turn(0, dleft < 0 ? -1 : 1);
            if (!can) {
                can = this.turn(dtop < 0 ? -1 : 1, 0);
            }
        }
        return can;
    }


    /**
     * Returns the next position of the last element in the queue
     * @return {{top: number, left: nuber}}
     */
    getPosition() {
        if (this.queue.isEmpty()) {
            return this.initialPos;
        }

        let last = this.queue.last();
        return {
            top  : last.top  + this.dirTop,
            left : last.left + this.dirLeft
        };
    }

    /**
     * Returns the current direction of the snake
     * @return {{top: number, left: nuber}}
     */
    getDirection() {
        return { top : this.dirTop, left : this.dirLeft };
    }
}
