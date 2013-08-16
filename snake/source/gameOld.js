/*jslint es5: true, plusplus: true, sloppy: true, white: true, browser: true */
/*global snake, snakeAnimate, snakeAudio, snakeBoard, snakeBody, snakeDemo, snakeFood, snakeHigh, snakeKeys,
		 snakeMessages, snakeScore, snakeStart, snakeSave, snakeZoom, subs, Queue, Audio */

window.addEventListener("load", function () { snake.init(); }, false);

/* Contents:
  I.	Snake Game
  II.	Messages Panel
  III.	Animation Frame
  IV.	Speed Demo
  V.	Board Data
  VI.	Start Count
  VII.	Board Matrix
  VIII.	Snake Body
  IX.	Food Creator
  X.	Score Board
  XI.	Keys Controller
  XII.	Audio Controller
  XIII.	Save Game
  XIV.	Game High Scores
  XV.	Game Zoom
*/


/* ---------------
    Snake Game  */

var snake = {
   
	container: {},
	display:   "mainScreen",
	level:     1,
	
	init: function () {
		this.container = document.getElementById("container");
		this.initHandlers();
		
		snakeMessages.init();
		snakeDemo.init();
		snakeBoard.init();
		snakeFood.init();
		snakeScore.init();
		snakeKeys.init();
		snakeAudio.init();
		snakeSave.init();
		snakeHigh.init();
		snakeZoom.init();
	},
	start: function (level) {
		this.setLevel(level);
		
		snakeMessages.hide();
		snakeStart.init();
		snakeScore.start();
		snakeSave.start();
	},
		
	
	// Show the Main Screen
	mainScreen: function () {
		this.display = "mainScreen";
		snakeMessages.show();
	},
	
	// Speed demo
	startDemo: function (level) {
		this.setLevel(level);
		this.display = "demo";
		snakeDemo.start();
		snakeAnimate.init();
	},
	endDemo: function () {
		this.display = "mainScreen";
		snakeDemo.end();
		snakeAnimate.cancel();
	},
		
	// Start Game
	startGame: function () {
		this.display = "game";
		snakeBoard.start();
		snakeBody.init();
		snakeFood.add();
		snakeAnimate.init();
	},
	
	
	// Pause Game
	startPause: function () {
		this.display = "pause";
		this.end();
		this.setOpacity();
	},
	endPause: function () {
		this.display = "game";
		this.setOpacity();
		snakeMessages.hide();
		snakeAnimate.request();
	},
	finishGame: function () {
		this.display = "mainScreen";
		this.destroy();
		this.end();
		this.setOpacity();
		snakeSave.destroy();
	},
	
	
	// Game Over
	gameOver: function () {
		this.display = subs.supportsStorage() ? "gameOverSave" : "gameOver";
		this.end();
		this.setOpacity();
		snakeSave.destroy();
		snakeHigh.setInput();
	},
	endGameOver: function (save) {
		this.destroy();
		this.setOpacity();
		
		if (save) {
			snakeHigh.save();
		} else {
			this.mainScreen();
		}
	},
	
		
	// Show High Scores
	highScores: function () {
		this.display = "highScores";
		snakeMessages.show();
	},
	
	// Show the Help
	help: function () {
		this.display = "help";
		snakeMessages.show();
	},
		
	// Restore Game
	restore: function () {
		if (!snakeSave.hasGame()) {
			return;
		}
		
		this.display = "continuing";
		this.setOpacity();
		snakeMessages.show();
		snakeSave.restore();
		snakeSave.init();
	},
	
	
	// End / Destroy
	end: function () {
		snakeMessages.show();
		snakeAnimate.cancel();
	},
	destroy: function () {
		snakeBoard.destroy();
		snakeBody.destroy();
		snakeFood.destroy();
		snakeScore.destroy();
		snakeSave.destroy();
	},
	
	
	// Initialize Event Handlers
	initHandlers: function () {
		document.querySelector("#container").addEventListener("click", function (e) {
			switch (e.target.dataset.action) {
				case "easy":			snake.start(1);				break;
				case "medium":			snake.start(2);				break;
				case "hard":			snake.start(3);				break;
				case "super":			snake.start(4);				break;
				case "highScores":		snake.highScores();			break;
				case "help":			snake.help();				break;
				case "restore":			snake.restore();			break;
				case "endPause":		snake.endPause();			break;
				case "finishGame":		snake.finishGame();			break;
				case "save":			snake.endGameOver(true);	break;
				case "newGame":			snake.endGameOver(false);	break;
				case "easyScores":		snakeHigh.show(1);			break;
				case "mediumScores":	snakeHigh.show(2);			break;
				case "hardScores":		snakeHigh.show(3);			break;
				case "superScores":		snakeHigh.show(4);			break;
				case "mainScreen":		snake.mainScreen();			break;
				case "zoom":			snakeZoom.change();			break;
			}
		});
		document.querySelector("#main ul").addEventListener("mouseover", function (e) {
			switch (e.target.dataset.action) {
				case "easy":	snake.startDemo(1);	break;
				case "medium":	snake.startDemo(2);	break;
				case "hard":	snake.startDemo(3);	break;
				case "super":	snake.startDemo(4);	break;
			}
		});
		document.querySelector("#main ul").addEventListener("mouseout", function (e) {
			switch (e.target.dataset.action) {
				case "easy":	snake.endDemo(1);	break;
				case "medium":	snake.endDemo(2);	break;
				case "hard":	snake.endDemo(3);	break;
				case "super":	snake.endDemo(4);	break;
			}
		});
	},
	
	
	// Sub Functions
	getTimer: function () {
		var times = [ 300, 200, 100, 50 ];
		return times[this.level - 1];
	},
	setOpacity: function () {
		this.container.classList.toggle("opacity");
	},
	setLevel: function (level) {
		this.level = level;
	},
	
	getContainer: function () { return this.container; },
	getDisplay:   function () { return this.display;   },
	getLevel:     function () { return this.level;     },
	
	isPaused:     function () { return this.display === "pause"; },
	isPlaying:    function () { return this.display === "game";  },
	isDemoing:    function () { return this.display === "demo";  }
};



