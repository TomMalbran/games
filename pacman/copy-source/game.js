/*jslint es5: true, plusplus: true, sloppy: true, white: true, browser: true */
/*global pacman, pmAnimate, pmAudio, pmBoard, pmBlob, pmData, pmDraw, pmFood, pmFruit, pmGhosts, pmHigh, pmKeys,
		 pmMessages, pmPen, pmScore, pmScreen, pmSequences, pmStart, subs */

window.addEventListener("load", function () { pacman.init(); }, false);

/* Contents:
  I.	Pacman Game
  II.   Messages Panel
  III.  Animation Frame
  IV.   Food Manager
  V.    Blob Manager
  VI.   Ghosts Manager
  VII.  Ghosts House
  VIII. Game Score
  IX.   Game Sequences
  X.    Keys Controler
*/


/* ----------------
    Pacman Game  */

var pacman = {
	
	container: {},
	display:   "mainScreen",
	
	
	init: function () {
		this.container = document.getElementById("container");
		
		pmBoard.init();
		pmDraw.init();
		pmScreen.init();
		pmStart.init();
		pmKeys.init();
		pmAnimate.request();
	},
	start: function () {
		this.display = "playing";
		this.showDisplay();
		
		pmBoard.draw();
		pmDraw.clearAll();
		pmScreen.clear();
		pmScore.init();
		this.animate(false);
	},
	animate: function (newLife) {
		pmFood.init(newLife);
		pmBlob.init();
		pmGhosts.init(newLife);
		pmPen.init(newLife);
		pmSequences.init();
		pmAnimate.start();
	},
	
	
	// Start Game or Save
	restart: function () {
		if (this.saving && subs.supportsStorage()) {
			pmHigh.saveScore();
		} else if (!this.started) {
			this.start();
        }
	},
	
	// Pause Game
	pause: function () {
		if (this.isPaused()) {
			this.display = "playing";
			pmSequences.end();
        } else {
			this.display = "paused";
			pmSequences.paused();
        }
	},
	
	// Game Over
	gameOver: function () {
		this.display = "gameOver";
		
		pmAnimate.cancel();
		this.newGame();
	},
	
	// Start New Game
	newGame: function () {
		this.init();
		
		pmMessages.newGame();
		pmBoard.clear();
	},
	
	// Show High Scores
	highScores: function () {
	},
	
	
	// Sub Functions
	showDisplay: function () {
		this.container.className = this.display;
	},
	hasStarted: function () {
		return this.display === "playing" || this.display === "paused";
	},
	isPaused: function () {
		return this.display === "paused";
	}
};



/* --------------------
    Animation Frame  */

var pmAnimate = {

	time:      1000 / 90,
	started:   0,
	speed:     1,
	starting:  false,
	animation: {},
	
	
	start: function () {
		this.cancel();
		this.starting  = true;
		this.animation = setTimeout(this.request, 3000);
	},
	
	request: function () {
		this.started   = new Date().getTime();
		this.starting  = false;
		this.animation = subs.requestAnimationFrame(function (){
			pmAnimate.animate();
		});
	},
	cancel: function () {
		subs.cancelAnimationFrame(this.animation);
	},
	
	animate: function () {
		this.time  = new Date().getTime() - this.started;
		this.speed = this.time / 16;
		if (this.speed < 0 || this.speed > 5) {
			return this.request();
        }
		
		if (!pacman.hasStarted()) {
			pmDraw.clearAll();
			pmStart.animate();
		} else if (pmSequences.isAnimating()) {
			pmDraw.clearAll();
			pmSequences.animate();
        } else {
			pmDraw.clear();
			pmFood.wink();
			pmSequences.animate();
			pmFood.reduceTimer();
			pmPen.increaseTimer();
			pmGhosts.animate();
			pmBlob.animate();
		}
		
		if (!this.starting) {
			this.request();
        }
	},
	
	// Sub Functions
	getTiming: function () { return this.time;  },
	getSpeed:  function () { return this.speed; }
};



/* ---------------
    Start Demo  */

