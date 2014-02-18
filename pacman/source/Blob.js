/*jslint browser: true */
/*global Utils */

var Blob = (function () {
    "use strict";
    
    var startingPos = { x: 14, y: 23 },
        startingDir = { x: -1, y:  0 },
        blobColor   = "rgb(255, 255, 51)",
        circleColor = "rgb(159, 159, 31)",
        circleWidth = 3;
    
    
    /**
     * @constructor
     * The Blob Class
     * @param {Board}  board
     * @param {Score}  score
     * @param {Food}   food
     * @param {Ghosts} ghosts
     * @param {Sounds} sounds
     */
    function Blob(board, score, food, ghosts, sounds) {
        this.food   = food;
        this.ghosts = ghosts;
        this.sounds = sounds;
        
		this.init(board, score, board.getGameCanvas());
		this.draw();
	}
    
    /**
     * Initializes the Blob
     * @param {Board}  board
     * @param {Score}  score
     * @param {Canvas} canvas
     */
    Blob.prototype.init = function (board, score, canvas) {
        this.board      = board;
        this.score      = score;
        this.canvas     = canvas;
        this.ctx        = canvas.getContext();
        
        this.tile       = Object.create(startingPos);
        this.tileCenter = this.board.getTileXYCenter(this.tile);
		this.x          = this.tileCenter.x;
		this.y          = this.tileCenter.y;
		this.dir        = Object.create(startingDir);
		this.speed      = this.score.getLevelData("pmSpeed");
		this.center     = true;
		this.turn       = null;
		this.delta      = null;
		this.mouth      = 5;
		this.radius     = Math.round(this.board.getTileSize() / 1.5);
        this.sound      = 1;
    };
    
    /**
     * Saves a callback function that is called when the Blob dies
     * @param {function} callback
     */
    Blob.prototype.onDeath = function (callback) {
        this.deathCallback = callback;
    };
	
    
    /**
     * Animates the Blob
     * @param {number} speed
     */
	Blob.prototype.animate = function (speed) {
		if (this.center && this.crashed()) {
			this.mouth = 5;
		} else if (this.delta) {
			this.cornering(speed);
        } else {
			this.move(speed);
        }
		this.draw();
	};
	
	/**
	 * Moves the Blob
	 * @param {number} seed
	 */
	Blob.prototype.move = function (speed) {
		this.x += this.dir.x * this.speed * speed;
		this.y += this.dir.y * this.speed * speed;
		
		this.moveMouth();
		this.newTile();
		this.atCenter();
        
        this.x = this.board.tunnelEnds(this.x);
	};
    
    /**
     * Changes the state of the Blob's mouth
     */
    Blob.prototype.moveMouth = function () {
        this.mouth = (this.mouth + 1) % 20;
    };
	
    /**
     * The Blob might have entered a new Tile, and several things might need to be done
     */
	Blob.prototype.newTile = function () {
		var tile = this.board.getTilePos(this.x, this.y);
		if (this.tile.x !== tile.x || this.tile.y !== tile.y) {
			this.tile       = tile;
			this.tileCenter = this.board.getTileXYCenter(tile);
			this.center     = false;
			
			if (this.turn && !this.isWall(this.turn)) {
				this.delta = {
                    x : this.dir.x || this.turn.x,
                    y : this.dir.y || this.turn.y
                };
			}
            
			this.ghosts.setTargets(this);
		}
	};
    
    /**
     * Does the turning or wall crash when the Blob is at, or just passed, the center of a tile
     */
	Blob.prototype.atCenter = function () {
		if (!this.center && this.passedCenter()) {
            this.eat();
            
            var turn = false;
            if (this.turn && !this.isWall(this.turn)) {
                this.dir  = this.turn;
                this.turn = null;
                turn      = true;
            }
            if (turn || this.crashed()) {
                this.x = this.tileCenter.x;
                this.y = this.tileCenter.y;
            }
            this.center = true;
		}
	};
	
	
	/**
	 * Does a faster turn by turnning a bit before the corner. Only when a turn is asked before reaching an intersection
	 */
	Blob.prototype.cornering = function (speed) {
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
			
			this.eat();
		}
	};
	
	/**
	 * Eats food (dots, energizers, fruits)
	 */
	Blob.prototype.eat = function () {
        if (this.food.isAtPill(this.tile.x, this.tile.y)) {
            var value = this.food.eatPill(this.tile.x, this.tile.y),
                total = this.food.getLeftPills();
            
            this.score.pill(value);
            this.ghosts.resetPenTimer();
            this.ghosts.checkElroyDots(total);
            
            if (this.food.isEnergizer(value)) {
                this.ghosts.frighten(this);
                this.setSpeed();
            }
            this.eatSound();
            
            if (total === 0) {
                this.score.newLevel();
            }
            this.setSpeed(true);
            
        } else {
            this.sound = 1;
            this.setSpeed(false);
        }
	};
    
    Blob.prototype.eatSound = function () {
        this.sound = (this.sound + 1) % 2;
        if (!this.sound) {
            this.sounds.eat1();
        } else {
            this.sounds.eat2();
        }
    };
	
	// New direction (given by the user)
	Blob.prototype.makeTurn = function (turn) {
		if (this.delta) {
            return;
		} else if (this.turnNow(turn)) {
			this.dir    = turn;
			this.turn   = null;
			this.center = false;
		} else {
			this.turn = turn;
        }
	};
    
    
    /**
     * Draws a Blob with the given data
     */
    Blob.prototype.draw = function () {
        var values = [ 0, 0.2, 0.4, 0.2 ],
            mouth  = Math.floor(this.mouth / 5),
            delta  = values[mouth];
        
        this.savePos();
        this.ctx.save();
        this.ctx.fillStyle = blobColor;
        this.ctx.translate(Math.round(this.x), Math.round(this.y));
        this.ctx.rotate(this.getAngle());
        this.ctx.beginPath();
        this.ctx.arc(0, 0, this.radius, (1 + delta) * Math.PI, (3 - delta) * Math.PI);
        this.ctx.lineTo(Math.round(this.radius / 3), 0);
        this.ctx.fill();
        this.ctx.restore();
    };
    
    /**
     * Saves the Blob's position to delete clear it before the next animation
     */
    Blob.prototype.savePos = function () {
        this.canvas.savePos(this.x, this.y);
    };
    
    /**
     * Draws the next step in the Blob's death animation
     * @param {Context} ctx
     * @param {number}  count
     */
    Blob.prototype.drawDeath = function (ctx, count) {
        var delta = count / 50;
        
        ctx.fillStyle = blobColor;
        ctx.beginPath();
        ctx.arc(0, 0, this.radius, (1.5 - delta) * Math.PI, (1.5 + delta) * Math.PI, true);
        ctx.lineTo(0, 0);
        ctx.fill();
    };
    
    /**
     * Draws a circle as the next step in the Blob Death animation
     * @param {Context} ctx
     * @param {number}  count
     */
    Blob.prototype.drawCircle = function (ctx, count) {
        var radius = Math.round(count / 2);
        
        ctx.strokeStyle = circleColor;
        ctx.lineWidth   = circleWidth;
        ctx.beginPath();
        ctx.arc(0, 0, radius, 0, 2 * Math.PI, true);
        ctx.stroke();
    };
        

    
	// Sub Functions
	Blob.prototype.crashed = function () {
		return this.isWall(this.dir);
	};
    
    /**
     * Returns true if the Blob has passed the center of the currrent tile
     * @return {boolean}
     */
	Blob.prototype.passedCenter = function () {
		return (
            (this.dir.x ===  1 && this.x >= this.tileCenter.x) ||
			(this.dir.x === -1 && this.x <= this.tileCenter.x) ||
			(this.dir.y ===  1 && this.y >= this.tileCenter.y) ||
			(this.dir.y === -1 && this.y <= this.tileCenter.y)
        );
	};
    
    /**
     * Returns true if the Blob has to turn now
     * @param {{x: number, y: number}}
     * @return {boolean}
     */
	Blob.prototype.turnNow = function (turn) {
		return (
            (!this.dir.x && !turn.x) || (!this.dir.y && !turn.y) ||		// Halth Turn
			(this.center && this.crashed() && !this.isWall(turn))		// Crash Turn
        );
	};
    
    /**
     * Returns true if the next tile is a wall
     * @param {{x: number, y: number}}
     * @return {boolean}
     */
	Blob.prototype.isWall = function (turn) {
		return this.board.isWall(this.tile.x + turn.x, this.tile.y + turn.y);
	};
	
	Blob.prototype.setSpeed = function (ate) {
		var param;
		if (this.ghosts.areFrighten()) {
			param = ate ? "eatingFrightSpeed" : "pmFrightSpeed";
		} else {
			param = ate ? "eatingSpeed" : "pmSpeed";
        }
        this.speed = this.score.getLevelData(param);
	};
    
	Blob.prototype.getAngle = function () {
		if (this.dir.x === -1) { return 0; }
		if (this.dir.x ===  1) { return Math.PI; }
		if (this.dir.y === -1) { return 0.5 * Math.PI; }
		if (this.dir.y ===  1) { return 1.5 * Math.PI; }
	};
	
    
    /**
     * Returns the Blob x position
     * @return {number}
     */
	Blob.prototype.getX = function () {
        return this.x;
    };
    
    /**
     * Returns the Blob y position
     * @return {number}
     */
	Blob.prototype.getY = function () {
        return this.y;
    };
    
    /**
     * Returns the Blob direction
     * @return {{x: number, y: number}}
     */
	Blob.prototype.getDir = function () {
        return this.dir;
    };
    
    /**
     * Returns the Blob tile
     * @return {{x: number, y: number}}
     */
	Blob.prototype.getTile = function () {
        return this.tile;
    };
    
    
    
    // The public API
    return Blob;
}());