/* -------------------
    Messages Panel  */

var snakeMessages = {
	
    data: {
        mainScreen:   [ "Snake",      "Select a level"     ],
        pause:        [ "Pause",      "Continue the game?" ],
        continuing:   [ "Continue",   "Continue the game?" ],
        gameOver:     [ "GameOver",   "Select an option"   ],
        gameOverSave: [ "GameOver",   "Write your name"    ],
        highScores:   [ "HighScores", "Select a level"     ],
        help:         [ "Help",       "Game controlls"     ]
    },
	container: {},
	header:    {},
	paragrath: {},
	
    
	init: function () {
		this.container = document.querySelector("#container");
		this.header    = document.querySelector("#messages h2");
		this.paragrath = document.querySelector("#messages p");
	},
	
	show: function () {
		var display = snake.getDisplay();
		
		this.container.className = display;
		this.header.innerHTML    = this.data[display][0];
		this.paragrath.innerHTML = this.data[display][1];
	},
	hide: function () {
		this.container.className = "game";
	},
	
	// Sub functions
	getContainer: function () {
		return this.container;
	}
};



/* --------------------
    Animation Frame  */

var snakeAnimate = {

	time:      0,
	started:   0,
	speed:     1,
	timer:     0,
	animation: {},
	
	init: function () {
		this.timer = snake.getTimer();
		this.request();
	},
	request: function () {
		this.started   = new Date().getTime();
		this.animation = subs.requestAnimationFrame(function () {
			snakeAnimate.animate();
		});
	},
	cancel: function () {
		subs.cancelAnimationFrame(this.animation);
	},
	
	animate: function () {
		this.time   = new Date().getTime() - this.started;
		this.speed  = this.time / 16;
		this.timer -= this.time;
		
		if (this.timer < 0) {
			if (snake.isPlaying()) {
				snakeBody.move();
			}
			if (snake.isDemoing()) {
				snakeDemo.move();
			}
			this.timer = snake.getTimer();
		}
		if (snake.isPlaying()) {
			snakeFood.timer();
		}
		
		if (snake.isPlaying() || snake.isDemoing()) {
			this.request();
		}
	},
	
	
	// Sub Functions
	getTiming: function () { return this.time;  },
	getSpeed:  function () { return this.speed; }
};



