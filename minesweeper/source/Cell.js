/**
 * Minesweeper Cell
 */
export default class Cell {

    /**
     * Minesweeper Cell constructor
     * @param {Number}  row
     * @param {Number}  col
     * @param {Boolean} isBorder
     */
    constructor(row, col, isBorder) {
        this.row        = row;
        this.col        = col;

        this.isBorder   = isBorder;
        this.number     = 0;
        this.flags      = 0;

        this.hasBomb    = false;
        this.isRevealed = false;
        this.isFlagged  = false;
    }

    /**
     * Returns true if the Cell is Empty
     * @returns {Boolean}
     */
    get isEmpty() {
        return this.number === 0;
    }

    /**
     * Returns true if the Cell can be Revealed
     * @returns {Boolean}
     */
    get canReveal() {
        return !this.isRevealed && !this.isFlagged;
    }

    /**
     * Returns true if the Cell can be Flagged
     * @returns {Boolean}
     */
    get canFlag() {
        return !this.isRevealed;
    }



    /**
     * Places a Bomb in the Cell
     * @returns {Void}
     */
    placeBomb() {
        this.hasBomb = true;
    }

    /**
     * Sets the Number of surrounding bombs
     * @param {Number} number
     * @returns {Void}
     */
    setNumber(number) {
        this.number = number;
    }

    /**
     * Creates the HTML Element
     * @param {HTMLElement} container
     * @returns {Void}
     */
    createElement(container) {
        if (this.isBorder) {
            return;
        }

        this.element = document.createElement("div");
        this.element.className      = "cell back";
        this.element.dataset.action = "reveal";
        this.element.dataset.col    = String(this.col);
        this.element.dataset.row    = String(this.row);
        this.element.style.setProperty("--cell-delay", `${(this.col + this.row) / 10}s`);

        const inner1 = document.createElement("div");
        const inner2 = document.createElement("div");
        this.element.append(inner1);
        this.element.append(inner2);

        container.appendChild(this.element);
    }

    /**
     * Reveals the Cell
     * @returns {Void}
     */
    reveal() {
        if (!this.canReveal) {
            return;
        }
        this.isRevealed = true;

        this.element.classList.remove("back");
        this.element.classList.add("front");

        if (this.hasBomb) {
            this.element.classList.add("bomb");
            this.element.innerHTML = "";
        } else if (this.number > 0) {
            this.element.classList.add("fill");
            this.element.innerHTML = String(this.number);
        } else {
            this.element.classList.add("empty");
            this.element.innerHTML = "";
        }

        this.addNumberFlag();
    }

    /**
     * Reveals the Cell
     * @returns {Number}
     */
    flag() {
        if (!this.canFlag) {
            return;
        }

        this.isFlagged = !this.isFlagged;
        if (this.isFlagged) {
            this.element.classList.add("flag");
            return 1;
        }
        this.element.classList.remove("flag");
        return -1;
    }

    /**
     * Updates the flags that surround the cell
     * @param {Number} value
     * @returns {Void}
     */
    addFlag(value) {
        this.flags += value;
        this.addNumberFlag();
    }

    /**
     * Updates the flag class when the cell is a number
     * @returns {Void}
     */
    addNumberFlag() {
        if (!this.isRevealed) {
            return;
        }
        if (this.number === this.flags) {
            this.element.classList.add("flag");
        } else {
            this.element.classList.remove("flag");
        }
    }
}
