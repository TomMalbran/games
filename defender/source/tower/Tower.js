/**
 * The Tower Base Class
 */
class Tower {

    /**
     * The Tower Base constructor
     * @param {Number} id
     * @param {Number} row
     * @param {Number} col
     * @param {Number} boardSize
     */
    init(id, row, col, boardSize) {
        this.id         = id;
        this.element    = null;

        this.level      = 1;
        this.damage     = this.getActualDamage();
        this.speed      = this.getActualSpeed();
        this.width      = 0;
        this.lists      = { boosts: [], towers: [], complete: [], reduced: [] };
        this.angle      = 0;
        this.locked     = false;

        this.timer      = 0;
        this.shooting   = false;
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
        let content  = document.querySelector(`.towersPanel .towerBuild[data-type="${this.type}"]`).parentNode.innerHTML;
        this.element = document.createElement("DIV");

        this.element.dataset.type   = "tower";
        this.element.dataset.id     = this.id;
        this.element.style.position = "absolute";
        this.element.style.top      = Utils.toPX((this.row + this.size / 2) * this.boardSize);
        this.element.style.left     = Utils.toPX((this.col + this.size / 2) * this.boardSize);

        this.element.innerHTML = `
            <div class="towerCenter${this.size}" towerShadow"></div>
            <div class="towerCenter${this.size}" towerSelect"></div>
            <div class="towerRange"></div>
            <div class="towerPlaceholder${this.size}">${content}</div>
        `;

        this.element.querySelector(".towerBuild").classList.remove("selected");

        this.width    = this.size * this.boardSize - 10;
        this.loader   = this.element.querySelector(".towerLoader");
        this.rotate   = this.element.querySelector(`.towerRotate${this.size}`);
        this.shadow   = this.element.querySelector(".towerShadow");
        this.levelers = this.element.querySelectorAll(".towerLevels div");
        this.number   = this.element.querySelector(".towerNumber");
        this.setRangeClasses();

        return this.element;
    }


    /**
     * Adds or Removes the Boost percentage to the Tower
     * @param {Number} amount
     * @returns {Void}
     */
    addBoost(amount) {
        this.boost += amount;
        if (this.boost > 0) {
            this.shadow.classList.add("withBoost");
        } else {
            this.shadow.classList.remove("withBoost");
        }
    }


    /**
     * Starts the Upgrade Process
     * @returns {Void}
     */
    startUpgrade() {
        this.loading = 1;
        this.loaded  = this.getUpgradeTime();
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
     * @param {?Number} level
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
        this.number.innerHTML = this.level;
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
        this.loader.style.width = Utils.toPX(this.getLoad() * this.width);
    }

    /**
     * Returns true if there is a loading process active
     * @returns {Boolean}
     */
    isLoading() {
        return this.loading < this.loaded && this.loading > 0;
    }

    /**
     * Returns the Loading fraction
     * @returns {Number}
     */
    getLoad() {
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
        this.timer    = 3000 / this.speed;
        this.shooting = true;
    }

    /**
     * Ends the shooting timer
     * @returns {Void}
     */
    endShoot() {
        this.shooting = false;
        this.shootIt  = null;
    }

    /**
     * Returns true if the Tower is shooting
     * @returns {Boolean}
     */
    isShooting() {
        return !!this.shooting;
    }

    /**
     * Decreases the shooting timer
     * @param {Number} time
     * @returns {Void}
     */
    decTimer(time) {
        this.timer -= time;
        return this.timer <= 0;
    }