/* ---------------
    Speed Demo  */

var snakeDemo = {

	container: {},
	element:   {},
	elements:  [],
	pointer:   -2,
	
	
	// Create Demo
	init: function () {
		var i;
		this.container = document.getElementById("demo");
		
		for (i = 0; i < 5; i++) {
			this.createElement(i, 0, 4 - i);
			this.createElement(i, 2, 6 + i);
		}
		this.createElement(0, 1, 5);
	},
	createElement: function (top, left, pos) {
		var elem = snakeBody.createElement();
		elem.style.top     = snakeBoard.getPos(top + 1);
		elem.style.left    = snakeBoard.getPos(left + 1);
		elem.style.display = "none";
		this.container.appendChild(elem);
		
		this.elements[pos] = elem;
	},
	
	
	// Start/End Demo
	start: function () {
		this.element = snakeMessages.getContainer().getElementsByTagName("li")[snake.getLevel() - 1];
		this.pointer = -3;
		this.setPosition();
	},
	end: function () {
		var i;
		for (i = this.pointer; i < this.pointer + 3; i++) {
			if (i >= 0 && i < this.elements.length) {
				this.elements[i].style.display = "none";
			}
		}
	},
	
	
	// Move Snake
	move: function () {
		if (this.pointer >= 0) {
			this.elements[this.pointer].style.display = "none";
		}
		if (this.pointer + 3 < this.elements.length) {
			this.elements[this.pointer + 3].style.display = "block";
		}
		
		this.pointer++;
		if (this.pointer >= this.elements.length) {
			this.pointer = -3;
		}
	},
	
	
	// Sub Functions
	setPosition: function () {
		var left = subs.getPosition(this.element).left - subs.getPosition(snakeMessages.getContainer()).left;
		this.container.style.left = (left + (this.element.offsetWidth - this.container.offsetWidth) / 2) + "px";
	}
};



/* ----------------
    Start Count  */

var snakeStart = {
	
	element: "",
	number:  3,
	time:    500,
   
	init: function () {
		this.element = document.getElementById("start");
		this.number  = 4;
		this.next();
	},
	
	
	// Add next text
	next: function () {
		var content;
		
		this.number--;
		if (this.number > 0) {
			content = this.number;
			snakeAudio.start();
		} else if (this.number === 0) {
			content = "Go!";
			snakeAudio.eat();
			setTimeout(function () { snakeAudio.eat(); }, 200);
		} else {
			content = "";
		}
		
		this.element.innerHTML = content;
		if (this.number >= 0) {
			setTimeout(function () { snakeStart.next(); }, this.time);
		} else {
			snake.startGame();
		}
	}
};



/* -----------------
    Board Matrix  */

var snakeBoard = {
	
	container: {},
	position:  {},
	
	matrix:    [],
	height:    18,
	width:     24,
	size:      15,
	total:     354,
	head:      3,
	tail:      3,
	
	
	init: function () {
		this.container = document.getElementById("board");
		this.position  = subs.getPosition(this.container);
	},
	start: function () {
		var i, j;
		this.matrix = [];
		for (i = 0; i < this.height; i++) {
			this.matrix[i] = [];
			for (j = 0; j < this.width; j++) {
				this.matrix[i][j] = this.getDefault(i, j);
			}
		}
		this.head = 0;
		this.tail = 0;
		
		this.container.addEventListener("click", function (e) {
			snakeBody.turn(e);
		});
	},
	destroy: function () {
		this.container.innerHTML = "";
		this.container.removeEventListener("click", function (e) {
			snakeBody.turn(e);
		});
	},
	restore: function (matrix, head, tail) {
		this.matrix = matrix;
		this.head   = head;
		this.tail   = tail;
	},
	
	
	// Add/Remove elements
	addSnake: function (top, left) {
		this.matrix[top][left] = this.tail;
		snakeSave.add(top, left, this.tail);
		
		this.tail++;
		if (this.tail > this.total) {
			this.tail = 0;
		}
	},
	removeSnake: function (top, left) {
		this.matrix[top][left] = -2;
		
		this.head++;
		if (this.head > this.total) {
			this.head = 0;
		}
		snakeSave.remove(top, left, this.head);
	},
	
	addFood: function () {
		var top, left, found = true;
		do {
			top   = subs.rand(1, this.height - 2);
			left  = subs.rand(1, this.width - 2);
			found = this.matrix[top][left] > 0;
		} while (found);
		
		this.matrix[top][left] = -3;
		snakeSave.add(top, left, -3);
		
		return { top: top, left: left };
	},
	
	
	// Sub Functions
	crashed: function (top, left) {
		return this.matrix[top][left] > -2;
	},
	ate: function (top, left) {
		return this.matrix[top][left] === -3;
	},
	
	isBorder: function (top, left) {
		return top === 0 || left === 0 || top === this.height - 1 || left === this.width - 1;
	},
	isSnake: function (value) {
		return value >= 0;
	},
	
	getPos: function (pos) {
		return ((pos - 1) * this.size) + "px";
	},
	getStart: function () {
		return { top: 3, left: 11 };
	},
	getDefault: function (top, left) {
		return this.isBorder(top, left) ? -1 : -2;
	},
	
	
	// Getters
	getBoard:    function () { return this.container; },
	getPosition: function () { return this.position;  },
	getSize:     function () { return this.size;      },
	getWidth:    function () { return this.width;     },
	getHeight:   function () { return this.height;    },
	getTotal:    function () { return this.total;     }
};



