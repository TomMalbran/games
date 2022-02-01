import Animations   from "./animations/Animations.js";
import Board        from "./board/Board.js";
import Blob         from "./Blob.js";
import Demo         from "./demo/Demo.js";
import Display      from "./Display.js";
import Food         from "./Food.js";
import Fruit        from "./Fruit.js";
import Ghosts       from "./ghosts/Ghosts.js";
import HighScores   from "./HighScores.js";
import Score        from "./score/Score.js";

// Utils
import KeyCode      from "../../utils/KeyCode.js";
import Sounds       from "../../utils/Sounds.js";
import Utils        from "../../utils/Utils.js";

// Variables
let board      = null;
let display    = null;
let demo       = null;
let animations = null;
let sounds     = null;
let scores     = null;
let score      = null;
let food       = null;
let fruit      = null;
let ghosts     = null;
let blob       = null;
let animation  = null;
let startTime  = null;
let actions    = null;
let shortcuts  = null;;



/**
 * Calls the Game Over animation and then deletes the game data
 * @returns {Void}
 */
function gameOver() {
    display.set("ready");
    animations.gameOver(() => {
        food   = null;
        fruit  = null;
        ghosts = null;
        blob   = null;

        board.clearAll();
        display.set("gameOver").show();
        scores.setInput();
    });
}

/**
 * Creates the Blob and the Ghosts, and starts the Ready animation
 * @param {Boolean} newLife
 * @returns {Void}
 */
function createPlayers(newLife) {
    ghosts = new Ghosts(board, newLife ? ghosts : null);
    blob   = new Blob(board);

    blob.draw();
    ghosts.draw();
    animations.ready(() => display.set("playing"));
}



/**
 * Called when the Blob enters a new tile
 * @returns {Void}
 */
function blobEating() {
    const tile   = blob.tile;
    const atPill = food.isAtPill(tile);

    if (atPill) {
        const value = food.eatPill(tile);
        const total = food.getLeftPills();

        fruit.add(total);
        score.pill(value);
        ghosts.resetPenTimer();
        ghosts.checkElroyDots(total);

        if (value === board.level.energizerValue) {
            ghosts.frighten(blob);
        }
        sounds.play(blob.getSound());

    } else if (fruit.isAtPos(tile)) {
        const text = score.fruit();
        fruit.eat();
        animations.fruitScore(text, board.fruitTile);
    }
    blob.onEat(atPill, ghosts.areFrighten());
}

/**
 * Called to do the crash etween a ghost and th blob
 * @returns {Void}
 */
function ghostCrash() {
    ghosts.crash(blob.tile, (eyesCounter, tile) => {
        const text = score.kill(eyesCounter);
        animations.ghostScore(text, tile);
        sounds.play("kill");
    }, () => {
        board.clearGame();
        animations.death(blob, newLife);
        sounds.play("death");
    });
}



/**
 * Called after the Blob dies
 * @returns {Void}
 */
function newLife() {
    const hasLives = score.died();
    if (hasLives) {
        display.set("ready");
        createPlayers(true);
    } else {
        gameOver();
    }
}

/**
 * Called after we get to a new level
 * @returns {Void}
 */
function newLevel() {
    animations.newLevel(board.level.get(), () => {
        food  = new Food(board);
        fruit = new Fruit(board);

        board.clearGame();
        food.draw();
        score.draw();
        createPlayers(false);
    });
}



/**
 * Request an animation frame
 * @returns {Void}
 */