var pmStart = {
	
	step: -1,
	data: {},
	
	init: function () {
		this.step = -1;
		this.data = {};
		this.next();
	},
	
	animate: function () {
		switch (this.step) {
			case 0: this.title();    break;
			case 1: this.chase();    break;
			case 2: this.frighten(); break;
			case 3: this.present();  break;
		}
	},
	next: function () {
		var id;
        this.step = this.step === 3 ? 1 : this.step + 1;
		this.data = {};
		for (id in pmData.demo[this.step]) {
			if (pmData.demo[this.step].hasOwnProperty(id)) {
				this.data[id] = pmData.demo[this.step][id];
			}
        }
	},
	
	
	// Title Animation
	title: function () {
		this.data.timer += pmAnimate.getTiming();
		this.data.mouth = (this.data.mouth + 1) % 20;
		var left = Math.round(this.data.timer) / 4,
            alpha = 1 - Math.round(this.data.timer * 1.8) / 2000;
		
		pmScreen.clear();
		pmScreen.blob(left > 133 ? 133 : left, Math.floor(this.data.mouth / 5));
		pmScreen.fill(alpha);
		
		if (this.data.timer > 550) {
			pmScreen.clear();
			pmScreen.title();
			this.next();
		}
	},
	
	
	// Demo Animation
	chase: function () {
		this.data.blob   += pmData.levels[0].pmSpeed    * pmAnimate.getSpeed();
		this.data.ghosts += pmData.levels[0].ghostSpeed * pmAnimate.getSpeed();
		this.data.mouth   = (this.data.mouth + 1) % 20;
		this.data.feet    = (this.data.feet + 0.3) % 2;
		this.data.radius += this.data.mult * 0.1;
		this.data.mult    = this.data.radius <= 3 ? 1 : (this.data.radius >= 5 ? -1 : this.data.mult);
		
		this.drawGhosts();
		this.drawBlob();
		pmBoard.energizer(pmDraw.getGame(), 310, 180, this.data.radius);
		
		if (this.data.blob >= 310) {
			this.next();
        }
	},
	
	frighten: function () {
		this.data.blob   -= pmData.levels[0].pmFrightSpeed;
		this.data.ghosts -= pmData.levels[0].ghostFrightSpeed * 0.9;
		this.data.mouth   = (this.data.mouth + 1) % 20;
		this.data.feet    = (this.data.feet + 0.3) % 2;
		
		this.drawScore();
		this.drawGhosts();
		this.drawBlob();
		
		if (this.data.amount > 0 && this.data.blob <= this.data.ghosts - (4 - this.data.amount) * 25 + 5) {
			this.data.amount--;
			this.data.text = this.data.blob;
		}
		if (this.data.blob < -100) {
			this.next();
        }
	},
	
	present: function () {
		if (this.data.timer <= 0) {
			this.data.ghosts += pmData.levels[0].ghostSpeed;
			this.data.feet    = (this.data.feet + 0.3) % 2;
			
			this.drawGhosts();
			
			if (this.data.ghosts > 230 + this.data.name * this.data.dist) {
				this.data.timer = 1000;
				this.data.name++;
			} else if (this.data.ghosts > 1200) {
				this.next();
            }
		} else {
			this.data.timer -= pmAnimate.getTiming();
			this.drawGhosts();
			this.drawName();
		}
	},
	
	
	// Sub Functions
	drawBlob: function () {
		pmDraw.blob({
			ctx:    pmDraw.getGame(),
			x:      this.data.blob,
			y:      180,
			angle:  this.data.rad * Math.PI,
			radius: pmData.blobRadius,
			mouth:  Math.floor(this.data.mouth / 5)
		});
	},
	drawGhosts: function () {
		var i, pos;
        for (i = 4 - this.data.amount; i < 4; i++) {
			pos = this.data.ghosts - i * this.data.dist;
			if (pos > -10 && pos < pmData.canvasWidth + 10) {
				pmDraw.ghost({
					ctx:    pmDraw.getGame(),
					id:     i,
					mode:   this.data.mode,
					x:      pos,
					y:      180,
					fright: pmData.isFrighten(this.data.mode),
					feet:   Math.floor(this.data.feet),
					add:    [ this.data.dir, 0 ]
				});
            }
		}
	},
	drawScore: function () {
		if (this.data.text > 0 && this.data.blob > 20) {
			pmDraw.text({
				size:  12,
				color: 'rgb(51,255,255)',
				text:  Math.pow(2, 4 - this.data.amount) * 100,
				pos:   [ this.data.text, 180 ]
			});
        }
	},
	drawName: function () {
		pmDraw.text({
			size:  25,
			color: pmData.getGhost(this.data.name - 1).color,
			text:  '\'' + pmData.ghosts[this.data.name - 1] + '\'',
			pos:   [ 150, 180 ]
		});
	}
};



/* -----------------
    Food Manager  */

var pmFood = {

	matrix: [],
	total:  244,
	radius: 5,
	mult:   -1,
	timer:  0,
	
	init: function (newLife) {
		var i, j, col, row;
        
        this.timer = 0;
		pmBoard.clearFruit();
		if (newLife) { return; }
		
		this.matrix = [];
		this.total  = 244;
		this.radius = 5;
		this.mult   = -1;
		
		for (i = 0; i < pmData.dimensions[1]; i++) {
			this.matrix[i] = [];
			for (j = 0; j < pmData.dimensions[0]; j++) {
				this.matrix[i][j] = pmData.hasPill(j, i) ? 1 : 0;
            }
		}
		for (i = 0; i < pmData.energizers.length; i++) {
			col = pmData.energizers[i][0];
			row = pmData.energizers[i][1];
			this.matrix[row][col] = 5;
		}
		
		pmBoard.dots();
		pmBoard.energizers(this.radius);
	},
	
	eat: function () {
		var col = pmBlob.getTile()[0],
            row = pmBlob.getTile()[1];
		
        if (this.timer > 0 && this.atFruit()) {
			this.eatFruit();
        } else if (this.matrix[row][col] > 0) {
			this.eatDot(col, row);
			this.addFruit();
			return true;
		}
		return false;
	},
	
	
	// Dots
	wink: function () {
		this.radius += this.mult * 0.1;
		this.mult    = this.radius <= 3 ? 1 : (this.radius >= 5 ? -1 : this.mult);
		pmBoard.energizers(this.radius);
	},
	eatDot: function (col, row) {
		pmBoard.clearDot(col, row);
		this.total -= 1;
		
		pmScore.dot(this.matrix[row][col]);
		pmPen.dotCounter();
		pmGhosts.elroyDots(this.total);
		
		if (this.matrix[row][col] === 5) {
			pmGhosts.frighten();
			pmBlob.setSpeed();
		}
		this.matrix[row][col] = 0;
		
		if (this.total === 0) {
			pmScore.newLevel();
        }
	},
	
	
	// Fruits
	reduceTimer: function () {
		if (this.timer > 0) {
			this.timer -= pmAnimate.getTiming();
			if (this.timer <= 0) {
				pmBoard.clearFruit();
            }
		}
	},
	addFruit: function () {
		if (this.total === pmData.fruitDots[0] || this.total === pmData.fruitDots[1]) {
			this.timer = pmData.fruitTimer();
			pmFruit.draw(pmBoard.getBoard(), pmData.fruitPos[0], pmData.fruitPos[1]);
		}
	},
	eatFruit: function () {
		pmScore.fruit();
		pmBoard.clearFruit();
	},
	
	
	// Sub Functions
	atFruit: function () {
		var minX = pmData.fruitPos[0] - 2,
			maxX = pmData.fruitPos[0] + pmData.fruitSize - 2,
			minY = pmData.fruitPos[1] - 2,
			maxY = pmData.fruitPos[1] + pmData.fruitSize - 2;
		
		return (pmBlob.getX() >= minX && pmBlob.getX() <= maxX &&
				pmBlob.getY() >= minY && pmBlob.getY() <= maxY);
	},
	getValue: function (col, row) {
		return this.matrix[col][row];
	}
};



