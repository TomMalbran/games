import Data         from "./Data.js";
import Deck         from "./Deck.js";
import Foundations  from "./Foundations.js";
import History      from "./History.js";
import Tableau      from "./Tableau.js";

// Utils
import Storage      from "../../utils/Storage.js";



/**
 * Spider Instance
 */
export default class Instance {

    /**
     * Spider Instance constructor
     */
    constructor() {
        this.storage = new Storage("spider.instance");
        this.suits   = this.storage.get("suits", 0);
        this.cards   = this.storage.get("cards");
        this.score   = this.storage.get("score", 0);
        this.moves   = this.storage.get("moves", 0);
        this.time    = this.storage.get("time",  0);

        this.current = this.storage.get("current", -1);
        this.total   = this.storage.get("total", 0);
    }

    /**
     * Returns true if there is a stored Game
     * @returns {Boolean}
     */
    get hasGame() {
        return this.suits > 0;
    }

    /**
     * Returns the amount of Used Cards
     * @returns {Number}
     */
    get usedCards() {
        let result = 0;
        for (let i = 0; i < Data.columns; i++) {
            const column = this.storage.get(`column.${i}`);
            result += column.length;
        }
        for (let i = 0; i < Data.foundations; i++) {
            const foundation = this.storage.get(`foundation.${i}`);
            result += foundation.length;
        }
        return result;
    }

    /**
     * Returns the amount of Deals left
     * @returns {Number}
     */
    get dealsLeft() {
        const unusedCards = Data.totalCards - this.usedCards;
        return Math.floor(unusedCards / Data.columns);
    }

    /**
     * Returns the Cards per Column
     * @param {Deck} deck
     * @returns {Object[]}
     */
    getColumnCards(deck) {
        const result = [];
        for (let i = 0; i < Data.columns; i++) {
            result[i] = [];
            const cards = this.storage.get(`column.${i}`);
            for (const { id, showingBack } of cards) {
                const card = deck.map[id];
                if (showingBack) {
                    card.showBack();
                }
                result[i].push(card);
            }
        }
        return result;
    }

    /**
     * Returns the Cards per Foundation
     * @param {Deck} deck
     * @returns {Object[]}
     */
    getFoundationCards(deck) {
        const result = [];
        for (let i = 0; i < Data.foundations; i++) {
            result[i] = [];
            const cards = this.storage.get(`foundation.${i}`);
            for (const { id } of cards) {
                const card = deck.map[id];
                card.showBack();
                result[i].push(card);
            }
        }
        return result;
    }

    /**
     * Returns the History
     * @returns {Object[]}
     */
    getHistory() {
        const result = [];
        for (let i = 0; i < this.total; i++) {
            result.push(this.storage.get(`history.${i}`));
        }
        return result;
    }



    /**
     * Adds a Game
     * @param {Number} suits
     * @param {Deck}   deck
     * @returns {Void}
     */
    addGame(suits, deck) {
        this.removeGame();
        this.storage.set("suits", suits);

        const cards = [];
        for (const card of deck.cards) {
            cards.push(card.id);
        }
        this.storage.set("cards", cards);
    }

    /**
     * Saves the Game
     * @param {Tableau}     tableau
     * @param {Foundations} foundations
     * @param {History}     history
     * @returns {Void}
     */
    saveGame(tableau, foundations, history) {
        // Save the Tableau
        for (const column of tableau.columns) {
            const cards = [];
            for (const card of column.cards) {
                cards.push({ id : card.id, showingBack : card.showingBack });
            }
            this.storage.set(`column.${column.index}`, cards);
        }

        // Save the Foundations
        for (const [ index, column ] of foundations.columns.entries()) {
            const cards = [];
            for (const card of column) {
                cards.push({ id : card.id });
            }
            this.storage.set(`foundation.${index}`, cards);
        }

        // Save the History
        for (const [ index, action ] of history.stack.entries()) {
            this.storage.set(`history.${index}`, action);
        }
        this.storage.set("current", history.current);
        this.storage.set("total",   history.stack.length);
    }

    /**
     * Saves the Score
     * @param {Number} score
     * @returns {Void}
     */
    saveScore(score) {
        this.storage.set("score", score);
    }

    /**
     * Saves the Moves
     * @param {Number} moves
     * @returns {Void}
     */
    saveMoves(moves) {
        this.storage.set("moves", moves);
    }

    /**
     * Saves the Time
     * @param {Number} time
     * @returns {Void}
     */
    saveTime(time) {
        this.storage.set("time", time);
    }

    /**
     * Removes the Saved Game
     * @returns {Void}
     */
    removeGame() {
        this.storage.remove("suits");
        this.storage.remove("cards");
        this.storage.remove("score");
        this.storage.remove("moves");
        this.storage.remove("time");
        this.storage.remove("current");
        this.storage.remove("total");

        for (let i = 0; i < Data.columns; i++) {
            this.storage.remove(`column.${i}`);
        }
        for (let i = 0; i < Data.foundations; i++) {
            this.storage.remove(`foundation.${i}`);
        }
        for (let i = 0; i < this.total; i++) {
            this.storage.remove(`history.${i}`);
        }

        this.suits   = 0;
        this.cards   = [];
        this.score   = 0;
        this.moves   = 0;
        this.current = 0;
        this.total   = 0;
    }
}
