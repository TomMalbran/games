import Data         from "./Data.js";

// Utils
import Utils        from "../../utils/Utils.js";



/**
 * Spider Card
 */
export default class Card {

    /**
     * Spider Card constructor
     * @param {String} suit
     * @param {Number} number
     * @param {Number} iteration
     */
    constructor(suit, number, iteration) {
        this.suit        = suit;
        this.number      = number;
        this.letter      = Data.letters[number - 1];
        this.id          = `${this.letter}${suit[0]}${iteration}`;
        this.file        = `${this.letter}${suit[0]}`;
        this.name        = `${this.letter} ${suit}`;
        this.amount      = 1;
        this.column      = null;
        this.showingBack = false;

        this.element = document.createElement("div");
        this.element.className = "card card-show-front";
        this.element.innerHTML = `
            <div class="card-inner">
                <div class="card-front">
                    <img src="images/${this.file}.svg" alt="${this.name}" />
                </div>
                <div class="card-back">
                    <img src="images/2B.svg" alt="${this.name}" />
                </div>
            </div>
        `;
        this.element.dataset.action = "card";
        this.element.dataset.id     = this.id;

        this.image = this.element.querySelector("img");
    }

    /**
     * Returns the Bounds of the Card
     * @return {Object}
     */
    get bounds() {
        return this.storedBounds || this.element.getBoundingClientRect();
    }

    /**
     * Returns the Card as an array
     * @returns {Card[]}
     */
    get cards() {
        return [ this ];
    }

    /**
     * Returns this as the first Card
     * @returns {Card}
     */
    get firstCard() {
        return this;
    }

    /**
     * Shows the Front of the Card
     * @returns {Boolean}
     */
    showFront() {
        if (!this.showingBack) {
            return false;
        }
        this.showingBack = false;
        this.element.classList.add("card-show-front");
        this.element.classList.remove("card-show-back");
        return true;
    }

    /**
     * Shows the Back of the Card
     * @returns {Boolean}
     */
    showBack() {
        if (this.showingBack) {
            return false;
        }
        this.showingBack = true;
        this.element.classList.add("card-show-back");
        this.element.classList.remove("card-show-front");
        return true;
    }




    /**
     * Sets the Card Column
     * @param {Number} column
     * @returns {Void}
     */
    setColumn(column) {
        this.column = column;
        this.element.dataset.column = String(this.column);
    }

    /**
     * Sets the Card position
     * @param {Number} top
     * @returns {Void}
     */
    setPosition(top) {
        this.storedBounds            = null;
        this.element.style.top       = Utils.toPX(top);
        this.element.style.left      = Utils.toPX(0);
        this.element.style.transform = "";
    }

    /**
     * Translates the Card
     * @param {{top: Number, left: Number}} pos
     * @returns {Void}
     */
    translate(pos) {
        this.element.style.transform = Utils.translate(
            pos.left - this.startPos.left,
            pos.top  - this.startPos.top
        );
    }



    /**
     * Picks the Card
     * @param {MouseEvent} event
     * @returns {Void}
     */
    pick(event) {
        this.pickPos    = Utils.getMousePos(event);
        this.isDragging = false;
    }

    /**
     * Drags the Card
     * @param {MouseEvent} event
     * @returns {Void}
     */
    drag(event) {
        const pos = Utils.getMousePos(event);
        if (this.isDragging) {
            this.translate(pos);
            return;
        }

        const dist = Utils.dist(this.pickPos, pos);
        if (dist > 10) {
            const bounds  = this.element.getBoundingClientRect();
            this.startPos = {
                top  : pos.top  - bounds.top,
                left : pos.left - bounds.left,
            };
            this.float();
            document.body.appendChild(this.element);
            this.setPosition(0);
            this.translate(pos);
            this.isDragging = true;
        }
    }

    /**
     * Drops the Chain
     * @returns {Void}
     */
    drop() {
        this.isDragging = false;
    }

    /**
     * Saves the last good Bounds
     * @returns {Void}
     */
    saveBounds() {
        this.storedBounds = this.element.getBoundingClientRect();
    }

    /**
     * Makes the Card Float in the body
     * @const {Object=} bounds
     * @returns {Void}
     */
    float(bounds) {
        if (this.isDragging) {
            return;
        }
        const realBounds = bounds || this.storedBounds || this.element.getBoundingClientRect();
        document.body.appendChild(this.element);
        this.setPosition(0);
        this.element.style.transform = Utils.translate(realBounds.left, realBounds.top);
    }

    /**
     * Removes the HTML Element
     * @returns {Void}
     */
    remove() {
        Utils.removeElement(this.element);
    }
}