/* -----------------
    Blob Manager  */

var pmBlob = {

	tile:   [],
	x:      0,
	y:      0,
	dir:    [],
	speed:  0,
	center: true,
	turn:   [],
	delta:  [],
	mouth:  0,
	
	
	init: function () {
		this.tile   = [ 14, 23 ];
		this.x      = pmData.getMiddle(this.tile[0]);
		this.y      = pmData.getMiddle(this.tile[1]);
		this.dir    = [ -1, 0 ];
		this.speed  = pmData.getLevel().pmSpeed;
		this.center = true;
		this.turn   = null;
		this.delta  = null;
		this.mouth  = 5;
		
		this.draw();
	},
	
	animate: function () {
		if (this.center && this.crashed()) {
			this.mouth = 5;
		} else if (this.delta) {
			this.cornering();
        } else {
			this.move();
        }
		this.draw();
	},
	
	
	// Moving the Blob
	move: function () {
		this.x    += this.dir[0] * this.speed * pmAnimate.getSpeed();
		this.y    += this.dir[1] * this.speed * pmAnimate.getSpeed();
		this.mouth = (this.mouth + 1) % 20;
		
		this.newTile();
		this.atCenter();
		this.tunnelEnds();
	},
	
	// Entering a new Tile
	newTile: function () {
		var tile = pmData.getTile(this.x, this.y);
		if (this.tile[0] !== tile[0] || this.tile[1] !== tile[1]) {
			this.tile   = tile;
			this.center = false;
			
			if (this.turn && !this.isWall(this.turn)) {
				this.delta = [ this.dir[0] || this.turn[0], this.dir[1] || this.turn[1] ];
			}
			pmGhosts.crash();
			pmGhosts.setTargets();
		}
	},
	atCenter: function () {
		if (this.center || !this.passedCenter()) {
			return;
		}
		this.eat();
		var turn = false;
		if (this.turn && !this.isWall(this.turn)) {
			this.dir  = this.turn;
			this.turn = null;
			turn      = true;
		}
		if (turn || this.crashed()) {
			this.x = pmData.getMiddle(this.tile[0]);
			this.y = pmData.getMiddle(this.tile[1]);
		}
		this.center = true;
	},
	tunnelEnds: function () {
		if (this.x < -6) {
			this.x = 342;
		} else if (this.x > 342) {
			this.x = -6;
        }
	},
	
	
	// Cornering
	cornering: function () {
		this.x += this.delta[0] * this.speed * pmAnimate.getSpeed();
		this.y += this.delta[1] * this.speed * pmAnimate.getSpeed();
		
		if (this.passedCenter()) {
			if (this.dir[0]) { this.x = pmData.getMiddle(this.tile[0]); }
			if (this.dir[1]) { this.y = pmData.getMiddle(this.tile[1]); }
			this.dir   = this.turn;
			this.turn  = null;
			this.delta = null;
			
			this.eat();
		}
	},
	
	// Eat food (dots, energizers, fruits)
	eat: function () {
		var ate = pmFood.eat(this.tile[0], this.tile[1]);
		this.setSpeed(ate);
		if (ate) {
            pmPen.resetTimer();
        }
	},
	
	// New direction (given by the user)
	makeTurn: function (turn) {
		if (this.delta) {
            return;
		} else if (this.turnNow(turn)) {
			this.dir    = turn;
			this.turn   = null;
			this.center = false;
		} else {
			this.turn = turn;
        }
	},
	
	// Draw Blob
	draw: function () {
		pmDraw.blob({
			ctx:    pmDraw.getGame(),
			x:      this.x,
			y:      this.y,
			angle:  this.getAngle(),
			radius: pmData.blobRadius,
			mouth:  Math.floor(this.mouth / 5)
		});
	},
	

	// Sub Functions
	crashed: function () {
		return this.isWall(this.dir);
	},
	passedCenter: function () {
		return ((this.dir[0] ===  1 && this.x >= pmData.getMiddle(this.tile[0])) ||
				(this.dir[0] === -1 && this.x <= pmData.getMiddle(this.tile[0])) ||
				(this.dir[1] ===  1 && this.y >= pmData.getMiddle(this.tile[1])) ||
				(this.dir[1] === -1 && this.y <= pmData.getMiddle(this.tile[1])));
	},
	turnNow: function (turn) {
		return ((!this.dir[0] && !turn[0]) || (!this.dir[1] && !turn[1]) ||		// Halth Turn
				(this.center && this.crashed() && !this.isWall(turn)));			// Crash Turn
	},
	isWall: function (turn) {
		return pmData.isWall(this.tile[0] + turn[0], this.tile[1] + turn[1]);
	},
	
	setSpeed: function (ate) {
		var lvl = pmData.getLevel();
		if (pmData.isFrighten(pmGhosts.getMode())) {
			this.speed = ate ? lvl.eatingFrightSpeed : lvl.pmFrightSpeed;
		} else {
			this.speed = ate ? lvl.eatingSpeed : lvl.pmSpeed;
        }
	},
	getAngle: function () {
		if (this.dir[0] === -1) { return 0; }
		if (this.dir[0] ===  1) { return Math.PI; }
		if (this.dir[1] === -1) { return 0.5 * Math.PI; }
		if (this.dir[1] ===  1) { return 1.5 * Math.PI; }
	},
	
	getX:    function () { return this.x;    },
	getY:    function () { return this.y;    },
	getDir:  function () { return this.dir;  },
	getTile: function () { return this.tile; }
};