/* ---------------
    Snake Body  */

var snakeBody = {

	queue:   {},
	length:  0,
	dirTop:  1,
	dirLeft: 0,
	newDir:  false,
	
	init: function () {
		this.queue   = new Queue();
		this.dirTop  = 1;
		this.dirLeft = 0;
		this.newDir  = false;
		
		var pos = snakeBoard.getStart();
		this.newElement(pos.top, pos.left);
		this.length = 1;
	},
	destroy: function () {
		this.queue = null;
	},
	
	restore: function (links, dirTop, dirLeft) {
		var i, elem;
		this.queue   = new Queue();
		this.length  = links.length;
		this.dirTop  = dirTop;
		this.dirLeft = dirLeft;
		this.newDir  = false;
		
		for (i = 0; i < links.length; i++) {
			elem = this.createElement();
			this.addElement(elem, links[i].top, links[i].left);
		}
	},
	
	
	// Move the snake
	move: function () {
		var pos = this.getPosition();
		
		if (this.length < 3) {
			this.newElement(pos.top, pos.left);
			this.length++;
		} else if (snakeBoard.crashed(pos.top, pos.left)) {
			snakeAudio.end();
			snake.gameOver();
		} else if (snakeBoard.ate(pos.top, pos.left)) {
			snakeAudio.eat();
			this.newElement(pos.top, pos.left);
			snakeScore.increase();
			snakeFood.add();
		} else {
			this.moveElement(pos.top, pos.left);
		}
		this.newDir = false;
	},
	
	
	// Elements Functions
	newElement: function (top, left) {
		var elem = this.createElement();
		this.addElement(elem, top, left);
		snakeBoard.addSnake(top, left);
	},
	moveElement: function (top, left) {
		var first = this.queue.dequeue();
		this.addElement(first.elem, top, left);
		snakeBoard.removeSnake(first.top, first.left);
		snakeBoard.addSnake(top, left);
	},
		
	addElement: function (elem, top, left) {
		elem.style.top  = snakeBoard.getPos(top);
		elem.style.left = snakeBoard.getPos(left);
		
		this.queue.enqueue({
			elem: elem,
			top:  top,
			left: left,
		});
		snakeBoard.getBoard().appendChild(elem);
	},
	createElement: function () {
		var div = document.createElement("DIV");
		div.className = "snake";
		div.innerHTML = "<div class='snakeShadow'></div><div class='snakeBody'></div>";
		return div;
	},
	
	
	// Change the direction
	turnTop: function (dtop) {
		if (!this.dirTop && !this.newDir) {
			this.dirTop  = dtop;
			this.dirLeft = 0;
			this.newDir  = true;
			snakeSave.direction();
			return true;
		}
		return false;
	},
	turnLeft: function (dleft) {
		if (!this.dirLeft && !this.newDir) {
			this.dirTop  = 0;
			this.dirLeft = dleft;
			this.newDir  = true;
			snakeSave.direction();
			return true;
		}
		return false;
	},
	turn: function (e) {
		if (!snake.isPlaying()) {
			return;
		}
		
		var mouse = subs.getMousePos(e),
			board = snakeBoard.getPosition(),
			last  = this.queue.last(),
			top   = Math.floor((mouse.top  -  board.top) / snakeBoard.getSize()),
			left  = Math.floor((mouse.left - board.left) / snakeBoard.getSize()),
			dtop  = top - last.top,
			dleft = left - last.left,
			can   = false;
		
		if (Math.abs(dtop) > Math.abs(dleft)) {
			can = this.turnTop(dtop < 0 ? -1 : 1);
			if (!can) {
				this.turnLeft(dleft < 0 ? -1 : 1);
			}
		} else {
			can = this.turnLeft(dleft < 0 ? -1 : 1);
			if (!can) {
				this.turnTop(dtop < 0 ? -1 : 1);
			}
		}
	},
	
	
	// Sub Functions
	getPosition: function () {
		var last = this.queue.last();
		return {
			top:  last.top  + this.dirTop,
			left: last.left + this.dirLeft
		};
	},
	getDirection: function () {
		return { top: this.dirTop, left: this.dirLeft };
	}
};



