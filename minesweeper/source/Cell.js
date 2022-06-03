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
        this.hasBomb    = false;
        this.isRevealed = false;
        this.number     = 0;
    }

    get isEmpty() {
        return this.number === 0;
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
     */
    reveal() {
        if (this.isRevealed) {
            return;
        }
        this.element.className = "cell front";
        this.element.innerHTML = "";
        if (this.number > 0) {
            this.element.innerHTML = String(this.number);
        }
        this.isRevealed = true;
    }
}