/* -------------------
    Ghosts Manager  */

var pmGhosts = {

	mode:    0,   // Global Mode
	switchs: 0,   // Amount of switchs between Scatter-Chase
	timer:   0,   // Scatter/Chase timer
	fright:  0,   // Frigthen timer
	blinks:  0,   // Amount of blinks at frighten end
	eyes:    0,   // Amount of dead Ghost 
	feet:    0,   // Feet type
	
	ghost:   {},  // Current ghost data
	blinky:  {},
	pinky:   {},
	inky:    {},
	clyde:   {},
	
	
	init: function (newLife) {
		var i, data;
        
        this.mode    = 0;
		this.switchs = 0;
		this.timer   = pmData.getSwitchTime(0);
		this.fright  = 0;
		this.blinks  = 0;
		this.eyes    = 0;
		this.feet    = 0;
		
		for (i = 0; i < pmData.ghosts.length; i++) {
            data = pmData.getGhost(i);
			this[pmData.ghosts[i]] = {
				id:      i,
				mode:    0,
				tile:    data.inpen ? [ 13, 14 ] : [ 13, 11 ],
				x:       data.position[0],
				y:       data.position[1],
				dir:     data.direction,
				turn:    data.inpen ? [ -1, 0 ] : null,
				center:  false,
                reverse: false,
				dots:    newLife ? this[pmData.ghosts[i]].dots : 0,
				target:  data.scatter,
				path:    data.path,
				step:    0,
				speed:   data.inpen ? pmData.inPenSpeed : pmData.getLevel().ghostSpeed,
				elroy:   newLife ? this[pmData.ghosts[i]].elroy : 0,
				active:  !newLife
			};
			this.ghost = this[pmData.ghosts[i]];
			this.draw();
		}
	},
	
	animate: function () {
		if (this.fright > 0) {
			this.fright -= pmAnimate.getTiming();
		} else if (this.switchs < 7 && this.timer > 0) {
			this.timer -= pmAnimate.getTiming();
		}
		this.feet = (this.feet + 0.3) % 2;
		this.timers();
		this.move();
	},
	
	
	// Ghosts Modes
	timers: function () {
		var oldMode = this.mode;
		if (pmData.isFrighten(this.mode) && this.fright <= 0) {
			this.blinks--;
			if (this.blinks >= 0) {
				this.fright = 230;
				this.mode   = this.mode === 3 ? 2 : 3;
			} else {
				this.mode = this.getSwitchMode();
            }
			this.switchMode(oldMode);
		} else if (this.timer <= 0) {
			this.switchs++;
			this.mode  = this.getSwitchMode();
			this.timer = pmData.getSwitchTime(this.switchs);
			this.switchMode(oldMode);
		}
	},
	
	switchMode: function (oldMode) {
		var i, ghost;
        for (i = 0; i < pmData.ghosts.length; i++) {
			ghost = pmData.ghosts[i];
			if (!this.dontSwitch(this[ghost].mode, oldMode)) {
                this[ghost].mode   = this.mode;
                this[ghost].target = this.getTarget(this[ghost]);
                this[ghost].speed  = this.getSpeed(this[ghost]);
                
                if (!this.dontHalthTurn(oldMode)) {
                    if (this[ghost].path === null) {
                        this[ghost].turn = [this[ghost].dir[0] * -1, this[ghost].dir[1] * -1];
                    } else {
                        this[ghost].turn = [ 1, 0 ];
                    }
                }
            }
		}
	},
	
	
	// Move Ghosts
	move: function () {
		var i;
        for (i = 0; i < pmData.ghosts.length; i++) {
			this.ghost    = this[pmData.ghosts[i]];
			this.ghost.x += this.ghost.dir[0] * this.ghost.speed * pmAnimate.getSpeed();
			this.ghost.y += this.ghost.dir[1] * this.ghost.speed * pmAnimate.getSpeed();
			
			if (this.ghost.path !== null) {
				this.pathMove();
			} else {
				this.normalMove();
			}
            
			this.draw();
			this[pmData.ghosts[i]] = this.ghost;
		}
	},
	
	pathMove: function () {
		if (this.passedDist()) {
			if (this.ghost.dir[0]) {
				this.ghost.x = this.getPath().distx;
            }
			if (this.ghost.dir[1]) {
				this.ghost.y = this.getPath().disty;
			}
            
			if (this.getPath().next !== null) {
				this.ghost.step = this.getPath().next;
				this.ghost.dir  = this.getPath().dir;
			} else if (pmData.isExitPath(this.ghost.path)) {
				this.ghost.path  = null;
				this.ghost.dir   = this.ghost.turn;
				this.ghost.turn  = null;
				this.ghost.speed = pmData.getLevel().ghostSpeed;
			} else if (pmData.isEnterPath(this.ghost.path)) {
				this.ghost.mode   = this.getSwitchMode();
				this.ghost.target = this.getTarget(this.ghost);
				this.ghost.tile   = [ 13, 14 ];
				this.ghost.turn   = [ -1, 0 ];
				pmPen.addGhost(this.ghost.id);
			}
		}
	},
	normalMove: function () {
		this.newTile();
		this.tunnelEnds();
		
		if (!this.ghost.center && this.passedCenter()) {
			if (this.ghost.turn) {
                this.makeTurn();
            }
            if (this.isNextIntersection()) {
                this.decideTurn();
            }
            this.ghost.speed  = this.getSpeed(this.ghost);
            this.ghost.center = true;
		}
	},
	
	
	// Move Sub Functions
	newTile: function () {
		var tile = pmData.getTile(this.ghost.x, this.ghost.y);
		if (this.ghost.tile[0] !== tile[0] || this.ghost.tile[1] !== tile[1]) {
			this.ghost.tile   = tile;
			this.ghost.center = false;
			
			if (this.enterPen()) {
				this.setPath(this.ghost.id, pmData.getEnterPath(this.ghost.id));
            }
			this.killOrDie(this.ghost.id);
		}
	},
	tunnelEnds: function () {
		if (this.ghost.x < -6) {
			this.ghost.x = 342;
		} else if (this.ghost.x > 342) {
			this.ghost.x = -6;
        }
	},
	
	
	// Possible turns
	makeTurn: function () {
		this.ghost.x    = pmData.getMiddle(this.ghost.tile[0]);
		this.ghost.y    = pmData.getMiddle(this.ghost.tile[1]);
		this.ghost.dir  = this.ghost.turn;
		this.ghost.turn = null;
	},
	decideTurn: function () {
		var turns = this.getTurns();
		if (turns.length === 1) {
			this.ghost.turn = turns[0];
		} else if (pmData.isFrighten(this.ghost.mode)) {
			this.ghost.turn = turns[subs.rand(0, turns.length - 1)];
        } else {
			this.targetTurn(turns);
        }
	},
	targetTurn: function (turns) {
		var i, ntile, distx, disty, dist,
            tile = this.nextTile(),
            best = 999999;
		
		for (i = 0; i < turns.length; i++) {
			ntile = [ tile[0] + turns[i][0], tile[1] + turns[i][1] ];
			distx = Math.pow(this.ghost.target[0] - ntile[0], 2);
			disty = Math.pow(this.ghost.target[1] - ntile[1], 2);
			dist  = Math.sqrt(distx + disty);
			if (dist < best) {
				best = dist;
				this.ghost.turn = turns[i];
			}
		}
	},
	
	
	// Switch to Frighten mode
	frighten: function () {
		this.mode   = 2;
		this.fright = pmData.getFrightTime();
		this.blinks = pmData.getBlinks();
		this.eyes   = 0;
		this.switchMode();
	},
	
	// Kill or Die
	crash: function () {
		var i;
        for (i = 0; i < pmData.ghosts.length; i++) {
			this.killOrDie(i);
        }
	},
	killOrDie: function (id) {
		var ghost = pmData.ghosts[id];
		if (this.sameTile(this[ghost].tile)) {
			if (pmData.isFrighten(this[ghost].mode)) {
				this.eyes++;
				this[ghost].mode   = 4;
				this[ghost].target = pmData.eyesTarget;
				this[ghost].speed  = pmData.eyesSpeed;
				pmScore.kill(this[ghost].x, this[ghost].y, this.eyes);
			} else if (!pmData.isEyes(this[ghost].mode)) {
				pmSequences.die();
            }
		}
	},
	
	// Blinky's "Cruise Elroy" Mode
	elroyDots: function (dots) {
		if (dots === pmData.getLevel().elroyDotsLeft1 || dots === pmData.getLevel().elroyDotsLeft2) {
			this.blinky.elroy++;
        }
	},
	activateElroy: function () {
		this.blinky.active = true;
	},
	
	// Draw Ghosts
	draw: function () {
		pmDraw.ghost({
			ctx:    pmDraw.getGame(),
			id:     this.ghost.id,
			mode:   this.ghost.mode,
			x:      this.ghost.x,
			y:      this.ghost.y,
			fright: pmData.isFrighten(this.ghost.mode),
			feet:   Math.floor(this.feet),
			add:    this.ghost.dir
		});
	},
	
	
	// Data Sub Functions
	getSpeed: function (ghost) {
		var speed = pmData.getLevel().ghostSpeed;
		if (pmData.isEyes(ghost.mode)) {
			speed = pmData.eyesSpeed;
		} else if (pmData.isFrighten(ghost.mode)) {
			speed = pmData.getLevel().ghostFrightSpeed;
        } else if (pmData.isTunnel(ghost.tile[0], ghost.tile[1])) {
			speed = pmData.getLevel().tunnelSpeed;
		} else if (this.isElroy(ghost)) {
			speed = pmData.getLevel()['elroySpeed' + ghost.elroy];
		}
		return speed;
	},
	setPath: function (id, path) {
		var ghost = pmData.ghosts[id];
		this[ghost].path  = path;
		this[ghost].step  = 0;
		this[ghost].dir   = pmData.paths[path][0].dir;
		this[ghost].speed = pmData.getPathSpeed(path);
	},
	setTargets: function () {
		var i;
        for (i = 0; i < pmData.ghosts.length; i++) {
			if (this.changeTarget(this[pmData.ghosts[i]])) {
				this[pmData.ghosts[i]].target = pmData.getGhost(i).chase();
            }
        }
	},
	
	
	// Modes Sub Functions
	dontSwitch: function (ghostMode, oldMode) {
		return (pmData.isFrighten(oldMode) && !pmData.isFrighten(ghostMode)) || pmData.isEyes(ghostMode);
	},
	dontHalthTurn: function (oldMode) {
		return pmData.isBlue(oldMode) || pmData.isWhite(oldMode);
	},
	changeTarget: function (ghost) {
		return !pmData.isEyes(ghost.mode) && (pmData.isChase(this.mode) || this.isElroy(ghost));
	},
	isElroy: function (ghost) {
		return ghost.active && ghost.elroy > 0;
	},
	getTarget: function (ghost) {
		if (pmData.isChase(ghost.mode) || this.isElroy(ghost)) {
			return pmData.getGhost(ghost.id).chase();
		} else {
			return pmData.getGhost(ghost.id).scatter;
		}
	},
	increaseDots: function (ghost) {
		this[ghost].dots++;
	},
	getSwitchMode: function () {
		return this.switchs % 2;
	},
	getTile: function (ghost) {
		return this[ghost].tile;
	},
	getMode: function () {
		return this.mode;
	},
	
	
	// Distances Sub Functions
	getPath: function () {
		return pmData.paths[this.ghost.path][this.ghost.step];
	},
	passedDist: function () {
		var path = this.getPath();
		return ((this.ghost.dir[0] ===  1 && this.ghost.x >= path.distx) ||
				(this.ghost.dir[0] === -1 && this.ghost.x <= path.distx) ||
				(this.ghost.dir[1] ===  1 && this.ghost.y >= path.disty) ||
				(this.ghost.dir[1] === -1 && this.ghost.y <= path.disty));
	},
	passedCenter: function () {
		return ((this.ghost.dir[0] ===  1 && this.ghost.x >= pmData.getMiddle(this.ghost.tile[0])) ||
				(this.ghost.dir[0] === -1 && this.ghost.x <= pmData.getMiddle(this.ghost.tile[0])) ||
				(this.ghost.dir[1] ===  1 && this.ghost.y >= pmData.getMiddle(this.ghost.tile[1])) ||
				(this.ghost.dir[1] === -1 && this.ghost.y <= pmData.getMiddle(this.ghost.tile[1])));
	},
	sameTile: function (tile) {
		return pmBlob.getTile()[0] === tile[0] && pmBlob.getTile()[1] === tile[1];
	},
	
	
	// Paths and Turns Sub Functions
	enterPen: function () {
		return this.ghost.mode === 4 && this.ghost.tile[0] === pmData.eyesTarget[0] && this.ghost.tile[1] === pmData.eyesTarget[1];
	},
	nextTile: function () {
		return [
			this.ghost.tile[0] + this.ghost.dir[0],
			this.ghost.tile[1] + this.ghost.dir[1]
		];
	},
	isNextIntersection: function () {
		var tile = this.nextTile();
		return pmData.isIntersection(tile[0], tile[1]);
	},
	getTurns: function () {
		var result = [], i,
			tile   = this.nextTile(),
            turns  = pmData.turns[pmData.tileToString(tile)];
        
		for (i = 0; i < turns.length; i++) {
            if ((turns[i] + 2) % 4 !== pmData.axisToValue(this.ghost.dir)) {
				result.push(pmData.valueToAxis(turns[i]));
            }
        }
		return result;
	}
};



