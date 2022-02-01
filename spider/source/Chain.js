import Card         from "./Card.js";

// Utils
import Utils        from "../../utils/Utils.js";



/**
 * Spider Chain
 */
export default class Chain {

    /**
     * Spider Chain constructor
     * @param {Card[]}                      cards
     * @param {{top: Number, left: Number}} pos
     * @param {Number}                      gap
     */
    constructor(cards, pos, gap) {
        this.cards      = cards;
        this.amount     = cards.length;
        this.column     = cards[0].column;
        this.suit       = cards[0].suit;

        this.initialPos = pos;
        this.isDragging = false;

        this.build(gap);
    }

    /**
     * Returns this as the first Card
     * @returns {Card}
     */
    get firstCard() {
        return this.cards[0];
    }



    /**
     * Builds the Chain
     * @param {Number} gap
     * @returns {Void}
     */
    build(gap) {
        const bounds = this.cards[0].bounds;
        let   top    = 0;

        this.element = document.createElement("div");
        this.element.className = "chain";
        for (const card of this.cards) {
            this.element.appendChild(card.element);
            card.setPosition(top);
            top += gap;
        }
        document.body.appendChild(this.element);

        this.startPos = {
            top  : this.initialPos.top  - bounds.top,
            left : this.initialPos.left - bounds.left,
        };
        this.translate(this.initialPos);
    }

    /**
     * Translates the Chain
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
     * Drags the Chain
     * @param {MouseEvent} event
     * @returns {Void}
     */
    drag(event) {
        const pos = Utils.getMousePos(event);
        if (this.isDragging) {
            this.translate(pos);
            return;
        }

        const dist = Utils.dist(this.initialPos, pos);
        if (dist > 10) {
            this.isDragging = true;
        }
    }

    /**
     * Drops the Chain
     * @returns {Void}
     */
    drop() {
        Utils.removeElement(this.element);
    }

    /**
     * Does nothing as a Chain is already floating
     * @returns {Void}
     */
    float() {
        return undefined;
    }
}
