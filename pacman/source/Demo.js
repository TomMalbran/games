/*jslint browser: true */
/*global Score, Blob, Ghosts, Food, Utils */

var Demo = (function () {
    "use strict";
    
    var animations   = [ "title", "chase", "frighten", "present" ],
        titleData    = {
            endTime     : 700,
            endTile     : 11,
            leftText    : { x:  9, y: 4 },
            rightText   : { x: 13, y: 4 },
            blobY       : 4.5,
            blobDir     : { x: 1, y: 0 },
            blobMouth   : 5,
            blobRadius  : 2.5
        },
        chaseData    = {
            endTile     : 26.5,
            playersY    : 15,
            playersDir  : { x: 1, y: 0 },
            scoreInc    : 500,
            scoreTime   : 1000,
            enerX       : 26,
            enerY       : 14.5
        },
        frightenData = {
            endTile     : -4,
            playersDir  : { x: -1, y: 0 },
            speedMult   : 0.9,
            textTile    : 15
        },
        presentData  = {
            playersDir  : { x: 1, y: 0 },
            presentTile : 20,
            namePos     : { x: 14, y: 15 },
            timer       : 1000
        };
    
    
    
    /**
     * @constructor
     * @private
     * @extends {Blob}
     * The Big Blob Class. Used in the title animation
     * @param {Board} board
     */
    function BigBlob(board) {
        this.ctx    = board.getScreenCanvas().getContext();
        this.radius = titleData.blobRadius * board.getTileSize();
        this.x      = -this.radius;
        this.y      = titleData.blobY * board.getTileSize();
        this.dir    = Object.create(titleData.blobDir);
        this.mouth  = titleData.blobMouth;
        this.timer  = 0;
        
        this.endPos = titleData.endTile * board.getTileSize();
    }
    
    BigBlob.prototype = Object.create(Blob.prototype);
    BigBlob.prototype.constructor = BigBlob;
    BigBlob.prototype.parentClass = Blob.prototype;
    
    /**
     * Moves the Big Blob. Specially made for the title animation
     * @param {number} time 
     */
    BigBlob.prototype.animate = function (time) {
        this.timer += time;
        this.x      = Math.round(this.timer * this.endPos / titleData.endTime);
        
        this.moveMouth();
        this.draw();
    };
    
    /**
     * When the Blob reaches it positions, it draws it there
     */
    BigBlob.prototype.endAnimation = function () {
        this.mouth = titleData.blobMouth;
        this.x     = this.endPos;
        this.draw();
    };
    
    /**
     * Removes the Canvas Save pos, since is not required
     */
    BigBlob.prototype.savePos = function () {
        return undefined;
    };
    
    
    
    /**
     * @constructor
     * @private
     * @extends {Blob}
     * The Demo Blob Class
     * @param {Board} board
     * @param {Score} score
     */
    function DemoBlob(board, score) {
		this.init(board, score, board.getScreenCanvas());
	}
    
    DemoBlob.prototype = Object.create(Blob.prototype);
    DemoBlob.prototype.constructor = DemoBlob;
    DemoBlob.prototype.parentClass = Blob.prototype;
    
    /**
     * Initialize some variables for the demo animation
     * @param {{x: number, y: number}} dir
     * @param {number} x
     * @param {number} y
     */
    DemoBlob.prototype.chaseDemo = function (dir, x, y) {
        this.dir   = Object.create(dir);
        this.x     = x;
		this.y     = y;
        this.speed = this.score.getLevelData("pmSpeed");
    };
    
    /**
     * The second animation of the demo in Frighten mode
     * @param {{x: number, y: number}} dir
     */
    DemoBlob.prototype.frightenDemo = function (dir) {
        this.dir   = Object.create(dir);
        this.speed = this.score.getLevelData("pmFrightSpeed");
    };
    
    /**
     * The animation used on the Demo
     * @param {number} speed
     */
    DemoBlob.prototype.animate = function (speed) {
        this.x += this.dir.x * this.speed * speed;
        
        this.moveMouth();
        this.draw();
    };
    
    
    
    /**
     * @constructor
     * @private
     * @extends {Food}
     * The Demo Food Class. Used in the chase animation
     * @param {Board} board
     */
    function DemoFood(board) {
        this.board = board;
        this.ctx   = board.getScreenCanvas().getContext();
		
        this.init();
    }
    
    DemoFood.prototype = Object.create(Food.prototype);
    DemoFood.prototype.constructor = DemoFood;
    DemoFood.prototype.parentClass = Food.prototype;
    
    /**
     * The wink animation used for the chase anmiation
     */
    DemoFood.prototype.wink = function () {
        var x = this.board.getTileCenter(chaseData.enerX),
            y = this.board.getTileCenter(chaseData.enerY);
        
        this.calcRadius();
        this.clearEnergizer(x, y);
        this.drawEnergizer(x, y, this.radius);
    };
    
    
    
    
    /**
     * @constructor
     * The Demo Class
     * @param {Board} board
     */
	function Demo(board) {
        this.board    = board;
        this.canvas   = board.getScreenCanvas();
        this.ctx      = this.canvas.getContext();
        
		this.step     = -1;
		this.name     = "";
        this.score    = new Score(board);
        this.bigBlob  = new BigBlob(board);
        this.food     = new DemoFood(board);
        
		this.nextAnimation();
	}
    
    /**
     * Destroys the current Demo and leaves it ready for the next start
     */
    Demo.prototype.destroy = function () {
        this.step = -1;
        this.canvas.clear();
        this.nextAnimation();
    };
	
    
    /**
     * Calls the animation the demo is at
     * @param {number} time
     * @param {number} speed
     */
	Demo.prototype.animate = function (time, speed) {
		switch (this.name) {
        case "title":
            this.titleAnimation(time);
            break;
		case "chase":
            this.chaseAnimation(speed);
            break;
		case "frighten":
            this.frightenAnimation(time, speed);
            break;
		case "present":
            this.presentAnimation(time, speed);
            break;
		}
	};
    
    /**
     * Jumps to the next animation in the demo
     */
	Demo.prototype.nextAnimation = function () {
        this.step  = this.step === animations.length - 1 ? 1 : this.step + 1;
		this.name  = animations[this.step];
        this.timer = 0;
		
        switch (this.name) {
        case "chase":
            this.initChase();
            break;
        case "frighten":
            this.initFrighten();
            break;
        case "present":
            this.initPresent();
            break;
        }
	};
	
	
	/**
	 * The Title Animation
	 * @param {number} time
	 */
	Demo.prototype.titleAnimation = function (time) {
		this.timer += time;
        var alpha   = 1 - Math.round(10 * this.timer / titleData.endTime) / 10;
		
		this.canvas.clear();
		this.bigBlob.animate(time);
		this.canvas.fill(alpha);
		
		if (this.timer > titleData.endTime) {
			this.canvas.clear();
			this.drawTitle();
            this.bigBlob.endAnimation();
			this.nextAnimation();
		}
	};
    
    /**
     * Draws the Pacman title
     */
    Demo.prototype.drawTitle = function () {
        var size = this.board.getTileSize();
        
		this.ctx.save();
		this.ctx.font      = "6em 'Whimsy TT'";
		this.ctx.textAlign = "right";
		this.ctx.fillText("Pa", titleData.leftText.x * size, titleData.leftText.y * size);
		this.ctx.textAlign = "left";
		this.ctx.fillText("man", titleData.rightText.x * size, titleData.rightText.y * size);
		this.ctx.restore();
	};
	
    
    /**
     * Initializes the Players for the Chase animation
     */
    Demo.prototype.initChase = function () {
        var size = this.board.getTileSize(),
            yPos = chaseData.playersY * size;
        
        this.createPlayers();
        this.blob.chaseDemo(chaseData.playersDir,        -size, yPos);
        this.blinky.chaseDemo(chaseData.playersDir,  -4 * size, yPos);
        this.pinky.chaseDemo(chaseData.playersDir,   -6 * size, yPos);
        this.inky.chaseDemo(chaseData.playersDir,    -8 * size, yPos);
        this.clyde.chaseDemo(chaseData.playersDir,  -10 * size, yPos);
        
        this.endPos = chaseData.endTile * this.board.getTileSize();
    };
    
    /**
     * Creates the Blob and the Ghosts
     */
    Demo.prototype.createPlayers = function () {
        var canvas  = this.board.getScreenCanvas();
        this.blob   = new DemoBlob(this.board, this.score);
        this.blinky = new Ghosts.Blinky(this, canvas);
        this.pinky  = new Ghosts.Pinky(this, canvas);
        this.inky   = new Ghosts.Inky(this, canvas);
        this.clyde  = new Ghosts.Clyde(this, canvas);
        
        this.ghosts = [ this.blinky, this.pinky, this.inky, this.clyde ];
    };
    
	/**
	 * The Chase Animation
	 * @param {number} speed
	 */
	Demo.prototype.chaseAnimation = function (speed) {
        this.animatePlayers(speed, true);
        
        if (this.blob.getX() >= this.endPos) {
			this.nextAnimation();
        }
	};
	
    
    /**
     * Initializes the Players for the Frighten animation
     */
    Demo.prototype.initFrighten = function () {
        var speed = this.score.getLevelData("ghostFrightSpeed") * frightenData.speedMult;
        
        this.blob.frightenDemo(frightenData.playersDir);
        this.blinky.frightenDemo(frightenData.playersDir, speed);
        this.pinky.frightenDemo(frightenData.playersDir,  speed);
        this.inky.frightenDemo(frightenData.playersDir,   speed);
        this.clyde.frightenDemo(frightenData.playersDir,  speed);
        
        this.scores  = [];
        this.endPos  = frightenData.endTile  * this.board.getTileSize();
    };
    
    /**
	 * The Frighten Animation
	 * @param {number} time
	 * @param {number} speed
	 */
	Demo.prototype.frightenAnimation = function (time, speed) {
        this.animatePlayers(speed);
		this.drawScores(time);
		
		if (this.ghosts.length > 0 && this.blob.getX() <= this.ghosts[0].getX()) {
            this.ghosts.shift();
			this.text = this.blob.getX();
            this.scores.push({
                timer : 0,
                size  : 1,
                color : "rgb(51, 255, 255)",
                text  : this.score.getGhostScore(4 - this.ghosts.length),
                pos   : {
                    x : this.blob.getX() / this.board.getTileSize(),
                    y : frightenData.textTile
                }
            });
		}
		if (this.blob.getX() < this.endPos) {
			this.nextAnimation();
        }
	};
    
    /**
     * Draws the Scores in the Canvas
     * @param {number} time
     */
    Demo.prototype.drawScores = function (time) {
        var self = this;
        this.scores.forEach(function (score, index) {
            score.timer += time;
            score.size   = Math.min(0.2 + Math.round(score.timer * 100 / chaseData.scoreInc) / 100, 1);
            
            if (score.timer < chaseData.scoreTime) {
                self.canvas.drawText(score);
            } else {
                self.scores.splice(index, 1);
            }
        });
	};
	
    
    /**
     * Initializes the Players for the Present animation
     */
    Demo.prototype.initPresent = function () {
        this.blob = null;
        this.blinky.presentDemo(presentData.playersDir);
        this.pinky.presentDemo(presentData.playersDir);
        this.inky.presentDemo(presentData.playersDir);
        this.clyde.presentDemo(presentData.playersDir);
        
        this.ghosts   = [ this.blinky ];
        this.others   = [ this.pinky, this.inky, this.clyde ];
        this.count    = 4;
        this.presentX = presentData.presentTile * this.board.getTileSize();
        this.exitX    = this.board.getWidth()   + this.board.getTileSize();
    };
    
    /**
	 * The Present Animation
	 * @param {number} time
	 * @param {number} speed
	 */
	Demo.prototype.presentAnimation = function (time, speed) {
        if (this.timer <= 0) {
            this.animatePlayers(speed);
            
            if (this.count > 0 && this.ghosts[0].getX() > this.presentX) {
                this.drawName(this.ghosts[0]);
                if (this.others.length) {
                    this.ghosts.unshift(this.others[0]);
                    this.others.shift();
                }
                this.timer  = presentData.timer;
                this.count -= 1;
            
            } else if (this.ghosts[this.ghosts.length - 1].getX() > this.exitX) {
                this.ghosts.pop();
                if (!this.ghosts.length) {
                    this.nextAnimation();
                }
            }
            
        } else {
            this.timer -= time;
        }
	};
    
    /**
     * Draws the Name of the given Ghost
     * @param {Ghost} ghost
     */
    Demo.prototype.drawName = function (ghost) {
		this.canvas.drawText({
			size:  2,
			color: ghost.getBodyColor(),
			text:  "‘" + ghost.getName() + "’",
			pos:   presentData.namePos
		});
	};
    
    
    /**
     * Animates all the players
     * @param {number} speed
     * @param {?boolean} food
     */
    Demo.prototype.animatePlayers = function (speed, food) {
        this.canvas.clearSavedRects();
        
        if (food) {
            this.food.wink();
        }
        this.ghosts.forEach(function (ghost) {
            ghost.demoAnimate(speed);
        });
        
        if (this.blob) {
            this.blob.animate(speed);
        }
    };
	
    
    
    // The public API
    return Demo;
}());