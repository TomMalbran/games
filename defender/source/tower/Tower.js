/**
 * @constructor
 * The Tower Base Class
 */
class Tower {
    
    /**
     * The Tower Base constructor
     * @param {number} id
     * @param {number} row
     * @param {number} col
     * @param {number} boardSize
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
     * @return {DOMElement}
     */
    createElement() {
        let content  = document.querySelector(".towersPanel .towerBuild[data-type='" + this.type + "']").parentNode.innerHTML;
        this.element = document.createElement("DIV");
        
        this.element.dataset.type   = "tower";
        this.element.dataset.id     = this.id;
        this.element.style.position = "absolute";
        this.element.style.top      = (this.row + this.size / 2) * this.boardSize + "px";
        this.element.style.left     = (this.col + this.size / 2) * this.boardSize + "px";
        
        this.element.innerHTML =
            "<div class='towerCenter" + this.size + " towerShadow'></div>" +
            "<div class='towerCenter" + this.size + " towerSelect'></div>" +
            "<div class='towerRange'></div>" +
            "<div class='towerPlaceholder" + this.size + "'>" + content + "</div>";
        
        this.element.querySelector(".towerBuild").classList.remove("selected");
	   	
        this.width    = this.size * this.boardSize - 10;
        this.loader   = this.element.querySelector(".towerLoader");
        this.rotate   = this.element.querySelector(".towerRotate" + this.size);
        this.shadow   = this.element.querySelector(".towerShadow");
        this.levelers = this.element.querySelectorAll(".towerLevels div");
        this.number   = this.element.querySelector(".towerNumber");
        this.setRangeClasses();
        
        return this.element;
    }
    
    
    /**
     * Adds or Removes the Boost percentage to the Tower
     * @param {number} amount
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
     */
    startUpgrade() {
        this.loading = 1;
        this.loaded  = this.getUpgradeTime();
        this.element.classList.add("loading");
        this.setLoadWidth();
    }
    
    /**
     * Ends the Upgrade Process
     */
    endUpgrade() {
        this.element.classList.remove("loading");
    }
    
    /**
     * Does the actual Tower Upgrade. If the level is given it sets that level
     * @param {?number} level
     */
    upgrade(level) {
        if (level) {
            this.level = level;
        } else {
            this.level += 1;
        }
        
        for (let i = 0; i < this.level; i += 1) {
            this.levelers[i].classList.remove("type" + (this.level - 1));
            this.levelers[i].classList.add("type"    + this.level);
        }
        this.number.innerHTML = this.level;
        this.setRangeClasses();
    }
    
    
    /**
     * Starts the Sale Process
     */
    startSale() {
        this.loading = 19;
        this.loaded  = 20;
        this.element.classList.add("loading");
        this.setLoadWidth();
    }
    
    /**
     * Destroys and Removes the current Tower
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
     */
    incLoader() {
        this.loading += 1;
        this.setLoadWidth();
    }
    
    /**
     * Decreases the Loader by 1 for the sale process
     */
    decLoader() {
        this.loading -= 1;
        this.setLoadWidth();
    }
    
    /**
     * Sets the load bar width
     */
    setLoadWidth() {
        this.loader.style.width = (this.getLoad() * this.width) + "px";
    }
    
    /**
     * Returns true if there is a loading process active
     * @return {boolean}
     */
    isLoading() {
        return this.loading < this.loaded && this.loading > 0;
    }
    
    /**
     * Returns the Loading fraction
     * @return {number}
     */
    getLoad() {
        return this.loading / this.loaded;
    }
    
    
    /**
     * Sets the Iterator that points to the shooting list
     * @param {Iterator} it
     */
    setShootIt(it) {
        this.shootIt = it;
    }
    
    /**
     * Starts the shooting timer
     */
    startShoot() {
        this.timer    = 3000 / this.speed;
        this.shooting = true;
    }
    
    /**
     * Ends the shooting timer
     */
    endShoot() {
        this.shooting = false;
        this.shootIt  = null;
    }
    
    /**
     * Returns true if the Tower is shooting
     * @return {boolean}
     */
    isShooting() {
        return !!this.shooting;
    }
    
    /**
     * Decreases the shooting timer
     * @param {number} time
     */
    decTimer(time) {
        this.timer -= time;
        return this.timer <= 0;
    }
    
    /**
     * Returns the damage depending if is a bleed Tower or not
     * @return {number}
     */
    getDamage() {
        return this.bleeds ? 0 : this.getActualDamage();
    }
    
    /**
     * Toggles a class on the tower element. Extended by the Tower classes
     * @param {number} amount
     */
    toggleAttack(amount) {
        return undefined;
    }
    
    /**
     * Returns a list of targets. Extended by the Tower classes
     * @param {List.<Iterator>} mobs
     * @param {Mob} mob
     * @return {Array.<Array.<Mob>>}
     */
    getTargets(mobs, mob) {
        return [[mob]];
    }
    
