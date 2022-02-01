import Card         from "./Card.js";
import Data         from "./Data.js";

// Utils
import Utils        from "../../utils/Utils.js";



/**
 * Spider Deck
 */
export default class Deck {

    /**
     * Spider Deck constructor
     * @param {Number} suitCount
     */
    constructor(suitCount) {
        this.lastUsed = 0;

        /** @type {Card[]} */
        this.cards    = [];

        /** @type {Object.<String, Card>} */
        this.map      = {};

        for (let iteration = 1; iteration <= Data.foundations; iteration++) {
            for (let number = 1; number <= 13; number++) {
                const suit = Data.suits[iteration % suitCount];
                const card = new Card(suit, number, iteration);
                this.cards.push(card);
                this.map[card.id] = card;
            }
        }
    }

    /**
     * Shuffles the Deck
     * @returns {Void}
     */
    shuffle() {
        for (let j = 0; j < Data.shuffles; j += 1) {
            for (let i = 0; i < this.cards.length; i += 1) {
                const pos       = Utils.rand(0, this.cards.length - 1);
                const aux       = this.cards[pos];
                this.cards[pos] = this.cards[i];
                this.cards[i]   = aux;
            }
        }
    }

    /**
     * Resets the Deck
     * @returns {Void}
     */
    reset() {
        for (const card of this.cards) {
            card.showFront();
        }
        this.lastUsed = 0;
    }

    /**
     * Restores the Deck
     * @param {Number[]} cards
     * @param {Number}   usedCards
     * @returns {Void}
     */
    restore(cards, usedCards) {
        this.cards = [];
        for (const cardID of cards) {
            this.cards.push(this.map[cardID]);
            this.map[cardID].showFront();
        }
        this.lastUsed = usedCards;
    }



    /**
     * Picks the next card from the Deck
     * @returns {Card}
     */
    pick() {
        const card = this.cards[this.lastUsed];
        this.lastUsed++;
        return card;
    }

    /**
     * Adds the amount of cards back to the deck
     * @param {Number} amount
     * @returns {Void}
     */
    add(amount) {
        this.lastUsed -= amount;
    }
}
