/*jslint browser: true */
/*global Utils */

var Ghosts = (function () {
    "use strict";
    
    /** @const Some data about the Ghosts */
    var scatterMode  = 0,
        chaseMode    = 1,
        blueMode     = 2,
        whiteMode    = 3,
        eyesMode     = 4,
        
        totalSwitchs = 7,
        blinksTimer  = 200,
        penDotsCount = [ 0, 7, 17, 32 ],
        inPenSpeed   = 0.6,
        eyesSpeed    = 2,
        exitPenSpeed = 0.4,
        eyesTarget   = { x: 13, y: 11 },
        pathSpeeds   = {
            inPen    : inPenSpeed,
            exitPen  : exitPenSpeed,
            enterPen : eyesSpeed
        };
    
    
    /**
     * Returns true if the given mode is Frighten
     * @param {number} mode
     * @return {boolean}
     */
    function isFrighten(mode) {
        return mode === blueMode || mode === whiteMode;
    }
    
    
    
    
    /**
     * @constructor
     * @private
     * The Ghost Base Class
     */
    function Ghost() {
        return undefined;
    }
    
    /**
     * Initializes the Ghost
     * @param {Ghosts}  parent
     * @param {Canvas}  canvas
     * @param {?number} dots
     */
    Ghost.prototype.init = function (parent, canvas, dots) {
        this.parent      = parent;
        this.canvas      = canvas;
        this.ctx         = canvas.getContext();
        
        this.mode        = scatterMode;
        this.tile        = this.inPen ? { x: 13, y: 14 } : { x: 13, y: 11 };
        this.tileCenter  = this.parent.board.getTileXYCenter(this.tile);
        this.turn        = this.inPen ? { x: -1, y:  0 } : null;
        this.center      = false;
        this.reverse     = false;
        this.dotsCount   = dots || 0;
        this.target      = this.scatter;
        this.speed       = this.inPen ? inPenSpeed : this.getLevelSpeed();
        this.feet        = 0;
        this.size        = this.parent.board.getTileSize() * 1.5;
        this.path        = null;
        this.pathName    = null;
        this.pathStep    = 0;
    };
    
    /**
     * Switches the Ghost mode
     * @param {number} oldMode
     * @param {number} newMode
     * @param {Blob}   blob
     */
    Ghost.prototype.switchMode = function (oldMode, newMode, blob) {
        if (!this.dontSwitch(oldMode)) {
            this.mode   = newMode;
            this.target = this.getTarget(blob);
            this.speed  = this.getSpeed();
                
            if (!this.dontHalfTurn(oldMode)) {
                if (this.path === null) {
                    this.turn = {
                        x : this.dir.x * -1,
                        y : this.dir.y * -1
                    };
                } else {
                    this.turn = { x: 1, y: 0 };
                }
            }
        }
    };
    
    /**
     * Moves the Ghost
     * @param {number} speed
     * @param {Blob}   blob
     */
    Ghost.prototype.move = function (speed, blob) {
        this.x += this.dir.x * this.speed * speed;
        this.y += this.dir.y * this.speed * speed;
        
        if (this.path !== null) {
            this.pathMove(blob);
        } else {
            this.normalMove(blob);
        }
        
        this.moveFeet();
        this.draw();
    };
    
    /**
     * Moves the Ghost in a predefined path
     * @param {Blob} blob
     */
    Ghost.prototype.pathMove = function (blob) {
        var step = this.path[this.pathStep];
        if (this.passedDist()) {
            if (this.dir.x) {
                this.x = step.distx;
            }
            if (this.dir.y) {
                this.y = step.disty;
            }
            
            if (step.next !== null) {
                this.pathStep = step.next;
                this.dir      = this.path[this.pathStep].dir;
            
            } else if (this.pathName === "exitPen") {
                this.path  = null;
                this.dir   = this.turn;
                this.turn  = null;
                this.speed = this.getLevelSpeed();
            
            } else if (this.pathName === "enterPen") {
                this.mode       = this.parent.getSwitchMode();
                this.target     = this.getTarget(blob);
                this.tile       = { x: 13, y: 14 };
                this.tileCenter = this.parent.board.getTileXYCenter(this.tile);
                this.turn       = { x: -1, y:  0 };
                this.parent.addGhostToPen(this);
            }
        }
    };
    
    /**
     * Moves the Ghost around the board
     * @param {Blob} blob
     */
    Ghost.prototype.normalMove = function (blob) {
        this.newTile(blob);
        this.x = this.parent.board.tunnelEnds(this.x);
        
        if (!this.center && this.passedCenter()) {
            if (this.turn) {
                this.makeTurn();
            }
            if (this.isNextIntersection()) {
                this.decideTurn();
            }
            this.speed  = this.getSpeed();
            this.center = true;
        }
    };
    
    
    /**
     * The Ghost moved to a new Tile
     * @param {Blob} blob
     */
    Ghost.prototype.newTile = function (blob) {
        var tile = this.parent.board.getTilePos(this.x, this.y);
        if (this.tile.x !== tile.x || this.tile.y !== tile.y) {
            this.tile       = tile;
            this.tileCenter = this.parent.board.getTileXYCenter(this.tile);
            this.center     = false;
            
            if (this.isEnteringPen()) {
                this.setPath("enterPen");
            }
            this.killOrDie(blob);
        }
    };
    
        
    /**
     * Sets the Path of the Ghost
     * @param {string} path
     */
    Ghost.prototype.setPath = function (name) {
        this.pathName = name;
        this.pathStep = 0;
        this.path     = this.paths[this.pathName];
        this.dir      = this.path[this.pathStep].dir;
        this.speed    = pathSpeeds[name];
    };
    
    /**
     * Returns true if the Ghost is entering the Pen
     * @return {boolean}
     */
    Ghost.prototype.isEnteringPen = function () {
        return this.mode === eyesMode && this.tile.x === eyesTarget.x && this.tile.y === eyesTarget.y;
    };
    
    
    /**
     * The Ghost turns used the previously stored turn direction
     */
    Ghost.prototype.makeTurn = function () {
        this.x    = this.tileCenter.x;
        this.y    = this.tileCenter.y;
        this.dir  = this.turn;
        this.turn = null;
    };
    
    /**
     * The Ghost decided which direction to do next depending on different factors
     */
    Ghost.prototype.decideTurn = function () {
        var turns = this.getTurns();
        if (turns.length === 1) {
            this.turn = turns[0];
        } else if (isFrighten(this.mode)) {
            this.turn = turns[Utils.rand(0, turns.length - 1)];
        } else {
            this.turn = this.getTargetTurn(turns);
        }
    };
    
    /**
     * Returns a list with all the possible turns a Ghost can do at an intersection
     * @return {Array.<{x: number, y: number}>}
     */
    Ghost.prototype.getTurns = function () {
        var tile   = this.getNextTile(),
            pos    = this.parent.board.tileToString(tile),
            turns  = this.parent.board.getTurns(pos),
            self   = this,
            result = [];
        
        turns.forEach(function (turn) {
            if ((turn + 2) % 4 !== self.parent.board.dirToNumber(self.dir)) {
                result.push(self.parent.board.numberToDir(turn));
            }
        });
        return result;
    };
    
    /**
     * Decides the best turn depending on which cell after the intersection is closes to the target
     * @param {Array.<{x: number, y: number}>} turns
     * @return {{x: number, y: number}}
     */
    Ghost.prototype.getTargetTurn = function (turns) {
        var tile   = this.getNextTile(),
            best   = 999999,
            self   = this,
            result = {};
        
        turns.forEach(function (turn) {
            var ntile = { x: tile.x + turn.x, y: tile.y + turn.y },
                distx = Math.pow(self.target.x - ntile.x, 2),
                disty = Math.pow(self.target.y - ntile.y, 2),
                dist  = Math.sqrt(distx + disty);
            
            if (dist < best) {
                best   = dist;
                result = turn;
            }
        });
        return result;
    };
    
    /**
     * Checks if the Ghost and the Blob are in the same tile and when those are the same depending on the
     * Ghost's mode, it can kill the blob or die
     * @param {Blob} blob
     * @return {boolean}
     */
    Ghost.prototype.killOrDie = function (blob) {
        if (this.isInBlobsTile(blob)) {
            if (isFrighten(this.mode)) {
                this.mode   = 4;
                this.target = eyesTarget;
                this.speed  = eyesSpeed;
                this.parent.increaseEyes({ x: this.tile.x + 0.5, y: this.tile.y + 0.5 });
            
            } else if (this.mode !== eyesMode) {
                return true;
            }
        }
        return false;
    };
    
    /**
     * Returns true if the Ghost is in Blob's tile
     * @param {Blob} blob
     * @return {boolean}
     */
    Ghost.prototype.isInBlobsTile = function (blob) {
        return blob.getTile().x === this.tile.x && blob.getTile().y === this.tile.y;
    };
    
    /**
     * Returns true if the Ghost should change it's target
     * @param {number} globalMode
     * @return {boolean}
     */
    Ghost.prototype.shouldChangeTarget = function (globalMode) {
        return this.mode !== eyesMode && (globalMode === chaseMode || this.isElroy());
    };
    
    /**
     * Don't let the Ghost change mode on certain cases
     * @param {number} oldMode
     * @return {boolean}
     */
    Ghost.prototype.dontSwitch = function (oldMode) {
        return (isFrighten(oldMode) && !isFrighten(this.mode)) || this.mode === eyesMode;
    };
    
    /**
     * Don't let the Ghost half turn when switching from Blue to White mode
     * @param {number} oldMode
     * @return {boolean}
     */
    Ghost.prototype.dontHalfTurn = function (oldMode) {
        return oldMode === blueMode || oldMode === whiteMode;
    };
    
    /**
     * Returns the Ghost's Speed based on diferent factors
     * @return {number}
     */
    Ghost.prototype.getSpeed = function () {
        var speed = this.parent.score.getLevelData("ghostSpeed");
        
        if (this.mode === eyesMode) {
            speed = eyesSpeed;
        } else if (isFrighten(this.mode)) {
            speed = this.parent.score.getLevelData("ghostFrightSpeed");
        } else if (this.parent.board.isTunnel(this.tile.x, this.tile.y)) {
            speed = this.parent.score.getLevelData("tunnelSpeed");
        } else if (this.isElroy()) {
            speed = this.parent.score.getLevelData("elroySpeed" + this.elroyMode);
        }
        return speed;
    };
    
    /**
     * Returns true if the Ghost moved past certain distance stored in the Path
     * @return {boolean}
     */
    Ghost.prototype.passedDist = function () {
        var path = this.path[this.pathStep];
        return (
            (this.dir.x ===  1 && this.x >= path.distx) ||
            (this.dir.x === -1 && this.x <= path.distx) ||
            (this.dir.y ===  1 && this.y >= path.disty) ||
            (this.dir.y === -1 && this.y <= path.disty)
        );
    };
    
    /**
     * Returns true if the Ghost passed the center of the tile
     * @return {boolean}
     */
    Ghost.prototype.passedCenter = function () {
        return (
            (this.dir.x ===  1 && this.x >= this.tileCenter.x) ||
            (this.dir.x === -1 && this.x <= this.tileCenter.x) ||
            (this.dir.y ===  1 && this.y >= this.tileCenter.y) ||
            (this.dir.y === -1 && this.y <= this.tileCenter.y)
        );
    };
    
    /**
     * Returns the next tile
     * @return {{x: number, y: number}}
     */
    Ghost.prototype.getNextTile = function () {
        return {
            x : this.tile.x + this.dir.x,
            y : this.tile.y + this.dir.y
        };
    };
    
    /**
     * Returns true if the next tile is an intersection
     * @return {boolean}
     */
    Ghost.prototype.isNextIntersection = function () {
        var tile = this.getNextTile();
        return this.parent.board.isIntersection(tile.x, tile.y);
    };
    
    /**
     * Returns the Ghost's target depending on the current mode
     * @param {Blob} blob
     * @return {{x: number, y: number}}
     */
    Ghost.prototype.getTarget = function (blob) {
        if (this.mode === chaseMode || this.isElroy()) {
            return this.chase(blob);
        }
        return this.scatter;
    };
    
    /**
     * Returns true if the Ghost is in "Cruise Elroy" Mode. Only used for Blinky
     * @return {boolean}
     */
    Ghost.prototype.isElroy = function () {
        return false;
    };
    
    /**
     * Makes it possible for a Ghost to switch to "Cruise Elroy" Mode. Only used for Blinky
     */
    Ghost.prototype.activateElroy = function () {
        return undefined;
    };
    
    /**
     * Increases the internal pills count of a Ghost
     */
    Ghost.prototype.increaseDots = function () {
        this.dotsCount += 1;
    };
    
    /**
     * Sets the Chase target of the Ghost
     * @param {Blob} blob
     */
    Ghost.prototype.setChaseTarget = function (blob) {
        this.target = this.chase(blob);
    };
    
    /**
     * Returns the Ghost's speed for the current level
     * @return {number}
     */
    Ghost.prototype.getLevelSpeed = function () {
        return this.parent.score.getLevelData("ghostSpeed");
    };
    
    
    /**
     * Initialize some variables for the chase demo animation
     * @param {{x: number, y: number}} dir
     * @param {number} x
     * @param {number} y
     */
    Ghost.prototype.chaseDemo = function (dir, x, y) {
        this.dir   = Object.create(dir);
        this.x     = x;
        this.y     = y;
        this.mode  = chaseMode;
        this.speed = this.getLevelSpeed();
    };
    
    /**
     * Initialize some variables for the frighten demo animation
     * @param {{x: number, y: number}} dir
     * @param {number} speed
     */
    Ghost.prototype.frightenDemo = function (dir, speed) {
        this.dir   = Object.create(dir);
        this.mode  = blueMode;
        this.speed = speed;
    };
    
    /**
     * Initialize some variables for the present demo animation
     * @param {{x: number, y: number}} dir
     */
    Ghost.prototype.presentDemo = function (dir) {
        this.dir   = Object.create(dir);
        this.x     = -this.size;
        this.mode  = chaseMode;
        this.speed = this.getLevelSpeed();
    };
    
    /**
     * The animation used on the Demo
     * @param {number} speed
     */
    Ghost.prototype.demoAnimate = function (speed) {
        this.x += this.dir.x * this.speed * speed;
        this.moveFeet();
        this.draw();
    };
    
    
    /**
     * Changes the Drawing for the Ghosts feet
     */
    Ghost.prototype.moveFeet = function () {
        this.feet = (this.feet + 0.3) % 2;
    };
    
    /**
     * Draws the Ghost
     */
    Ghost.prototype.draw = function () {
        this.canvas.savePos(this.x, this.y);
        this.ctx.save();
        this.ctx.translate(Math.round(this.x) - this.size / 2, Math.round(this.y) - this.size / 2);
        
        this.ghostBody();
        if (isFrighten(this.mode)) {
            this.ghostFrightenFace();
        } else {
            this.ghostNormalFace();
        }
        this.ctx.restore();
    };
    
    /**
     * Draws the Ghost's Body
     */
    Ghost.prototype.ghostBody = function () {
        this.ctx.fillStyle = this.getBodyColor();
        this.ctx.beginPath();
        this.ctx.arc(8,  8, 8, Math.PI, 1.5 * Math.PI, false);
        this.ctx.arc(10, 8, 8, 1.5 * Math.PI, 2 * Math.PI, false);
        
        if (!Math.floor(this.feet)) {
            this.ghostFeet0();
        } else {
            this.ghostFeet1();
        }
        this.ctx.fill();
    };
    
    /**
     * Draws one of the variations of the Ghost's Feet
     */
    Ghost.prototype.ghostFeet0 = function () {
        this.ctx.lineTo(18, 16);
        this.ctx.lineTo(16, 18);
        this.ctx.lineTo(15, 18);
        this.ctx.lineTo(12, 15);
        this.ctx.lineTo(9, 18);
        this.ctx.lineTo(6, 15);
        this.ctx.lineTo(3, 18);
        this.ctx.lineTo(2, 18);
        this.ctx.lineTo(0, 16);
        this.ctx.lineTo(0, 8);
    };
    
    /**
     * Draws the other variation of the Ghost's Feet
     */
    Ghost.prototype.ghostFeet1 = function () {
        this.ctx.lineTo(18, 18);
        this.ctx.lineTo(15, 15);
        this.ctx.lineTo(12, 18);
        this.ctx.lineTo(11, 18);
        this.ctx.lineTo(9, 15);
        this.ctx.lineTo(7, 18);
        this.ctx.lineTo(6, 18);
        this.ctx.lineTo(3, 15);
        this.ctx.lineTo(0, 18);
        this.ctx.lineTo(0, 8);
    };
    
    /**
     * Draws the Ghost's Face for the Chase/Scatter/Eyes modes
     */
    Ghost.prototype.ghostNormalFace = function () {
        this.ctx.fillStyle = "rgb(255, 255, 255)";
        this.ctx.beginPath();
        this.ctx.arc(6    + this.dir.x * 2, 7 + this.dir.y * 2, 3, 0, 2 * Math.PI);
        this.ctx.arc(12.5 + this.dir.x * 2, 7 + this.dir.y * 2, 3, 0, 2 * Math.PI);
        this.ctx.fill();
        
        this.ctx.fillStyle = "rgb(0, 51, 255)";
        this.ctx.beginPath();
        this.ctx.arc(6    + this.dir.x * 4, 7 + this.dir.y * 4, 1.5, 0, 2 * Math.PI);
        this.ctx.arc(12.5 + this.dir.x * 4, 7 + this.dir.y * 4, 1.5, 0, 2 * Math.PI);
        this.ctx.fill();
    };
    
    /**
     * Draws the Ghost's Face for the Frighten (Blue/White) modes
     */
    Ghost.prototype.ghostFrightenFace = function () {
        this.ctx.fillStyle = this.getFaceColor();
        this.ctx.beginPath();
        this.ctx.arc(6, 7, 1.5, 0, 2 * Math.PI);
        this.ctx.arc(12.5, 7, 1.5, 0, 2 * Math.PI);
        this.ctx.fill();
        
        this.ctx.strokeStyle = this.getFaceColor();
        this.ctx.beginPath();
        this.ctx.moveTo(3, 14);
        this.ctx.lineTo(5, 11);
        this.ctx.lineTo(7, 14);
        this.ctx.lineTo(9, 11);
        this.ctx.lineTo(11, 14);
        this.ctx.lineTo(13, 11);
        this.ctx.lineTo(15, 14);
        this.ctx.stroke();
    };
    
    /**
     * Returns the color for the Ghosts body depending on the mode
     * @return {string}
     */
    Ghost.prototype.getBodyColor = function () {
        switch (this.mode) {
        case blueMode:
            return "rgb(0, 51, 255)";
        case whiteMode:
            return "rgb(255, 255, 255)";
        case eyesMode:
            return "rgb(0, 0, 0)";
        default:
            return this.color;
        }
    };
    
    /**
     * Returns the color used for the Ghosts face depending on the mode
     * @return {string}
     */
    Ghost.prototype.getFaceColor = function () {
        return this.mode === blueMode ? "rgb(255, 255, 255)" : "rgb(255, 0, 0)";
    };
    
    
    /**
     * Returns the Ghost's ID
     * @return {number}
     */
    Ghost.prototype.getID = function () {
        return this.id;
    };
    
    /**
     * Returns the Ghost's name position
     * @return {string}
     */
    Ghost.prototype.getName = function () {
        return this.name;
    };
    
    /**
     * Returns the Ghost's x position
     * @return {number}
     */
    Ghost.prototype.getX = function () {
        return this.x;
    };
    
    /**
     * Returns the Ghost's y position
     * @return {number}
     */
    Ghost.prototype.getY = function () {
        return this.y;
    };
    
    /**
     * Returns the Ghost's tile position
     * @return {{x: number, y: number}}
     */
    Ghost.prototype.getTile = function () {
        return this.tile;
    };
    
    /**
     * Returns the Ghost's interntal dots counter
     * @return {number}
     */
    Ghost.prototype.getDots = function () {
        return this.dotsCount;
    };
    
    /**
     * Returns the Ghost's current target tile
     * @return {number}
     */
    Ghost.prototype.getTargetTile = function () {
        return this.target;
    };
    
    
        
    /**
     * @constructor
     * @extends {Ghost}
     * The Blinky Class
     * @param {Ghosts}  parent
     * @param {Canvas}  canvas
     * @param {?number} dots
     */
    function Blinky(parent, canvas, dots) {
        this.paths   = {
            exitPen : [
                { dir : { x:  0, y: -1 }, disty : 138, next : null }
            ],
            enterPen : [
                { dir : { x: -1, y:  0 }, distx : 168, next : 1    },
                { dir : { x:  0, y:  1 }, disty : 174, next : null }
            ]
        };
        
        this.id      = 0;
        this.x       = 168;
        this.y       = 138;
        this.dir     = { x: -1, y:  0 };
        this.scatter = { x: 25, y: -3 };
        this.inPen   = false;
        this.color   = "rgb(221, 0, 0)";
        this.name    = "Blinky";
        
        this.init(parent, canvas, dots);
        
        this.elroyMode   = 0;
        this.activeElroy = dots !== null;
    }
    
    Blinky.prototype = Object.create(Ghost.prototype);
    Blinky.prototype.constructor = Blinky;
    Blinky.prototype.parentClass = Ghost.prototype;
    
    /**
     * Blinky's target is always the current tile of the Blob
     * @param {Blob} blob
     * @return {{x: number, y: number}}
     */
    Blinky.prototype.chase = function (blob) {
        return blob.getTile();
    };
    
    /**
     * Sets Blinky's "Cruise Elroy" Mode when the number of dots left reaches the target
     * @param {number} dots
     */
    Blinky.prototype.checkElroyDots = function (dots) {
        if (dots === this.parent.score.getLevelData("elroyDotsLeft1") ||
                dots === this.parent.score.getLevelData("elroyDotsLeft2")) {
            this.elroy += 1;
        }
    };
    
    /**
     * Returns true when Blinky is in "Cruise Elroy" Mode. Only used for Blinky
     * @return {boolean}
     */
    Blinky.prototype.isElroy = function () {
        return this.activeElroy && this.elroy > 0;
    };
    
    /**
     * Makes it possible for Blinky to switch to "Cruise Elroy" Mode
     */
    Blinky.prototype.activateElroy = function () {
        this.activeElroy = true;
    };
	
	
    
    /**
     * @constructor
     * @extends {Ghost}
     * The Pinky Class
     * @param {Ghosts}  parent
     * @param {Canvas}  canvas
     * @param {?number} dots
     */
    function Pinky(parent, canvas, dots) {
        this.paths   = {
            inPen    : [
                { dir : { x:  0, y: -1 }, disty : 168, next : 1 },
                { dir : { x:  0, y:  1 }, disty : 180, next : 0 }
            ],
            exitPen  : [
                { dir : { x:  0, y: -1 }, disty : 138, next : null }
            ],
            enterPen : [
                { dir : { x: -1, y:  0 }, distx : 168, next : 1    },
                { dir : { x:  0, y:  1 }, disty : 174, next : null }
            ]
        };
        
        this.id       = 1;
        this.x        = 168;
        this.y        = 174;
        this.scatter  = { x: 2, y: -3 };
        this.inPen    = true;
        this.color    = "rgb(255, 153, 153)";
        this.name     = "Pinky";
        
        this.init(parent, canvas, dots);
        this.setPath("inPen");
    }
    
    Pinky.prototype = Object.create(Ghost.prototype);
    Pinky.prototype.constructor = Pinky;
    Pinky.prototype.parentClass = Ghost.prototype;
    
    /**
     * Pinky's target is always 4 tiles ahead of the Blob
     * @param {Blob} blob
     * @return {{x: number, y: number}}
     */
    Pinky.prototype.chase = function (blob) {
        var targetx = blob.getTile().x + 4 * blob.getDir().x,
            targety = blob.getTile().y + 4 * blob.getDir().y;
        
        // Recreating bug where Up = Up+Left
        if (blob.getDir().y === -1) {
            targetx -= 4;
        }
        return { x: targetx, y: targety };
    };
    
    
    
    /**
     * @constructor
     * @extends {Ghost}
     * The Inky Class
     * @param {Ghosts}  parent
     * @param {Canvas}  canvas
     * @param {?number} dots
     */
    function Inky(parent, canvas, dots) {
        this.paths   = {
            inPen    : [
                { dir : { x:  0, y: -1 }, disty : 168, next : 1 },
                { dir : { x:  0, y:  1 }, disty : 180, next : 0 }
            ],
            exitPen  : [
                { dir : { x:  1, y:  0 }, distx : 168, next : 1    },
                { dir : { x:  0, y: -1 }, disty : 138, next : null }
            ],
            enterPen : [
                { dir : { x: -1, y:  0 }, distx : 168, next : 1    },
                { dir : { x:  0, y:  1 }, disty : 174, next : 2    },
                { dir : { x: -1, y:  0 }, distx : 144, next : null }
            ]
        };
        
        this.id      = 2;
        this.x       = 144;
        this.y       = 174;
        this.scatter = { x: 27, y: 31 };
        this.inPen   = true;
        this.color   = "rgb(102, 255, 255)";
        this.name    = "Inky";
        
        this.init(parent, canvas, dots);
        this.setPath("inPen");
    }
    
    Inky.prototype = Object.create(Ghost.prototype);
    Inky.prototype.constructor = Inky;
    Inky.prototype.parentClass = Ghost.prototype;
    
    /**
     * Inky's target is an average of Blinky's position and the Blob's position
     * @param {Blob} blob
     * @return {{x: number, y: number}}
     */
    Inky.prototype.chase = function (blob) {
        var offsetx = blob.getTile().x + 2 * blob.getDir().x,
            offsety = blob.getTile().y + 2 * blob.getDir().y;
        
        // Recreating bug where Up = Up+Left
        if (blob.getDir().y === -1) {
            offsetx -= 2;
        }
        return {
            x : offsetx * 2 - this.parent.blinky.getTile().x,
            y : offsety * 2 - this.parent.blinky.getTile().y
        };
    };
    
    
    
    /**
     * @constructor
     * @extends {Ghost}
     * The Clyde Class
     * @param {Ghosts}  parent
     * @param {Canvas}  canvas
     * @param {?number} dots
     */
    function Clyde(parent, canvas, dots) {
        this.paths   = {
            inPen    : [
                { dir : { x:  0, y: -1 }, disty : 168, next : 1 },
                { dir : { x:  0, y:  1 }, disty : 180, next : 0 }
            ],
            exitPen  : [
                { dir : { x: -1, y:  0 }, distx : 168, next : 1    },
                { dir : { x:  0, y: -1 }, disty : 138, next : null }
            ],
            enterPen : [
                { dir : { x: -1, y:  0 }, distx : 168, next : 1    },
                { dir : { x:  0, y:  1 }, disty : 174, next : 2    },
                { dir : { x:  1, y:  0 }, distx : 192, next : null }
            ]
        };
        
        this.id      = 3;
        this.x       = 192;
        this.y       = 174;
        this.scatter = { x: 0, y: 31 };
        this.inPen   = true;
        this.color   = "rgb(255,153,0)";
        this.name    = "Clyde";
        
        this.init(parent, canvas, dots);
        this.setPath("inPen");
    }
    
    Clyde.prototype = Object.create(Ghost.prototype);
    Clyde.prototype.constructor = Clyde;
    Clyde.prototype.parentClass = Ghost.prototype;
    
    /**
     * Clyde's target is the Blob possition if is further away and the Scatter if is closer
     * @param {Blob} blob
     * @return {{x: number, y: number}}
     */
    Clyde.prototype.chase = function (blob) {
        var x = Math.pow(this.tile.x - blob.getTile().x, 2),
            y = Math.pow(this.tile.y - blob.getTile().y, 2);
        
        if (Math.sqrt(x + y) > 8) {
            return blob.getTile();
        }
        return this.scatter;
    };
    
    
    
    
    /**
     * @constructor
     * The Ghosts Manager Class
     * @param {Board}       board
     * @param {Score}       score
     * @param {?oldManager} Manager
     */
    function Manager(board, score, oldManager) {
        this.board       = board;
        this.score       = score;
        
        // Ghosts Data
        this.globalMode  = scatterMode;                 // Global Mode
        this.modeCounter = 0;                           // Amount of switchs between Scatter-Chase
        this.modeTimer   = score.getSwitchTime(0);      // Scatter/Chase timer
        this.frightTimer = 0;                           // Frigthen timer
        this.blinksCount = 0;                           // Amount of blinks at frighten end
        this.eyesCounter = 0;                           // Amount of dead Ghost during a fright mode
        
        // The Ghosts
        var canvas       = this.board.getGameCanvas(), self = this;
        this.blinky      = new Blinky(this, canvas, oldManager ? oldManager.blinky.getDots() : null);
        this.pinky       = new Pinky(this,  canvas, oldManager ? oldManager.pinky.getDots()  : null);
        this.inky        = new Inky(this,   canvas, oldManager ? oldManager.inky.getDots()   : null);
        this.clyde       = new Clyde(this,  canvas, oldManager ? oldManager.clyde.getDots()  : null);
        this.ghosts      = [ this.blinky, this.pinky, this.inky, this.clyde ];
        
        // Pen Data
        this.penType     = !!oldManager;               // Type used to force ghosts out of the pen (false = using 
                                                       // ... ghost's dot counters | true = using global dot counter)
        this.penTimer    = 0;                          // Pen Leaving Force Timer
        this.globalDots  = 0;                          // Global dots counter
        this.inPen       = [ this.pinky, this.inky, this.clyde ];
        
        if (!this.penType) {
            this.inPen.forEach(function () {
                self.checkDotLimit();
            });
        }
    }
    
    /**
     * Animates all the Ghosts, and reduces the ghosts modes timers
     * @param {number} time
     * @param {number} speed
     * @param {Blob}   blob
     */
    Manager.prototype.animate = function (time, speed, blob) {
        if (this.frightTimer > 0) {
            this.frightTimer -= time;
        } else if (this.modeCounter < totalSwitchs && this.modeTimer > 0) {
            this.modeTimer -= time;
        }
        
        this.switchMode(blob);
        this.moveGhosts(speed, blob);
        
        this.increasePenTimer(time);
    };
    
    /**
     * Changes the Ghosts mode
     * @param {Blob} blob
     */
    Manager.prototype.switchMode = function (blob) {
        var oldMode = this.globalMode;
        if (isFrighten(this.globalMode) && this.frightTimer <= 0) {
            this.blinksCount -= 1;
            
            if (this.blinksCount >= 0) {
                this.frightTimer = blinksTimer;
                this.globalMode  = this.globalMode === whiteMode ? blueMode : whiteMode;
            } else {
                this.globalMode  = this.getSwitchMode();
            }
            this.switchGhostsMode(oldMode, blob);
        
        } else if (this.modeTimer <= 0) {
            this.modeCounter += 1;
            this.globalMode   = this.getSwitchMode();
            this.modeTimer    = this.score.getSwitchTime(this.modeCounter);
            this.switchGhostsMode(oldMode, blob);
        }
    };
    
    /**
     * Changes the mode of each Ghost
     * @param {number} oldMode
     * @param {Blob}   blob
     */
    Manager.prototype.switchGhostsMode = function (oldMode, blob) {
        var newMode = this.globalMode;
        this.ghosts.forEach(function (ghost) {
            ghost.switchMode(oldMode, newMode, blob);
        });
    };
    
    /**
     * Moves all The Ghosts
     * @param {number} speed
     * @param {Blob}   blob
     */
    Manager.prototype.moveGhosts = function (speed, blob) {
        this.ghosts.forEach(function (ghost) {
            ghost.move(speed, blob);
        });
    };
    
    /**
     * Draws all The Ghosts
     */
    Manager.prototype.drawGhosts = function () {
        this.ghosts.forEach(function (ghost) {
            ghost.draw();
        });
    };
    
    /**
     * Sets the Ghosts targets when the Blob reached a new Tile
     * @param {Blob} blob
     */
    Manager.prototype.setTargets = function (blob) {
        var self = this;
        this.ghosts.forEach(function (ghost) {
            if (ghost.shouldChangeTarget(self.globalMode)) {
                ghost.setChaseTarget(blob, self.blinky);
            }
        });
    };
    
    /**
     * Sets Blinky's "Cruise Elroy" Mode when the number of dots left reaches the target
     * @param {number} dots
     */
    Manager.prototype.checkElroyDots = function (dots) {
        this.blinky.checkElroyDots(dots);
    };
    
    /**
     * Switches to Frighten mode
     * @param {Blob} blob
     */
    Manager.prototype.frighten = function (blob) {
        var oldMode      = this.globalMode;
        this.globalMode  = blueMode;
        this.frightTimer = this.score.getFrightTime();
        this.blinksCount = this.score.getBlinks();
        this.eyesCounter = 0;
        
        this.switchGhostsMode(oldMode, blob);
    };
    
    /**
     * The Ghost kills the Blob or Dies from it. Returns true if the Blob died
     * @param {Blob} blob
     * @return {boolean}
     */
    Manager.prototype.crash = function (blob) {
        return this.ghosts.some(function (ghost) {
            return ghost.killOrDie(blob);
        });
    };
    
    /**
     * Increases the amount of dead Ghosts in a single Fright period
     * @param {{x: number, y: number}} pos
     */
    Manager.prototype.increaseEyes = function (pos) {
        this.eyesCounter += 1;
        this.score.kill(this.eyesCounter, pos);
    };
    
    /**
     * Returns the current Scatter or Chase mode
     * @return {number}
     */
    Manager.prototype.getSwitchMode = function () {
        return this.modeCounter % 2;
    };
    
    /**
     * Returns the current Mode, including the Fright variations
     * @return {number}
     */
    Manager.prototype.getMode = function () {
        return this.globalMode;
    };
    
    /**
     * Returns true if the current mode is a Fright
     * @return {boolean}
     */
    Manager.prototype.areFrighten = function () {
        return isFrighten(this.globalMode);
    };
    
    
    /**
     * Increases the global dots or the first Ghost internal dots depending on the mode
     */
    Manager.prototype.incDotCounter = function () {
        if (!this.penType) {
            this.incGhostsDots();
        } else {
            this.incGlobalDots();
        }
    };
    
    /**
     * Increases the internal dots counter for the Ghost in the Pen array
     */
    Manager.prototype.incGhostsDots = function () {
        if (this.inPen.length > 0) {
            this.inPen[0].increaseDots();
            this.checkDotLimit();
        }
    };
    
    /**
     * Checks if a ghost can leave pen
     */
    Manager.prototype.checkDotLimit = function () {
        var limits = this.score.getLevelData("penLeavingLimit");
        
        if (limits[this.inPen[0].getID()] <= this.inPen[0].getDots()) {
            this.releaseGhostFromPen();
        }
    };
    
    /**
     * Increases the global dot counter and release ghosts changes type when required
     */
    Manager.prototype.incGlobalDots = function () {
        var self = this;
        this.globalDots += 1;
        
        this.inPen.forEach(function (ghost) {
            if (self.globalDots === penDotsCount[ghost.getID()]) {
                if (ghost.getID() <= 2) {
                    self.releaseGhostFromPen();
                } else {
                    self.penType    = false;
                    self.globalDots = 0;
                }
            }
        });
    };
    
    /**
     * Increases the Pen Timer
     * @param {number} time
     */
    Manager.prototype.increasePenTimer = function (time) {
        this.penTimer += time;
        if (this.inPen.length > 0 && this.penTimer >= this.score.getPenForceTime()) {
            this.releaseGhostFromPen();
            this.penTimer = 0;
        }
    };
    
    /**
     * Resents the Pen Timer to cero, since the Blob ate a pill and checks the Dots counters
     */
    Manager.prototype.resetPenTimer = function () {
        this.penTimer = 0;
        this.incDotCounter();
    };
    
    /**
     * Releases the first Ghost in the vector from Pen
     */
    Manager.prototype.releaseGhostFromPen = function () {
        var ghost = this.inPen[0];
        ghost.setPath("exitPen");
        ghost.activateElroy();
        
        this.inPen = this.inPen.slice(1);
    };
    
    /**
     * Adds the given Ghost to Pen
     * @param {Ghost} ghost
     */
    Manager.prototype.addGhostToPen = function (ghost) {
        var i = 0;
        
        // Blinky never stays in the Pen
        if (ghost.getID() === 0) {
            ghost.setPath("exitPen");
        } else {
            while (i < this.inPen.length && this.inPen[i].getID() <= ghost.getID()) {
                i += 1;
            }
            this.inPen.splice(i, 0, ghost);
            ghost.setPath("inPen");
            
            if (!this.penType) {
                this.checkDotLimit();
            }
        }
    };
    
    
    
    // The public API
    return {
        Manager : Manager,
        Blinky  : Blinky,
        Pinky   : Pinky,
        Inky    : Inky,
        Clyde   : Clyde
    };
}());