/* -----------------
    Ghosts House  */

var pmPen = {

	type:    false,   // Type used to force ghosts out of the pen ( false = using 
	                  // ... ghost's dot counters | true = using global dot counter )
	timer:   0,       // Pen Leaving Force Timer
	waiting: [],      // Ghosts waiting in pen
	dots:    0,       // Global dots
	
	
	init: function (newLife) {
		var i;
        
        this.type    = newLife;
		this.timer   = 0;
		this.waiting = [ 1, 2, 3 ];
		this.dots    = 0;
		
		for (i = 0; i < this.waiting.length && !newLife; i++) {
			this.dotLimit();
        }
	},
	
	
	// Increase Dots
	dotCounter: function () {
		if (!this.type) {
			this.ghostsDots();
		} else {
			this.globalDots();
        }
	},
	
	// Increase Ghost's dots counter 
	ghostsDots: function () {
		if (this.waiting.length > 0) {
			var ghost = pmData.ghosts[this.waiting[0]];
			pmGhosts.increaseDots(ghost);
			this.dotLimit();
		}
	},
	
	// Checking if a ghost can leave pen
	dotLimit: function () {
		var limits = pmData.getLevel().penLeavingLimit,
            ghost  = pmData.ghosts[this.waiting[0]];
		
		if (limits[this.waiting[0]] <= pmGhosts[ghost].dots) {
			this.releaseGhost();
        }
	},
	
	
	// Increase global dots
	globalDots: function () {
		var i;
        this.dots++;
        
		for (i = 0; i < this.waiting.length; i++) {
			if (this.dots === pmData.alternateDotsCount[this.waiting[i]]) {
				if (this.waiting[i] <= 2) {
					this.releaseGhost();
				} else {
					this.type = false;
					this.dots = 0;
				}
			}
        }
	},
	
	
	// Increase Timer
	increaseTimer: function () {
		this.timer += pmAnimate.getTiming();
		if (this.waiting.length > 0 && this.timer >= pmData.getPenForceTime()) {
			this.releaseGhost();
			this.timer = 0;
		}
	},
	resetTimer: function () {
		this.timer = 0;
	},
	
	
	// Release Ghost from Pen
	releaseGhost: function () {
		var id = this.waiting[0];
		pmGhosts.setPath(id, pmData.getExitPath(id));
		if (id === 3) {
            pmGhosts.activateElroy();
        }
		this.waiting = this.waiting.slice(1);
	},
	
	// Add Ghost to Pen
	addGhost: function (id) {
		var i = 0;
        if (id === 0) { // Blinky never stays in the Pen
			pmGhosts.setPath(id, pmData.getExitPath(id));
		} else {
			while (i < this.waiting.length && this.waiting[i] <= id) {
                i++;
            }
            this.waiting.splice(i, 0, id);
			pmGhosts.setPath(id, pmData.getInPenPath(id));
			if (!this.type) {
                this.dotLimit();
            }
        }
	}
};



