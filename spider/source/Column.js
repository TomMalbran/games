import Card         from "./Card.js";
import Chain        from "./Chain.js";
import Data         from "./Data.js";

// Utils
import Utils        from "../../utils/Utils.js";



/**
 * Spider Column
 */
export default class Column {

    /**
     * Spider Column constructor
     * @param {Number} index
     */
    constructor(index) {
        this.index     = index;

        /** @type {Card[]} */
        this.cards     = [];

        this.container = document.createElement("div");
        this.slot      = document.createElement("div");
        this.slot.className = "slot slot-card";
        this.container.appendChild(this.slot);

        this.gap       = window.innerHeight * 0.11 * 0.3;
        this.downGap   = Math.round(this.gap / 2);
    }

    /**
     * Returns true if the column is Empty
     * @returns {Boolean}
     */
    get isEmpty() {
        return this.cards.length === 0;
    }

    /**
     * Returns the last card, if possible
     * @returns {?Card}
     */
    get lastCard() {
        return !this.isEmpty ? this.cards[this.cards.length - 1] : null;
    }

    /**
     * Returns the last element
     * @returns {Object}
     */
    get element() {
        if (this.isEmpty) {
            return this.slot;
        }
        return this.lastCard.element;
    }

    /**
     * Returns the Bounds of the last element
     * @returns {Object}
     */
    get bounds() {
        return this.element.getBoundingClientRect();
    }

    /**
     * Returns the Offset for the next Card
     * @returns {Number}
     */
    get offset() {
        if (this.isEmpty) {
            return 0;
        }
        return this.gap;
    }



    /**
     * Resets the Column
     * @returns {Void}
     */
    reset() {
        this.cards = [];
        this.container.innerHTML = "";
        this.container.appendChild(this.slot);
    }

    /**
     * Updates the Card positions
     * @returns {Void}
     */
    updatePositions() {
        let downAmount = 0;
        let upAmount   = 0;
        for (const card of this.cards) {
            if (card.showingBack) {
                downAmount += 1;
            } else {
                upAmount += 1;
            }
        }

        const bounds    = this.slot.getBoundingClientRect();
        const downSize  = bounds.top + downAmount * this.downGap + bounds.height;
        const totalSize = downSize + (upAmount - 1) * this.gap;
        let   upGap     = this.gap;
        if (totalSize > window.innerHeight) {
            const leftSize = window.innerHeight - downSize;
            upGap = Math.floor(leftSize / (upAmount - 1));
        }

        let cardTop = 0;
        for (const card of this.cards) {
            card.setPosition(cardTop);
            if (card.showingBack) {
                cardTop += this.downGap;
            } else {
                cardTop += upGap;
            }
        }
    }



    /**
     * Adds a Card to the Column
     * @param {Card} card
     * @returns {Void}
     */
    addCard(card) {
        this.cards.push(card);
        this.container.appendChild(card.element);
        card.setColumn(this.index);
        this.updatePositions();
    }

    /**
     * Adds an array of Cards into the Column
     * @param {Card[]} cards
     * @returns {Void}
     */
    addCards(cards) {
        for (const card of cards) {
            this.addCard(card);
        }
    }

    /**
     * Removes the last Card from the Column
     * @returns {Card}
     */
    removeLast() {
        const card = this.cards.pop();
        card.saveBounds();
        card.remove();
        this.updatePositions();
        return card;
    }

    /**
     * Removes the amount of Cards from the Column
     * @param {Number} amount
     * @returns {Chain}
     */
    removeAmount(amount) {
        const cards = [];
        for (let i = 0; i < amount; i++) {
            cards.push(this.removeLast());
        }
        cards.reverse();
        const { top, left } = cards[0].storedBounds;
        return new Chain(cards, { top, left }, this.gap);
    }

    /**
     * Removes the all Cards from a complete Sequence
     * @returns {Card[]}
     */
    removeSequence() {
        const cards = [];
        for (let i = 0; i < Data.suitCards; i++) {
            cards.push(this.removeLast());
        }
        return cards;
    }



