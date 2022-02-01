import Card         from "./Card.js";
import Chain        from "./Chain.js";
import Column       from "./Column.js";
import Data         from "./Data.js";

// Utils
import Utils        from "../../utils/Utils.js";



/**
 * Spider Animation
 */
export default class Animation {

    /**
     * Animates the Move
     * @param {(Card|Chain)} picked
     * @param {Column}       column
     * @returns {Promise}
     */
    move(picked, column) {
        return new Promise((resolve) => {
            const elem = picked.element;
            const onAnimationEnd = () => {
                elem.removeEventListener("transitionend", onAnimationEnd);
                elem.style.transition = "";
                resolve();
            };

            const bounds = column.bounds;
            picked.float();
            elem.getBoundingClientRect();

            elem.addEventListener("transitionend", onAnimationEnd);
            elem.style.transform  = Utils.translate(bounds.left, bounds.top + column.offset);
            elem.style.transition = `all 0.2s linear`;
        });
    }

    /**
     * Animates the Deal
     * @param {Card}     card
     * @param {Object}   fromBounds
     * @param {Object}   toBounds
     * @param {Number}   gap
     * @param {Boolean=} isFast
     * @returns {Promise}
     */
    deal(card, fromBounds, toBounds, gap, isFast) {
        return new Promise((resolve) => {
            const onAnimationEnd = () => {
                card.element.removeEventListener("transitionend", onAnimationEnd);
                card.element.style.transition = "";
                resolve();
            };

            card.float(fromBounds);
            card.element.getBoundingClientRect();

            card.element.addEventListener("transitionend", onAnimationEnd);
            card.element.style.transform  = Utils.translate(toBounds.left, toBounds.top + gap);
            card.element.style.transition = `all ${isFast ? 0.03 : 0.1}s`;
        });
    }

    /**
     * Animates the Foundation
     * @param {Card[]}  cards
     * @param {Object}  fromBounds
     * @param {Object}  toBounds
     * @param {Column=} column
     * @returns {Promise}
     */
    foundation(cards, fromBounds, toBounds, column) {
        return new Promise((resolve) => {
            let amount = 0;
            const onAnimationEnd = (card) => {
                card.element.removeEventListener("transitionend", () => onAnimationEnd(card));
                card.element.style.removeProperty("z-index");
                card.element.style.transition = "";
                amount -= 1;

                if (amount === 0) {
                    for (const card of cards) {
                        card.element.style.transform = "";
                        card.remove();
                    }
                    resolve();
                }
            }

            const total = Data.suitCards + 2;
            for (const card of cards) {
                const offset = column ? (amount * column.gap) + (column.offset / 2) : 0;
                card.float(fromBounds);
                card.showFront();
                card.element.getBoundingClientRect();
                card.element.addEventListener("transitionend", () => onAnimationEnd(card));
                card.element.style.zIndex     = String(total - card.number);
                card.element.style.transform  = Utils.translate(toBounds.left, toBounds.top + offset);
                card.element.style.transition = `all 0.2s linear ${amount / total}s`;
                amount += 1;
            }
        });
    }

    /**
     * Animates the Win
     * @param {Card[]} cards
     * @param {Object} fromBounds
     * @returns {Promise}
     */
    win(cards, fromBounds) {
        return new Promise((resolve) => {
            let amount = 0;
            const onAnimationEnd = (card) => {
                card.element.style.removeProperty("z-index");
                card.element.style.transition = "";
                amount -= 1;

                if (amount === 0) {
                    for (const card of cards) {
                        card.element.style.transform = "";
                        card.remove();
                    }
                    resolve();
                }
            }

            const total = Data.suitCards + 2;
            for (const card of cards) {
                const toLeft = Utils.rand(100, window.innerWidth - 100);
                const toTop  = Utils.rand(fromBounds.top  + 100, window.innerHeight - 100);
                const deg    = Utils.rand(180, 720);

                card.float(fromBounds);
                card.showFront();
                card.element.getBoundingClientRect();
                card.element.addEventListener("transitionend", () => onAnimationEnd(card));
                card.element.style.zIndex     = String(total - card.number);
                card.element.style.transform  = Utils.translate(toLeft, toTop) + " " + Utils.rotate(deg);
                card.element.style.transition = `all 0.5s linear`;
                amount += 1;
            }
        });
    }
}