/* -----------------
    Food Creator  */

var snakeFood = {
	
	element: {},
	top:     0,
	left:    0,
	time:    1000,
	
	
	init: function () {
		this.element = document.getElementById("food");
	},
	destroy: function () {
		this.setDisplay("none");
	},
	restore: function (top, left) {
		this.time = 1000;
		this.top  = top;
		this.left = left;
		
		this.setPosition();
		this.setDisplay("block");
	},
	
	
	// Add
	eat: function (top, left) {
		if (top === this.top && left === this.left) {
			this.setDisplay("none");
			return true;
		}
		return false;
	},
	add: function () {
		this.time = 1000;
		
		var pos   = snakeBoard.addFood();
		this.top  = pos.top;
		this.left = pos.left;
		
		this.setPosition();
		this.setDisplay("block");
	},
	
	
	// Timer
	timer: function () {
		if (this.time > 1) {
			this.time -= 4;
			snakeScore.setTimer(Math.round(this.time / 10));
			this.setTransform();
		}
	},
	
	
	// Display Functions
	setPosition: function () {
		this.element.style.top  = snakeBoard.getPos(this.top);
		this.element.style.left = snakeBoard.getPos(this.left);
	},
	setDisplay: function (display) {
		this.element.style.display = display;
	},
	
	setTransform: function () {
		var time = (1000 - this.time) / 10, deg;
		if (time < 21) {
			deg = time * 360 / 20;
		} else if (time < 51) {
			deg = time * 720 / 50;
		} else {
			deg = time * 1080 / 99;
		}
		subs.transform(this.getBody(),   "rotate(" + deg + "deg)");
		subs.transform(this.getShadow(), "rotate(" + deg + "deg)");
	},
	
	
	// Sub Functions
	getBody: function () {
		return this.element.getElementsByClassName("foodBody")[0];
	},
	getShadow: function () {
		return this.element.getElementsByClassName("foodShadow")[0];
	},
	
	getPosition: function () {
		return { top: this.top, left: this.left };
	},
	getTimer: function () {
		return this.time;
	}
};



/* ----------------
    Score Board  */

var snakeScore = {

	scorer:	{},
	timer:	{},
	level:	{},
	score:	0,
	
	init: function () {
		this.scorer = document.getElementById("score");
		this.timer  = document.getElementById("time");
		this.level  = document.getElementById("level");
	},
	destroy: function () {
		this.scorer.innerHTML = "";
		this.timer.innerHTML  = "";
		this.level.innerHTML  = "";
	},
	
	start: function (score) {
		this.score = score || 0;
		this.setScore();
		this.setLevel();
	},
	
	increase: function () {
		this.score += snakeFood.getTimer();
		this.setScore();
		snakeSave.score();
	},
	
	
	// Display Functions
	setScore: function () {
		this.scorer.innerHTML = "Score: " + subs.formatNumber(this.score, ",");
	},
	setTimer: function (time) {
		this.timer.innerHTML = time;
	},
	getLevel: function () {
		var levels = [ "Easy", "Medium", "Hard", "Super" ];
		return levels[snake.getLevel() - 1];
	},
	setLevel: function () {
		this.level.innerHTML = "Level: " + this.getLevel();
	},
	
	
	// Sub Functions
	getScore: function () {
		return this.score;
	}
};



