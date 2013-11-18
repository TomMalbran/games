/*jslint browser: true */
/*global Utils, Storage, Sounds */

(function () {
    "use strict";
    
    var board, sound, scorer, scores, actualTetrimino, nextTetrimino,
        container, header, paragraph, leveler, fielder, winker, tetriminer, nexter, piecer, ghoster,
        animation, startTime, gameTimer, gameCount, keyPressed, shortcuts,
        messages = {
            mainScreen : [ "Tetris",     "Select the starting level" ],
            paused     : [ "Pause",      "Continue with the game?"   ],
            continuing : [ "Continue",   "Continue with the game?"   ],
            gameOver   : [ "GameOver",   "Write your name"           ],
            highScores : [ "HighScores", "Select a level"            ],
            help       : [ "Help",       "Game controlls"            ]
        },
        tetriminos = [
            { // I Tetrimino
                matrix : [
                    [ [ 0, 0, 0, 0 ], [ 1, 1, 1, 1 ], [ 0, 0, 0, 0 ], [ 0, 0, 0, 0 ] ],     // Rotation 1
                    [ [ 0, 0, 1, 0 ], [ 0, 0, 1, 0 ], [ 0, 0, 1, 0 ], [ 0, 0, 1, 0 ] ],     // Rotation 2
                    [ [ 0, 0, 0, 0 ], [ 0, 0, 0, 0 ], [ 1, 1, 1, 1 ], [ 0, 0, 0, 0 ] ],     // Rotation 3
                    [ [ 0, 1, 0, 0 ], [ 0, 1, 0, 0 ], [ 0, 1, 0, 0 ], [ 0, 1, 0, 0 ] ]      // Rotation 4
                ],
                rows : 3,        // Amount of rows at the starting position
                cols : 4         // Amount of columns at the starting position
            },
            { // J Tetrimino
                matrix : [
                    [ [ 1, 0, 0 ], [ 1, 1, 1 ], [ 0, 0, 0 ] ],
                    [ [ 0, 1, 1 ], [ 0, 1, 0 ], [ 0, 1, 0 ] ],
                    [ [ 0, 0, 0 ], [ 1, 1, 1 ], [ 0, 0, 1 ] ],
                    [ [ 0, 1, 0 ], [ 0, 1, 0 ], [ 1, 1, 0 ] ]
                ],
                rows : 2,
                cols : 3
            },
            { // L Tetrimino
                matrix : [
                    [ [ 0, 0, 1 ], [ 1, 1, 1 ], [ 0, 0, 0 ] ],
                    [ [ 0, 1, 0 ], [ 0, 1, 0 ], [ 0, 1, 1 ] ],
                    [ [ 0, 0, 0 ], [ 1, 1, 1 ], [ 1, 0, 0 ] ],
                    [ [ 1, 1, 0 ], [ 0, 1, 0 ], [ 0, 1, 0 ] ]
                ],
                rows : 2,
                cols : 3
            },
            { // O Tetrimino
                matrix : [
                    [ [ 0, 1, 1, 0 ], [ 0, 1, 1, 0 ], [ 0, 0, 0, 0 ] ],
                    [ [ 0, 1, 1, 0 ], [ 0, 1, 1, 0 ], [ 0, 0, 0, 0 ] ],
                    [ [ 0, 1, 1, 0 ], [ 0, 1, 1, 0 ], [ 0, 0, 0, 0 ] ],
                    [ [ 0, 1, 1, 0 ], [ 0, 1, 1, 0 ], [ 0, 0, 0, 0 ] ]
                ],
                rows : 2,
                cols : 4
            },
            { // S Tetrimino
                matrix : [
                    [ [ 0, 1, 1 ], [ 1, 1, 0 ], [ 0, 0, 0 ] ],
                    [ [ 0, 1, 0 ], [ 0, 1, 1 ], [ 0, 0, 1 ] ],
                    [ [ 0, 0, 0 ], [ 0, 1, 1 ], [ 1, 1, 0 ] ],
                    [ [ 1, 0, 0 ], [ 1, 1, 0 ], [ 0, 1, 0 ] ]
                ],
                rows : 2,
                cols : 3
            },
            { // T Tetrimino
                matrix : [
                    [ [ 0, 1, 0 ], [ 1, 1, 1 ], [ 0, 0, 0 ] ],
                    [ [ 0, 1, 0 ], [ 0, 1, 1 ], [ 0, 1, 0 ] ],
                    [ [ 0, 0, 0 ], [ 1, 1, 1 ], [ 0, 1, 0 ] ],
                    [ [ 0, 1, 0 ], [ 1, 1, 0 ], [ 0, 1, 0 ] ]
                ],
                rows : 2,
                cols : 3
            },
            { // Z Tetrimino
                matrix : [
                    [ [ 1, 1, 0 ], [ 0, 1, 1 ], [ 0, 0, 0 ] ],
                    [ [ 0, 0, 1 ], [ 0, 1, 1 ], [ 0, 1, 0 ] ],
                    [ [ 0, 0, 0 ], [ 1, 1, 0 ], [ 0, 1, 1 ] ],
                    [ [ 0, 1, 0 ], [ 1, 1, 0 ], [ 1, 0, 0 ] ]
                ],
                rows : 2,
                cols : 3
            }
        ],
        soundFiles        = [ "pause", "crash", "drop", "line", "rotate", "end" ],
        fastKeys          = [ 37, 65, 40, 83, 39, 68 ],
        matrixCols        = 12,
        matrixRows        = 23,
        nexterWidth       = 9.6,
        nexterHeight      = 6.3,
        tetriminoSize     = 2,
        tetriminoBorder   = 0.2,
        tetriminoMaxRot   = 3,
        tetriminoSequence = [ 0, 1, 2, 3, 4, 5, 6 ],
        tetriminoPointer  = 0,
        scoreMultipliers  = [ 40, 100, 300, 1200 ],
        timeInterval      = 50,
        linesPerLevel     = 10,
        maxInitialLevel   = 10,
        maxScores         = 9,
        soundStorage      = "tetris.sound",
        scoresStorage     = "tetris.hs",
        zoomStorage       = "tetris.zoom",
        gameDisplay       = "mainScreen",
        gameLevel         = 1;
    
    
    /**
     * Display Functions
     */
    function isStarting() { return gameDisplay === "starting"; }
    function isPlaying() {  return gameDisplay === "playing";  }
    function isPaused() {   return gameDisplay === "paused";   }
    
    /**
     * Destroys the game elements
     */
    function destroyGame() {
        fielder.innerHTML = "";
        winker.innerHTML  = "";
        nexter.innerHTML  = "";
        piecer.innerHTML  = "";
        ghoster.innerHTML = "";
    }
    
    
    /**
     * Sets the initial level
     */
    function setLevel() {
        leveler.innerHTML = gameLevel;
    }
    
    /**
     * Increases the initial level
     */
    function increaseLevel() {
        Utils.unselect();
        if (gameLevel < maxInitialLevel) {
            gameLevel += 1;
            setLevel();
        }
    }
    
    /**
     * Decreases the initial level
     */
    function decreaseLevel() {
        Utils.unselect();
        if (gameLevel > 1) {
            gameLevel -= 1;
            setLevel();
        }
    }
    
    /**
     * Sets the initial level
     * @param {number}
     */
    function chooseLevel(level) {
        if (level > 0 && level <= maxInitialLevel) {
            gameLevel = level;
            setLevel();
        }
    }
    
    
    /**
     * Key Press Event
     * @param {number} key
     * @param {?Event} event
     */
    function pressKey(key, event) {
        if (scores.isFocused()) {
            if (key === 13) {
                scores.save();
            }
        } else {
            if (!isPlaying()) {
                event.preventDefault();
            }
            
            if ([8, 66, 78].indexOf(key) > -1) {            // Backspace / B / N
                key = "B";
            } else if ([13, 79, 84].indexOf(key) > -1) {    // Enter / O / T
                key = "O";
            } else if ([80, 67].indexOf(key) > -1) {        // P / C
                key = "P";
            } else if ([17, 32].indexOf(key) > -1) {        // Ctrl / Space
                key = "C";
            } else if ([38, 87].indexOf(key) > -1) {        // Up    / W
                key = "W";
            } else if ([37, 65].indexOf(key) > -1) {        // Left  / A
                key = "A";
            } else if ([40, 83].indexOf(key) > -1) {        // Down  / S
                key = "S";
            } else if ([39, 68].indexOf(key) > -1) {        // Right / D
                key = "D";
            } else if (gameDisplay === "mainScreen") {
                if (key === 48 || key === 96) {
                    chooseLevel(10);
                } else if (key > 48 && key < 58) {
                    chooseLevel(key - 48);
                } else if (key > 96 && key < 106) {
                    chooseLevel(key - 96);
                }
            } else {
                key = String.fromCharCode(key);
            }
            
            if (shortcuts[gameDisplay][key]) {
                shortcuts[gameDisplay][key]();
            }
        }
    }
    
    /**
     * Key handler for the on key down event
     * @param {$.Event} event
     */
    function onKeyDown(event) {
        if (isPlaying() && fastKeys.indexOf(event.keyCode) > -1) {
            if (keyPressed === null) {
                keyPressed = event.keyCode;
            } else {
                return;
            }
        }
        pressKey(event.keyCode, event);
    }
    
    /**
     * Key handler for the on key up event
     * @param {$.Event} event
     */
    function onKeyUp() {
        keyPressed = null;
        gameCount  = 0;
    }
    
    /**
     * When a key is pressed, this is called on each frame for fast key movements
     */
    function onKeyHold() {
        if (keyPressed !== null && isPlaying()) {
            pressKey(keyPressed);
        }
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
            if (gameTimer < 0) {
                actualTetrimino.softDrop();
                gameTimer = scorer.getTimer();
            }
            
            if (keyPressed) {
                gameCount += 1;
                if (gameCount > 8) {
                    onKeyHold();
                    gameCount -= 3;
                }
            }
            
            if (isPlaying() && !board.isWinking()) {
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
     * Show the messages
     */
    function showMessage() {
        container.className = gameDisplay;
        header.innerHTML    = messages[gameDisplay][0];
        paragraph.innerHTML = messages[gameDisplay][1];
    }
    
    /**
     * Hide the messages
     */
    function hideMessage() {
        container.className = "playing";
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
        sound.pause();
    }
    
    /**
     * Unpause the Game
     */
    function endPause() {
        gameDisplay = "playing";
        
        hideMessage();
        requestAnimation();
        sound.pause();
    }
    
    /**
     * Toggles the pause
     */
    function showPause() {
        if (isPaused()) {
            endPause();
        } else {
            startPause();
        }
    }
    
    /**
     * Finish the Game
     */
    function finishGame() {
        destroyGame();
        showMainScreen();
    }
    
    /**
     * Game Over
     */
    function showGameOver() {
        gameDisplay = "gameOver";
        
        showMessage();
        sound.end();
        scores.setInput();
        destroyGame();
    }
    
    /**
     * Show the High Scores
     */
    function showHighScores() {
        gameDisplay = "highScores";
        showMessage();
        scores.show();
    }
    
    /**
     * Show the Help
     */
    function showHelp() {
        gameDisplay = "help";
        showMessage();
    }
    
    
    
    /**
     * @constructor
     * The Board Class
     */
    function Board() {
        var i, j;
        
        this.matrix = [];
        this.rows   = [];
        this.lines  = [];
        this.winks  = null;
        
        for (i = 0; i < matrixRows; i += 1) {
            this.matrix[i] = [];
            this.rows[i]   = 0;
            for (j = 0; j < matrixCols; j += 1) {
                this.matrix[i][j] = this.isBorder(i, j) ? 1 : 0;
            }
        }
    }
    
    /**
     * Checks if there is a crash, given the Tetrimino Matrix and position
     * @param {number} top
     * @param {number} left
     * @param {Array.<Array.<number>>} matrix
     */
    Board.prototype.crashed = function (top, left, matrix) {
        var i, j;
        for (i = 0; i < matrix.length; i += 1) {
            for (j = 0; j < matrix[i].length; j += 1) {
                if (matrix[i][j] && this.matrix[top + i][left + j + 1]) {
                    return true;
                }
            }
        }
        return false;
    };
    
    /**
     * Adds Tetrimino Elements to the Matrix
     * @param {DOMElement} element
     * @param {number} top
     * @param {number} left
     */
    Board.prototype.addToMatrix = function (element, top, left) {
        this.matrix[top][left + 1] = element;
        this.rows[top] += 1;
        
        return this.rows[top] === matrixCols - 2;
    };
    
    /**
     * Removes a Row from the Matrix
     * @param {number} line
     */
    Board.prototype.removeLine = function (line) {
        var i, j;
        for (i = 1; i < matrixCols - 1; i += 1) {
            if (this.matrix[line][i]) {
                Utils.removeElement(this.matrix[line][i]);
            }
        }
        
        i = line - 1;
        while (this.rows[i] > 0) {
            for (j = 1; j < matrixCols - 1; j += 1) {
                this.matrix[i + 1][j] = this.matrix[i][j];
                if (this.matrix[i][j]) {
                    this.matrix[i][j].style.top = this.getTop(i + 1);
                }
            }
            this.rows[i + 1] = this.rows[i];
            i -= 1;
        }
        i += 1;
        for (j = 1; j < matrixCols - 1; j += 1) {
            this.matrix[i][j] = 0;
        }
        this.rows[i] = 0;
    };
    
        
    /**
     * Adds all the elements in the Tetrimino to the board
     * @param {Array.<Array.<number>>} matrix
     * @param {number} type
     * @param {number} elemTop
     * @param {number} elemLeft
     */
    Board.prototype.addElements = function (matrix, type, elemTop, elemLeft) {
        var i, j, top, left, elem, lines = [];
        
        for (i = 0; i < matrix.length; i += 1) {
            for (j = 0; j < matrix[i].length; j += 1) {
                if (matrix[i][j]) {
                    top  = elemTop  + i;
                    left = elemLeft + j;
                    elem = this.append(type, top, left);
                    
                    if (this.addToMatrix(elem, top, left)) {
                        lines.push(top);
                    }
                }
            }
        }
        if (lines.length > 0) {
            this.startWink(lines);
        }
    };
    
    /**
     * Creates a new element and adds it to the Board
     * @param {number} type
     * @param {number} top
     * @param {number} left
     */
    Board.prototype.append = function (type, top, left) {
        var element = document.createElement("DIV");
        element.className  = "cell" + type;
        element.style.top  = this.getTop(top);
        element.style.left = this.getLeft(left);
        
        fielder.appendChild(element);
        return element;
    };
    
    /**
     * Starts the wink animation
     * @param {Array.<number>} lines
     */
    Board.prototype.startWink = function (lines) {
        var self = this;
        lines.forEach(function (line) {
            if (self.lines[line]) {
                self.lines[line].classList.add("wink");
            } else {
                self.lines[line] = self.createWink(line);
            }
        });
        
        sound.line();
        scorer.line(lines.length);
        
        this.winks = lines;
    };
    
    /**
     * Creates a new wink Element
     * @param {number} top
     * @return {DOMElement}
     */
    Board.prototype.createWink = function (top) {
        var element = document.createElement("div"),
            self    = this;
        
        element.className   = "wink";
        element.style.top   = this.getTop(top);
        element.dataset.top = top;
        
        winker.appendChild(element);
        
        Utils.addEventListener(element, "AnimationEnd", function () {
            self.endWink();
        });
        return element;
    };
    
    /**
     * Ends the Wink animation
     */
    Board.prototype.endWink = function () {
        var self = this;
        if (this.winks) {
            this.winks.forEach(function (line) {
                self.lines[line].classList.remove("wink");
                self.removeLine(line);
            });
            
            this.winks = null;
            actualTetrimino.setHardDrop();
            requestAnimation();
        }
    };
    
    /**
     * Returns true if the Board is winking
     * @return {boolean}
     */
    Board.prototype.isWinking = function () {
        return this.winks !== null;
    };
    
    
    /**
     * Returns true if the position is a border
     * @param {number} top
     * @param {number} left
     * @return {boolean}
     */
    Board.prototype.isBorder = function (top, left) {
        return top === matrixRows  - 1 || left === 0 || left === matrixCols - 1;
    };
    
    /**
     * Returns a column so that the Tetrimino is centered in the board
     * @param {number} cols - Number of columns of the Tetrimino
     * @return {number}
     */
    Board.prototype.getMiddle = function (cols) {
        return Math.floor((matrixCols - cols - 2) / 2);
    };
    
    /**
     * Returns the top position for styling
     * @param {number} top
     * @return {string}
     */
    Board.prototype.getTop = function (top) {
        return ((top - 2) * tetriminoSize) + "em";
    };
    
    /**
     * Returns the left position for styling
     * @param {number} top
     * @return {string}
     */
    Board.prototype.getLeft = function (left) {
        return (left * tetriminoSize) + "em";
    };
    
    
    
    /**
     * @constructor
     * The Tetrimino Class
     */
    function Tetrimino() {
        this.type         = this.getNextType();
        this.data         = tetriminos[this.type];
        this.top          = 0;
        this.left         = 0;
        this.rotation     = 0;
        this.hard         = 0;
        this.drop         = 0;
        
        nexter.className  = "piece" + this.type + " rot0";
        nexter.innerHTML  = tetriminer[this.type].innerHTML;
        nexter.style.top  = (nexterHeight - this.data.rows * tetriminoSize - tetriminoBorder) / 2 + "em";
        nexter.style.left = (nexterWidth  - this.data.cols * tetriminoSize - tetriminoBorder) / 2 + "em";
        
        this.setCubePositions();
    }
    
    /**
     * Increase the current pointer and if required it creates a new permutation of the 7 Tetriminos
     * and then it returns the next type
     * @return {number}
     */
    Tetrimino.prototype.getNextType = function () {
        var i, pos, aux;
        
        if (tetriminoPointer < tetriminoSequence.length - 1) {
            tetriminoPointer += 1;
        } else {
            for (i = 0; i < tetriminoSequence.length; i += 1) {
                pos = Utils.rand(0, tetriminoSequence.length - 1);
                aux = tetriminoSequence[pos];
                
                tetriminoSequence[pos] = tetriminoSequence[i];
                tetriminoSequence[i]   = aux;
            }
            tetriminoPointer = 0;
        }
        return tetriminoSequence[tetriminoPointer];
    };
    
    /**
     * Sets the positions of each cube in the piece
     */
    Tetrimino.prototype.setCubePositions = function () {
        var i, elements = nexter.querySelectorAll("div");
        
        for (i = 0; i < elements.length; i += 1) {
            elements[i].style.top  = (elements[i].dataset.top  * tetriminoSize) + "em";
            elements[i].style.left = (elements[i].dataset.left * tetriminoSize) + "em";
        }
    };
    
    /**
     * Makes the Tetrimino start falling
     * @return {Tetrimino}
     */
    Tetrimino.prototype.fall = function () {
        this.left = board.getMiddle(this.data.cols);
        this.hard = this.getHardDrop();
        
        piecer.className = "piece" + this.type + " rot0";
        piecer.innerHTML = nexter.innerHTML;
        
        ghoster.className = "rot0";
        ghoster.innerHTML = nexter.innerHTML;
        
        this.setDropPosition();
        return this;
    };
    
    /**
     * Called when the Tetrimino crashes into the bottom of the screen or on top of another tetrimino
     */
    Tetrimino.prototype.crash = function () {
        if (this.top === 0 || this.top === 1) {
            showGameOver();
            return;
        }
        
        scorer.piece(this.drop);
        board.addElements(this.getMatrix(), this.type, this.top, this.left);
        sound.crash();
        
        actualTetrimino = nextTetrimino.fall();
        nextTetrimino   = new Tetrimino();
    };
    
    /**
     * Moves the Tetrimino one cell down
     */
    Tetrimino.prototype.softDrop = function () {
        if (this.crashed(1, 0)) {
            this.crash();
        } else {
            this.top  += 1;
            this.drop += 1;
            this.setDropPosition();
        }
    };
    
    /**
     * Moves the Tetrimino to the bottom most possible cell
     */
    Tetrimino.prototype.hardDrop = function () {
        sound.drop();
        this.top = this.getHardDrop();
        
        this.setDropPosition();
        this.crash();
    };
    
    /**
     * Moves the Tetrimino one cell to the left
     */
    Tetrimino.prototype.moveLeft = function () {
        if (!this.crashed(0, -1)) {
            this.left -= 1;
            this.hard  = this.getHardDrop();
            this.setDropPosition();
        }
    };
    
    /**
     * Moves the Tetrimino one cell to the right
     */
    Tetrimino.prototype.moveRight = function () {
        if (!this.crashed(0, 1)) {
            this.left += 1;
            this.hard  = this.getHardDrop();
            this.setDropPosition();
        }
    };
    
    /**
     * Rotates the Tetrimino clockwise
     */
    Tetrimino.prototype.rotateRight = function () {
        var rotation = this.rotation + 1;
        if (rotation > tetriminoMaxRot) {
            rotation = 0;
        }
        this.rotate(rotation);
    };
    
    /**
     * Rotates the Tetrimino anti-clockwise
     */
    Tetrimino.prototype.rotateLeft = function () {
        var rotation = this.rotation - 1;
        if (rotation < 0) {
            rotation = tetriminoMaxRot;
        }
        this.rotate(rotation);
    };
    
    /**
     * Does the Tetrimino rotation
     * @param {number} rotation
     */
    Tetrimino.prototype.rotate = function (rotation) {
        if (!this.crashed(0, 0, rotation)) {
            piecer.classList.remove("rot" + this.rotation);
            piecer.classList.add("rot" + rotation);
            ghoster.classList.remove("rot" + this.rotation);
            ghoster.classList.add("rot" + rotation);
            
            this.rotation = rotation;
            this.setHardDrop();
            sound.rotate();
        }
    };
    
    /**
     * Sets the position of the Tetrimino and the Ghost
     */
    Tetrimino.prototype.setDropPosition = function () {
        piecer.style.top   = board.getTop(this.top);
        piecer.style.left  = board.getLeft(this.left);
        ghoster.style.top  = board.getTop(this.hard);
        ghoster.style.left = board.getLeft(this.left);
    };
    
    /**
     * Returns a matrix that represents the Tetrimino for the given rotation
     * @param {number=} rotation
     * @return {Array.<Array.<number>>}
     */
    Tetrimino.prototype.getMatrix = function (rotation) {
        var rot = rotation || rotation === 0 ? rotation : this.rotation;
        return this.data.matrix[rot];
    };
    
    /**
     * Sets the bottom most cell
     */
    Tetrimino.prototype.setHardDrop = function () {
        this.hard = this.getHardDrop();
        this.setDropPosition();
    };
    
    /**
     * Gets the bottom most cell
     * @return {number}
     */
    Tetrimino.prototype.getHardDrop = function () {
        var add = 1;
        while (!this.crashed(add, 0)) {
            add += 1;
        }
        return this.top + add - 1;
    };
    
    /**
     * Returns a possible crash from the matrix
     * @param {number} addTop
     * @param {number} addLeft
     * @param {number} rotation
     * @return {boolean}
     */
    Tetrimino.prototype.crashed = function (addTop, addLeft, rotation) {
        return board.crashed(this.top + addTop, this.left + addLeft, this.getMatrix(rotation));
    };
    
    
    
    /**
     * @constructor
     * The Scorer Class
     */
    function Scorer() {
        this.levelElem = document.querySelector(".level .content");
        this.scoreElem = document.querySelector(".score .content");
        this.linesElem = document.querySelector(".lines .content");
        
        this.level     = gameLevel;
        this.score     = 0;
        this.lines     = 0;
        this.amount    = 0;
        this.timer     = this.calculateTimer();
        
        this.setLevel();
        this.setScore();
        this.setLines();
    }
    
    /**
     * Adds the score for a new Piece that dropped
     * @param {number} drop - Amount of cells the Tetrimino dropped before crashing the bottom
     */
    Scorer.prototype.piece = function (drop) {
        this.score += 21 + (3 * this.level) - drop;
        this.setScore();
    };
    
    /**
     * Adds the score for a new Line
     * @param {number} amount - Amount of lines completed in one move
     */
    Scorer.prototype.line = function (amount) {
        this.addScore(amount);
        this.addLine(amount);
        this.addLevel(amount);
    };
    
    /**
     * Increases the score
     * @param {number} amount - Amount of lines completed in one move
     */
    Scorer.prototype.addScore = function (amount) {
        this.score += this.level * scoreMultipliers[amount - 1];
        this.setScore();
    };
    
    /**
     * Increases the lines
     * @param {number} amount - Amount of lines completed in one move
     */
    Scorer.prototype.addLine = function (amount) {
        this.lines += amount;
        this.setLines();
    };
    
    /**
     * Increases the level
     * @param {number} amount - Amount of lines completed in one move
     */
    Scorer.prototype.addLevel = function (amount) {
        this.amount += amount;
        if (this.amount >= linesPerLevel) {
            this.amount -= linesPerLevel;
            this.timer   = this.calculateTimer();
            this.level  += 1;
            this.setLevel();
        }
    };
    
    /**
     * Displays the level in the Game
     */
    Scorer.prototype.setLevel = function () {
        this.levelElem.innerHTML = this.level;
    };
    
    /**
     * Displays the score in the Game
     */
    Scorer.prototype.setScore = function () {
        this.scoreElem.innerHTML = Utils.formatNumber(this.score, ",");
    };
    
    /**
     * Displays the lines in the Game
     */
    Scorer.prototype.setLines = function () {
        this.linesElem.innerHTML = this.lines;
    };
    
    /**
     * Returns the timer between each drop
     * @return {number}
     */
    Scorer.prototype.getTimer = function () {
        return this.timer;
    };
    
    /**
     * Returns the current level
     * @return {number}
     */
    Scorer.prototype.getLevel = function () {
        return this.level;
    };
    
    /**
     * Returns the current Score
     * @return {number}
     */
    Scorer.prototype.getScore = function () {
        return this.score;
    };
    
    /**
     * Calculates the time used between each soft drop
     * @return {number}
     */
    Scorer.prototype.calculateTimer = function () {
        return (this.level < maxInitialLevel ? (maxInitialLevel + 1 - this.level) : 1) * timeInterval;
    };
    
    
    
    /**
     * @constructor
     * The Game High Scores
     */
    function HighScores() {
        this.input  = document.querySelector(".input input");
        this.scores = document.querySelector(".scores");
        this.none   = document.querySelector(".none");
        this.data   = new Storage(scoresStorage);
        this.total  = this.data.get("total") || 0;
    
        this.input.onfocus = function () { this.focused = true;  };
        this.input.onblur  = function () { this.focused = false; };
    }
    
    /**
     * Show the Scores for the given mode
     * @param {string} mode
     */
    HighScores.prototype.show = function (mode) {
        this.scores.innerHTML = "";
        this.showHideNone(this.total === 0);
        
        if (this.total > 0) {
            this.displayTitles();
            this.displayScores();
        }
    };
    
    /**
     * Create the titles and place it in the DOM
     */
    HighScores.prototype.displayTitles = function () {
        var div = this.createContent("name", "lvl", "score");
        div.className = "titles";
        this.scores.appendChild(div);
    };
    
    /**
     * Create each score line and place it in the DOM
     */
    HighScores.prototype.displayScores = function () {
        var i, data, div;
        for (i = 1; i <= this.total; i += 1) {
            data = this.data.get(i);
            div  = this.createContent(data.name, data.level, Utils.formatNumber(data.score, ","));
            div.className = "highScore";
            this.scores.appendChild(div);
        }
    };
    
    /**
     * Creates the content for each High Score
     */
    HighScores.prototype.createContent = function (name, level, score) {
        var namer     = "<div class='left'>"    + name  + " -</div>",
            lvler     = "<div class='middle'>"  + level + "</div>",
            scorer    = "<div class='right'>- " + score + "</div>",
            container = document.createElement("DIV");
        
        container.innerHTML = namer + lvler + scorer;
        return container;
    };
    
    /**
     * Tries to save a score, when possible
     */
    HighScores.prototype.save = function () {
        if (this.input.value) {
            this.saveData();
            showHighScores();
        }
    };
    
    /**
     * Gets the scores and adds the new one in the right position, updating the total, when possible
     */
    HighScores.prototype.saveData = function () {
        var i, hs, data = [], saved = false, self = this,
            actual = {
                name  : this.input.value,
                level : scorer.getLevel(),
                score : scorer.getScore()
            };
        
        for (i = 1; i <= this.total; i += 1) {
            hs = this.data.get(i);
            if (!saved && hs.score < actual.score) {
                data.push(actual);
                saved = true;
            }
            if (data.length < maxScores) {
                data.push(hs);
            }
        }
        if (!saved && data.length < maxScores) {
            data.push(actual);
        }
        
        this.data.set("total", data.length);
        data.forEach(function (element, index) {
            self.data.set(index + 1, element);
        });
        this.total = data.length;
    };
    
    /**
     * Deletes all the Scores
     */
    HighScores.prototype.restore = function () {
        var i;
        for (i = 1; i <= this.total; i += 1) {
            this.data.remove(i);
        }
        this.data.set("total", 0);
        this.show();
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
     * Starts a new game
     */
    function newGame() {
        gameDisplay      = "playing";
        tetriminoPointer = tetriminoSequence.length;
        
        board            = new Board();
        scorer           = new Scorer();
        actualTetrimino  = new Tetrimino().fall();
        nextTetrimino    = new Tetrimino();
        
        gameCount        = 0;
        gameTimer        = scorer.getTimer();
        
        hideMessage();
        requestAnimation();
    }
    
    /**
     * Creates the shortcuts functions
     */
    function createShortcuts() {
        shortcuts = {
            mainScreen : {
                O : function () { newGame();        },
                A : function () { decreaseLevel();  },
                D : function () { increaseLevel();  },
                I : function () { showHighScores(); },
                H : function () { showHelp();       },
                M : function () { sound.toggle();   }
            },
            paused : {
                P : function () { endPause();       },
                B : function () { finishGame();     }
            },
            gameOver : {
                O : function () { scores.save();    },
                B : function () { showMainScreen(); }
            },
            highScores : {
                B : function () { showMainScreen(); },
                R : function () { scores.restore(); }
            },
            help : {
                B : function () { showMainScreen(); }
            },
            playing : {
                C : function () { actualTetrimino.hardDrop();    },
                W : function () { actualTetrimino.rotateRight(); },
                A : function () { actualTetrimino.moveLeft();    },
                S : function () { actualTetrimino.softDrop();    },
                D : function () { actualTetrimino.moveRight();   },
                Z : function () { actualTetrimino.rotateLeft();  },
                P : function () { startPause();                  },
                M : function () { sound.toggle();                }
            }
        };
    }
    
    /**
     * Stores the used DOM elements and initializes the Event Handlers
     */
    function initDomListeners() {
        container  = document.querySelector("#container");
        header     = document.querySelector(".messages h2");
        paragraph  = document.querySelector(".messages p");
        leveler    = document.querySelector(".leveler");
        tetriminer = document.querySelectorAll(".tetriminos > div");
        fielder    = document.querySelector(".field");
        winker     = document.querySelector(".winker");
        nexter     = document.querySelector("#next");
        piecer     = document.querySelector("#piece");
        ghoster    = document.querySelector("#ghost");
        
        document.body.addEventListener("click", function (e) {
            var element = e.target;
            while (element.parentElement && !element.dataset.action) {
                element = element.parentElement;
            }
            
            switch (element.dataset.action) {
            case "decrease":
                decreaseLevel();
                break;
            case "increase":
                increaseLevel();
                break;
            case "start":
                newGame();
                break;
            case "mainScreen":
                showMainScreen();
                break;
            case "endPause":
                endPause();
                break;
            case "pause":
                showPause();
                break;
            case "finishGame":
                finishGame();
                break;
            case "highScores":
                showHighScores();
                break;
            case "help":
                showHelp();
                break;
            case "save":
                scores.save();
                break;
            case "restore":
                scores.restore();
                break;
            case "sound":
                sound.toggle();
                break;
            }
        });
        
        document.addEventListener("keydown", function (e) { onKeyDown(e); });
        document.addEventListener("keyup",   function (e) { onKeyUp(e);   });
    }
    
    /**
     * The main Function
     */
    function main() {
        initDomListeners();
        createShortcuts();
        
        sound  = new Sounds(soundFiles, soundStorage, true);
        scores = new HighScores();
    }
    
    
    // Load the game
    window.addEventListener("load", function () { main(); }, false);
    
}());