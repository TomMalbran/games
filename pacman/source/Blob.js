/**
 * The Blob Class
 */
class Blob {

    /**
     * The Blob constructor
     */
    constructor() {
        this.init(Board.gameCanvas);
    }

    /**
     * Initializes the Blob
     * @param {Canvas} canvas
     * @returns {Void}
     */
    init(canvas) {
        this.canvas     = canvas;
        this.ctx        = canvas.context;

        this.tile       = Board.startingPos;
        this.tileCenter = Board.getTileXYCenter(this.tile);
        this.x          = this.tileCenter.x;
        this.y          = this.tileCenter.y;
        this.dir        = Board.startingDir;
        this.speed      = Data.getLevelData("pmSpeed");
        this.center     = true;
        this.turn       = null;
        this.delta      = null;
        this.mouth      = 5;
        this.radius     = Board.blobRadius;
        this.sound      = 1;
    }


    /**
     * Animates the Blob
     * @param {Number} speed
     * @returns {Boolean}
     */
    animate(speed) {
        let newTile = false;
        if (this.center && this.crashed()) {
            this.mouth = 5;
        } else if (this.delta) {
            newTile = this.cornering(speed);
        } else {
            newTile = this.move(speed);
        }
        this.draw();
        return newTile;
    }

    /**
     * Moves the Blob
     * @param {Number} speed
     * @returns {Boolean}
     */
    move(speed) {
        this.x += this.dir.x * this.speed * speed;
        this.y += this.dir.y * this.speed * speed;

        this.moveMouth();
        this.newTile();
        let newTile = this.atCenter();

        this.x = Board.tunnelEnds(this.x);
        return newTile;
    }

    /**
     * Changes the state of the Blob's mouth
     * @returns {Void}
     */
    moveMouth() {
        this.mouth = (this.mouth + 1) % 20;
    }

    /**
     * The Blob might have entered a new Tile, and several things might need to be done
     * @returns {Void}
     */
    newTile() {
        let tile = Board.getTilePos(this.x, this.y);
        if (!Board.equalTiles(this.tile, tile)) {
            this.tile       = tile;
            this.tileCenter = Board.getTileXYCenter(tile);
            this.center     = false;

            if (this.turn && this.inBoard(this.turn) && !this.isWall(this.turn)) {
                this.delta = {
                    x : this.dir.x || this.turn.x,
                    y : this.dir.y || this.turn.y
                };
            }
        }
    }

    /**
     * Does the turning or wall crash when the Blob is at, or just passed, the center of a tile
     * @returns {Boolean}
     */
    atCenter() {
        if (!this.center && this.passedCenter()) {
            let turn = false;
            if (this.turn && this.inBoard(this.turn) && !this.isWall(this.turn)) {
                this.dir  = this.turn;
                this.turn = null;
                turn      = true;
            }
            if (turn || this.crashed()) {
                this.x = this.tileCenter.x;
                this.y = this.tileCenter.y;
            }
            this.center = true;

            return true;
        }
        return false;
    }


    /**
     * Does a faster turn by turnning a bit before the corner.
     * Only when a turn is asked before reaching an intersection
     * @param {Number} speed
     * @returns {Boolean}
     */
    cornering(speed) {
        this.x += this.delta.x * this.speed * speed;
        this.y += this.delta.y * this.speed * speed;

        if (this.passedCenter()) {
            if (this.dir.x) {
                this.x = this.tileCenter.x;
            }
            if (this.dir.y) {
                this.y = this.tileCenter.y;
            }
            this.dir   = this.turn;
            this.turn  = null;
            this.delta = null;

            return true;
        }
        return false;
    }

    /**
     * Eats food (dots, energizers, fruits)
     * @param {Boolean} atPill
     * @param {Boolean} frightenGhosts
     * @returns {Void}
     */
    onEat(atPill, frightenGhosts) {
        if (!atPill) {
            this.sound = 1;
        }

        let key;
        if (frightenGhosts) {
            key = atPill ? "eatingFrightSpeed" : "pmFrightSpeed";
        } else {
            key = atPill ? "eatingSpeed" : "pmSpeed";
        }
        this.speed = Data.getLevelData(key);
    }

    /**
     * Returns the apropiate sound effect
     * @returns {String}
     */
    getSound() {
        this.sound = (this.sound + 1) % 2;
        return this.sound ? "eat2" : "eat1";
    }

    /**
     * New direction (given by the user)
     * @param {{x: Number, y: Number}} turn
     * @returns {Void}
     */
    makeTurn(turn) {
        if (this.delta) {
            return;
        }
        if (this.turnNow(turn)) {
            this.dir    = turn;
            this.turn   = null;
            this.center = false;
        } else {
            this.turn = turn;
        }
    }


