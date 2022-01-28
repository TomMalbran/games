import Data               from "../Data.js";
import Ammo               from "../ammo/Ammo.js";
import Mob                from "../mob/Mob.js";

// Utils
import List, { Iterator } from "../../../utils/List.js";
import Utils              from "../../../utils/Utils.js";



/**
 * Defender Tower
 */
export default class Tower {

    /**
     * Defender Tower constructor
     */
    constructor() {
        this.name      = "";
        this.text      = "";
        this.type      = "";
        this.special   = "";
        this.sound     = "";

        this.levels    = 0;
        this.size      = 0;
        this.ammoRange = 0;
        this.costs     = [];
        this.damages   = [];
        this.ranges    = [];
        this.speeds    = [];
        this.bleeds    = false;
        this.slows     = false;
        this.boosts    = false;
        this.lock      = false;
        this.fire      = false;
    }

    /**
     * Defender Tower initializer
     * @param {Number} id
     * @param {Number} row
     * @param {Number} col
     * @param {Number} boardSize
     * @returns {Void}
     */
    init(id, row, col, boardSize) {
        this.id         = id;
        this.element    = null;
        this.lists      = {
            boosts   : [],
            towers   : [],
            complete : [],
            reduced  : [],
        };

        this.level      = 1;
        this.speed      = this.actualSpeed;
        this.width      = 0;
        this.angle      = 0;
        this.isLocked   = false;

        this.timer      = 0;
        this.isShooting = false;
        this.shootIt    = null;
        this.ammos      = 0;
        this.boost      = 0;
        this.loading    = 0;
        this.loaded     = 0;

        this.boardSize  = boardSize;
        this.row        = row || 0;
        this.col        = col || 0;
        this.centerTop  = this.getTowerCenter(this.row);
        this.centerLeft = this.getTowerCenter(this.col);
    }

    /**
     * Creates the Tower element and returns it
     * @returns {HTMLElement}
     */
    createElement() {
        const content = document.querySelector(`.towers-panel .tower-build[data-type="${this.type}"]`).parentElement.innerHTML;
        this.element  = document.createElement("DIV");

        this.element.className    = "tower";
        this.element.dataset.type = "tower";
        this.element.dataset.id   = String(this.id);
        this.element.style.top    = Utils.toPX((this.row + this.size / 2) * this.boardSize);
        this.element.style.left   = Utils.toPX((this.col + this.size / 2) * this.boardSize);
        this.element.style.zIndex = String(this.row + this.col);

        this.element.innerHTML = `
            <div class="tower-center${this.size} tower-shadow"></div>
            <div class="tower-center${this.size} tower-select"></div>
            <div class="tower-range"></div>
            <div class="tower-placeholder${this.size}">${content}</div>
        `;

        this.element.querySelector(".tower-build").classList.remove("selected");

        /** @type {HTMLElement} */
        this.loader   = this.element.querySelector(".tower-loader");

        /** @type {HTMLElement} */
        this.rotate   = this.element.querySelector(`.tower-rotate${this.size}`);
        this.shadow   = this.element.querySelector(".tower-shadow");
        this.levelers = this.element.querySelectorAll(".tower-levels div");
        this.number   = this.element.querySelector(".tower-number");
        this.width    = this.size * this.boardSize - 10;
        this.setRangeClasses();

        return this.element;
    }

    /**
     * Creates a new Ammo
     * @param {Mob[]}  targets
     * @param {Number} index
     * @returns {Ammo}
     */
    createAmmo(targets, index) {
        return undefined;
    }



    /**
     * Adds or Removes the Boost percentage to the Tower
     * @param {Number} amount
     * @returns {Void}
     */
    addBoost(amount) {
        this.boost += amount;
        if (this.boost > 0) {
            this.shadow.classList.add("tower-boost");
        } else {
            this.shadow.classList.remove("tower-boost");
        }
    }

    /**
     * Starts the Upgrade Process
     * @returns {Void}
     */
    startUpgrade() {
        this.loading = 1;
        this.loaded  = this.upgradeTime;
        this.element.classList.add("loading");
        this.setLoadWidth();
    }

    /**
     * Ends the Upgrade Process
     * @returns {Void}
     */
    endUpgrade() {
        this.element.classList.remove("loading");
    }