/* --------------------
    Keys Controller  */

var snakeKeys = {
	
	init: function () {
		document.addEventListener("keydown", snakeKeys.press);
	},
	
	press: function (e) {
		var display = snake.getDisplay(),
			key     = e.keyCode;
		
		if (!snakeHigh.isFocused()) {
			e.preventDefault();
			
			switch (key) {
				case 89: case 49: case  97: key = "Y";	break;	// Y / 1
				case 69: case 50: case  98: key = "E";	break;	// E / 2
				case 82: case 51: case  99: key = "R";	break;	// R / 3
				case 85: case 52: case 100: key = "U";	break;	// U / 4
				case  8: case 66: case  78: key = "B";	break;	// Backspace / B / N
				case 13: case 79:			key = "O";	break;	// Enter / O
				case 80: case 67:			key = "P";	break;	// P / C
				case 38: case 87:			key = "W";	break;	// Up    / W
				case 37: case 65:			key = "A";	break;	// Left  / A
				case 40: case 83:			key = "S";	break;	// Down  / S
				case 39: case 68:			key = "D";	break;	// Right / D
			}
		}
		snakeKeys[display](key);
	},
	
	mainScreen: function (key) {
		switch (key) {
			case "O": snake.start(snake.getLevel());	break;	// Enter
			case "Y": snake.start(1);					break;	// Y
			case "E": snake.start(2);					break;	// E
			case "R": snake.start(3);					break;	// R
			case "U": snake.start(4);					break;	// U
			case  73: snake.highScores();				break;	// I
			case  72: snake.help();						break;	// H
			case  84: snake.restore();					break;	// T
			case  77: snakeAudio.sound();				break;	// M
		}
	},
	pause: function (key) {
		switch (key) {
			case "P": snake.endPause();		break;
			case "B": snake.finishGame();	break;
		}
	},
	gameOver: function (key) {
		if (key === "B") {
			snake.endGameOver(false);
		}
	},
	gameOverSave: function (key) {
		if (!snakeHigh.isFocused() || key === 13) {
			switch (key) {
				case  13:
				case "O": snake.endGameOver(true);	break;
				case "B": snake.endGameOver(false);	break;
			}
		}
	},
	highScores: function (key) {
		switch (key) {
			case "Y": snakeHigh.show(1);	break;
			case "E": snakeHigh.show(2);	break;
			case "R": snakeHigh.show(3);	break;
			case "U": snakeHigh.show(4);	break;
			case "B": snake.mainScreen();	break;
		}
	},
	help: function (key) {
		if (key === "B") {
			snake.mainScreen();
		}
	},
	game: function (key) {
		switch (key) {
			case "W": snakeBody.turnTop(-1);	break;	// Up
			case "A": snakeBody.turnLeft(-1);	break;	// Left
			case "S": snakeBody.turnTop(1);		break;	// Down
			case "D": snakeBody.turnLeft(1);	break;	// Right
			case "P": snake.startPause();		break;	// P
			case  77: snakeAudio.sound();		break;	// M
		}
	}
};



/* ---------------------
    Audio Controller  */

