import Data         from "./Data.js";
import Storage      from "../../utils/Storage.js";
import Utils        from "../../utils/Utils.js";



/**
 * Puzzle Selection
 */
export default class Selection {

    /** @type {Storage} */
    #storage;
    /** @type {Function} */
    #onStart;
    /** @type {String} */
    #image;
    /** @type {String} */
    #tab;
    /** @type {Number} */
    #index;
    /** @type {Number} */
    #amount;
    /** @type {Number} */
    #last;
    /** @type {Number} */
    #pieces;

    /** @type {HTMLElement} */
    #mainElem;
    /** @type {HTMLElement} */
    #tabsElem;
    /** @type {HTMLElement} */
    #listElem;
    /** @type {HTMLElement} */
    #packElem;
    /** @type {HTMLElement} */
    #descElem;
    /** @type {HTMLElement} */
    #buttonElem;
    /** @type {HTMLElement} */
    #selectedElem;


    /**
     * Puzzle Selection constructor
     * @param {Function} onStart
     */
    constructor(onStart) {
        this.#storage    = new Storage("puzzle");
        this.#onStart    = onStart;

        this.#image      = "";
        this.#tab        = Data.categories[0].toLowerCase();
        this.#index      = 0;
        this.#amount     = 2;
        this.#last       = Data.puzzles - this.#amount + 1;

        this.#mainElem   = document.querySelector(".selection");
        this.#tabsElem   = document.querySelector(".selection-tabs");
        this.#listElem   = document.querySelector(".slider-list");
        this.#packElem   = document.querySelector(".selection-pack");
        this.#descElem   = document.querySelector(".selection-desc");
        this.#buttonElem = document.querySelector(".selection button");

        this.buildTabs();
        this.buildTab();
    }

    /**
     * Builds all the Tabs
     * @returns {Void}
     */
    buildTabs() {
        for (const category of Data.categories) {
            const isSelected  = this.#tab === category.toLowerCase();
            const li          = document.createElement("li");
            li.className      = isSelected ? "selected" : "";
            li.dataset.action = "tab";
            li.innerText      = category;
            this.#tabsElem.appendChild(li);
        }
    }

    /**
     * Builds a single Tab
     * @returns {Void}
     */
    buildTab() {
        let done = 0;

        this.#listElem.innerHTML = "";
        for (let i = 1; i <= Data.puzzles; i += 1) {
            let completed = 0;
            let selects   = "";
            for (const pieceCount of Data.pieces) {
                const prefix = `${this.#tab}${i}.${pieceCount}.`;
                const score  = this.#storage.get(`${prefix}score`);
                const isDone = score && score.placed === score.total
                done      += isDone ? 1 : 0;
                completed += isDone ? 1 : 0;
                selects   += `<li data-action="select" ${isDone ? "class='completed'" : ""}>${pieceCount}</li>`;
            }

            const li     = document.createElement("li");
            li.className = "slider-slide";
            li.innerHTML = `
                <div class="slider-image">
                    <h3>${i}</h3>
                    <img src="images/${this.#tab}/${i}.jpg" />
                    ${completed > 0 ? `<h4 ${(completed === Data.pieces.length) ? "class='done'" : ""}>
                        ${completed}/${Data.pieces.length}
                    </h4>` : ""}
                </div>
                <ul data-image="${this.#tab}${i}">${selects}</ul>
            `;
            this.#listElem.appendChild(li);
        }

        const total   = Data.puzzles * Data.pieces.length;
        const percent = Math.floor(done * 100 / total);
        this.#packElem.innerHTML = `Completed <b>${done}/${total}</b> puzzles <i>(${percent}%)</i> of this pack.`;

        this.#listElem.style.setProperty("--slider-count", String(this.#amount));
        this.#listElem.style.setProperty("--slider-total", String(Data.puzzles));
    }

    /**
     * Shows the Selection
     * @returns {Void}
     */
    show() {
        this.#mainElem.style.display = "block";
    }

    /**
     * Changes the current Tab
     * @param {HTMLElement} element
     * @returns {Void}
     */
    changeTab(element) {
        this.#tab   = element.innerText.toLowerCase();
        this.#index = 0;

        this.#tabsElem.querySelector(".selected").classList.remove("selected");
        element.classList.add("selected");
        this.buildTab();

        this.#descElem.style.display   = "none";
        this.#buttonElem.style.display = "none";
        this.transform();
    }



    /**
     * Moves the Slider one to the left or right
     * @param {Number} dir
     * @returns {Void}
     */
    moveSlider(dir) {
        this.#index += dir;
        if (this.#index < 0) {
            this.#index = this.#last - 1;
        } else if (this.#index > this.#last - 1) {
            this.#index = 0;
        }
        this.transform();
    }

    /**
     * Sets the Slider transform
     * @returns {Void}
     */
    transform() {
        this.#listElem.style.transform = `translateX(calc(-100%/${Data.puzzles}*${this.#index}))`;
    }

    /**
     * Selects the Pieces
     * @param {HTMLElement} element
     * @returns {Void}
     */
    select(element) {
        this.#image  = element.parentElement.getAttribute("data-image");
        this.#pieces = Number(element.innerHTML);

        if (this.#selectedElem) {
            this.#selectedElem.classList.remove("selected");
            this.#selectedElem.parentElement.parentElement.classList.remove("selected");
        }
        this.#selectedElem = element;
        this.#selectedElem.classList.add("selected");
        this.#selectedElem.parentElement.parentElement.classList.add("selected");

        this.#buttonElem.style.display = "block";
        const score = this.#storage.get(`${this.#image}.${this.#pieces}.score`);
        if (score) {
            const percent = Math.floor(score.placed * 100 / score.total);
            const time    = this.#storage.get(`${this.#image}.${this.#pieces}.time`);
            let   desc    = `Completed <b>${percent}%</b> of this puzzle.`;
            if (time) {
                const timeParts = Utils.parseTime(time);
                desc = `Completed <b>${percent}%</b> of this puzzle in <b>${timeParts.join(":")}</b>.`;
            }
            this.#descElem.innerHTML     = desc;
            this.#descElem.style.display = "block";
            this.#buttonElem.innerHTML   = percent === 100 ? "Restart" : "Continue";
        } else {
            this.#descElem.style.display = "none";
            this.#buttonElem.innerHTML   = "Start";
        }
    }

    /**
     * Starts the Puzzle
     * @returns {Void}
     */
    start() {
        this.#selectedElem.classList.remove("selected");
        this.#selectedElem.parentElement.parentElement.classList.remove("selected");

        this.#mainElem.style.display   = "none";
        this.#descElem.style.display   = "none";
        this.#buttonElem.style.display = "none";

        this.#onStart(this.#image, this.#pieces);
    }
}