/* ---------------
    Game Score  */

var pmScore = {

	score:  0,
	level:  1,
	lives:  2,
	bonus:  0,   // Amount of new lives won
	ghosts: 0,   // Amount of times all 4 ghosts die per level
	
	init: function () {
		this.score  = 0;
		this.level  = 1;
		this.lives  = 2;
		this.bonus  = 0;
		this.ghosts = 0;
		
		pmBoard.texts();
		pmBoard.score(this.score);
		pmBoard.blobs(this.lives);
		pmFruit.draw(pmBoard.getBoard(), 313, 378);
	},
	
	
	// Change Functions
	addScore: function (amount) {
		this.score += amount;
		if (this.score > 10000 * Math.pow(10, this.bonus)) {
			if (this.lives < 4) {
				this.addLives(1);
            }
			this.bonus++;
		}
		pmBoard.score(this.score);
	},
	addLives: function (amount) {
		this.lives += amount;
		pmBoard.blobs();
	},
	newLevel: function () {
		this.level++;
		this.ghosts = 0;
		pmSequences.newLevel();
	},
	
	
	// Actions
	dot: function (score) {
		this.addScore(score * 10);
	},
	fruit: function () {
		this.addScore(pmData.getLevel().fruitScore);
		pmSequences.fruit();
	},
	kill: function (x, y, amount) {
		var score = Math.pow(2, amount) * 100;
		this.addScore(score);
		pmSequences.ghost(score, x, y);
		
		if (amount === 4) {
			this.ghosts++;
			if (this.ghosts === 4) {
				this.addScore(12000);
            }
		}
	},
	die: function () {
		this.addLives(-1);
		if (this.lives >= 0) {
			pacman.animate(true);
		} else {
			pmSequences.gameOver();
        }
	},
	
	
	// Sub Functions
	getLevel: function () { return this.level; }
};