function requestAnimation() {
    startTime = new Date().getTime();
    animation = window.requestAnimationFrame(() => {
        const time  = new Date().getTime() - startTime;
        const speed = (time / 16) * 1.5;

        if (speed > 5) {
            return requestAnimation();
        }

        if (display.isMainScreen) {
            demo.animate(time, speed);
        } else if (animations.isAnimating) {
            animations.animate(time);
        } else if (display.isPlaying) {
            board.clearGame();
            food.wink();
            fruit.reduceTimer(time);
            ghosts.animate(time, speed, blob);
            const newTile = blob.animate(speed);
            animations.animate(time);

            if (newTile) {
                ghosts.setTargets(blob);
                blobEating();
            }
            if (food.getLeftPills() === 0) {
                score.newLevel();
                animations.endLevel(newLevel);
            }
            ghostCrash();
        }
        requestAnimation();
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
 * Starts a new Game
 * @returns {Void}
 */
function newGame() {
    display.set("ready").show();
    cancelAnimation();

    score = new Score(board);
    food  = new Food(board);
    fruit = new Fruit(board);

    demo.destroy();
    board.start();
    food.draw();
    score.draw();

    createPlayers(false);
    requestAnimation();
    sounds.play("start");
}

/**
 * Toggles the Game Pause
 * @returns {Void}
 */
function togglePause() {
    if (display.isPaused) {
        display.set("playing");
        animations.endAll();
    } else {
        display.set("paused");
        animations.paused();
    }
}

/**
 * Show the High Scores
 * @returns {Void}
 */
function showHighScores() {
    display.set("highScores").show();
    scores.show();
}

/**
 * Saves the High Score
 * @returns {Void}
 */
function saveHighScore() {
    if (scores.save(score.level, score.score)) {
        showHighScores();
    }
}



/**
 * Creates a shortcut object
 * @returns {Void}
 */
function createActionsShortcuts() {
    actions = {
        play       : () => newGame(),
        pause      : () => togglePause(),
        highScores : () => showHighScores(),
        help       : () => display.set("help").show(),
        sound      : () => sounds.toggle(),
        save       : () => saveHighScore(),
        retore     : () => scores.restore(),
        mainScreen : () => display.set("mainScreen").show(),
    };

    shortcuts = {
        mainScreen : {
            Enter : "play",
            Space : "play",
            Down  : "play",
            H     : "highScores",
            C     : "help",
            M     : "sound",
        },
        playing : {
            P     : "pause",
            Space : "pause",
            M     : () => sounds.toggle(),
            Left  : () => blob.makeTurn({ x: -1, y:  0 }),
            Up    : () => blob.makeTurn({ x:  0, y: -1 }),
            Right : () => blob.makeTurn({ x:  1, y:  0 }),
            Down  : () => blob.makeTurn({ x:  0, y:  1 }),
        },
        paused : {
            P     : "pause",
            Space : "pause",
        },
        gameOver : {
            Enter : () => saveHighScore(),
            B     : () => display.set("mainScreen").show(),
        },
        highScores : {
            B     : () => display.set("mainScreen").show(),
            R     : () => scores.restore()
        },
        help : {
            B     : () => display.set("mainScreen").show(),
        }
    };
}

/**
 * Stores the used DOM elements and initializes the Event Handlers
 * @returns {Void}
 */
function initDomListeners() {
    document.body.addEventListener("click", (e) => {
        const element = Utils.getTarget(e);
        if (actions[element.dataset.action]) {
            actions[element.dataset.action](element.dataset.data || undefined);
            e.preventDefault();
        }
    });

    document.addEventListener("keydown", (e) => {
        const code = KeyCode.keyToCode(e.keyCode, true);
        if (shortcuts[display.current] && shortcuts[display.current][code]) {
            if (typeof shortcuts[display.current][code] === "string") {
                actions[shortcuts[display.current][code]]();
            } else {
                shortcuts[display.current][code]();
            }
            e.preventDefault();
        }
    });
}

/**
 * Destroys the demo when the display changes
 * @returns {Void}
 */
function onShow() {
    if (!display.isMainScreen) {
        demo.destroy();
    }
}

/**
 * The main Function
 * @returns {Void}
 */
function main() {
    board      = new Board();
    display    = new Display(onShow);
    demo       = new Demo(board);
    animations = new Animations(board);
    sounds     = new Sounds("pacman.sound");
    scores     = new HighScores();

    createActionsShortcuts();
    initDomListeners();
    requestAnimation();
}

// Load the game
window.addEventListener("load", main, false);
