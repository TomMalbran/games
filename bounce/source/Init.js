(function () {
    "use strict";

    let mode, display, score, keyboard, board, ship, ball, tail, bricks, sound, scores;

    let hasStarted = false;
    let startTime  = 0;



    /**
     * Moves the ball
     * @param {Number} speed
     * @returns {Void}
     */
    function moveBall(speed) {
        let crash = false;
        ball.move(speed);

        if (mode.isBricksMode && bricks.crash(ball)) {
            sound.brick();
            score.inc();
            ball.randomChange();
        } else if (ball.bottomCrash()) {
            sound.end();
            gameOver();
        } else {
            if (ball.direction.top < 0) {
                crash = ball.topCrash();
            } else if (ball.shipCrash(ship)) {
                sound.bounce();
                ship.ballCrash();
                if (mode.isSpeedMode) {
                    ball.changeAngle(ship);
                    ball.accelerate();
                }
                if (mode.isSpeedMode || mode.isRandomMode) {
                    score.inc();
                }
                if (mode.isBricksMode && bricks.restart()) {
                    ship.reduceWidth();
                }
                crash = true;
            }
            if (ball.direction.left < 0) {
                crash = ball.leftCrash();
            } else {
                crash = ball.rightCrash();
            }
            if (crash && (mode.isRandomMode || mode.isBricksMode)) {
                ball.randomChange();
            }
        }
    }

    /**
     * Request an animation frame
     * @returns {Void}
     */
    function requestAnimation() {
        startTime = new Date().getTime();
        window.requestAnimationFrame(() => {
            const time  = new Date().getTime() - startTime;
            const speed = time / 16;

            if (speed < 0) {
                speed = 0;
            }
            if (speed > 5) {
                return requestAnimation();
            }

            if (hasStarted) {
                tail.move(ball);
                moveBall(speed);
            }
            keyboard.onKeyHold();

            if (display.isPlaying) {
                requestAnimation();
            }
        });
    }



    /**
     * Show the Main Screen
     * @returns {Void}
     */
    function showMainScreen() {
        display.set("mainScreen").show();
    }

    /**
     * Start the Game
     * @returns {Void}
     */
    function startGame() {
        hasStarted = true;
        ball.start();
    }

    /**
     * Finish the Game
     * @returns {Void}
     */
    function finishGame() {
        board.end();
        if (mode.isBricksMode) {
            bricks.destroy();
        }
        showMainScreen();
    }

    /**
     * Hide the required game parts
     * @returns {Void}
     */
    function hideGame() {
        display.show();
        board.end();
    }

    /**
     * Pauses the game
     * @returns {Void}
     */
    function startPause() {
        display.set("paused");
        hideGame();
    }

    /**
     * Unpauses the game
     * @returns {Void}
     */
    function endPause() {
        display.set("playing").hide();
        board.start((e) => ship.mouseMove(e));

        if (hasStarted) {
            requestAnimation();
        }
    }

    /**
     * Game Over
     * @returns {Void}
     */
    function gameOver() {
        display.set("gameOver");
        hideGame();
        scores.setInput();
        board.end();

        if (mode.isBricksMode) {
            bricks.destroy();
        }
    }

    /**
     * Show the High Scores
     * @returns {Void}
     */
    function showHighScores() {
        display.set("highScores").show();
    }

    /**
     * Saves a High Score
     * @returns {Void}
     */
    function saveHighScore() {
        if (scores.save(mode.get(), score.get())) {
            showHighScores();
        }
    }

    /**
     * Show the Help
     * @returns {Void}
     */
    function showHelp() {
        display.set("help").show();
    }



    /**
     * Callback used when the ship moves
     * @returns {Void}
     */
    function onShipMove() {
        if (!hasStarted) {
            ball.setStartLeft(ship);
            tail.start(ball);
        }
    }

    /**
     * Starts a new game
     * @param {String} gameMode
     * @returns {Void}
     */
    function newGame(gameMode) {
        hasStarted = false;

        display.set("playing").hide();
        mode.set(gameMode);
        score.restart();

        ship = new Ship(board, mode.shipWidth, onShipMove);
        ball = new Ball(board.width, board.height);
        tail = new Tail();

        board.start((e) => ship.mouseMove(e));
        ball.setStartTop(ship);
        ball.setStartLeft(ship);
        tail.start(ball);

        if (mode.isBricksMode) {
            bricks = new Bricks();
        }
        requestAnimation();
    }



    /**
     * Stores the used DOM elements and initializes the Event Handlers
     * @returns {Void}
     */
    function initDomListeners() {
        document.body.addEventListener("click", (e) => {
            const element = Utils.getTarget(e);
            const actions = {
                play       : () => newGame(element.dataset.mode),
                mainScreen : () => showMainScreen(),
                highScores : () => showHighScores(),
                help       : () => showHelp(),
                endPause   : () => endPause(),
                finishGame : () => finishGame(),
                save       : () => saveHighScore(),
                showScores : () => scores.show(element.dataset.mode),
                sound      : () => sound.toggle(),
            };

            if (actions[element.dataset.action]) {
                actions[element.dataset.action]();
            }
        });
    }

    /**
     * Returns the shortcuts functions
     * @returns {Object}
     */
    function getShortcuts() {
        return {
            mainScreen : {
                O : () => newGame(mode.get()),
                E : () => newGame("speed"),
                R : () => newGame("random"),
                C : () => newGame("bricks"),
                I : () => showHighScores(),
                H : () => showHelp(),
                M : () => sound.toggle()
            },
            paused : {
                P : () => endPause(),
                B : () => finishGame()
            },
            gameOver : {
                O : () => saveHighScore(),
                B : () => showMainScreen()
            },
            highScores : {
                E : () => scores.show("speed"),
                R : () => scores.show("random"),
                C : () => scores.show("bricks"),
                B : () => showMainScreen()
            },
            help : {
                B : () => showMainScreen()
            },
            playing : {
                A : () => ship.keyMove(-1),
                D : () => ship.keyMove(1),
                O : () => startGame(),
                P : () => startPause(),
                M : () => sound.toggle()
            }
        };
    }

    /**
     * Called when the board is clicked
     * @returns {Void}
     */
    function onBoardClick() {
        if (!hasStarted) {
            startGame();
        } else {
            startPause();
        }
    }

    /**
     * The main Function
     * @returns {Void}
     */
    function main() {
        initDomListeners();

        display  = new Display();
        mode     = new Mode();
        score    = new Score();
        sound    = new Sounds([ "bounce", "brick", "end" ], "bounce.sound");
        board    = new Board(onBoardClick);
        scores   = new HighScores();
        keyboard = new Keyboard(display, scores, getShortcuts());
    }


    // Load the game
    window.addEventListener("load", main, false);

}());
