/**
 * Ball Manager
 */
class Ball {

    /**
     * Ball Manager constructor
     * @param {number} boardWidth
     * @param {number} boardHeight
     */
    constructor(boardWidth, boardHeight) {
        this.minSpeed    = 8;
        this.maxSpeed    = 16;
        this.minAngle    = 25;
        this.maxAngle    = 75;
        this.speedInc    = 0.1;

        this.element     = document.querySelector(".ball");
        this.angle       = Utils.rand(50, 70);
        this.dirTop      = -1;
        this.dirLeft     = -1;
        this.speed       = this.minSpeed;
        this.size        = this.element.offsetWidth;
        this.top         = 0;
        this.left        = 0;
        this.boardWidth  = boardWidth;
        this.boardHeight = boardHeight;
    }

    /**
     * Set the top start position
     * @param {Ship} ship
     */
    setStartTop(ship) {
        this.top = Math.round(ship.getPosition().top - this.size);
        Utils.setPosition(this.element, this.top, this.left);
    }

    /**
     * Set the left start position
     * @param {Ship} ship
     */
    setStartLeft(ship) {
        this.left = Math.round(ship.getPosition().left + (ship.getWidth() - this.size) / 2);
        Utils.setPosition(this.element, this.top, this.left);
    }

    /**
     * Move the ball when starting
     */
    start() {
        this.top -= 1;
    }


    /**
     * Move after starting
     * @param {number} speed
     */
    move(speed) {
        let movey    = this.angle / 90,
            crash    = false,
            gameOver = false;

        this.top  += this.speed * this.dirTop * movey * speed;
        this.left += this.speed * this.dirLeft * (1 - movey) * speed;

        Utils.setPosition(this.element, this.top, this.left);
    }

    /**
     * If the ball crashed the top wall, change the direction, angle and speed
     * @return {boolean} True if the ball crashed the top wall
     */
    topCrash() {
        if (this.top <= 0) {
            this.dirTop = 1;
            return true;
        }
        return false;
    }

    /**
     * If the ball crashed the left wall, change the direction, angle and speed
     * @return {boolean} True if the ball crashed the left wall
     */
    leftCrash() {
        if (this.left <= 0) {
            this.dirLeft = 1;
            return true;
        }
        return false;
    }

    /**
     * If the ball crashed the right wall, change the direction, angle and speed
     * @return {boolean} True if the ball crashed the right wall
     */
    rightCrash() {
        if (this.left + this.size >= this.boardWidth) {
            this.dirLeft = -1;
            return true;
        }
        return false;
    }

    /**
     * If the ball went through the bottom wall, game over
     * @return {boolean} True if the ball went through the bottom wall
     */
    bottomCrash() {
        if (this.top + this.size >= this.boardHeight) {
            return true;
        }
        return false;
    }

    /**
     * If the ball crashed the ship, perform the required actions
     * @param {Ship} ship
     */
    shipCrash(ship) {
        if (this.onShip(ship)) {
            this.dirTop = -1;
            return true;
        }
        return false;
    }

    /**
     * Check if the ball is touching the ship
     * @param {{top: number, left: number}} shipPos
     * @return {boolean}
     */
    onShip(ship) {
        let pos    = ship.getPosition(),
            sTop   = pos.top,
            sLeft  = pos.left,
            sWidth = ship.getWidth(),
            bTop   = this.top + this.size,
            bLeft  = this.left + this.size / 2;

        return (bTop >= sTop && bLeft >= sLeft && bLeft <= sLeft + sWidth);
    }


    /**
     * Change the angle
     * @param {Ship} ship
     */
    changeAngle(ship) {
        let pos   = this.left + this.size / 2 - ship.getPosition().left,
            width = ship.getWidth();

        this.angle = Math.floor(pos * 180 / width);
        if (this.angle > 90) {
            this.angle = 180 - this.angle;
        }
        this.angle = Utils.clamp(this.angle, this.minAngle, this.maxAngle);

        if (this.dirLeft === 1 && pos < width / 2) {
            this.dirLeft = -1;
        } else if (this.dirLeft === -1 && pos > width / 2) {
            this.dirLeft = 1;
        }
    }

    /**
     * Increase the speed
     */
    accelerate() {
        this.speed += this.speedInc;
    }

    /**
     * Randomly change the angle and speed
     */
    randomChange() {
        this.angle = Utils.rand(this.minAngle, this.maxAngle);
        this.speed = Utils.rand(this.minSpeed, this.maxSpeed);
    }


    /**
     * Sets the top direction of the ball
     * @param {number} dir
     */
    setDirTop(dir) {
        this.dirTop  = dir;
    }

    /**
     * Sets the left direction of the ball
     * @param {number} dir
     */
    setDirLeft(dir) {
        this.dirLeft = dir;
    }


    /**
     * Returns the position of the ball
     * @return {{top: number, left: number}}
     */
    getPosition() {
        return { top : this.top, left : this.left };
    }

    /**
     * Returns the direction of the ball
     * @return {{top: number, left: number}}
     */
    getDirection() {
        return { top : this.dirTop, left : this.dirLeft };
    }

    /**
     * Returns the size of the ball
     * @return {number}
     */
    getSize() {
        return this.size;
    }
}