    /**
     * Returns the damage depending if is a bleed Tower or not
     * @returns {Number}
     */
    getDamage() {
        return this.bleeds ? 0 : this.getActualDamage();
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
     * Returns a list of targets. Extended by the Tower classes
     * @param {List.<Iterator>} mobs
     * @param {Mob}             mob
     * @returns {Array.<Array.<Mob>>}
     */
    getTargets(mobs, mob) {
        return [[mob]];
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
        const defense = this.getActualDamage() > mob.getDefense();
        const valid   = this.isValidTarget(mob);
        return defense && valid;
    }

    /**
     * Returns a list with the targets close enough to the given Mob
     * @param {Array.<Mob>} mobs
     * @param {Mob}         mob
     * @returns {Array.<Mob>}
     */
    getCloseTargets(mobs, mob) {
        let list = [];

        mobs.forEach((it) => {
            let nmob     = it.getPrev(),
                isClose  = this.isClose(nmob, mob),
                canShoot = this.canShoot(nmob);

            if (nmob.getHitPoints() > 0 && isClose && canShoot) {
                list.push(nmob);
            }
        });
        return list;
    }

    /**
     * Returns a list with the targets in the range of the tower
     * @param {Array.<Mob>} mobs
     * @returns {Array.<Mob>}
     */
    getRangeTargets(mobs) {
        let list = [];

        mobs.forEach((it) => {
            let mob      = it.getPrev(),
                inRange  = this.inRange(mob, 1),
                canShoot = this.canShoot(mob);

            if (mob.getHitPoints() > 0 && inRange && canShoot) {
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
        let yDis  = Math.abs(target.getPos().top  - mob.getPos().top),
            xDist = Math.abs(target.getPos().left - mob.getPos().left);

        return yDis < this.ammoRange && xDist < this.ammoRange;
    }

    /**
     * Returns true if the given mob is in the range of the tower
     * @param {Mob} mob
     * @param {Number} mult
     * @returns {Boolean}
     */
    inRange(mob, mult) {
        let mobPos = mob.getCenterPos(),
            yDis   = Math.abs(this.centerTop  - mobPos.top),
            xDist  = Math.abs(this.centerLeft - mobPos.left),
            range  = this.getRealRange() * mult;

        return yDis < range && xDist < range;
    }

    /**
     * Returns the angle between the tower and the given mob
     * @param {Mob} mob
     * @returns {Number}
     */
    getMobAngle(mob) {
        let mobPos = mob.getCenterPos(),
            xDist  = mobPos.left - this.centerLeft,
            yDist  = mobPos.top  - this.centerTop;

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
        this.locked = !this.locked;
        this.element.classList.toggle("locked");
    }

    /**
     * Returns true if the Tower is Locked
     * @returns {Boolean}
     */
    isLocked() {
        return this.locked;
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
            this.element.classList.remove(`towerRange${Math.floor(this.getActualRange(-1))}`);
            this.element.classList.add(`towerRange${Math.floor(this.getActualRange())}`);
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
     * Returns the Tower ID
     * @returns {Number}
     */
    getID() {
        return this.id;
    }

    /**
     * Returns the type of the Tower
     * @returns {String}
     */
    getType() {
        return this.type;
    }

    /**
     * Returns the current level of the Tower
     * @returns {Number}
     */
    getLevel() {
        return this.level;
    }

    /**
     * Returns the size of a side of the Tower as amount of cells
     * @returns {Number}
     */
    getSize() {
        return this.size;
    }

    /**
     * Returns the Row where the Tower is on the Board
     * @returns {Number}
     */
    getRow() {
        return this.row;
    }

    /**
     * Returns the Column where the Tower is on the Board
     * @returns {Number}
     */
    getCol() {
        return this.col;
    }

    /**
     * Returns the position at the center Tower
     * @returns {{top: Number, left: Number}}
     */
    getCenterPos() {
        return { top: this.centerTop, left: this.centerLeft };
    }

    /**
     * Returns the angle of the Tower Canon
     * @returns {Number}
     */
    getAngle() {
        return this.angle;
    }

    /**
     * If a tower can be destroyed, it returns true after all the ammos reached its target
     * @returns {Void}
     */
    canDestroy() {
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
     * @param {{boosts: Array.<Iterator>, towers: Array.<Iterator>, complete: Array.<Iterator>, reduced: Array.<Iterator>}} lists
     * @returns {Void}
     */
    setLists(lists) {
        this.lists = lists;
    }

    /**
     * Sets just one list of Iterators
     * @param {String}           name
     * @param {Array.<Iterator>} list
     * @returns {Void}
     */
    setList(name, list) {
        this.lists[name] = list;
    }

    /**
     * Returns those iterator lists lists
     * @returns {{boosts: Array.<Iterator>, towers: Array.<Iterator>, complete: Array.<Iterator>, reduced: Array.<Iterator>}}
     */
    getLists() {
        return this.lists;
    }


    /**
     * Returns true if the Tower can slow the targets
     * @returns {Boolean}
     */
    canSlow() {
        return !!this.slows;
    }

    /**
     * Returns true if the Tower can stun the targets
     * @returns {Boolean}
     */
    canStun() {
        return !!this.slows;
    }

    /**
     * Returns true if the Tower can make the targets bleed
     * @returns {Boolean}
     */
    canBleed() {
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
     * Returns the text for the Tower
     * @returns {String}
     */
    getText() {
        return this.text;
    }

    /**
     * Returns the name of the sound file used when shooting
     * @returns {String}
     */
    getSoundName() {
        return this.sound;
    }

    /**
     * Returns the price for the Tower, depending if is planning or playing
     * @param {Boolean} hasStarted
     * @returns {Number}
     */
    getPrice(hasStarted) {
        let cost = this.getActualCost();
        return hasStarted ? Math.floor(cost * 0.75) : cost;
    }

    /**
     * Returns the cost for the current level of the Tower
     * @returns {Number}
     */
    getActualCost() {
        return this.costs[this.level - 1];
    }

    /**
     * Returns the upgrade cost for the Tower
     * @returns {Number}
     */
    getUpgradeCost() {
        return this.costs[this.level] - this.costs[this.level - 1];
    }

    /**
     * Returns the damage for the current level of the Tower, including the Boosts
     * @returns {Number}
     */
    getActualDamage() {
        let value = this.damages[this.level - 1];
        return this.getBoostDamage(value);
    }

    /**
     * Returns the added damage for the next level of the Tower, including the Boosts
     * @returns {Number}
     */
    getUpgradeDamage() {
        let value = this.damages[this.level] - this.damages[this.level - 1];
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
     * Returns the current boost of the Tower
     * @returns {Number}
     */
    getBoost() {
        return this.boost;
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
     * @returns {Array.<Array.<Number>>}
     */
    getRangeMatrix() {
        return RangesData[this.getActualRange()];
    }

    /**
     * Returns the real range of the Tower with decimals if required
     * @returns {Number}
     */
    getRealRange() {
        return this.ranges[this.level - 1];
    }

    /**
     * Returns the added range after upgrading th Tower
     * @returns {Number}
     */
    getUpgradeRange() {
        return this.ranges[this.level] - this.ranges[this.level - 1];
    }


    /**
     * Returns the actual speed of the Ammo of the Tower
     * @returns {Number}
     */
    getActualSpeed() {
        return this.speeds[this.level - 1];
    }

    /**
     * Returns the added speed of the Ammo of the Tower after upgrading
     * @returns {Number}
     */
    getUpgradeSpeed() {
        let diff = this.speeds[this.level] - this.speeds[this.level - 1] !== 0;
        return diff ? this.speeds[this.level] : "";
    }

    /**
     * Returns the upgrade time
     * @returns {Number}
     */
    getUpgradeTime() {
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
    isMaxLevel() {
        return this.level === this.levels;
    }

    /**
     * Returns true if this is a Boost Tower
     * @returns {Boolean}
     */
    isBoost() {
        return this.boosts ? true : false;
    }

    /**
     * Returns true if this Tower can be locked
     * @returns {Boolean}
     */
    canLock() {
        return this.lock ? true : false;
    }

    /**
     * Returns true if this Tower can be fired
     * @returns {Boolean}
     */
    canFire() {
        return this.fire ? true : false;
    }



    /**
     * Creates a new Tower
     * @param {String} type
     * @param {...}    params
     * @returns {Tower}
     */
    static create(type, ...params) {
        let Tower = {
            Shoot      : ShootTower,
            Fast       : FastTower,
            Missile    : MissileTower,
            AntiAir    : AntiAirTower,
            Frost      : FrostTower,
            Earthquake : EarthquakeTower,
            Ink        : InkTower,
            Snap       : SnapTower,
            Laser      : LaserTower,
            Boost      : BoostTower
        };
        return new Tower[type](...params);
    }
}
