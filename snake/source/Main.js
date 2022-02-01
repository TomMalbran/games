import Board        from "./Board.js";
import Demo         from "./Demo.js";
import Display      from "./Display.js";
import Game         from "./Game.js";
import HighScores   from "./HighScores.js";
import Instance     from "./Instance.js";
import Keyboard     from "./Keyboard.js";
import Score        from "./Score.js";

// Utils
import Sounds       from "../../utils/Sounds.js";
import Utils        from "../../utils/Utils.js";

// Variables
let display   = null;
let demo      = null;
let board     = null;
let sounds    = null;
let score     = null;
let game      = null;
let scores    = null;
let instance  = null;
let starter   = null;
let animation = null;
let startTime = null;



/**
 * Show the Main Screen
 * @returns {Void}
 */
function showMainScreen() {
    display.set("mainScreen").show();
}

/**
 * Pause the Game
 * @returns {Void}
 */
function startPause() {
    display.set("paused").show();
    cancelAnimation();
}

/**
 * Unpause the Game
 * @returns {Void}
 */
function endPause() {
    display.set("playing").setClass();
    requestAnimation();
}

/**
 * Finish the Game
 * @returns {Void}
 */
function finishGame() {
    display.set("mainScreen").show();
    game.destroy();
    cancelAnimation();
    instance.destroyGame();
}

/**
 * Game Over
 * @returns {Void}
 */
function gameOver() {
    cancelAnimation();
    display.set("gameOver").show();
    scores.setInput();
    instance.destroyGame();
}

/**
 * Svae scores and restart
 * @returns {Void}
 */
function endGameOver(save) {
    game.destroy();
    if (save) {
        saveHighScore();
    } else {
        showMainScreen();
    }
}



/**
 * Starts the speed demo
 * @param {Number} level
 * @returns {Void}
 */
function startDemo(level) {
    display.set("demo");
    score.set(level, 0);
    demo.start(level);
    requestAnimation();
}

/**
 * Ends the speed demo
 * @returns {Void}
 */
function endDemo() {
    if (display.isDemoing) {
        display.set("mainScreen");
        cancelAnimation();
    }
    demo.end();
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
    if (scores.save(score.level, score.score)) {
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
 * Starts a new game
 * @param {Number} level
 * @returns {Void}
 */
 function newGame(level) {
    display.set("starting").setClass();
    score.set(level).show();

    game = new Game(board, instance);
    instance.newGame(level);
    requestAnimation();
}

/**
 * Restores a saved Game
 * @returns {Void}
 */
function restoreGame() {
    if (instance.hasGame) {
        const data = instance.generateData();

        display.set("continuing").show();
        score.set(data.level, data.score).show();

        game = new Game(board, instance, data);
    }
}



/**
 * Request an animation frame
 * @returns {Void}
 */
function requestAnimation() {
    startTime = new Date().getTime();
    animation = window.requestAnimationFrame(() => {
        const time  = new Date().getTime() - startTime;
        const speed = time / 16;

        score.decTime(time);
        if (speed <= 0 || speed > 5) {
            return requestAnimation();
        }

        if (score.time < 0) {
            if (display.isDemoing) {
                demo.move();
            }
            if (display.isStarting) {
                nextCount();
            } else if (display.isPlaying) {
                const res = game.snake.move();
                if (res === "crashed") {
                    sounds.play("end");
                    gameOver();
                } else if (res === "ate") {
                    sounds.play("eat");
                    score.incScore(game.food.timer);
                    instance.saveScore(score.score);
                    game.addFood();
                }
            }
            score.resetTime();
        }
        if (display.isPlaying) {
            game.food.reduceTime(time);
            score.showFoodTimer(game.food.timer);
        }

        if (display.isDemoing || display.isStarting || display.isPlaying) {
            requestAnimation();
        }
    });
}

/**
 * Cancel an animation frame
 * @returns {Void}
 */
function cancelAnimation() {
    window.cancelAnimationFrame(animation);
}

/**
 * Reduces by 1 the initial count until it changes the mode to playing
 * @returns {Void}
 */
function nextCount() {
    let content = "";

    score.decCount();
    if (score.count > 0) {
        content = score.count;
        sounds.play("start");
    } else if (score.count === 0) {
        content = "Go!";
        sounds.play("eat");
        window.setTimeout(() => sounds.play("eat"), 200);
    } else {
        display.set("playing").setClass();
    }

    starter.innerHTML = content;
}

/**
 * Returns the shortcut functions
 * @returns {Object}
 */
function getShortcuts() {
    return {
        mainScreen : {
            O : () => newGame(score.level),
            Y : () => newGame(1),
            E : () => newGame(2),
            R : () => newGame(3),
            U : () => newGame(4),
            I : () => showHighScores(),
            H : () => showHelp(),
            T : () => restoreGame(),
            M : () => sounds.toggle()
        },
        paused : {
            P : () => endPause(),
            B : () => finishGame()
        },
        gameOver : {
            O : () => endGameOver(true),
            B : () => endGameOver(false)
        },
        highScores : {
            Y : () => scores.show(1),
            E : () => scores.show(2),
            R : () => scores.show(3),
            U : () => scores.show(4),
            B : () => showMainScreen()
        },
        help : {
            B : () => showMainScreen()
        },
        playing : {
            W : () => game.turnSnake(-1, 0),
            A : () => game.turnSnake(0, -1),
            S : () => game.turnSnake(1, 0),
            D : () => game.turnSnake(0, 1),
            P : () => startPause(),
            M : () => sounds.toggle()
        },
        saveHighScore : () => saveHighScore()
    };
}

/**
 * Stores the used DOM elements and initializes the Event Handlers
 * @returns {Void}
 */
function initDomListeners() {
    const navigation = document.querySelector(".main ul");
    starter = document.querySelector(".start");

    document.body.addEventListener("click", (e) => {
        const element = Utils.getTarget(e);
        const actions = {
            play       : () => newGame(Number(element.dataset.level)),
            mainScreen : () => showMainScreen(),
            highScores : () => showHighScores(),
            help       : () => showHelp(),
            restore    : () => restoreGame(),
            endPause   : () => endPause(),
            finishGame : () => finishGame(),
            save       : () => endGameOver(true),
            newGame    : () => endGameOver(false),
            showScores : () => scores.show(element.dataset.level),
            sound      : () => sounds.toggle()
        };

        if (actions[element.dataset.action]) {
            actions[element.dataset.action]();
        }
    });

    navigation.addEventListener("mouseover", (e) => {
        const element = Utils.getCloseTarget(e);
        if (element.dataset.action === "play") {
            startDemo(Number(element.dataset.level));
        }
    });
    navigation.addEventListener("mouseout", (e) => {
        const element = Utils.getCloseTarget(e);
        if (element.dataset.action === "play") {
            endDemo();
        }
    });

    document.querySelector(".game").addEventListener("click", (e) => {
        if (display.isPlaying) {
            game.mouseTurn(e);
        }
    });
}



/**
 * The main Function
 * @returns {Void}
 */
function main() {
    initDomListeners();

    display  = new Display();
    score    = new Score(display);
    board    = new Board();
    demo     = new Demo(board);
    instance = new Instance(board);
    sounds   = new Sounds("snake.sound");
    scores   = new HighScores();

    new Keyboard(display, scores, getShortcuts());
}

// Load the game
window.addEventListener("load", main, false);