    /**
     * Shows the front of the last Card if required
     * @returns {Boolean}
     */
    showCardFront() {
        if (this.lastCard) {
            return this.lastCard.showFront();
        }
        return false;
    }

    /**
     * Shows the back of the last Card if required
     * @returns {Boolean}
     */
    showCardBack() {
        if (this.lastCard) {
            return this.lastCard.showBack();
        }
        return false;
    }



    /**
     * Picks a Card or a Chain from the Column, if possible
     * @param {String}     id
     * @param {MouseEvent} event
     * @returns {?(Card|Chain)}
     */
    pickCards(id, event) {
        if (this.isEmpty) {
            return null;
        }
        const lastCard = this.lastCard;
        if (lastCard.id === id) {
            this.cards.pop();
            lastCard.pick(event);
            this.updatePositions();
            return lastCard;
        }
        if (this.cards.length < 2) {
            return null;
        }

        const suit       = lastCard.suit;
        const cards      = [ lastCard ];
        let   isChain    = true;
        let   index      = this.cards.length - 2;
        let   lastNumber = lastCard.number;
        let   nextCard   = lastCard;
        do {
            nextCard = this.cards[index];
            if (nextCard.suit !== suit || nextCard.number - lastNumber !== 1) {
                isChain = false;
                break;
            }
            cards.push(nextCard);
            lastNumber = nextCard.number;
            index     -= 1;
        } while (isChain && nextCard.id !== id && index >= 0);

        if (!isChain) {
            return null;
        }
        this.cards.splice(-cards.length, cards.length);
        this.updatePositions();

        const pos = Utils.getMousePos(event);
        return new Chain(cards.reverse(), pos, this.gap);
    }

    /**
     * Returns true if the card can be dropped
     * @param {Card} card
     * @returns {Boolean}
     */
    canDrop(card) {
        if (this.isEmpty) {
            return this.isClose(card, this.slot);
        }
        if (this.lastCard.number - card.number !== 1) {
            return false;
        }
        return this.isClose(card, this.lastCard.element);
    }

    /**
     * Returns true if the card can be auto dropped
     * @param {Card} card
     * @returns {Boolean}
     */
    canMove(card) {
        return this.isEmpty || this.lastCard.number - card.number === 1;
    }

    /**
     * Returns true if the card is close to the given element
     * @param {Card}        card
     * @param {HTMLElement} element
     * @returns {Boolean}
     */
    isClose(card, element) {
        const cardBounds = card.element.getBoundingClientRect();
        const elemBounds = element.getBoundingClientRect();
        const dist       = Utils.dist(cardBounds, elemBounds);
        return dist < 80;
    }



    /**
     * Returns the length of the sequence with the given suit and first number
     * @param {String} suit
     * @param {Number} firstNumber
     * @returns {Number}
     */
    getSequenceLength(suit, firstNumber) {
        let index  = this.cards.length - 1;
        let number = firstNumber;
        let length = 0;

        while (number <= 13 && index >= 0) {
            const card = this.cards[index];
            if (card.showingBack || card.suit !== suit || card.number !== number) {
                break;
            }
            index  -= 1;
            number += 1;
            length += 1;
        }
        return length;
    }

    /**
     * Returns a score of placing the given card into this column
     * @param {Card} card
     * @returns {Number}
     */
    getScore(card) {
        if (this.isEmpty) {
            return 1;
        }
        const length = this.getSequenceLength(card.suit, card.number + 1);
        if (length > 0) {
            return length + 3;
        }
        if (this.lastCard.suit !== card.suit && this.lastCard.number === card.number + 1) {
            return 2;
        }
        return 0;
    }

    /**
     * Returns a sequence of cards if it is complete, and removes the cards
     * @returns {Card[]}
     */
    getCompleteSequence() {
        if (this.cards.length < Data.suitCards) {
            return null;
        }
        const length = this.getSequenceLength(this.lastCard.suit, 1);
        if (length !== Data.suitCards) {
            return null;
        }
        const result = [];
        for (let i = 0; i < Data.suitCards; i++) {
            result.push(this.removeLast());
        }
        return result;
    }
}
