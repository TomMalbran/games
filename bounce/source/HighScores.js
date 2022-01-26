import Storage      from "../../utils/Storage.js";
import Utils        from "../../utils/Utils.js";



/**
 * Bounce High Scores
 */
export default class HighScores {

    /**
     * Bounce High Scores constructor
     */
    constructor() {
        this.mode      = "";
        this.data      = {};
        this.total     = 0;
        this.maxScores = 5;
        this.isFocused = false;

        /** @type {HTMLElement} */
        this.scores    = document.querySelector(".scores");

        /** @type {HTMLElement} */
        this.none      = document.querySelector(".none");

        /** @type {HTMLInputElement} */
        this.input         = document.querySelector(".input input");
        this.input.onfocus = () => { this.isFocused = true; };
        this.input.onblur  = () => { this.isFocused = false; };
    }

    /**
     * Creates the high scores for the given mode
     * @param {String} mode
     * @returns {Void}
     */
    create(mode) {
        this.mode  = mode;
        this.data  = new Storage(`bounce.hs.${this.mode}`);
        this.total = this.data.get("total") || 0;
    }



    /**
     * Show the Scores for the given mode
     * @param {String} mode
     * @returns {Void}
     */
    show(mode) {
        this.scores.innerHTML = "";
        this.create(mode);
        this.showHideNone(this.total === 0);

        if (this.total > 0) {
            this.displayScores();
        }
    }

    /**
     * Create each score line and place it in the DOM
     * @returns {Void}
     */
    displayScores() {
        for (let i = 1; i <= this.total; i += 1) {
            const data  = this.data.get(i);
            const div   = document.createElement("DIV");
            const score = Utils.formatNumber(data.score, ",");

            div.className = "highScore";
            div.innerHTML = `
                <div class="hsName">${data.name}</div>
                <div class="hsScore">${score}</div>
            `;
            this.scores.appendChild(div);
        }
    }



    /**
     * Tries to save a score, when possible
     * @param {String} mode
     * @param {Number} score
     * @returns {Boolean}
     */
    save(mode, score) {
        if (this.input.value) {
            this.create(mode);
            this.saveData(score);
            this.show(this.mode);
            return true;
        }
        return false;
    }

    /**
     * Gets the scores and adds the new one in the right position, updating the total, when possible
     * @param {Number} score
     * @returns {Void}
     */
    saveData(score) {
        const data   = [];
        const actual = {
            name  : this.input.value,
            score : score,
        };
        let saved = false;

        for (let i = 1; i <= this.total; i += 1) {
            const hs = this.data.get(i);
            if (!saved && hs.score < actual.score) {
                data.push(actual);
                saved = true;
            }
            if (data.length <= this.maxScores) {
                data.push(hs);
            }
        }
        if (!saved && data.length <= this.maxScores) {
            data.push(actual);
        }

        this.data.set("total", data.length);
        data.forEach((element, index) => {
            this.data.set(index + 1, element);
        });
    }

    /**
     * Shows or hides the no results element
     * @param {Boolean} show
     * @returns {Void}
     */
    showHideNone(show) {
        this.none.style.display = show ? "block" : "none";
    }



    /**
     * Sets the input value and focus it
     * @returns {Void}
     */
    setInput() {
        this.input.value = "";
        this.input.focus();
    }
}