    /**
     * Returns true if the given Mob is a valid target. Extended by the Tower classes
     * @param {Mob} mob
     * @return {boolean}
     */
    isValidTarget(mob) {
        return true;
    }
    
    
    /**
     * Returns true if the Tower can shoot the given Mob
     * @param {Mob} mob
     * @return {boolean}
     */
    canShoot(mob) {
        let defense = this.getActualDamage() > mob.getDefense(),
            valid   = this.isValidTarget(mob);
        
        return defense && valid;
    }
    
    /**
     * Returns a list with the targets close enough to the given Mob
     * @param {Array.<Mob>} mobs
     * @param {Mob} mob
     * @return {Array.<Mob>}
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
     * @return {Array.<Mob>}
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
     * @return {boolean}
     */
    isClose(target, mob) {
        let yDis  = Math.abs(target.getPos().top  - mob.getPos().top),
            xDist = Math.abs(target.getPos().left - mob.getPos().left);
        
        return yDis < this.ammoRange && xDist < this.ammoRange;
    }
    
    /**
     * Returns true if the given mob is in the range of the tower
     * @param {Mob} mob
     * @param {number} mult
     * @return {boolean}
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
     * @return {number}
     */
    getMobAngle(mob) {
        let mobPos = mob.getCenterPos(),
            xDist  = mobPos.left - this.centerLeft,
            yDist  = mobPos.top  - this.centerTop;
        
        return Utils.calcAngle(xDist, yDist);
    }
    
    /**
     * Returns true if the given angles are close enought
     * @param {number} towerAngle
     * @param {number} mobAngle
     * @return {boolean}
     */
    validAngle(towerAngle, mobAngle) {
        return Math.abs(towerAngle - mobAngle) < 5;
    }
    
    
    /**
     * Locks/Unlocks the Tower
     */
    toggleLock() {
        this.locked = !this.locked;
        this.element.classList.toggle("locked");
    }
    
    /**
     * Returns true if the Tower is Locked
     * @return {boolean}
     */
    isLocked() {
        return this.locked;
    }
    
    
    /**
     * Selects/Unselects the Tower
     * @param {boolean} select
     */
    toggleSelect(select) {
        this.element.classList.toggle("selected", select);
    }
    
    /**
     * Sets the new Ranges classes of the Tower
     */
    setRangeClasses() {
        if (this.level === 1 || this.getActualRange() !== this.getActualRange(-1)) {
            this.element.classList.remove("towerRange" + Math.floor(this.getActualRange(-1)));
            this.element.classList.add("towerRange" + Math.floor(this.getActualRange()));
        }
    }
    
    /**
     * Sets and Rotates the Tower
     * @param {number} angle
     */
    rotateCanon(angle) {
        this.angle = angle;
        this.rotate.transform = "rotate(" + angle + "deg)";
    }
    
    
    /**
     * Returns the Tower ID
     * @return {number}
     */
    getID() {
        return this.id;
    }
    
    /**
     * Returns the type of the Tower
     * @return {string}
     */
    getType() {
        return this.type;
    }
    
    /**
     * Returns the current level of the Tower
     * @return {number}
     */
    getLevel() {
        return this.level;
    }
    
    /**
     * Returns the size of a side of the Tower as amount of cells
     * @return {number}
     */
    getSize() {
        return this.size;
    }
    
    /**
     * Returns the Row where the Tower is on the Board
     * @return {number}
     */
    getRow() {
        return this.row;
    }
    
    /**
     * Returns the Column where the Tower is on the Board
     * @return {number}
     */
    getCol() {
        return this.col;
    }
    
    /**
     * Returns the position at the center Tower
     * @return {{top: number, left: number}}
     */
    getCenterPos() {
        return { top: this.centerTop, left: this.centerLeft };
    }
    
    /**
     * Returns the angle of the Tower Canon
     * @return {number}
     */
    getAngle() {
        return this.angle;
    }
    
    /**
     * If a tower can be destroyed, it returns true after all the ammos reached its target
     */
    canDestroy() {
        return this.ammos <= 0;
    }
    
    /**
     * Increases the amount of ammos shooted by the tower
     * @param {number} amount
     */
    addAmmo(amount) {
        this.ammos += amount;
    }
    
    /**
     * Decreases by one the amount of ammos, once an ammo reached the target
     */
    decAmmo() {
        this.ammos -= 1;
    }
    
    
    /**
     * Sets the Iterator lists that points to different cells in the Ranges matrixs
     * @param {{boosts: Array.<Iterator>, towers: Array.<Iterator>, complete: Array.<Iterator>, reduced: Array.<Iterator>}} lists
     */
    setLists(lists) {
        this.lists = lists;
    }
    
    /**
     * Sets just one list of Iterators
     * @param {string} name
     * @param {Array.<Iterator>} list
     */
    setList(name, list) {
        this.lists[name] = list;
    }
    
