import Storage      from "../../utils/Storage.js";
import Utils        from "../../utils/Utils.js";



/**
 * Puzzle Selection
 */
export default class Selection {

    /**
     * Puzzle Selection constructor
     */
    constructor() {
        this.storage = new Storage("puzzle");
        this.image   = "";
        this.tab     = "art";
        this.index   = 0;
        this.amount  = 2;
        this.total   = 10;
        this.last    = this.total - this.amount + 1;

        /** @type {Function} */
        this.onStart = null;

        /** @type {HTMLElement} */
        this.element = document.querySelector(".selection");

        /** @type {HTMLElement} */
        this.tabs    = document.querySelector(".selection-tabs");

        /** @type {HTMLElement} */
        this.list    = document.querySelector(".slider-list");

        /** @type {HTMLElement} */
        this.pack    = document.querySelector(".selection-pack");

        /** @type {HTMLElement} */
        this.desc    = document.querySelector(".selection-desc");

        /** @type {HTMLElement} */
        this.button  = document.querySelector(".selection button");

        this.build();
    }

    /**
     * Builds the Slider
     * @returns {Void}
     */
    build() {
        const pieces = [ "50", "100", "250", "500" ];
        let   done   = 0;

        this.list.innerHTML = "";
        for (let i = 1; i <= this.total; i += 1) {
            let completed = 0;
            let selects   = "";
            for (const pieceCount of pieces) {
                const score  = this.storage.get(`${this.tab}${i}.${pieceCount}.score`);
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
                    <img src="images/${this.tab}${i}.jpg" />
                    ${completed > 0 ? `<h4 ${(completed === pieces.length) ? "class='done'" : ""}>
                        ${completed}/${pieces.length}
                    </h4>` : ""}
                </div>
                <ul data-image="${this.tab}${i}">${selects}</ul>
            `;
            this.list.appendChild(li);
        }

        const total   = (this.total * pieces.length);
        const percent = Math.floor(done * 100 / total);
        this.pack.innerHTML = `Completed <b>${done}/${total}</b> puzzles <i>(${percent}%)</i> of this pack.`;

        this.list.style.setProperty("--slider-count", String(this.amount));
        this.list.style.setProperty("--slider-total", String(this.total));
    }

    /**
     * Shows the Selection
     * @returns {Void}
     */
    show() {
        this.element.style.display = "block";
    }

    /**
     * Changes the current Tab
     * @param {HTMLElement} element
     * @returns {Void}
     */
    changeTab(element) {
        this.tab   = element.innerText.toLowerCase();
        this.index = 0;

        this.tabs.querySelector(".selected").classList.remove("selected");
        element.classList.add("selected");
        this.build();

        this.desc.style.display   = "none";
        this.button.style.display = "none";
        this.transform();
    }



    /**
     * Moves the Slider one to the left or right
     * @param {Number} dir
     * @returns {Void}
     */
    moveSlider(dir) {
        this.index += dir;
        if (this.index < 0) {
            this.index = this.last - 1;
        } else if (this.index > this.last - 1) {
            this.index = 0;
        }
        this.transform();
    }

    /**
     * Sets the Slider transform
     * @returns {Void}
     */
    transform() {
        this.list.style.transform = `translateX(calc(-100%/${this.total}*${this.index}))`;
    }

    /**
     * Selects the Pieces
     * @param {HTMLElement} element
     * @returns {Void}
     */
    select(element) {
        this.image  = element.parentElement.getAttribute("data-image");
        this.pieces = Number(element.innerHTML);

        if (this.selElement) {
            this.selElement.classList.remove("selected");
            this.selElement.parentElement.parentElement.classList.remove("selected");
        }
        this.selElement = element;
        this.selElement.classList.add("selected");
        this.selElement.parentElement.parentElement.classList.add("selected");

        this.button.style.display = "block";
        const score = this.storage.get(`${this.image}.${this.pieces}.score`);
        if (score) {
            const percent = Math.floor(score.placed * 100 / score.total);
            const time    = this.storage.get(`${this.image}.${this.pieces}.time`);
            let   desc    = `Completed <b>${percent}%</b> of this puzzle.`;
            if (time) {
                const timeParts = Utils.parseTime(time);
                desc = `Completed <b>${percent}%</b> of this puzzle in <b>${timeParts.join(":")}</b>.`;
            }
            this.desc.innerHTML     = desc;
            this.desc.style.display = "block";
            this.button.innerHTML   = percent === 100 ? "Restart" : "Continue";
        } else {
            this.desc.style.display = "none";
            this.button.innerHTML   = "Start";
        }
    }

    /**
     * Starts the Puzzle
     * @returns {Void}
     */
    start() {
        this.selElement.classList.remove("selected");
        this.selElement.parentElement.parentElement.classList.remove("selected");

        this.element.style.display = "none";
        this.desc.style.display    = "none";
        this.button.style.display  = "none";

        this.onStart(this.image, this.pieces);
    }
}
