import Data         from "./Data.js";

// Utils
import Utils        from "../../utils/Utils.js";



/**
 * Spider Stock
 */
export default class Stock {

    /**
     * Spider Stock constructor
     */
    constructor() {
        this.children  = [];

        this.container = document.querySelector(".stock");
        this.slot      = document.createElement("div");
        this.slot.className = "slot slot-empty";
        this.container.appendChild(this.slot);
    }

    /**
     * Returns true if the Stock is Empty
     * @returns {Boolean}
     */
    get isEmpty() {
        return this.children.length === 0;
    }

    /**
     * Returns the last element, if possible
     * @returns {?HTMLElement}
     */
    get element() {
        if (!this.children.length) {
            return this.slot;
        }
        return this.children[this.children.length - 1];
    }

    /**
     * Returns the Bounds of the last element
     * @returns {Object}
     */
    get bounds() {
        return this.element.getBoundingClientRect();
    }



    /**
     * Builds the Stock
     * @returns {Void}
     */
    build() {
        this.children = [];
        this.container.innerHTML = "";
        this.container.appendChild(this.slot);

        for (let i = 0; i < Data.deals; i++) {
            this.add();
        }
    }

    /**
     * Resets the Stock
     * @returns {Void}
     */
    reset() {
        this.restore(Data.deals);
    }

    /**
     * Restores the Stock
     * @param {Number} deals
     * @returns {Void}
     */
    restore(deals) {
        this.children = [];
        this.container.innerHTML = "";
        this.container.appendChild(this.slot);

        for (let i = 0; i < deals; i++) {
            this.add();
        }
    }

    /**
     * Adds one to the Stock
     * @returns {Void}
     */
    add() {
        const img = document.createElement("img");
        img.src = "images/2B.svg";
        img.alt = `Stock ${this.children.length + 1}`;
        img.dataset.action = "deal";
        this.container.appendChild(img);
        this.children.push(img);
    }

    /**
     * Removes one from the Stock
     * @returns {Void}
     */
    remove() {
        const child = this.children.pop();
        Utils.removeElement(child);
    }
}
