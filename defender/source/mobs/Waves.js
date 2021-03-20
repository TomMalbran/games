/**
 * The Mobs Waves Class
 */
class Waves {

    /**
     * The Mobs Waves constructor
     * @param {Mobs} parent
     */
    constructor(parent) {
        this.waves = [
            "Normal",    "Inmune", "Group",  "Fast",   "Normal", "Spawn",  "Flying", "NormalBoss",
            "Inmune",    "Group",  "Arrow",  "Normal", "Spawn",  "Flying", "Normal", "InmuneBoss",
            "Group",     "Arrow",  "Dark",   "Spawn",  "Flying", "Normal", "Inmune", "GroupBoss",
            "Arrow",     "Dark",   "Spawn",  "Flying", "Decoy",  "Hopper", "Morph",  "FastBoss",
            "Dark",      "Spawn",  "Flying", "Decoy",  "Hopper", "Morph",  "Fast",   "DarkBoss",
            "Spawn",     "Flying", "Decoy",  "Hopper", "Morth",  "Fast",   "Dark",   "FlyingBoss",
            "SpawnBoss", "Normal"
        ];

        this.parent    = parent;
        this.container = document.querySelector(".waves");
        this.waver     = document.querySelector(".currentWave");
        this.total     = document.querySelector(".totalWaves");
        this.button    = document.querySelector(".nextButton");

        this.maxWaves  = 3;
        this.elemWidth = 79;
        this.elements  = [];
        this.wave      = 0;
        this.count     = Math.min(8, this.waves.length);
        this.simWaves  = this.maxWaves - 1;
        this.mobCount  = [];

        this.setWave();

        this.container.innerHTML = "";
        for (let i = 0; i < this.count; i += 1) {
            this.createElement(i);
        }

        this.button.style.display = "";
        this.total.innerHTML      = this.waves.length;
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
        this.parent.sounds.enter();
    }

    /**
     * Reduces the mob count for the given wave
     * @param {Number} wave
     * @returns {Void}
     */
    reduceMob(wave) {
        this.mobCount[wave] -= 1;
        if (this.mobCount[wave] <= 0) {
            this.simWaves = Math.min(this.maxWaves, this.simWaves + 1);
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
            if (this.parent.score.getTimer() === 0) {
                this.newWave();
                this.simWaves = Math.min(this.simWaves + 1, this.maxWaves);
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
        if (this.wave + this.count < this.waves.length) {
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
        const mob = Mob.create(this.getType(add), { boss : this.isBossWave(add) });
        const div = document.createElement("DIV");

        div.style.backgroundColor = mob.getColor();
        div.style.left = Utils.toPX(this.getLeft(this.wave + add, 0));
        div.className  = "wave";
        div.innerHTML  = `
            <h3>${this.wave + add + 1}. ${(mob.isBoss() ? "Boss" : mob.getName())}</h3>
            <p>${mob.getSlogan()}</p>
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
        const timer = this.parent.score.getTimer();
        const start = (timer - 25) * this.elemWidth / 25;

        this.elements.forEach((element, index) => {
            element.style.left = Utils.toPX(this.getLeft(index, start));
        });
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
     * @param {Number} add
     * @returns {String}
     */
    getType(add) {
        return this.waves[this.wave + (add || 0)].replace("Boss", "");
    }

    /**
     * Returns true if the wave of the current + add is a boss wave
     * @param {Number} add
     * @returns {Boolean}
     */
    isBossWave(add) {
        return this.waves[this.wave + (add || 0)].includes("Boss");
    }

    /**
     * Returns the left property for the element at the given index
     * @param {Number} index
     * @param {Number} start
     * @returns {Number}
     */
    getLeft(index, start) {
        return Math.round(start + index * this.elemWidth);
    }

    /**
     * Returns true if this is the last wave
     * @returns {Void}
     */
    isLastWave() {
        return this.wave + 1 === this.waves.length;
    }

    /**
     * Sets the inner HTML for the current wave
     * @returns {Void}
     */
    setWave() {
        this.waver.innerHTML = this.wave + 1;
    }
}
