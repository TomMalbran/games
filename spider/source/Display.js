/**
 * Spider Display
 */
export default class Display {

    /**
     * Spider Display constructor
     */
    constructor() {
        this.current      = "selection";

        /** @type {HTMLElement} */
        this.container    = document.querySelector(".container");

        /** @type {HTMLElement} */
        this.selection    = document.querySelector(".selection");

        /** @type {HTMLElement} */
        this.pause        = document.querySelector(".pause");

        /** @type {HTMLElement} */
        this.scores       = document.querySelector(".high-scores");

        /** @type {HTMLElement} */
        this.error        = document.querySelector(".deals-error");

        /** @type {HTMLElement} */
        this.moves        = document.querySelector(".moves-error");

        /** @type {HTMLElement} */
        this.congrats     = document.querySelector(".congrats");

        /** @type {HTMLElement} */
        this.congratsText = document.querySelector(".congrats p");
    }



    /**
     * Shows the Selection Screen
     * @returns {Void}
     */
    showSelction() {
        this.current                 = "selection";
        this.selection.style.display = "block";
        this.container.style.display = "none";
    }

    /**
     * Shows the Selection Screen
     * @returns {Void}
     */
    showGame() {
        this.current                 = "game";
        this.selection.style.display = "none";
        this.container.style.display = "block";
    }



    /**
     * Closes the Dialogs and goes back to the Game mode
     * @returns {Void}
     */
    closeDialogs() {
        this.current                = "game";
        this.congrats.style.display = "none";
        this.pause.style.display    = "none";
        this.scores.style.display   = "none";
        this.error.style.display    = "none";
        this.moves.style.display    = "none";
    }

    /**
     * Shows a Pause Dialog
     * @returns {Void}
     */
    showPause() {
        this.current             = "pause";
        this.pause.style.display = "block";
    }

    /**
     * Shows a Scores Dialog
     * @returns {Void}
     */
    showScores() {
        this.current              = "scores";
        this.scores.style.display = "block";
    }

    /**
     * Shows a Deal Error Dialog
     * @returns {Void}
     */
    showDealError() {
        this.current             = "dealError";
        this.error.style.display = "block";
    }

    /**
     * Shows a Moves Error Dialog
     * @returns {Void}
     */
    showMovesError() {
        this.current             = "movesError";
        this.moves.style.display = "block";
    }

    /**
     * Shows a Congrats Dialog
     * @param {String} text
     * @returns {Void}
     */
    showCongrats(text) {
        this.current                = "congrats";
        this.congrats.style.display = "block";
        this.congratsText.innerHTML = text;
    }
}
