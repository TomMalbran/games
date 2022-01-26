import Storage      from "../../utils/Storage.js";
import Utils        from "../../utils/Utils.js";



/**
 * Tetris High Scores
 */
export default class HighScores {

    /**
     * Tetris High Scores constructor
     */
    constructor() {
        this.data      = new Storage("tetris.hs");
        this.total     = this.data.get("total") || 0;
        this.maxScores = 9;
        this.isFocused = false;

        /** @type {HTMLInputElement} */
        this.input     = document.querySelector(".input input");

        /** @type {HTMLElement} */
        this.scores    = document.querySelector(".scores");

        /** @type {HTMLElement} */
        this.none      = document.querySelector(".none");

        this.input.onfocus = () => this.isFocused = true;
        this.input.onblur  = () => this.isFocused = false;
    }



    /**
     * Show the Scores for the given mode
     */
    show() {
        this.scores.innerHTML = "";
        this.showHideNone(this.total === 0);

        if (this.total > 0) {
            this.displayTitles();
            this.displayScores();
        }
    }

    /**
     * Create the titles and place it in the DOM
     */
    displayTitles() {
        const div = this.createContent("name", "lvl", "score");
        div.className = "titles";
        this.scores.appendChild(div);
    }

    /**
     * Create each score line and place it in the DOM
     */
    displayScores() {
        for (let i = 1; i <= this.total; i += 1) {
            const data = this.data.get(i);
            const div  = this.createContent(data.name, data.level, Utils.formatNumber(data.score, ","));

            div.className = "highScore";
            this.scores.appendChild(div);
        }
    }

    /**
     * Creates the content for each High Score
     */
    createContent(name, level, score) {
        const element = document.createElement("DIV");
        element.innerHTML = `
            <div class="left">${name} -</div>
            <div class="middle">${level}</div>
            <div class="right">- ${score}</div>
        `;
        return element;
    }

    /**
     * Tries to save a score, when possible
     * @param {Number} level
     * @param {Number} score
     * @returns {Boolean}
     */
    save(level, score) {
        if (this.input.value) {
            this.saveData(level, score);
            return true;
        }
        return false;
    }

    /**
     * Gets the scores and adds the new one in the right position, updating the total, when possible
     * @param {Number} level
     * @param {Number} score
     */
    saveData(level, score) {
        const data   = [];
        const actual = {
            name  : this.input.value,
            level : level,
            score : score
        };
        let saved = false;

        for (let i = 1; i <= this.total; i += 1) {
            const hs = this.data.get(i);
            if (!saved && hs.score < actual.score) {
                data.push(actual);
                saved = true;
            }
            if (data.length < this.maxScores) {
                data.push(hs);
            }
        }
        if (!saved && data.length < this.maxScores) {
            data.push(actual);
        }

        this.data.set("total", data.length);
        data.forEach((element, index) => {
            this.data.set(index + 1, element);
        });
        this.total = data.length;
    }

    /**
     * Deletes all the Scores
     */
    restore() {
        for (let i = 1; i <= this.total; i += 1) {
            this.data.remove(i);
        }
        this.data.set("total", 0);
        this.show();
    }

    /**
     * Shows or hides the no results element
     * @param {Boolean} show
     */
    showHideNone(show) {
        this.none.style.display = show ? "block" : "none";
    }

    /**
     * Sets the input value and focus it
     */
    setInput() {
        this.input.value = "";
        this.input.focus();
    }
}
