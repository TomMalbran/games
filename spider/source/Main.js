import Display      from "./Display.js";
import Game         from "./Game.js";
import Instance     from "./Instance.js";

// Utils
import KeyCode      from "../../utils/KeyCode.js";
import Sounds       from "../../utils/Sounds.js";
import Utils        from "../../utils/Utils.js";

// Variables
let game       = null;
let instance   = null;
let display    = null;
let sounds     = null;
let actions    = null;
let shortcuts  = null;
let picked     = null;
let games      = {};
let needForRAF = true;



/**
 * Starts a Game
 * @param {Number} suits
 * @returns {Void}
 */
function play(suits) {
    display.showGame();

    if (!games[suits]) {
        games[suits] = new Game(instance, display, sounds, suits);
    }
    game = games[suits];
    if (instance.hasGame) {
        game.restore();
    } else {
        game.start();
    }
}

/**
 * Seelcts a Game
 * @returns {Void}
 */
function selectGame() {
    game.lost();
    display.showSelction();
}

/**
 * Creates a shortcut object
 * @returns {Void}
 */
function createActionsShortcuts() {
    actions = {
        play        : (data) => play(data),
        start       : () => game.start(),
        restart     : () => game.restart(),
        pause       : () => game.pause(),
        continue    : () => game.continue(),
        deal        : () => game.deal(),
        undo        : () => game.undo(),
        redo        : () => game.redo(),
        hint        : () => game.showHint(),
        scores      : () => game.scores(),
        resetScores : () => game.resetScores(),
        toggle      : () => game.toggle(),
        mute        : () => sounds.toggle(),
        select      : () => selectGame(),
    };

    shortcuts = {
        selection : {
            1      : () => play(1),
            2      : () => play(2),
            4      : () => play(4),
        },
        game : {
            P      : "pause",
            Escape : "pause",
            M      : "mute",
            U      : "undo",
            Z      : "undo",
            R      : "redo",
            H      : "hint",
            S      : "scores",
        },
        pause : {
            P      : "continue",
            C      : "continue",
            Enter  : "continue",
            Escape : "continue",
            R      : "restart",
            S      : "start",
            D      : "select",
        },
        scores : {
            C      : "continue",
            Enter  : "continue",
            Escape : "continue",
            R      : "resetScores",
        },
        dealError : {
            C      : "continue",
            Enter  : "continue",
            Escape : "continue",
        },
        movesError : {
            C      : "continue",
            Enter  : "continue",
            Escape : "continue",
        },
        congrats : {
            S      : "start",
            Enter  : "start",
            D      : "select",
        },
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
            const data = Number(element.dataset.suits);
            actions[element.dataset.action](data);
            e.preventDefault();
        }
    });

    document.body.addEventListener("mousedown", (e) => {
        if (game) {
            game.hideHint();
        }
        if (e.button !== 0 || picked) {
            return;
        }
        const element = Utils.getTarget(e, "card");
        if (element) {
            picked = game.tableau.pickCards(element.dataset.column, element.dataset.id, e);
            e.preventDefault();
        }
    });

    document.addEventListener("mousemove", (e) => {
        if (picked && needForRAF) {
            needForRAF = false;
            window.requestAnimationFrame(() => {
                if (picked) {
                    picked.drag(e);
                }
                needForRAF = true;
            });
        }
        e.preventDefault();
    });

    document.addEventListener("mouseup", (e) => {
        if (picked) {
            if (picked.isDragging) {
                game.drop(picked);
            } else {
                game.move(picked);
            }
            picked = null;
        }
        e.preventDefault();
    });

    document.addEventListener("keydown", (e) => {
        const code = KeyCode.keyToCode(e.keyCode, false);
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
 * The main Function
 * @returns {Void}
 */
function main() {
    instance = new Instance();
    display  = new Display();
    sounds   = new Sounds("spider.sound");

    createActionsShortcuts();
    initDomListeners();

    if (instance.hasGame) {
        play(instance.suits);
    }
}

// Load the game
window.addEventListener("load", main, false);
