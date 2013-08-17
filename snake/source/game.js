/*jslint browser: true */
/*global Utils, Storage, Queue, Audio */

(function () {
	"use strict";
	
	var demo, sound, board, snake, food, scores, instance, zoom,
		container, navigator, header, paragrath, starter, scorer, timer, leveler,
		animation, startTime, gameTimer, gameCount, gameScore, shortcuts,
		messages = {
			mainScreen:   [ "Snake",      "Select a level"     ],
			paused:       [ "Pause",      "Continue the game?" ],
			continuing:   [ "Continue",   "Continue the game?" ],
			gameOver:     [ "GameOver",   "Select an option"   ],
			gameOverSave: [ "GameOver",   "Write your name"    ],
			highScores:   [ "HighScores", "Select a level"     ],
			help:         [ "Help",       "Game controlls"     ]
		},
		soundFiles      = [ "start", "eat", "end" ],
		levelNames      = [ "Easy", "Medium", "Hard", "Super" ],
		speedTimes      = [ 300, 200, 100, 50 ],    /** @const The times used for the different levels      */
		countTime       = 500,                      /** @const The initial timer used for the count         */
		foodTime        = 1000,                     /** @const The initial timer used for the food          */
		demoRows        = 5,                        /** @const The amount of rows in the demo matrix        */
		matrixRows      = 18,                       /** @const The amount of rows in the matrix             */
		matrixColumns   = 24,                       /** @const The amount of columns in the matrix          */
		totalCells      = 354,                      /** @const The total amount of cells in the board       */
		cellSize        = 15,                       /** @const The fisical size of a board cell             */
		initialCount    = 4,                        /** @const The count before the game starts             */
		initialParts    = 3,                        /** @const The initial amount of parts of the snake     */
		initialPosition = { top: 3, left: 11 },     /** @const The starting position of the snake           */
		borderValue     = -1,                       /** @const The value used for the border in the matrix  */
		emptyValue      = -2,                       /** @const The value used for the space in the matrix   */
		foodValue       = -3,                       /** @const The value used for the food in the matrix    */
		maxScores       = 5,                        /** @const Maximum high scores displayed                */
		instanceStorage = "snake.game",             /** @const The name of the Instance Storage             */
		soundStorage    = "snake.sound",            /** @const The name of the Sound Storage                */
		scoresStorage   = "snake.hs.",              /** @const The name of the High Scores Storage          */
		zoomStorage     = "snake.zoom",             /** @const The name of the Zoom Storage                 */
		gameDisplay     = "mainScreen",
		gameLevel       = 1;
	
	
	/**
	 * Display Functions
	 */
	function isStarting() { return gameDisplay === "starting"; }
	function isPlaying() {  return gameDisplay === "playing";  }
	function isPaused() {   return gameDisplay === "paused";   }
	function isDemoing() {  return gameDisplay === "demo";     }
	
	/**
	 * Returns the timer used for the animations
	 */
	function getTimer() {
		if (isStarting()) {
			return countTime;
		}
		return speedTimes[gameLevel - 1];
	}
	
	/**
	 * Sets the container class
	 */
	function setContainerClass() {
		container.className = gameDisplay;
	}
	
	/**
	 * Destroys the game elements
	 */
	function destroyGame() {
		board = null;
		snake = null;
		food  = null;
		instance.destroyGame();
	}
	
	
	
	/**
	 * Key Press Event
	 * @param {Event} event
	 */
	function pressKey(event) {
		var key = event.keyCode;
		if (scores.isFocused()) {
			if (key === 13) {
				scores.save();
			}
		} else {
			if (!isPlaying()) {
				event.preventDefault();
			}
			if ([89, 49, 97].indexOf(key) > -1) {           // Y / 1
				key = "Y";
			} else if ([69, 50, 98].indexOf(key) > -1) {    // E / 2
				key = "E";
			} else if ([82, 51, 99].indexOf(key) > -1) {    // R / 3
				key = "R";
			} else if ([85, 52, 100].indexOf(key) > -1) {   // U / 4
				key = "U";
			} else if ([8, 66, 78].indexOf(key) > -1) {     // Backspace / B / N
				key = "B";
			} else if ([13, 32, 79].indexOf(key) > -1) {    // Enter / Space / O
				key = "O";
			} else if ([80, 67].indexOf(key) > -1) {        // P / C
				key = "P";
			} else if ([38, 87].indexOf(key) > -1) {        // Up    / W
				key = "W";
			} else if ([37, 65].indexOf(key) > -1) {        // Left  / A
				key = "A";
			} else if ([40, 83].indexOf(key) > -1) {        // Down  / S
				key = "S";
			} else if ([39, 68].indexOf(key) > -1) {        // Right / D
				key = "D";
			} else {
				key = String.fromCharCode(key);
			}
			
			if (shortcuts[gameDisplay][key]) {
				shortcuts[gameDisplay][key]();
			}
		}
	}
	
	
	/**
	 * Reduces by 1 the initial count until it changes the mode to playing
	 */
	function nextCount() {
		var content = "";
		
		gameCount -= 1;
		if (gameCount > 0) {
			content = gameCount;
			sound.start();
		} else if (gameCount === 0) {
			content = "Go!";
			sound.eat();
			window.setTimeout(function () { sound.eat(); }, 200);
		} else {
			gameDisplay = "playing";
			setContainerClass();
		}
		
		starter.innerHTML = content;
	}
	
	/**
	 * Request an animation frame
	 */
	function requestAnimation() {
		startTime = new Date().getTime();
		animation = Utils.requestAnimationFrame(function () {
			var time  = new Date().getTime() - startTime,
				speed = time / 16;
			
			gameTimer -= time;
			if (speed <= 0 || speed > 5) {
				return requestAnimation();
			}
			
			if (gameTimer < 0) {
				if (isDemoing()) {
					demo.move();
				}
				if (isStarting()) {
					nextCount();
				} else if (isPlaying()) {
					snake.move();
				}
				gameTimer = getTimer();
			}
			if (isPlaying()) {
				food.reduceTime(time);
			}
			
			if (isDemoing() || isStarting() || isPlaying()) {
				requestAnimation();
			}
		});
	}
	
	/**
	 * Cancel an animation frame
	 */
	function cancelAnimation() {
		Utils.cancelAnimationFrame(animation);
	}
	
	
	/**
	 * Shows the current level in the game view
	 */
	function showLevel() {
		leveler.innerHTML = "Level: " + levelNames[gameLevel - 1];
	}
	
	/**
	 * Increases the Score
	 * @param {number} score
	 */
	function increaseScore(score) {
		gameScore += score;
		scorer.innerHTML = "Score: " + Utils.formatNumber(gameScore, ",");
		instance.saveScore();
	}
	
	/**
	 * Sets the food timer
	 * @param {(string|number)} timer
	 */
	function setFoodTimer(time) {
		timer.innerHTML = time;
	}
	
	
	
	/**
	 * Show the messages
	 */
	function showMessage() {
		setContainerClass();
		header.innerHTML    = messages[gameDisplay][0];
		paragrath.innerHTML = messages[gameDisplay][1];
	}
	
	/**
	 * Show the Main Screen
	 */
	function showMainScreen() {
		gameDisplay = "mainScreen";
		showMessage();
	}
	
	/**
	 * Pause the Game
	 */
	function startPause() {
		gameDisplay = "paused";
		
		showMessage();
		cancelAnimation();
	}
	
	/**
	 * Unpause the Game
	 */
	function endPause() {
		gameDisplay = "playing";
		
		setContainerClass();
		requestAnimation();
	}
	
	/**
	 * Finish the Game
	 */
	function finishGame() {
		gameDisplay = "mainScreen";
		
		destroyGame();
		showMessage();
		cancelAnimation();
		instance.destroyGame();
	}
	
	/**
	 * Game Over
	 */
	function gameOver() {
		gameDisplay = Utils.supportsStorage() ? "gameOverSave" : "gameOver";
		
		showMessage();
		cancelAnimation();
		scores.setInput();
		instance.destroyGame();
	}
	
	/**
	 * Svae scores and restart
	 */
	function endGameOver(save) {
		destroyGame();
		if (save) {
			scores.save();
		} else {
			showMainScreen();
		}
	}
	
	
	/**
	 * Starts the speed demo
	 * @param {number} level
	 */
	function startDemo(level) {
		gameDisplay = "demo";
		gameLevel   = level;
		gameTimer   = getTimer();
		
		demo.start();
		requestAnimation();
	}
	
	/**
	 * Ends the speed demo
	 */
	function endDemo() {
		if (isDemoing()) {
			gameDisplay = "mainScreen";
			cancelAnimation();
		}
		demo.end();
	}
	
	/**
	 * Show the High Scores
	 */
	function showHighScores() {
		gameDisplay = "highScores";
		showMessage();
	}
		
	/**
	 * Show the Help
	 */
	function showHelp() {
		gameDisplay = "help";
		showMessage();
	}
	
	
	
	/**
	 * Transforms an x or y coordinate in the matrix into a pixel position relative to the board
	 * @param {number} pos
	 * @return {string}
	 */
	function getBoardPosition(pos) {
		return ((pos - 1) * cellSize) + "px";
	}
	
	/**
	 * Creates a new snake link and returns the element
	 * @return {DOM}
	 */
	function createSnakeElement() {
		var div = document.createElement("DIV");
		div.className = "link";
		div.innerHTML = "<div class='snakeShadow'></div><div class='snakeBody'></div>";
		return div;
	}
	
	/**
	 * Returns the default value to use in the matrix depending if is a border or not
	 * @param {number} top
	 * @param {number} left
	 * @return {number}
	 */
	function getBoardDefault(top, left) {
		if (top === 0 || left === 0 || top === matrixRows - 1 || left === matrixColumns - 1) {
			return borderValue;
		}
		return emptyValue;
	}
	
	
	
	/**
	 * @constructor
	 * Speed Demo
	 */
	function Demo() {
		var i;
		this.container = document.querySelector(".demo");
		this.left      = Utils.getPosition(document.querySelector(".messages")).left;
		this.width     = this.container.offsetWidth;
		this.element   = null;
		this.elements  = [];
		this.pointer   = -2;
		
		for (i = 0; i < demoRows; i += 1) {
			this.createElement(i, 0, demoRows - i - 1);
			this.createElement(i, 2, demoRows + i + 1);
		}
		this.createElement(0, 1, demoRows);
	}
	
	/**
	 * Create each snake link element
	 * @param {number} top
	 * @param {number} left
	 * @param {number} pos
	 */
	Demo.prototype.createElement = function (top, left, pos) {
		var element = createSnakeElement();
		element.style.top     = getBoardPosition(top  + 1);
		element.style.left    = getBoardPosition(left + 1);
		element.style.display = "none";
		this.container.appendChild(element);
		
		this.elements[pos] = element;
	};
	
	/**
	 * Start the demo
	 */
	Demo.prototype.start = function () {
		this.element = container.querySelector(".main li:nth-child(" + gameLevel + ")");
		this.pointer = -initialParts;
		this.setPosition();
	};
	
	/**
	 * End the demo
	 */
	Demo.prototype.end = function () {
		var i;
		for (i = this.pointer; i < this.pointer + initialParts; i += 1) {
			if (i >= 0 && i < this.elements.length) {
				this.elements[i].style.display = "none";
			}
		}
	};
	
	/**
	 * Move the Snake
	 */
	Demo.prototype.move = function () {
		if (this.pointer >= 0) {
			this.elements[this.pointer].style.display = "none";
		}
		if (this.pointer + initialParts < this.elements.length) {
			this.elements[this.pointer + initialParts].style.display = "block";
		}
		
		this.pointer += 1;
		if (this.pointer >= this.elements.length) {
			this.pointer = -initialParts;
		}
	};
	
	/**
	 * Set the position of the demo element
	 */
	Demo.prototype.setPosition = function () {
		var left = Utils.getPosition(this.element).left - this.left;
		this.container.style.left = (left + (this.element.offsetWidth - this.width) / 2) + "px";
	};
	
	
	
	/**
	 * @constructor
	 * Board Manager
	 * @param {?Array.<Array.<number>>} matrix
	 * @param {?number} head
	 * @param {?number} tail
	 */
	function Board(matrix, head, tail) {
		this.head   = head !== undefined ? head : 0;
		this.tail   = tail !== undefined ? tail : 0;
		this.matrix = matrix || [];
		
		var i, j;
		if (!matrix) {
			for (i = 0; i < matrixRows; i += 1) {
				this.matrix[i] = [];
				for (j = 0; j < matrixColumns; j += 1) {
					this.matrix[i][j] = getBoardDefault(i, j);
				}
			}
		}
	}
	
	/**
	 * Adds a snake body element
	 * @param {number} top
	 * @param {number} left
	 */
	Board.prototype.addSnake = function (top, left) {
		this.matrix[top][left] = this.tail;
		instance.addToMatrix(top, left, this.tail);
		
		this.tail += 1;
		if (this.tail > totalCells) {
			this.tail = 0;
		}
	};
	
	/**
	 * Removes a snake body element
	 * @param {number} top
	 * @param {number} left
	 */
	Board.prototype.removeSnake = function (top, left) {
		this.matrix[top][left] = emptyValue;
		
		this.head += 1;
		if (this.head > totalCells) {
			this.head = 0;
		}
		instance.removeFromMatrix(top, left, this.head);
	};
	
	/**
	 * Adds a new food element to the board in the first possible random position
	 * @return {{top: number, left: number}}
	 */
	Board.prototype.addFood = function () {
		var top, left, found = true;
		do {
			top   = Utils.rand(1, matrixRows    - 2);
			left  = Utils.rand(1, matrixColumns - 2);
			found = this.matrix[top][left] >= borderValue;
		} while (found);
		
		this.matrix[top][left] = foodValue;
		instance.addToMatrix(top, left, foodValue);
		
		return { top: top, left: left };
	};
	
	/**
	 * Returns true if the snake crashed a wall or it's own body
	 * @param {number} top
	 * @param {number} left
	 * @return {boolean}
	 */
	Board.prototype.crashed = function (top, left) {
		return this.matrix[top][left] >= borderValue;
	};
	
	/**
	 * Returns true if the snake ate the food
	 * @param {number} top
	 * @param {number} left
	 * @return {boolean}
	 */
	Board.prototype.ate = function (top, left) {
		return this.matrix[top][left] === foodValue;
	};
	
	
	
	/**
	 * @constructor
	 * Snake Manager
	 * @param {?Array.<{top: number, left: number}>} links
	 * @param {?number} dirTop
	 * @param {?number} dirLeft
	 */
	function Snake(links, dirTop, dirLeft) {
		this.container = document.querySelector(".snake");
		this.position  = Utils.getPosition(this.container);
		this.queue     = new Queue();
		this.dirTop    = dirTop  !== undefined ? dirTop  : 1;
		this.dirLeft   = dirLeft !== undefined ? dirLeft : 0;
		this.newDir    = false;
		
		this.container.innerHTML = "";
		
		if (links) {
			var self = this;
			links.forEach(function (link) {
				self.addLink(createSnakeElement(), link.top, link.left);
			});
		}
	}
	
	/**
	 * Moves the snake
	 */
	Snake.prototype.move = function () {
		var pos = this.getPosition();
		
		if (board.crashed(pos.top, pos.left)) {
			sound.end();
			gameOver();
		} else if (board.ate(pos.top, pos.left)) {
			sound.eat();
			this.newLink(pos.top, pos.left);
			increaseScore(food.getTimer());
			food.add();
		} else if (this.queue.size() < 3) {
			this.newLink(pos.top, pos.left);
		} else {
			this.moveLink(pos.top, pos.left);
		}
		this.newDir = false;
	};
	
	/**
	 * Creates a new Element to the snake
	 * @param {number} top
	 * @param {number} left
	 */
	Snake.prototype.newLink = function (top, left) {
		this.addLink(createSnakeElement(), top, left);
		board.addSnake(top, left);
	};
	
	/**
	 * Move the last link to head of the snake
	 * @param {number} top
	 * @param {number} left
	 */
	Snake.prototype.moveLink = function (top, left) {
		var first = this.queue.dequeue();
		this.addLink(first.element, top, left);
		
		board.removeSnake(first.top, first.left);
		board.addSnake(top, left);
	};
	
	/**
	 * Adds a link to the head of the snake
	 * @param {DOM} element
	 * @param {number} top
	 * @param {number} left
	 */
	Snake.prototype.addLink = function (element, top, left) {
		element.style.top  = getBoardPosition(top);
		element.style.left = getBoardPosition(left);
		
		this.queue.enqueue({
			element: element,
			top:     top,
			left:    left
		});
		this.container.appendChild(element);
	};
	
	/**
	 * Change the x direction of the snake
	 * @param {number} dirTop
	 * @return {boolean} True if the snake changed direction
	 */
	Snake.prototype.turnTop = function (dirTop) {
		if (!this.dirTop && !this.newDir) {
			this.dirTop  = dirTop;
			this.dirLeft = 0;
			this.newDir  = true;
			instance.saveDirection(this.dirTop, this.dirLeft);
			return true;
		}
		return false;
	};
	
	/**
	 * Change the y direction of the snake
	 * @param {number} dirLeft
	 * @return {boolean} True if the snake changed direction
	 */
	Snake.prototype.turnLeft = function (dirLeft) {
		if (!this.dirLeft && !this.newDir) {
			this.dirTop  = 0;
			this.dirLeft = dirLeft;
			this.newDir  = true;
			instance.saveDirection(this.dirTop, this.dirLeft);
			return true;
		}
		return false;
	};
	
	/**
	 * Turns the snake using the mouse
	 * @param {Event} event
	 */
	Snake.prototype.turn = function (event) {
		var mouse = Utils.getMousePos(event),
			last  = this.queue.last(),
			top   = Math.floor((mouse.top  - this.position.top)  / cellSize),
			left  = Math.floor((mouse.left - this.position.left) / cellSize),
			dtop  = top  - last.top,
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
	};
	
	/**
	 * Returns the next position of the last element in the queue
	 * @return {{top: number, left: nuber}}
	 */
	Snake.prototype.getPosition = function () {
		if (this.queue.isEmpty()) {
			return initialPosition;
		}
		var last = this.queue.last();
		return {
			top:  last.top  + this.dirTop,
			left: last.left + this.dirLeft
		};
	};
	
	
	
	/**
	 * @constructor
	 * Snake Manager
	 * @param {?number} top
	 * @param {?number} left
	 */
	function Food(top, left) {
		this.element = document.querySelector(".food");
		this.body    = this.element.querySelector(".foodBody");
		this.shadow  = this.element.querySelector(".foodShadow");
		this.top     = top  || 0;
		this.left    = left || 0;
		this.time    = foodTime;
		
		if (top) {
			this.setPosition();
		} else {
			this.add();
		}
	}
	
	/**
	 * Checks if the given position is the food position and it hides it when it is
	 * @param {number} top
	 * @param {number} left
	 * @return {boolean} True when top and left are equal to the food position
	 */
	Food.prototype.eat = function (top, left) {
		if (top === this.top && left === this.left) {
			return true;
		}
		return false;
	};
	
	/**
	 * Repositions the food and restarts the variables
	 */
	Food.prototype.add = function () {
		var pos   = board.addFood();
		this.time = foodTime;
		this.top  = pos.top;
		this.left = pos.left;
		
		this.setPosition();
	};
	
	/**
	 * Reduces the time
	 * @param {number} time
	 */
	Food.prototype.reduceTime = function (time) {
		if (this.time > 0) {
			this.time = Math.max(0, this.time - Math.round(time / 4));
			setFoodTimer(Math.round(this.time / 10));
			this.setTransform();
		}
	};
	
	/**
	 * Places the food at a position
	 */
	Food.prototype.setPosition = function () {
		this.element.style.top  = getBoardPosition(this.top);
		this.element.style.left = getBoardPosition(this.left);
	};
	
	/**
	 * Sets the transform to rotate the food
	 */
	Food.prototype.setTransform = function () {
		var time = (1000 - this.time) / 10, deg;
		if (time < 21) {
			deg = time * 360 / 20;
		} else if (time < 51) {
			deg = time * 720 / 50;
		} else {
			deg = time * 1080 / 99;
		}
		Utils.setTransform(this.body,   "rotate(" + deg + "deg)");
		Utils.setTransform(this.shadow, "rotate(" + deg + "deg)");
	};
	
	/**
	 * Returns the position of the food
	 * @return {{top: number, left: number}}
	 */
	Food.prototype.getPosition = function () {
		return { top: this.top, left: this.left };
	};
	
	/**
	 * Returns the timer
	 * @return {number}
	 */
	Food.prototype.getTimer = function () {
		return Math.round(this.time / 10);
	};
	
	
	
	/**
	 * @constructor
	 * A local storage saved version of the Instance
	 */
	function Instance() {
		this.data = new Storage(instanceStorage);
		this.main = document.querySelector(".main");
		
		if (this.hasGame()) {
			this.main.classList.remove("help");
			this.main.classList.add("continue");
		}
	}
	
	/**
	 * Saves the initial values for a new game
	 */
	Instance.prototype.newGame = function () {
		this.destroyGame();
		
		this.data.set("playing",     1);
		this.data.set("level",       gameLevel);
		this.data.set("dirTop",      1);
		this.data.set("dirLeft",     0);
		this.data.set("matrix.head", 0);
		this.data.set("matrix.tail", 0);
	};
	
	/**
	 * Remove the data for this game
	 */
	Instance.prototype.destroyGame = function () {
		var i, j, name;
		for (i = 0; i < matrixRows; i += 1) {
			for (j = 0; j < matrixColumns; j += 1) {
				name = "matrix." + i + "." + j;
				if (this.data.get(name)) {
					this.data.remove(name);
				}
			}
		}
		
		this.data.set("playing", 0);
		this.data.remove("matrix.head");
		this.data.remove("matrix.tail");
		this.data.remove("dirTop");
		this.data.remove("dirLeft");
		this.data.remove("score");
		this.data.remove("level");
		
		this.main.classList.add("help");
		this.main.classList.remove("continue");
	};
	
	/**
	 * Returns the saved data of a game
	 */
	Instance.prototype.getData = function () {
		var i, j, value, pointer,
			head   = this.data.get("matrix.head"),
			matrix = [],
			links  = [],
			food   = {};
		
		for (i = 0; i < matrixRows; i += 1) {
			matrix[i] = [];
			for (j = 0; j < matrixColumns; j += 1) {
				value = this.data.get("matrix." + i + "." + j);
				if (value) {
					matrix[i][j] = value;
					
					if (value >= 0) {
						pointer = value - head >= 0 ? value - head : totalCells + value - head;
						links[pointer] = { top: i, left: j };
					} else {
						food = { top: i, left: j };
					}
				} else {
					matrix[i][j] = getBoardDefault(i, j);
				}
			}
		}
		
		return {
			level:    this.data.get("level"),
			score:    this.data.get("score"),
			matrix:   matrix,
			head:     head,
			tail:     this.data.get("matrix.tail") + 1,
			links:    links,
			dirTop:   this.data.get("dirTop"),
			dirLeft:  this.data.get("dirLeft"),
			foodTop:  food.top,
			foodLeft: food.left
		};
	};
	
	/**
	 * Adds the given value in the given position in the matrix
	 */
	Instance.prototype.addToMatrix = function (top, left, value) {
		this.data.set("matrix." + top + "." + left, value);
		if (value > 0) {
			this.data.set("matrix.tail", value);
		}
	};
	
	/**
	 * Removes the given value in the given position in the matrix
	 */
	Instance.prototype.removeFromMatrix = function (top, left, value) {
		this.data.remove("matrix." + top + "." + left);
		if (value) {
			this.data.set("matrix.head", value);
		}
	};
	
	/**
	 * Saves the score
	 */
	Instance.prototype.saveScore = function () {
		this.data.set("score", gameScore);
	};
	
	/**
	 * Saves the Snake directions
	 */
	Instance.prototype.saveDirection = function (dirTop, dirLeft) {
		this.data.set("dirTop",  dirTop);
		this.data.set("dirLeft", dirLeft);
	};
	
	/**
	 * Returns true if there is a saved Game
	 */
	Instance.prototype.hasGame = function () {
		return this.data.get("playing");
	};
	
	
	
	/**
	 * @constructor
	 * Sound Controller
	 */
	function Sound() {
		this.data   = new Storage(soundStorage);
		this.audio  = document.querySelector(".audio");
		this.waves  = document.querySelector(".waves");
		this.format = Utils.supportsOGG() ? ".ogg" : (Utils.supportsMP3() ? ".mp3" : null);
		this.mute   = this.getMute();
		
		if (this.format) {
			this.setSounds();
			this.setDisplay();
		} else {
			this.audio.style.display = "none";
		}
	}
	
	/**
	 * Create all the Sound Functions
	 */
	Sound.prototype.setSounds = function () {
		var audio, self = this;
		
		soundFiles.forEach(function (sound) {
			self[sound] = function () {
				audio = new Audio("audio/" + sound + self.format);
				if (self.format && !self.mute) {
					audio.play();
				}
			};
		});
	};
	
	/**
	 * Mute/Unmute the sound
	 */
	Sound.prototype.toggle = function () {
		this.setMute(!this.mute);
		this.setDisplay();
	};
	
	/**
	 * Returns true if the sound is mute
	 * @return {boolean}
	 */
	Sound.prototype.getMute = function () {
		return this.data.get("sound");
	};
	
	/**
	 * Sets and saves the mute option
	 * @param {boolean} mute
	 */
	Sound.prototype.setMute = function (mute) {
		this.mute = mute;
		this.data.set("sound", this.mute);
	};
	
	/**
	 * Sets the display of the sound waves
	 */
	Sound.prototype.setDisplay = function () {
		this.waves.style.display = this.mute ? "none" : "block";
	};
	
	
	
    /**
	 * @constructor
	 * The Game High Scores
	 */
	function HighScores() {
		this.input  = document.querySelector(".input input");
		this.scores = document.querySelector(".scores");
		this.none   = document.querySelector(".none");
		this.level  = "";
		this.data   = null;
		this.total  = 0;
		
		this.input.onfocus = function () { this.focused = true;  };
		this.input.onblur  = function () { this.focused = false; };
	}
	
	/**
	 * Creates the high scores for the given mode
	 * @param {string} mode
	 */
	HighScores.prototype.create = function (level) {
		this.level = level;
		this.data  = new Storage(scoresStorage + this.level);
		this.total = this.data.get("total") || 0;
	};
	
	/**
	 * Show the Scores for the given mode
	 * @param {string} mode
	 */
	HighScores.prototype.show = function (level) {
		this.scores.innerHTML = "";
		this.create(level);
		this.showHideNone(this.total === 0);
		
		if (this.total > 0) {
			this.displayScores();
		}
	};
	
	/**
	 * Create each score line and place it in the DOM
	 */
	HighScores.prototype.displayScores = function () {
		var i, data, div;
		for (i = 1; i <= this.total; i += 1) {
			data = this.data.get(i);
			div	 = document.createElement("DIV");
			div.className = "highScore";
			div.innerHTML = "<div class='hsName'>" + data.name + "</div>" +
							"<div class='hsScore'>" + Utils.formatNumber(data.score, ",") + "</div>";
			
			this.scores.appendChild(div);
		}
	};
	
	/**
	 * Tries to save a score, when possible
	 */
	HighScores.prototype.save = function () {
		if (this.input.value && Utils.supportsStorage()) {
			this.create(gameLevel);
			this.saveData();
			
			showHighScores();
			this.show(this.level);
		}
	};
	
	/**
	 * Gets the scores and adds the new one in the right position, updating the total, when possible
	 */
	HighScores.prototype.saveData = function () {
		var i, hs, data = [], saved = false, self = this,
			actual = {
				name:  this.input.value,
				score: gameScore
			};
				
		for (i = 1; i <= this.total; i += 1) {
			hs = this.data.get(i);
			if (!saved && hs.score < actual.score) {
				data.push(actual);
				saved = true;
			}
			if (data.length <= maxScores) {
				data.push(hs);
			}
		}
		if (!saved && data.length <= maxScores) {
			data.push(actual);
		}
		
		this.data.set("total", data.length);
		data.forEach(function (element, index) {
			self.data.set(index + 1, element);
		});
	};
	
	
	/**
	 * Shows or hides the no results element
	 */
	HighScores.prototype.showHideNone = function (show) {
		this.none.style.display = show ? "block" : "none";
	};
	
	/**
	 * Sets the input value and focus it
	 */
	HighScores.prototype.setInput = function () {
		this.input.value = "";
		this.input.focus();
	};
	
	/**
	 * Returns true if the input is focus
	 */
	HighScores.prototype.isFocused = function () {
		return this.input.focused;
	};
	
	
	
	/**
	 * @constructor
	 * Game Zoom
	 */
	function Zoom() {
		this.element = document.querySelector(".zoom");
		this.name    = zoomStorage;
		this.values  = [ "1.0", "1.2", "1.4", "1.6", "1.8", "2.0" ];
		this.current = 0;
		this.style   = null;
		
		if (Utils.supportsStorage() && window.localStorage[this.name]) {
			this.current = parseInt(window.localStorage[this.name], 10);
			if (this.current > 0) {
				this.setContent();
				this.setStyle();
			}
		}
	}
	
	/**
	 * Change the zoom
	 */
	Zoom.prototype.change = function () {
		this.current += 1;
		if (this.current === this.values.length) {
			this.current = 0;
		}
		this.setContent();
		this.setStyle();
		
		if (Utils.supportsStorage()) {
			window.localStorage[this.name] = this.current;
		}
	};
	
	/**
	 * Set the new zoom value
	 */
	Zoom.prototype.setContent = function () {
		this.element.innerHTML = "x" + this.values[this.current];
	};
	
	/**
	 * Set the style for the zoom in the current style or in a new one
	 */
	Zoom.prototype.setStyle = function () {
		if (this.style) {
			this.style.innerHTML = this.current === 0 ? "" : this.getStyle();
		} else {
			var head = document.querySelector("head");
			
			this.style = document.createElement("style");
			this.style.id = "sZoom";
			this.style.innerHTML = this.getStyle();
			head.appendChild(this.style);
		}
	};
	
	/**
	 * Creates the style as a transform for each prefix
	 */
	Zoom.prototype.getStyle = function () {
		var prefix  = ["-webkit-", "-o-", ""],
			content = "body > *:not(.zoom) {",
			self    = this;
		
		prefix.forEach(function (prefix) {
			content += prefix + "transform: scale(" + self.values[self.current] + ");";
		});
		return content + " }";
	};
	
	
	
	/**
	 * Restores a saved Game
	 */
	function restoreGame() {
		var data;
		if (instance.hasGame()) {
			gameDisplay = "continuing";
			showMessage();
			
			data        = instance.getData();
			gameLevel   = data.level;
			gameScore   = data.score;
			gameTimer   = getTimer();
			board       = new Board(data.matrix, data.head,   data.tail);
			snake       = new Snake(data.links,  data.dirTop, data.dirLeft);
			food        = new Food(data.foodTop, data.foodLeft);
			
			showLevel();
			increaseScore(0);
			setFoodTimer("");
		}
	}
	
	/**
	 * Starts a new game
	 * @param {number} level
	 */
	function newGame(level) {
		gameDisplay = "starting";
		gameLevel   = level;
		gameCount   = initialCount;
		gameTimer   = getTimer();
		gameScore   = 0;
		
		setContainerClass();
		showLevel();
		increaseScore(0);
		setFoodTimer("");
		
		board = new Board();
		snake = new Snake();
		food  = new Food();
		
		instance.newGame();
		requestAnimation();
	}
	
	/**
	 * Creates the shortcuts functions
	 */
	function createShortcuts() {
		shortcuts = {
			mainScreen: {
				O: function () { newGame(gameLevel); },
				Y: function () { newGame(1);         },
				E: function () { newGame(2);         },
				R: function () { newGame(3);         },
				U: function () { newGame(4);         },
				I: function () { showHighScores();   },
				H: function () { showHelp();         },
				T: function () { restoreGame();      },
				M: function () { sound.toggle();     }
			},
			paused: {
				P: function () { endPause();         },
				B: function () { finishGame();       }
			},
			gameOver: {
				B: function () { endGameOver(false); }
			},
			gameOverSave: {
				O: function () { endGameOver(true);  },
				B: function () { endGameOver(false); }
			},
			highScores: {
				Y: function () { scores.show(1);     },
				E: function () { scores.show(2);     },
				R: function () { scores.show(3);     },
				U: function () { scores.show(4);     },
				B: function () { showMainScreen();   }
			},
			help: {
				B: function () { showMainScreen();   }
			},
			playing: {
				W: function () { snake.turnTop(-1);  },
				A: function () { snake.turnLeft(-1); },
				S: function () { snake.turnTop(1);   },
				D: function () { snake.turnLeft(1);  },
				P: function () { startPause();       },
				M: function () { sound.toggle();     }
			}
		};
	}
	
	/**
	 * Stores the used DOM elements and initializes the Event Handlers
	 */
	function initDomListeners() {
		container = document.querySelector("#container");
		navigator = document.querySelector(".main ul");
		header    = document.querySelector(".messages h2");
		paragrath = document.querySelector(".messages p");
		starter   = document.querySelector(".start");
		scorer    = document.querySelector(".score");
		timer     = document.querySelector(".time");
		leveler   = document.querySelector(".level");
		
		container.addEventListener("click", function (e) {
			var element = e.target;
			while (element.parentElement && !element.dataset.action) {
				element = element.parentElement;
			}
			
			switch (element.dataset.action) {
			case "play":
				newGame(element.dataset.level);
				break;
			case "mainScreen":
				showMainScreen();
				break;
			case "highScores":
				showHighScores();
				break;
			case "help":
				showHelp();
				break;
			case "restore":
				restoreGame();
				break;
			case "endPause":
				endPause();
				break;
			case "finishGame":
				finishGame();
				break;
			case "save":
				endGameOver(true);
				break;
			case "newGame":
				endGameOver(false);
				break;
			case "sound":
				sound.toggle();
				break;
			case "showScores":
				scores.show(element.dataset.level);
				break;
			case "zoom":
				zoom.change();
				break;
			}
		});
		
		navigator.addEventListener("mouseover", function (e) {
			var element = e.target.dataset.action ? e.target : e.target.parentElement;
			if (element.dataset.action === "play") {
				startDemo(element.dataset.level);
			}
		});
		navigator.addEventListener("mouseout", function (e) {
			var element = e.target.dataset.action ? e.target : e.target.parentElement;
			if (element.dataset.action === "play") {
				endDemo();
			}
		});
		
		document.querySelector(".snake").addEventListener("click", function (e) {
			if (isPlaying()) {
				snake.turn(e);
			}
		});
		
		document.addEventListener("keydown", function (e) { pressKey(e); });
	}
	
	/**
	 * The main Function
	 */
	function main() {
		initDomListeners();
		createShortcuts();
		
		demo     = new Demo();
		instance = new Instance();
		sound    = new Sound();
		scores   = new HighScores();
		zoom     = new Zoom();
	}
	
	// Load the game
	window.addEventListener("load", function () { main(); }, false);
	
}());