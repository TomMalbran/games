import Storage      from "../../utils/Storage.js";
import Utils        from "../../utils/Utils.js";



/**
 * Spider High Scores
 */
export default class HighScores {

    /**
     * Spider HighScore constructor
     * @param {Number} suits
     */
    constructor(suits) {
        this.storage     = new Storage(`spider.scores.${suits}`);

        /** @type {HTMLElement} */
        this.element     = document.querySelector(".high-scores");

        /** @type {HTMLElement} */
        this.chartElem   = this.element.querySelector(".chart");

        /** @type {HTMLElement} */
        this.wonElem     = this.element.querySelector(".won");

        /** @type {HTMLElement} */
        this.lostElem    = this.element.querySelector(".lost");

        /** @type {HTMLElement} */
        this.winningElem = this.element.querySelector(".winning-streak");

        /** @type {HTMLElement} */
        this.losingElem  = this.element.querySelector(".losing-streak");

        /** @type {HTMLElement} */
        this.streakElem  = this.element.querySelector(".current-streak");

        /** @type {HTMLElement} */
        this.scoreElem   = this.element.querySelector(".best-score");

        /** @type {HTMLElement} */
        this.timeElem    = this.element.querySelector(".best-time");

        /** @type {HTMLElement} */
        this.movesElem   = this.element.querySelector(".best-moves");

        this.init();
    }

    /**
     * Inits the Score variables
     * @returns {Void}
     */
    init() {
        this.games          = this.storage.get("games", 0);
        this.wins           = this.storage.get("wins", 0);
        this.curWinStreak   = this.storage.get("currentWinStreak", 0);
        this.curLooseStreak = this.storage.get("currentLooseStreak", 0);
        this.winStreak      = this.storage.get("maxWinStreak", 0);
        this.looseStreak    = this.storage.get("maxLooseStreak", 0);
        this.bestScore      = this.storage.get("bestScore");
    }

    /**
     * Resets the Scores
     * @returns {Void}
     */
    reset() {
        const stats = [ "games", "wins", "currentWinStreak", "currentLooseStreak", "maxWinStreak", "maxLooseStreak", "bestScore" ];
        for (const stat of stats) {
            this.storage.remove(stat);
        }
        this.init();
    }

    /**
     * Builds the Scores
     * @returns {Void}
     */
    build() {
        const looses       = this.games - this.wins;
        const winPercent   = Utils.toPercent(this.wins, this.games);
        const loosePercent = Utils.toPercent(looses, this.games);

        this.chartElem.style.background = `conic-gradient(#a2e100 ${winPercent}%, #e12b1e 0)`;
        this.wonElem.innerText          = `${this.wins} (${winPercent}%)`;
        this.lostElem.innerText         = `${looses} (${loosePercent}%)`;
        this.winningElem.innerText      = this.winStreak;
        this.losingElem.innerText       = this.looseStreak;
        this.streakElem.innerText       = this.curLooseStreak > 0 ? `${this.curLooseStreak} loose${this.curLooseStreak > 1 ? "s" : ""}` : `${this.curWinStreak} win${this.curWinStreak > 1 ? "s" : ""}`;
        this.scoreElem.innerText        = this.bestScore ? this.bestScore.score : "0";
        this.timeElem.innerText         = this.bestScore ? Utils.timeToString(this.bestScore.time) : "0";
        this.movesElem.innerText        = this.bestScore ? `${this.bestScore.moves} moves` : "0";
    }



    /**
     * Adds a Game
     * @returns {Void}
     */
    addGame() {
        this.isPlaying = true;
    }

    /**
     * Adds a Win
     * @returns {Void}
     */
    addWin(score, time, moves) {
        if (!this.isPlaying) {
            return;
        }
        this.games          = this.storage.inc("games", 1);
        this.wins           = this.storage.inc("wins", 1);
        this.curWinStreak   = this.storage.inc("currentWinStreak", 1);
        this.curLooseStreak = this.storage.set("currentLooseStreak", 0);

        if (this.curWinStreak > this.winStreak) {
            this.storage.set("maxWinStreak", this.curWinStreak);
            this.winStreak = this.curWinStreak;
        }
        if (!this.bestScore || this.bestScore.score < score) {
            this.bestScore = { score, time, moves };
            this.storage.set("bestScore", this.bestScore);
        }
        this.isPlaying = false;
    }

    /**
     * Adds a Loose
     * @returns {Void}
     */
    addLoose() {
        if (!this.isPlaying) {
            return;
        }
        this.games          = this.storage.inc("games", 1);
        this.curLooseStreak = this.storage.inc("currentLooseStreak", 1);
        this.currentStreak  = this.storage.set("currentWinStreak", 0);

        if (this.curLooseStreak > this.looseStreak) {
            this.storage.set("maxLooseStreak", this.curLooseStreak);
            this.looseStreak = this.curLooseStreak;
        }
        this.isPlaying = false;
    }
}