var snakeAudio = {

	data:    {},
	audio:   {},
	waves:   {},
	format:  "",
	mute:    false,
	sounds:  {},
	
	
	init: function () {
		this.data   = new Storage("snake");
		this.audio  = document.getElementById("audio");
		this.waves  = document.getElementById("waves");
		this.format = subs.supportsOGG() ? ".ogg" : (subs.supportsMP3() ? ".mp3" : null);
		this.mute   = this.getMute();
		
		if (this.format) {
			this.setSounds();
			this.addFunctions();
			this.setDisplay();
		} else {
			this.audio.style.display = "none";
		}
	},
	
	
	// Audio Functions
	setSounds: function () {
		var i, sounds = [ "start", "eat", "end" ];
		for (i = 0; i < sounds.length; i++) {
			this.sounds[sounds[i]] = this.createAudio("audio/" + sounds[i]);
			this[sounds[i]] = this.makeSound(this.sounds[sounds[i]]);
		}
	},
	makeSound: function (sound) {
		return function () { snakeAudio.reproduce(sound); };
	},
	createAudio: function (src) {
		return new Audio(src + this.format);
	},
	reproduce: function (audio) {
		if (this.format && !this.mute) {
			audio.cloneNode(true).play();
		}
	},
	
	
	// Mute/Unmute
	sound: function () {
		this.setMute();
		this.setDisplay();
	},
	getMute: function () {
		return this.data.get("sound");
	},
	setMute: function () {
		this.mute = !this.mute;
		this.data.set("sound", this.mute);
	},
	setDisplay: function () {
		this.waves.style.display = this.mute ? "none" : "block";
	},
	
	
	// Button Functions
	addFunctions: function () {
		this.audio.onclick	    = function () { snakeAudio.sound();            };
		this.audio.onmouseover	= function () { this.classList.toggle("over"); };
		this.audio.onmouseout	= function () { this.classList.toggle("over"); };
	}
};



/* --------------
    Save Game  */

var snakeSave = {

	data: {},
	
	init: function () {
		this.data = new Storage("snake.game");
		document.getElementById("main").className = this.hasGame() ? "continue" : "help";
	},
	start: function () {
		this.destroy();
		
		this.data.set("playing", "true");
		this.data.set("level", snake.getLevel());
		this.data.set("dirTop", 1);
		this.data.set("dirLeft", 0);
		this.data.set("matrix.head", 0);
		this.data.set("matrix.tail", 0);
	},
	
	
	// Remove the game
	destroy: function () {
		var i, j;
		this.data.set("playing", "false");
		
		for (i = 0; i < snakeBoard.getHeight(); i++) {
			for (j = 0; j < snakeBoard.getWidth(); j++) {
				if (this.data.get("matrix." + i + "." + j)) {
					this.data.remove("matrix." + i + "." + j);
				}
			}
		}
		this.data.remove("matrix.head");
		this.data.remove("matrix.tail");
		this.data.remove("dirTop");
		this.data.remove("dirLeft");
		this.data.remove("score");
		this.data.remove("level");
	},
	
	// Restore the game
	restore: function () {
		var i, j, value, pointer,
			matrix = [],
			links  = [],
			food   = {},
			head   = this.data.get("matrix.head");
		
		for (i = 0; i < snakeBoard.getHeight(); i++) {
			matrix[i] = [];
			for (j = 0; j < snakeBoard.getWidth(); j++) {
				if (this.data.get("matrix." + i + "." + j)) {
					value = this.data.get("matrix." + i + "." + j);
					matrix[i][j] = value;
					
					if (snakeBoard.isSnake(value)) {
						pointer = value - head >= 0 ? value - head : snakeBoard.getTotal() + value - head;
						links[pointer] = { top: i, left: j };
					} else {
						food = { top: i, left: j };
					}
				} else {
					matrix[i][j] = snakeBoard.getDefault(i, j);
				}
			}
		}
		
		snake.setLevel(this.data.get("level"));
		snakeBoard.restore(matrix, head, this.data.get("matrix.tail"));
		snakeBody.restore(links, this.data.get("dirTop"), this.data.get("dirLeft"));
		snakeFood.restore(food.top, food.left);
		snakeScore.start(this.data.get("score"));
	},
	
	
	// Save while Playing
	add: function (top, left, value) {
		this.data.set("matrix." + top + "." + left, value);
		if (value > 0) {
			this.data.set("matrix.tail", value);
		}
	},
	remove: function (top, left, value) {
		this.data.remove("matrix." + top + "." + left);
		if (value) {
			this.data.set("matrix.head", value);
		}
	},
	score: function () {
		this.data.set("score", snakeScore.getScore());
	},
	direction: function () {
		var dir = snakeBody.getDirection();
		this.data.set("dirTop", dir.top);
		this.data.set("dirLeft", dir.left);
	},
	
	
	// Subs Functions
	hasGame: function () {
		return this.data.get("playing");
	}
};



