import Mobs         from "./Mobs.js";
import Data         from "../Data.js";
import Factory      from "../Factory.js";

// Utils
import Utils        from "../../../utils/Utils.js";



/**
 * Defender Mobs Waves
 */
export default class Waves {

    /**
     * Defender Mobs Waves constructor
     * @param {Mobs} parent
     */
    constructor(parent) {
        this.parent    = parent;
        this.elements  = [];
        this.wave      = 0;
        this.count     = Math.min(Data.initWaves, Data.waves.length);
        this.simWaves  = Data.maxWaves - 1;
        this.mobCount  = [];

        this.waver     = document.querySelector(".current-wave");
        this.total     = document.querySelector(".total-waves");

        /** @type {HTMLElement} */
        this.container = document.querySelector(".waves-content");

        /** @type {HTMLElement} */
        this.button    = document.querySelector(".next-button");

        this.setWave();

        this.container.innerHTML = "";
        for (let i = 0; i < this.count; i += 1) {
            this.createElement(i);
        }

        this.button.style.display = "";
        this.total.innerHTML      = String(Data.waves.length);
    }



    /**
     * Moves to the next Wave
     * @returns {Void}
     */
    next() {
        if (!this.isLastWave() && this.simWaves > 0) {
            this.newWave();
            this.setLeft();
            this.simWaves -= 1;
            this.showButton();
        }
    }

    /**
     * Sends the mobs from the new Wave
     * @returns {Void}
     */
    sendMobs() {
        this.mobCount[this.wave + 1] = this.parent.create.mobs({
            type     : this.getType(),
            isBoss   : this.isBossWave(),
            wave     : this.wave + 1,
            lastWave : this.isLastWave()
        });
        this.parent.score.startTimer();
        this.parent.sounds.play("enter");
    }

    /**
     * Reduces the mob count for the given wave
     * @param {Number} wave
     * @returns {Void}
     */
    reduceMob(wave) {
        this.mobCount[wave] -= 1;
        if (this.mobCount[wave] <= 0) {
            this.simWaves = Math.min(Data.maxWaves, this.simWaves + 1);
            this.showButton();
        }
    }



    /**
     * Moves all the waves elements
     * @returns {Void}
     */
    move() {
        if (this.isLastWave()) {
            this.button.style.display = "none";
            this.parent.score.removeTimer();
        } else {
            if (this.parent.score.timer === 0) {
                this.newWave();
                this.simWaves = Math.min(this.simWaves + 1, Data.maxWaves);
                this.showButton();
            }
            this.setLeft();
        }
    }

    /**
     * Adds a new Wave element
     * @returns {Void}
     */
    newWave() {
        if (this.wave + this.count < Data.waves.length) {
            this.createElement(this.count);
        }

        this.removeElement();
        this.left  = 0;
        this.wave += 1;
        this.setWave();
        this.sendMobs();
    }

    /**
     * Creates the Wave element
     * @param {Number} add
     * @returns {Void}
     */
    createElement(add) {
        const mob = Factory.createMob(this.getType(add), { boss : this.isBossWave(add) });
        const div = document.createElement("DIV");

        div.style.backgroundColor = mob.color;
        div.className = "wave";
        div.innerHTML = `
            <h3>${this.wave + add + 1}. ${mob.waveName}</h3>
            <p>${mob.slogan}</p>
        `;

        this.container.appendChild(div);
        this.elements[this.elements.length] = div;
    }

    /**
     * Removes the first Wave element
     * @returns {Void}
     */
    removeElement() {
        Utils.removeElement(this.elements[0]);
        this.elements = this.elements.splice(1);
    }

    /**
     * Sets the left position of the waves elements
     * @returns {Void}
     */
    setLeft() {
        const timer = this.parent.score.timer;
        const start = (timer - 25) * Data.waveSize / 25;

        this.container.style.left = Utils.toPX(start);
    }

    /**
     * Sets the display of the button
     * @returns {Void}
     */
    showButton() {
        this.button.style.display = this.simWaves <= 0 ? "none" : "block";
    }



    /**
     * Returns the type of the current + add wave
     * @param {Number=} add
     * @returns {String}
     */
    getType(add = 0) {
        return Data.waves[this.wave + add].replace("Boss", "");
    }

    /**
     * Returns true if the wave of the current + add is a boss wave
     * @param {Number=} add
     * @returns {Boolean}
     */
    isBossWave(add = 0) {
        return Data.waves[this.wave + add].includes("Boss");
    }

    /**
     * Returns true if this is the last wave
     * @returns {Boolean}
     */
    isLastWave() {
        return this.wave + 1 === Data.waves.length;
    }

    /**
     * Sets the inner HTML for the current wave
     * @returns {Void}
     */
    setWave() {
        this.waver.innerHTML = String(this.wave + 1);
    }
}