    /**
     * Returns those iterator lists lists
     * @return {{boosts: Array.<Iterator>, towers: Array.<Iterator>, complete: Array.<Iterator>, reduced: Array.<Iterator>}}
     */
    getLists() {
        return this.lists;
    }
    
    
    /**
     * Returns true if the Tower can slow the targets
     * @return {boolean}
     */
    canSlow() {
        return !!this.slows;
    }
    
    /**
     * Returns true if the Tower can stun the targets
     * @return {boolean}
     */
    canStun() {
        return !!this.slows;
    }
    
    /**
     * Returns true if the Tower can make the targets bleed
     * @return {boolean}
     */
    canBleed() {
        return !!this.bleeds;
    }
    
    /**
     * Returns the Tower name. Using the special name if required
     * @param {boolean} preview  If not true, the level will be added to the name
     * @return {string}
     */
    getName(preview) {
        return this.level === 6 ? this.special : this.name + " " + (!preview ? this.level : "");
    }
    
    /**
     * Returns the text for the Tower
     * @return {string}
     */
    getText() {
        return this.text;
    }
    
    /**
     * Returns the name of the sound file used when shooting
     * @return {string}
     */
    getSoundName() {
        return this.sound;
    }
    
    /**
     * Returns the price for the Tower, depending if is planning or playing
     * @param {boolean} hasStarted
     * @return {number}
     */
    getPrice(hasStarted) {
        let cost = this.getActualCost();
        return hasStarted ? Math.floor(cost * 0.75) : cost;
    }
    
    /**
     * Returns the cost for the current level of the Tower
     * @return {number}
     */
    getActualCost() {
        return this.costs[this.level - 1];
    }
    
    /**
     * Returns the upgrade cost for the Tower
     * @return {number}
     */
    getUpgradeCost() {
        return this.costs[this.level] - this.costs[this.level - 1];
    }
    
    /**
     * Returns the damage for the current level of the Tower, including the Boosts
     * @return {number}
     */
    getActualDamage() {
        let value = this.damages[this.level - 1];
        return this.getBoostDamage(value);
    }
    
    /**
     * Returns the added damage for the next level of the Tower, including the Boosts
     * @return {number}
     */
    getUpgradeDamage() {
        let value = this.damages[this.level] - this.damages[this.level - 1];
        return this.getBoostDamage(value);
    }
    
    /**
     * Multiplies the damage with the boost for the Tower
     * @param {number} value
     * @return {number}
     */
    getBoostDamage(value) {
        return Math.round(value * (this.boost ? this.boost / 100 + 1 : 1));
    }
    
    /**
     * Returns the current boost of the Tower
     * @return {number}
     */
    getBoost() {
        return this.boost;
    }
    
    
    /**
     * Returns the range of the tower, or the one of a different level
     * @param {number} add
     * @return {number}
     */
    getActualRange(add) {
        return Math.floor(this.ranges[this.level - 1 + (add || 0)]);
    }
    
    /**
     * Returns the matrix that corresponds to the range of the Tower
     * @return {Array.<Array.<number>>}
     */
    getRangeMatrix() {
        return RangesData[this.getActualRange()];
    }
    
    /**
     * Returns the real range of the Tower with decimals if required
     * @return {number}
     */
    getRealRange() {
        return this.ranges[this.level - 1];
    }
    
    /**
     * Returns the added range after upgrading th Tower
     * @return {number}
     */
    getUpgradeRange() {
        return this.ranges[this.level] - this.ranges[this.level - 1];
    }
    
    
    /**
     * Returns the actual speed of the Ammo of the Tower
     * @return {number}
     */
    getActualSpeed() {
        return this.speeds[this.level - 1];
    }
    
    /**
     * Returns the added speed of the Ammo of the Tower after upgrading
     * @return {number}
     */
    getUpgradeSpeed() {
        let diff = this.speeds[this.level] - this.speeds[this.level - 1] !== 0;
        return diff ? this.speeds[this.level] : "";
    }
    
    /**
     * Returns the upgrade time
     * @return {number}
     */
    getUpgradeTime() {
        return this.level * 30;
    }
    
    
    /**
     * Returns the center of the Tower
     * @param {number} cell
     * @return {number}
     */
    getTowerCenter(cell) {
        return (cell + this.size / 2) * this.boardSize;
    }
    
    
    /**
     * Returns true if the Tower reached the maximum level
     * @return {boolean}
     */
    isMaxLevel() {
        return this.level === this.levels;
    }
    
    /**
     * Returns true if this is a Boost Tower
     * @return {boolean}
     */
    isBoost() {
        return this.boosts ? true : false;
    }
    
    /**
     * Returns true if this Tower can be locked
     * @return {boolean}
     */
    canLock() {
        return this.lock ? true : false;
    }
    
    /**
     * Returns true if this Tower can be fired
     * @return {boolean}
     */
    canFire() {
        return this.fire ? true : false;
    }
    
    
    
    /**
     * Creates a new Tower
     * @param {string} type
     * @param {...}    params
     * @return {Tower}
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