/* ---------------------
    Game High Scores  */

var snakeHigh = {

	input:	{},
	scores:	{},
	none:	{},
	
	data:   {},
	level:	0,
	total:  0,
	amount:	5,
	
	
	init: function () {
		this.input	= document.getElementsByTagName("input")[0];
		this.scores	= document.getElementById("scores");
		this.none	= document.getElementById("none");
		
		this.input.onfocus = function () { this.focused = true;  };
		this.input.onblur  = function () { this.focused = false; };
	},
	create: function (level) {
		this.level = level;
		this.data  = new Storage("snake.hs." + this.level);
		this.total = this.data.get("total") || 0;
	},
	
	
	// Show Scores
	show: function (level) {
		this.scores.innerHTML = "";
		this.create(level);
				
		if (this.total === 0) {
			this.showNone();
		} else {
			this.hideNone();
			this.displayScores();
		}
	},
	displayScores: function () {
		var i, data, div;
		for (i = 1; i <= this.total; i++) {
			data = this.data.get(i);
			div	 = document.createElement("DIV");
			div.className = "highScore";
			div.innerHTML = "\
			  <div class='name'>" + data.name + "</div>\
			  <div class='score'>" + subs.formatNumber(data.score, ",") + "</div>";
			
			this.scores.appendChild(div);
		}
	},
	
	
	// Save Score
	save: function () {
		if (this.input.value && subs.supportsStorage()) {
			this.create(snake.getLevel());
			this.saveData();
			
			snake.highScores();
			this.show(this.level);
		}
	},
	saveData: function () {
		var i, hs, data = [], saved = false,
			actual = {
				name:  this.input.value,
				score: snakeScore.getScore(),
			};
				
		for (i = 1; i <= this.total; i++) {
			hs = this.data.get(i);
			if (!saved && hs.score < actual.score) {
				data[data.length] = actual;
				saved = true;
			}
			if (data.length < this.amount) {
				data[data.length] = hs;
			}
		}
		if (!saved && data.length < this.amount) {
			data[data.length] = actual;
		}
		
		this.data.set("total", data.length);
		for (i = 0; i < data.length; i++) {
			this.data.set(i + 1, data[i]);
		}
	},
	
	
	// Subs Functions
	showNone: function () { this.none.style.display = "block"; },
	hideNone: function () { this.none.style.display = "none";  },
	
	setInput: function () {
		this.input.value = "";
		this.input.focus();
	},
	isFocused: function () {
		return this.input.focused;
	}
};



/* --------------
    Game Zoom  */

var snakeZoom = {
	
	name:    "snake.zoom",
	values:  [ "1.0", "1.2", "1.4", "1.6", "1.8", "2.0" ],
	current: 0,
	
	init: function () {
		if (subs.supportsStorage() && window.localStorage[this.name]) {
			this.current = parseInt(window.localStorage[this.name], 10);
			if (this.current > 0) {
				this.setContent();
				this.setStyle();
			}
		}
	},
	change: function () {
		this.current++;
		if (this.current === this.values.length) {
			this.current = 0;
		}
		this.setContent();
		this.setStyle();
		
		if (subs.supportsStorage()) {
			window.localStorage[this.name] = this.current;
		}
	},
	
	
	// Sub Functions
	setContent: function () {
		document.getElementById("zoom").innerHTML = "x" + this.values[this.current];
	},
	setStyle: function () {
		if (document.getElementById("sZoom")) {
			document.getElementById("sZoom").innerHTML = this.current === 0 ? "" : this.getStyle();
		} else {
			var head  = document.getElementsByTagName("head")[0],
				style = document.createElement("style");
			style.id  = "sZoom";
			style.innerHTML = this.getStyle();
			head.appendChild(style);
		}
	},
	
	getStyle: function () {
		var prefix  = [ "-webkit-", "-moz-", "-ms-", "-o-", "" ],
			content = "body > *:not(#zoom) {",
			i;
		
		for (i = 0; i < prefix.length; i++) {
			content += prefix[i] + "transform: scale(" + this.values[this.current] + ");";
		}
		return content + " }";
	}
};