    /**
     * Does the actual Tower Upgrade. If the level is given it sets that level
     * @param {Number=} level
     * @returns {Void}
     */
    upgrade(level) {
        if (level) {
            this.level = level;
        } else {
            this.level += 1;
        }

        for (let i = 0; i < this.level; i += 1) {
            this.levelers[i].classList.remove(`type${this.level - 1}`);
            this.levelers[i].classList.add(`type${this.level}`);
        }
        this.number.innerHTML = String(this.level);
        this.setRangeClasses();
    }



    /**
     * Starts the Sale Process
     * @returns {Void}
     */
    startSale() {
        this.loading = 19;
        this.loaded  = 20;
        this.element.classList.add("loading");
        this.setLoadWidth();
    }

    /**
     * Destroys and Removes the current Tower
     * @returns {Void}
     */
    destroy() {
        if (this.shootIt) {
            this.shootIt.removePrev();
        }
        if (this.element) {
            Utils.removeElement(this.element);
        }
    }



    /**
     * Increases the Loader by 1 for the upgrade process
     * @returns {Void}
     */
    incLoader() {
        this.loading += 1;
        this.setLoadWidth();
    }

    /**
     * Decreases the Loader by 1 for the sale process
     * @returns {Void}
     */
    decLoader() {
        this.loading -= 1;
        this.setLoadWidth();
    }

    /**
     * Sets the load bar width
     * @returns {Void}
     */
    setLoadWidth() {
        this.loader.style.width = Utils.toPX(this.loadValue * this.width);
    }

    /**
     * Returns true if there is a loading process active
     * @returns {Boolean}
     */
    get isLoading() {
        return this.loading < this.loaded && this.loading > 0;
    }

    /**
     * Returns the Loading fraction
     * @returns {Number}
     */
    get loadValue() {
        return this.loading / this.loaded;
    }



    /**
     * Sets the Iterator that points to the shooting list
     * @param {Iterator} it
     * @returns {Void}
     */
    setShootIt(it) {
        this.shootIt = it;
    }

    /**
     * Starts the shooting timer
     * @returns {Void}
     */
    startShoot() {
        this.timer      = 3000 / this.speed;
        this.isShooting = true;
    }

    /**
     * Ends the shooting timer
     * @returns {Void}
     */
    endShoot() {
        this.isShooting = false;
        this.shootIt    = null;
    }

    /**
     * Decreases the shooting timer
     * @param {Number} time
     * @returns {Boolean}
     */
    decTimer(time) {
        this.timer -= time;
        return this.timer <= 0;
    }

    /**
     * Returns the damage depending if is a bleed Tower or not
     * @returns {Number}
     */
    get damage() {
        return this.bleeds ? 0 : this.actualDamage;
    }

    /**
     * Toggles a class on the tower element. Extended by the Tower classes
     * @param {Number} amount
     * @returns {Void}
     */
    toggleAttack(amount) {
        return undefined;
    }

    /**
     * Toggles the attacking class for a single Missile
     * @param {Number} index
     * @returns {Void}
     */
    toggleMissile(index) {
        return undefined;
    }

    /**
     * Returns a list of targets. Extended by the Tower classes
     * @param {List} mobs
     * @param {Mob}  mob
     * @returns {Mob[][]}
     */
    getTargets(mobs, mob) {
        return [[ mob ]];
    }

    /**
     * Returns true if the given Mob is a valid target. Extended by the Tower classes
     * @param {Mob} mob
     * @returns {Boolean}
     */
    isValidTarget(mob) {
        return true;
    }



    /**
     * Returns true if the Tower can shoot the given Mob
     * @param {Mob} mob
     * @returns {Boolean}
     */
    canShoot(mob) {
        const defense = this.actualDamage > mob.defense;
        const valid   = this.isValidTarget(mob);
        return defense && valid;
    }

    /**
     * Returns a list with the targets close enough to the given Mob
     * @param {List} mobs
     * @param {Mob}  mob
     * @returns {Mob[]}
     */
    getCloseTargets(mobs, mob) {
        const list = [];

        mobs.forEach((it) => {
            /** @type {Mob} */
            const nmob     = it.getPrev();
            const isClose  = this.isClose(nmob, mob);
            const canShoot = this.canShoot(nmob);

            if (nmob.hitPoints > 0 && isClose && canShoot) {
                list.push(nmob);
            }
        });
        return list;
    }

    /**
     * Returns a list with the targets in the range of the tower
     * @param {List} mobs
     * @returns {Mob[]}
     */
    getRangeTargets(mobs) {
        const list = [];

        mobs.forEach((it) => {
            /** @type {Mob} */
            const mob      = it.getPrev();
            const inRange  = this.inRange(mob, 1);
            const canShoot = this.canShoot(mob);

            if (mob.hitPoints > 0 && inRange && canShoot) {
                list.push(mob);
            }
        });
        return list;
    }