    /**
     * Draws a Blob with the given data
     * @returns {Void}
     */
    draw() {
        let values = [ 0, 0.2, 0.4, 0.2 ],
            mouth  = Math.floor(this.mouth / 5),
            delta  = values[mouth];

        this.savePos();
        this.ctx.save();
        this.ctx.fillStyle = "rgb(255, 255, 51)";
        this.ctx.translate(Math.round(this.x), Math.round(this.y));
        this.ctx.rotate(this.getAngle());
        this.ctx.beginPath();
        this.ctx.arc(0, 0, this.radius, (1 + delta) * Math.PI, (3 - delta) * Math.PI);
        this.ctx.lineTo(Math.round(this.radius / 3), 0);
        this.ctx.fill();
        this.ctx.restore();
    }

    /**
     * Saves the Blob's position to delete clear it before the next animation
     * @returns {Void}
     */
    savePos() {
        this.canvas.savePos(this.x, this.y);
    }

    /**
     * Draws the next step in the Blob's death animation
     * @param {Context} ctx
     * @param {Number}  count
     * @returns {Void}
     */
    drawDeath(ctx, count) {
        let delta = count / 50;

        ctx.fillStyle = "rgb(255, 255, 51)";
        ctx.beginPath();
        ctx.arc(0, 0, this.radius, (1.5 - delta) * Math.PI, (1.5 + delta) * Math.PI, true);
        ctx.lineTo(0, 0);
        ctx.fill();
    }

    /**
     * Draws a circle as the next step in the Blob Death animation
     * @param {Context} ctx
     * @param {Number}  count
     * @returns {Void}
     */
    drawCircle(ctx, count) {
        let radius = Math.round(count / 2);

        ctx.strokeStyle = "rgb(159, 159, 31)";
        ctx.lineWidth   = 3;
        ctx.beginPath();
        ctx.arc(0, 0, radius, 0, 2 * Math.PI, true);
        ctx.stroke();
    }


    /**
     * Returns true if the Blob crashed with a wall
     * @returns {Boolean}
     */
    crashed() {
        return this.inBoard(this.dir) && this.isWall(this.dir);
    }

    /**
     * Returns true if the Blob has passed the center of the currrent tile
     * @returns {Boolean}
     */
    passedCenter() {
        return (
            (this.dir.x ===  1 && this.x >= this.tileCenter.x) ||
            (this.dir.x === -1 && this.x <= this.tileCenter.x) ||
            (this.dir.y ===  1 && this.y >= this.tileCenter.y) ||
            (this.dir.y === -1 && this.y <= this.tileCenter.y)
        );
    }

    /**
     * Returns true if the Blob has to turn now
     * @param {{x: Number, y: Number}}
     * @returns {Boolean}
     */
    turnNow(turn) {
        return (
            (!this.dir.x && !turn.x) || (!this.dir.y && !turn.y) ||  // Half Turn
            (this.center && this.crashed() && this.inBoard(turn) && !this.isWall(turn))    // Crash Turn
        );
    }

    /**
     * Returns true if the next tile is a wall
     * @param {{x: Number, y: Number}}
     * @returns {Boolean}
     */
    isWall(turn) {
        let tile = Board.sumTiles(this.tile, turn);
        return Board.isWall(tile.x, tile.y);
    }

    /**
     * Returns true if the next tile is a wall
     * @param {{x: Number, y: Number}}
     * @returns {Boolean}
     */
    inBoard(turn) {
        let tile = Board.sumTiles(this.tile, turn);
        return Board.inBoard(tile.x, tile.y);
    }

    /**
     * Returns the angle of the Blob using its direction
     * @returns {Number}
     */
    getAngle() {
        let angle;
        if (this.dir.x === -1) {
            angle = 0;
        } else if (this.dir.x ===  1) {
            angle = Math.PI;
        } else if (this.dir.y === -1) {
            angle = 0.5 * Math.PI;
        } else if (this.dir.y ===  1) {
            angle = 1.5 * Math.PI;
        }
        return angle;
    }


    /**
     * Returns the Blob x position
     * @returns {Number}
     */
    getX() {
        return this.x;
    }

    /**
     * Returns the Blob y position
     * @returns {Number}
     */
    getY() {
        return this.y;
    }

    /**
     * Returns the Blob direction
     * @returns {{x: Number, y: Number}}
     */
    getDir() {
        return this.dir;
    }

    /**
     * Returns the Blob tile
     * @returns {{x: Number, y: Number}}
     */
    getTile() {
        return this.tile;
    }
}