/* -------------------
    Game Sequences  */
	 
var pmSequences = {

	timer: 0,
	name:  '',
	type:  0,
	data:  {},
	clear: true,
	
	init: function () {
		this.timer = 0;
		this.name  = '';
		this.type  = 0;
		this.data  = {};
		
		pmDraw.text({
			color: 'rgb(255,255,51)',
			text:  'Ready!',
			pos:   [ 168, 208 ]
		});
	},
	
	
	// Actions
	start: function (name, type, data) {
		this.timer = 0;
		this.name  = name;
		this.type  = type;
		this.data  = data;
	},
	animate: function () {
		if (this.type !== 0) {
			this.timer += pmAnimate.getTiming();
			if (this.type === 1) {
				this[this.name + 'Anim']();
			} else {
				this[this.name + 'Disp']();
			}
		}
	},
	end: function () {
		this.type = 0;
	},
		
	
	// Start Animations
	paused: function () {
		this.start('paused', 1, { mult: 1 });
	},
	newLevel: function () {
		this.start('endLevel', 1, { blinks: 0 });
	},
	gameOver: function () {
		this.start('gameOver', 1);
	},
	die: function () {
		this.start('die', 1);
	},
	ghost: function (score, x, y) {
		this.start('ghost', 1, { text: score, x: x, y: y });
	},
	fruit: function () {
		this.start('fruit', 1);
	},
	
	
	// Do Animations
	pausedAnim: function () {
		var add  = Math.round(this.timer) / 50,
            size = this.data.mult < 0 ? 26 - add : 20 + add;
        
		pmDraw.bg();
		pmDraw.text({
			size:  size,
			color: 'rgb(255,255,51)',
			text:  'Paused!',
			pos:   [ 168, 208 ]
		});
		if (size <= 20 || size >= 26) {
			this.timer = 0;
			this.data.mult = size <= 20 ? 1 : -1;
		}
	},
	
	endLevelAnim: function () {
		if (this.data.blinks < 10) {
			if (this.timer > 150) {
				pmBoard.clear();
				pmBoard.draw(this.data.blinks % 2 === 0);
				this.data.blinks++;
				this.timer = 0;
			}
		} else {
			pmFood.init();
			this.start('startLevel', 1);
		}
	},
	startLevelAnim: function () {
		if (this.timer < 2000) {
			var pos = (Math.round(this.timer * 0.4) < 210 ? Math.round(this.timer * 0.4) - 30 : 180),
                lvl = (pmScore.getLevel() < 10 ? '0' : '') + pmScore.getLevel();
			
            pmDraw.text({
				color: 'rgb(255,255,255)',
				align: 'right',
				text:  'Level',
				pos:   [ pos, 208 ]
			});
			pmDraw.text({
				color: 'rgb(255,255,51)',
				align: 'left',
				text:  lvl,
				pos:   [ pmData.canvasWidth - pos + 30, 208 ]
			});
		} else {
			this.end();
			pacman.animate();
		}
	},
	
	gameOverAnim: function () {
		if (this.timer < 2000) {
			var size  = Math.round(2000 - this.timer) / 70,
                alpha = Math.round(2000 - this.timer) / 2000;
			
			pmDraw.text({
				size:  size < 20 ? 20 : size,
				color: 'rgba(255,0,0,' + (alpha < 0 ? 0 : alpha) + ')',
				text:  'Game Over',
				pos:   [ 168, 208 ]
			});
		} else {
			this.end();
			pacman.gameOver();
		}
	},
	
	dieAnim: function () {
		if (this.timer < 1350) {
			var count = Math.round(this.timer / 15);
			
			pmDraw.startDeath(pmBlob.getX(), pmBlob.getY());
			if (this.timer < 750) {
				pmDraw.blobDeath(count);
			} else if (this.timer < 1050) {
				pmDraw.blobCircle(count - 50);
			} else {
				pmDraw.blobCircle(count - 70);
            }
			pmDraw.endDeath();
		} else {
			this.end();
			pmScore.die();
		}
	},
	
	ghostAnim: function () {
		if (this.timer < 400) {
			var size = 4 + Math.round(this.timer) / 40;
			pmDraw.text({
				size:  size > 12 ? 12 : size,
				color: 'rgb(51,255,255)',
				text:  this.data.text,
				pos:   [ this.data.x, this.data.y ]
			});
		} else {
			this.start('ghost', 2, this.data);
        }
	},
	fruitAnim: function () {
		if (this.timer < 200) {
			pmDraw.text({
				size:  12,
				color: 'rgb(255,184,255)',
				text:  pmData.getLevel().fruitScore,
				pos:   pmData.fruitText
			});
        } else {
			this.start('fruit', 2);
        }
	},
	
	
	// Do Displays
	ghostDisp: function () {
		if (this.timer < 1200) {
			var alpha = 1 - Math.round(this.timer * 1.25) / 2000;
			pmDraw.text({
				size:  12,
				color: 'rgba(51,255,255,' + alpha + ')',
				text:  this.data.text,
				pos:   [ this.data.x, this.data.y ]
			});
		} else {
			pmDraw.clearAll();
			this.end();
        }
	},
	fruitDisp: function () {
		if (this.timer < 2200) {
			var alpha = this.timer < 1000 ? 1 : 1 - Math.round((this.timer - 1000) * 1.25) / 2000;
			pmDraw.text({
				size:  12,
				color: 'rgba(255,184,255,' + alpha + ')',
				text:  pmData.getLevel().fruitScore,
				pos:   pmData.fruitText
			});
		} else {
			pmDraw.clearAll();
			this.end();
        }
	},
	
		
	// Sub Functions
	isAnimating: function () { return this.type === 1; }
};



/* -------------------
    Keys Controler  */

var pmKeys = {
	
	init: function () {
		document.addEventListener("keydown", function (e) { pmKeys.press(e); });
	},
	destroy: function () {
		document.removeEventListener("keydown", function (e) { pmKeys.press(e); });
	},
	
	
	// Press
	press: function (e) {
		var key = e.keyCode;
		
		switch (key) {
			case 13: pacman.restart();          break;  // Enter
			case 80: pacman.pause();            break;  // P
		 
			case 77: pmAudio.sound();           break;  // M
			case 37: pmBlob.makeTurn([-1, 0 ]); break;  // Left Key
			case 38: pmBlob.makeTurn([ 0,-1 ]); break;  // Up Key
			case 39: pmBlob.makeTurn([ 1, 0 ]); break;  // Right Key
			case 40: pmBlob.makeTurn([ 0, 1 ]); break;  // Down Key
		}
	}
};
