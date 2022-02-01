import Tableau      from "./Tableau.js";
import Stock        from "./Stock.js";



/**
 * Spider Hints
 */
export default class Hints {

    /**
     * Spider Hints constructor
     * @param {Tableau} tableau
     * @param {Stock}   stock
     */
    constructor(tableau, stock) {
        this.tableau   = tableau;
        this.stock     = stock;

        this.showing   = false;
        this.isInvalid = true;
        this.hints     = [];
        this.current   = 0;
    }

    /**
     * Shows a new Hint
     * @returns {Boolean}
     */
    showHint() {
        if (this.isInvalid) {
            this.generate();
        } else if (this.hints.length) {
            this.hideHint();
            this.current += 1;
            if (this.current >= this.hints.length) {
                this.current = 0;
            }
        }

        this.showing = true;
        if (!this.hints.length) {
            if (this.stock.isEmpty) {
                return false;
            }
            this.stock.element.classList.add("card-hint");
            return true;
        }

        const hint = this.hints[this.current];
        for (const card of hint.cards) {
            card.element.classList.add("card-hint");
        }
        hint.to.element.classList.add("card-hint");
        return true;
    }

    /**
     * Hides the current Hint
     * @returns {Void}
     */
    hideHint() {
        if (!this.showing) {
            return;
        }

        this.showing = false;
        if (!this.hints.length) {
            this.stock.element.classList.remove("card-hint");
            return;
        }

        const hint = this.hints[this.current];
        for (const card of hint.cards) {
            card.element.classList.remove("card-hint");
        }
        hint.to.element.classList.remove("card-hint");
    }



    /**
     * Invalidates the Hints
     * @returns {Void}
     */
    invalidate() {
        this.isInvalid = true;
    }

    /**
     * Generates all the Hints
     * @returns {Void}
     */
    generate() {
        this.isInvalid = false;
        this.hints     = [];
        this.current   = 0;

        for (const column of this.tableau.columns) {
            if (column.isEmpty) {
                continue;
            }
            const cards      = [];
            let   lastNumber = 0;
            let   cardIndex  = 0;

            for (cardIndex = column.cards.length - 1; cardIndex >= 0; cardIndex--) {
                const card = column.cards[cardIndex];
                if (cards.length > 0 && (card.showingBack || cards[0].suit !== card.suit || card.number - lastNumber !== 1)) {
                    break;
                }
                cards.unshift(card);
                lastNumber = card.number;
            }
            if (!cards.length) {
                continue;
            }

            for (let colIndex = 0; colIndex < this.tableau.columns.length; colIndex++) {
                const otherColumn = this.tableau.columns[colIndex];
                // Cant move to this column
                if (column.index === colIndex || !otherColumn.canMove(cards[0])) {
                    continue;
                }
                // The other column is empty and there are no back cards
                if (otherColumn.isEmpty && cardIndex === -1) {
                    continue;
                }
                // The other column has the same last card as the previous onw
                if (cardIndex >= 0) {
                    const prevCard = column.cards[cardIndex];
                    if (!prevCard.showingBack && !otherColumn.isEmpty && prevCard.name === otherColumn.lastCard.name) {
                        continue;
                    }
                }

                let score = otherColumn.getScore(cards[0]) + cards.length;
                if (!otherColumn.isEmpty) {
                    score += 100;
                }

                this.hints.push({
                    score, cards,
                    from  : column,
                    to    : otherColumn,
                });
            }
        }

        this.hints.sort((a, b) => b.score - a.score);
    }
}