    /**
     * Returns true if two mobs are close enought, according to the range of the ammo
     * @param {Mob} target
     * @param {Mob} mob
     * @returns {Boolean}
     */
    isClose(target, mob) {
        const yDis  = Math.abs(target.pos.top  - mob.pos.top);
        const xDist = Math.abs(target.pos.left - mob.pos.left);

        return yDis < this.ammoRange && xDist < this.ammoRange;
    }

    /**
     * Returns true if the given mob is in the range of the tower
     * @param {Mob} mob
     * @param {Number} mult
     * @returns {Boolean}
     */
    inRange(mob, mult) {
        const mobPos = mob.centerPos;
        const yDis   = Math.abs(this.centerTop  - mobPos.top);
        const xDist  = Math.abs(this.centerLeft - mobPos.left);
        const range  = this.realRange * mult;

        return yDis < range && xDist < range;
    }

    /**
     * Returns the angle between the tower and the given mob
     * @param {Mob} mob
     * @returns {Number}
     */
    getMobAngle(mob) {
        const mobPos = mob.centerPos;
        const xDist  = mobPos.left - this.centerLeft;
        const yDist  = mobPos.top  - this.centerTop;

        return Utils.calcAngle(xDist, yDist);
    }

    /**
     * Returns true if the given angles are close enought
     * @param {Number} towerAngle
     * @param {Number} mobAngle
     * @returns {Boolean}
     */
    validAngle(towerAngle, mobAngle) {
        return Math.abs(towerAngle - mobAngle) < 5;
    }



    /**
     * Locks/Unlocks the Tower
     * @returns {Void}
     */
    toggleLock() {
        this.isLocked = !this.isLocked;
        this.element.classList.toggle("locked");
    }

    /**
     * Selects/Unselects the Tower
     * @param {Boolean} select
     * @returns {Void}
     */
    toggleSelect(select) {
        this.element.classList.toggle("selected", select);
    }

    /**
     * Sets the new Ranges classes of the Tower
     * @returns {Void}
     */
    setRangeClasses() {
        if (this.level === 1 || this.getActualRange() !== this.getActualRange(-1)) {
            this.element.classList.remove(`tower-range${Math.floor(this.getActualRange(-1))}`);
            this.element.classList.add(`tower-range${Math.floor(this.getActualRange())}`);
        }
    }

    /**
     * Sets and Rotates the Tower
     * @param {Number} angle
     * @returns {Void}
     */
    rotateCanon(angle) {
        this.angle = angle;
        this.rotate.style.transform = Utils.rotate(angle);
    }

    /**
     * Rotates the Tower and Ammo right after it starts shooting
     * @param {Mob}  mob
     * @param {Ammo} ammo
     * @returns {Void}
     */
    setAngle(mob, ammo) {
        let angle = this.getMobAngle(mob);
        if (this.isLocked) {
            angle = this.angle;
        } else {
            this.rotateCanon(angle);
        }
        ammo.rotate(angle);
    }



    /**
     * Returns the end row of the Tower
     * @returns {Number}
     */
    get endRow() {
        return this.row + this.size;
    }

    /**
     * Returns the end row of the Tower
     * @returns {Number}
     */
    get endCol() {
        return this.col + this.size;
    }

    /**
     * Returns the position at the center Tower
     * @returns {{top: Number, left: Number}}
     */
    get centerPos() {
        return { top: this.centerTop, left: this.centerLeft };
    }

    /**
     * If a tower can be destroyed, it returns true after all the ammos reached its target
     * @returns {Boolean}
     */
    get canDestroy() {
        return this.ammos <= 0;
    }

    /**
     * Increases the amount of ammos shooted by the tower
     * @param {Number} amount
     * @returns {Void}
     */
    addAmmo(amount) {
        this.ammos += amount;
    }

    /**
     * Decreases by one the amount of ammos, once an ammo reached the target
     * @returns {Void}
     */
    decAmmo() {
        this.ammos -= 1;
    }



    /**
     * Sets the Iterator lists that points to different cells in the Ranges matrixs
     * @param {{boosts: Iterator[], towers: Number[], complete: Iterator[], reduced: Iterator[]}} lists
     * @returns {Void}
     */
    setLists(lists) {
        this.lists = lists;
    }

