import Puzzle       from "./Puzzle.js";
import Selection    from "./Selection.js";

// Utils
import KeyCode      from "../../utils/KeyCode.js";
import Sounds       from "../../utils/Sounds.js";
import Utils        from "../../utils/Utils.js";

// Variables
let sounds    = null;
let selection = null;
let puzzle    = null;
let shortcuts = null;



/**
 * Creates a shortcut object
 * @returns {Void}
 */
function createShortcuts() {
    const preview = () => puzzle.togglePreview();
    const pause   = () => puzzle.togglePause();
    const mute    = () => sounds.toggle();
    const borders = () => puzzle.drawer.toggleBorders();
    const exit    = () => {
        if (puzzle.display === "game") {
            puzzle.destroy();
            selection.show();
            puzzle = null;
        }
    };

    shortcuts = {
        V      : preview,
        P      : pause,
        Escape : pause,
        M      : mute,
        Q      : exit,
        E      : exit,
        B      : borders,
    };
}

/**
 * Stores the used DOM elements and initializes the Event Handlers
 * @returns {Void}
 */
function initDomListeners() {
    let partial = null;

    document.body.addEventListener("click", (e) => {
        const element = Utils.getTarget(e);
        switch (element.dataset.action) {
        case "tab":
            selection.changeTab(element);
            break;
        case "next":
            selection.moveSlider(1);
            break;
        case "prev":
            selection.moveSlider(-1);
            break;
        case "select":
            selection.select(element);
            break;
        case "start":
            selection.start(element);
            break;
        case "restart":
            puzzle.destroy();
            selection.build();
            selection.show();
            puzzle = null;
            break;

        case "borders":
            if (puzzle) {
                puzzle.drawer.toggleBorders();
            }
            break;
        case "preview":
            if (puzzle) {
                puzzle.togglePreview(e);
            }
            break;
        case "pause":
            if (puzzle) {
                puzzle.togglePause();
            }
            break;
        case "mute":
            sounds.toggle();
            break;
        case "exit":
            puzzle.destroy();
            selection.show();
            puzzle = null;
            break;
        }
    });

    document.body.addEventListener("mousedown", (e) => {
        if (e.button !== 0 || !puzzle || partial) {
            return;
        }
        const element = Utils.getTarget(e, "piece", "set");
        if (element) {
            partial = puzzle.pickAny(e, element.dataset.id);
            e.preventDefault();
        }
    });

    document.addEventListener("mousemove", (e) => {
        if (partial) {
            partial.drag(e);
        }
        e.preventDefault();
    });

    document.addEventListener("mouseup", (e) => {
        if (partial) {
            puzzle.dropAny(e, partial);
            partial = null;
        }
        e.preventDefault();
    });

    document.addEventListener("keydown", (e) => {
        const code = KeyCode.keyToCode(e.keyCode, false);
        if (puzzle && shortcuts[code]) {
            shortcuts[code]();
            e.preventDefault();
        }
    });
}

/**
 * The main Function
 * @returns {Void}
 */
function main() {
    sounds    = new Sounds("puzzle.sound");
    selection = new Selection();
    selection.onStart = (image, pieces) => {
        puzzle = new Puzzle(sounds, image, pieces);
    };

    createShortcuts();
    initDomListeners();
}

// Load the game
window.addEventListener("load", main, false);
