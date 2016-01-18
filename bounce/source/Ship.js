/**
 * Ship Manager
 */
class Ship {

    /**
     * Ship Manager constructor
     * @param {Board}    board
     * @param {number}   shipWidth
     * @param {function} onMove
     */
    constructor(board, shipWidth, onMove) {
        this.minWidth       = 3;
        this.extraWidth     = 1;
        this.decreaseAmount = 1;
        this.keyMovement    = 10;
        this.onMove         = onMove;
        
        this.board   = board;
        this.element = document.querySelector(".ship");
        this.emWidth = shipWidth;
        this.setWidth();
        
        this.top     = this.board.getHeight() - this.element.offsetHeight - 5;
        this.left    = (this.board.getWidth() - this.width) / 2;
        
        Utils.setPosition(this.element, this.top, this.left);
    }
    
    
    /**
     * Set the width property of the element
     */
    setWidth() {
        this.element.style.width = this.emWidth + "em";
        this.width = this.element.offsetWidth;
    }
    
    /**
     * Set the top property of the element
     * @param {number=} top
     */
    setTop(top) {
        this.element.style.top = (top || this.top) + "px";
    }
    
    /**
     * Set the left property of the element
     */
    setLeft() {
        this.element.style.left = this.left + "px";
    }
    
    /**
     * Move the Ship using the mouse
     * @param {Event} e
     */
    mouseMove(e) {
        let mouseLeft  = Utils.getMousePos(e).left,
            halfWidth  = this.width / 2,
            boardLeft  = this.board.getLeft() - this.board.getBorder(),
            boardRight = this.board.getLeft() + this.board.getWidth() + this.board.getBorder(),
            leftSide   = this.board.getLeft() + halfWidth,
            rightSide  = this.board.getLeft() + this.board.getWidth() - halfWidth,
            shipLeft   = 0;
        
        if (mouseLeft < boardLeft || mouseLeft > boardRight) {
            return;
        }
        if (mouseLeft >= leftSide && mouseLeft <= rightSide) {
            shipLeft = mouseLeft - this.board.getLeft() - halfWidth;
        } else if (mouseLeft > rightSide) {
            shipLeft = rightSide - this.board.getLeft() - halfWidth;
        }
        this.doMove(shipLeft);
    }
    
    /**
     * Move the Ship using the keyboard
     * @param {number} direction
     */
    keyMove(direction) {
        let left  = this.left + this.keyMovement * direction,
            maxim = this.board.getWidth() - this.width;
        
        left = Utils.clamp(left, 0, maxim);
        this.doMove(left);
    }
    
    /**
     * Move the Ship
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
     */
    ballCrash() {
        this.setTop(this.top + 2);
        window.setTimeout(() => this.setTop(), 100);
    }
    
    
    /**
     * Reduce the width of the ship
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
     * @return {{top: number, left: number}}
     */
    getPosition() {
        return {
            top  : this.top,
            left : this.left - this.extraWidth / 2
        };
    }
    
    /**
     * Returns the width of the Ship
     * @return {number}
     */
    getWidth() {
        return this.width + this.extraWidth;
    }
}