    /**
     * Sets just one list of Iterators
     * @param {String}     name
     * @param {Iterator[]} list
     * @returns {Void}
     */
    setList(name, list) {
        this.lists[name] = list;
    }



    /**
     * Returns true if the Tower can slow the targets
     * @returns {Boolean}
     */
    get canSlow() {
        return !!this.slows;
    }

    /**
     * Returns true if the Tower can stun the targets
     * @returns {Boolean}
     */
    get canStun() {
        return !!this.slows;
    }

    /**
     * Returns true if the Tower can make the targets bleed
     * @returns {Boolean}
     */
    get canBleed() {
        return !!this.bleeds;
    }

    /**
     * Returns the Tower name. Using the special name if required
     * @param {Boolean} preview  If not true, the level will be added to the name
     * @returns {String}
     */
    getName(preview) {
        return this.level === 6 ? this.special : `${this.name} ${!preview ? this.level : ""}`;
    }

    /**
     * Returns the price for the Tower, depending if is planning or playing
     * @param {Boolean} hasStarted
     * @returns {Number}
     */
    getPrice(hasStarted) {
        const cost = this.actualCost;
        return hasStarted ? Math.floor(cost * 0.75) : cost;
    }

    /**
     * Returns the cost for the current level of the Tower
     * @returns {Number}
     */
    get actualCost() {
        return this.costs[this.level - 1];
    }

    /**
     * Returns the upgrade cost for the Tower
     * @returns {Number}
     */
    get upgradeCost() {
        return this.costs[this.level] - this.costs[this.level - 1];
    }

    /**
     * Returns the damage for the current level of the Tower, including the Boosts
     * @returns {Number}
     */
    get actualDamage() {
        const value = this.damages[this.level - 1];
        return this.getBoostDamage(value);
    }

    /**
     * Returns the added damage for the next level of the Tower, including the Boosts
     * @returns {Number}
     */
    get upgradeDamage() {
        const value = this.damages[this.level] - this.damages[this.level - 1];
        return this.getBoostDamage(value);
    }

    /**
     * Multiplies the damage with the boost for the Tower
     * @param {Number} value
     * @returns {Number}
     */
    getBoostDamage(value) {
        return Math.round(value * (this.boost ? this.boost / 100 + 1 : 1));
    }



    /**
     * Returns the range of the tower, or the one of a different level
     * @param {Number} add
     * @returns {Number}
     */
    getActualRange(add = 0) {
        return Math.floor(this.ranges[this.level - 1 + add]);
    }

    /**
     * Returns the matrix that corresponds to the range of the Tower
     * @returns {Number[][]}
     */
    get rangeMatrix() {
        return Data.ranges[this.getActualRange()];
    }

    /**
     * Returns the real range of the Tower with decimals if required
     * @returns {Number}
     */
    get realRange() {
        return this.ranges[this.level - 1];
    }

    /**
     * Returns the added range after upgrading th Tower
     * @returns {Number}
     */
    get upgradeRange() {
        return this.ranges[this.level] - this.ranges[this.level - 1];
    }



    /**
     * Returns the actual speed of the Ammo of the Tower
     * @returns {Number}
     */
    get actualSpeed() {
        return this.speeds[this.level - 1];
    }

    /**
     * Returns the added speed of the Ammo of the Tower after upgrading
     * @returns {Number}
     */
    get upgradeSpeed() {
        const diff = this.speeds[this.level] - this.speeds[this.level - 1] !== 0;
        return diff ? this.speeds[this.level] : "";
    }

    /**
     * Returns the upgrade time
     * @returns {Number}
     */
    get upgradeTime() {
        return this.level * 30;
    }

    /**
     * Returns the center of the Tower
     * @param {Number} cell
     * @returns {Number}
     */
    getTowerCenter(cell) {
        return (cell + this.size / 2) * this.boardSize;
    }



    /**
     * Returns true if the Tower reached the maximum level
     * @returns {Boolean}
     */
    get isMaxLevel() {
        return this.level === this.levels;
    }

    /**
     * Returns true if this is a Boost Tower
     * @returns {Boolean}
     */
    get isBoost() {
        return this.boosts ? true : false;
    }

    /**
     * Returns true if this Tower can be locked
     * @returns {Boolean}
     */
    get canLock() {
        return this.lock ? true : false;
    }

    /**
     * Returns true if this Tower can be fired
     * @returns {Boolean}
     */
    get canFire() {
        return this.fire ? true : false;
    }

    /**
     * Returns true if it will stun a mob
     * @returns {Boolean}
     */
    get shouldStun() {
        return false;
    }
}
