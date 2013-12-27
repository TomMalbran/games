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