import Board        from "./Board.js";

// Utils
import Sounds       from "../../utils/Sounds.js";
import Utils        from "../../utils/Utils.js";

// Variables
let board  = null;
let sounds = null;



/**
 * Stores the used DOM elements and initializes the Event Handlers
 * @returns {Void}
 */
function initDomListeners() {
    document.body.addEventListener("click", (e) => {
        const element = Utils.getTarget(e);
        switch (element.dataset.action) {
        case "reveal":
            const row = Number(element.dataset.row);
            const col = Number(element.dataset.col);
            board.reveal(row, col);
            break;
        }
    });
}

/**
 * The main Function
 * @returns {Void}
 */
function main() {
    board = new Board(10, 10, 10);
    // instance = new Instance();
    // display  = new Display();
    sounds   = new Sounds("minesweeper.sound");

    // createActionsShortcuts();
    initDomListeners();

    // if (instance.hasGame) {
    //     play(instance.suits);
    // }
}

// Load the game
window.addEventListener("load", main, false);
