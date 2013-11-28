/*jslint browser: true */
/*global Utils */

var Tower = (function () {
    "use strict";
    
    var ranges = {
        30: [
            [ 1, 1, 1, 1 ],
            [ 1, 1, 1, 1 ],
            [ 1, 1, 1, 1 ],
            [ 1, 1, 1, 1 ]
        ],
        45: [
            [ 0, 1, 1, 1, 1, 0 ],
            [ 1, 1, 1, 1, 1, 1 ],
            [ 1, 1, 1, 1, 1, 1 ],
            [ 1, 1, 1, 1, 1, 1 ],
            [ 1, 1, 1, 1, 1, 1 ],
            [ 0, 1, 1, 1, 1, 0 ]
        ],
        60: [
            [ 0, 0, 1, 1, 1, 1, 0, 0 ],
            [ 0, 1, 1, 1, 1, 1, 1, 0 ],
            [ 1, 1, 1, 1, 1, 1, 1, 1 ],
            [ 1, 1, 1, 1, 1, 1, 1, 1 ],
            [ 1, 1, 1, 1, 1, 1, 1, 1 ],
            [ 1, 1, 1, 1, 1, 1, 1, 1 ],
            [ 0, 1, 1, 1, 1, 1, 1, 0 ],
            [ 0, 0, 1, 1, 1, 1, 0, 0 ]
        ],
        75: [
            [ 0, 0, 0, 1, 1, 1, 1, 0, 0, 0 ],
            [ 0, 0, 1, 1, 1, 1, 1, 1, 0, 0 ],
            [ 0, 1, 1, 1, 1, 1, 1, 1, 1, 0 ],
            [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1 ],
            [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1 ],
            [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1 ],
            [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1 ],
            [ 0, 1, 1, 1, 1, 1, 1, 1, 1, 0 ],
            [ 0, 0, 1, 1, 1, 1, 1, 1, 0, 0 ],
            [ 0, 0, 0, 1, 1, 1, 1, 0, 0, 0 ]
        ],
        90: [
            [ 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0 ],
            [ 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0 ],
            [ 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0 ],
            [ 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0 ],
            [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1 ],
            [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1 ],
            [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1 ],
            [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1 ],
            [ 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0 ],
            [ 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0 ],
            [ 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0 ],
            [ 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0 ]
        ],
        105: [
            [ 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0 ],
            [ 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0 ],
            [ 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0 ],
            [ 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0 ],
            [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1 ],
            [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1 ],
            [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1 ],
            [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1 ],
            [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1 ],
            [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1 ],
            [ 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0 ],
            [ 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0 ],
            [ 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0 ],
            [ 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0 ]
        ],
        112: [
            [ 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0 ],
            [ 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0 ],
            [ 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0 ],
            [ 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0 ],
            [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1 ],
            [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1 ],
            [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1 ],
            [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1 ],
            [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1 ],
            [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1 ],
            [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1 ],
            [ 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0 ],
            [ 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0 ],
            [ 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0 ],
            [ 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0 ]
        ],
        120: [
            [ 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0 ],
            [ 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0 ],
            [ 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0 ],
            [ 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0 ],
            [ 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0 ],
            [ 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0 ],
            [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1 ],
            [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1 ],
            [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1 ],
            [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1 ],
            [ 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0 ],
            [ 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0 ],
            [ 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0 ],
            [ 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0 ],
            [ 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0 ],
            [ 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0 ]
        ],
        135: [
            [ 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0 ],
            [ 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0 ],
            [ 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0 ],
            [ 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0 ],
            [ 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0 ],
            [ 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0 ],
            [ 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0 ],
            [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1 ],
            [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1 ],
            [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1 ],
            [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1 ],
            [ 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0 ],
            [ 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0 ],
            [ 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0 ],
            [ 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0 ],
            [ 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0 ],
            [ 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0 ],
            [ 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0 ]
        ],
        150: [
            [ 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0 ],
            [ 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0 ],
            [ 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0 ],
            [ 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0 ],
            [ 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0 ],
            [ 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0 ],
            [ 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0 ],
            [ 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0 ],
            [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1 ],
            [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1 ],
            [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1 ],
            [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1 ],
            [ 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0 ],
            [ 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0 ],
            [ 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0 ],
            [ 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0 ],
            [ 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0 ],
            [ 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0 ],
            [ 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0 ],
            [ 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0 ]
        ]
    };
    
    
    
    /**
     * @private
     * @constructor
     * The Tower Base Class
     */
    function Tower() {
        return undefined;
    }
    
    /**
     * Initializes the Tower
     * @param {number} id
     * @param {number} row
     * @param {number} col
     * @param {number} boardSize
     */
    Tower.prototype.init = function (id, row, col, boardSize) {
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
    };
    
    /**
     * Creates the Tower element and returns it
     * @return {DOMElement}
     */
    Tower.prototype.createElement = function () {
        var content  = document.querySelector(".towersPanel .towerBuild[data-type='" + this.type + "']").parentNode.innerHTML;
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
	};
    
    
    /**
     * Adds or Removes the Boost percentage to the Tower
     * @param {number} amount
     */
    Tower.prototype.addBoost = function (amount) {
        this.boost += amount;
        if (this.boost > 0) {
            this.shadow.classList.add("withBoost");
        } else {
            this.shadow.classList.remove("withBoost");
        }
    };
    
    
    /**
     * Starts the Upgrade Process
     */
    Tower.prototype.startUpgrade = function () {
        this.loading = 1;
        this.loaded  = this.getUpgradeTime();
        this.element.classList.add("loading");
        this.setLoadWidth();
    };
    
    /**
     * Ends the Upgrade Process
     */
    Tower.prototype.endUpgrade = function () {
        this.element.classList.remove("loading");
    };
    
    /**
     * Does the actual Tower Upgrade. If the level is given it sets that level
     * @param {?number} level
     */
    Tower.prototype.upgrade = function (level) {
        var i;
        if (level) {
            this.level = level;
        } else {
            this.level += 1;
        }
        
        for (i = 0; i < this.level; i += 1) {
            this.levelers[i].classList.remove("type" + (this.level - 1));
            this.levelers[i].classList.add("type"    + this.level);
        }
        this.number.innerHTML = this.level;
        this.setRangeClasses();
    };
    
    
    /**
     * Starts the Sale Process
     */
    Tower.prototype.startSale = function () {
        this.loading = 19;
        this.loaded  = 20;
        this.element.classList.add("loading");
        this.setLoadWidth();
    };
    
    /**
     * Destroys and Removes the current Tower
     */
    Tower.prototype.destroy = function () {
        if (this.shootIt) {
            this.shootIt.removePrev();
        }
        if (this.element) {
            Utils.removeElement(this.element);
        }
    };
    
    
    /**
     * Increases the Loader by 1 for the upgrade process
     */
    Tower.prototype.incLoader = function () {
        this.loading += 1;
        this.setLoadWidth();
    };
    
    /**
     * Decreases the Loader by 1 for the sale process
     */
    Tower.prototype.decLoader = function () {
        this.loading -= 1;
        this.setLoadWidth();
    };
    
    /**
     * Sets the load bar width
     */
    Tower.prototype.setLoadWidth = function () {
        this.loader.style.width = (this.getLoad() * this.width) + "px";
    };
    
    /**
     * Returns true if there is a loading process active
     * @return {boolean}
     */
    Tower.prototype.isLoading = function () {
        return this.loading < this.loaded && this.loading > 0;
    };
    
    /**
     * Returns the Loading fraction
     * @return {number}
     */
    Tower.prototype.getLoad = function () {
        return this.loading / this.loaded;
    };
    
    
    /**
     * Sets the Iterator that points to the shooting list
     * @param {Iterator} it
     */
    Tower.prototype.setShootIt = function (it) {
        this.shootIt = it;
    };
    
    /**
     * Starts the shooting timer
     */
    Tower.prototype.startShoot = function () {
        this.timer    = 3000 / this.speed;
        this.shooting = true;
    };
    
    /**
     * Ends the shooting timer
     */
    Tower.prototype.endShoot = function () {
        this.shooting = false;
        this.shootIt  = null;
    };
    
    /**
     * Returns true if the Tower is shooting
     * @return {boolean}
     */
    Tower.prototype.isShooting = function () {
        return !!this.shooting;
    };
    
    /**
     * Decreases the shooting timer
     * @param {number} time
     */
    Tower.prototype.decTimer = function (time) {
        this.timer -= time;
        return this.timer <= 0;
    };
    
    /**
     * Returns the damage depending if is a bleed Tower or not
     * @return {number}
     */
    Tower.prototype.getDamage = function () {
        return this.bleeds ? 0 : this.getActualDamage();
    };
    
    /**
     * Toggles a class on the tower element. Extended by the Tower classes
     * @param {number} amount
     */
    Tower.prototype.toggleAttack = function (amount) {
        return undefined;
    };
    
    /**
     * Returns a list of targets. Extended by the Tower classes
     * @param {List.<Iterator>} mobs
     * @param {Mob} mob
     * @return {Array.<Array.<Mob>>}
     */
    Tower.prototype.getTargets = function (mobs, mob) {
        return [[mob]];
    };
    
    /**
     * Returns true if the given Mob is a valid target. Extended by the Tower classes
     * @param {Mob} mob
     * @return {boolean}
     */
    Tower.prototype.isValidTarget = function (mob) {
        return true;
    };
    
    
    /**
     * Returns true if the Tower can shoot the given Mob
     * @param {Mob} mob
     * @return {boolean}
     */
    Tower.prototype.canShoot = function (mob) {
        var defense = this.getActualDamage() > mob.getDefense(),
            valid   = this.isValidTarget(mob);
        
        return defense && valid;
    };
    
    /**
     * Returns a list with the targets close enough to the given Mob
     * @param {Array.<Mob>} mobs
     * @param {Mob} mob
     * @return {Array.<Mob>}
     */
    Tower.prototype.getCloseTargets = function (mobs, mob) {
        var list = [],
            self = this;
        
        mobs.forEach(function (it) {
            var nmob     = it.getPrev(),
                isClose  = self.isClose(nmob, mob),
                canShoot = self.canShoot(nmob);
            
            if (nmob.getHitPoints() > 0 && isClose && canShoot) {
                list.push(nmob);
            }
        });
        return list;
    };
    
    /**
     * Returns a list with the targets in the range of the tower
     * @param {Array.<Mob>} mobs
     * @return {Array.<Mob>}
     */
    Tower.prototype.getRangeTargets = function (mobs) {
        var list = [],
            self = this;
        
        mobs.forEach(function (it) {
            var mob      = it.getPrev(),
                inRange  = self.inRange(mob, 1),
                canShoot = self.canShoot(mob);
            
            if (mob.getHitPoints() > 0 && inRange && canShoot) {
                list.push(mob);
            }
        });
        return list;
    };
    
    /**
     * Returns a list with the targets in the same line as the position of the tower canon
     * @param {Array.<Mob>} mobs
     * @param {number} angle
     * @return {Array.<Mob>}
     */
    Tower.prototype.getLinealTargets = function (mobs, angle) {
        var list = [],
            self = this;
        
        mobs.forEach(function (it) {
            var mob        = it.getPrev(),
                inRange    = self.inRange(mob, 3),
                validAngle = self.validAngle(angle, self.getMobAngle(mob));
            
            if (mob.getHitPoints() > 0 && inRange && validAngle) {
                list.push(mob);
            }
        });
        return list;
    };
    
    /**
     * Returns true if two mobs are close enought, according to the range of the ammo
     * @param {Mob} target
     * @param {Mob} mob
     * @return {boolean}
     */
    Tower.prototype.isClose = function (target, mob) {
        var yDis  = Math.abs(target.getPos().top  - mob.getPos().top),
            xDist = Math.abs(target.getPos().left - mob.getPos().left);
        
        return yDis < this.ammoRange && xDist < this.ammoRange;
    };
    
    /**
     * Returns true if the given mob is in the range of the tower
     * @param {Mob} mob
     * @param {number} mult
     * @return {boolean}
     */
    Tower.prototype.inRange = function (mob, mult) {
        var mobPos = mob.getCenterPos(),
            yDis   = Math.abs(this.centerTop  - mobPos.top),
            xDist  = Math.abs(this.centerLeft - mobPos.left),
            range  = this.getRealRange() * mult;
        
        return yDis < range && xDist < range;
    };
    
    /**
     * Returns the angle between the tower and the given mob
     * @param {Mob} mob
     * @return {number}
     */
    Tower.prototype.getMobAngle = function (mob) {
        var mobPos = mob.getCenterPos(),
            xDist  = mobPos.left - this.centerLeft,
            yDist  = mobPos.top  - this.centerTop;
        
        return Utils.calcAngle(xDist, yDist);
    };
    
    /**
     * Returns true if the given angles are close enought
     * @param {number} towerAngle
     * @param {number} mobAngle
     * @return {boolean}
     */
    Tower.prototype.validAngle = function (towerAngle, mobAngle) {
        return Math.abs(towerAngle - mobAngle) < 5;
    };
    
    
    /**
     * Locks/Unlocks the Tower
     */
    Tower.prototype.toggleLock = function () {
        this.locked = !this.locked;
        this.element.classList.toggle("locked");
    };
    
    /**
     * Returns true if the Tower is Locked
     * @return {boolean}
     */
    Tower.prototype.isLocked = function () {
        return this.locked;
    };
    
    
    /**
     * Selects/Unselects the Tower
     * @param {boolean} select
     */
    Tower.prototype.toggleSelect = function (select) {
        this.element.classList.toggle("selected", select);
    };
    
    /**
     * Sets the new Ranges classes of the Tower
     */
    Tower.prototype.setRangeClasses = function () {
        if (this.level === 1 || this.getActualRange() !== this.getActualRange(-1)) {
            this.element.classList.remove("towerRange" + Math.floor(this.getActualRange(-1)));
            this.element.classList.add("towerRange" + Math.floor(this.getActualRange()));
        }
    };
    
    /**
     * Sets and Rotates the Tower
     * @param {number} angle 
     */
    Tower.prototype.rotateCanon = function (angle) {
        this.angle = angle;
        Utils.setTransform(this.rotate, "rotate(" + angle + "deg)");
    };
    
    
    /**
     * Returns the Tower ID
     * @return {number}
     */
    Tower.prototype.getID = function () {
        return this.id;
    };
    
    /**
     * Returns the type of the Tower
     * @return {string}
     */
    Tower.prototype.getType = function () {
        return this.type;
    };
    
    /**
     * Returns the current level of the Tower
     * @return {number}
     */
    Tower.prototype.getLevel = function () {
        return this.level;
    };
    
    /**
     * Returns the size of a side of the Tower as amount of cells
     * @return {number}
     */
    Tower.prototype.getSize = function () {
        return this.size;
    };
    
    /**
     * Returns the Row where the Tower is on the Board
     * @return {number}
     */
    Tower.prototype.getRow = function () {
        return this.row;
    };
    
    /**
     * Returns the Column where the Tower is on the Board
     * @return {number}
     */
    Tower.prototype.getCol = function () {
        return this.col;
    };
    
    /**
     * Returns the position at the center Tower
     * @return {{top: number, left: number}}
     */
    Tower.prototype.getCenterPos = function () {
        return { top: this.centerTop, left: this.centerLeft };
    };
    
    /**
     * Returns the angle of the Tower Canon
     * @return {number}
     */
    Tower.prototype.getAngle = function () {
        return this.angle;
    };
    
    /**
     * If a tower can be destroyed, it returns true after all the ammos reached its target
     */
    Tower.prototype.canDestroy = function () {
        return this.ammos <= 0;
    };
    
    /**
     * Increases the amount of ammos shooted by the tower
     * @param {number} amount
     */
    Tower.prototype.addAmmo = function (amount) {
        this.ammos += amount;
    };
    
    /**
     * Decreases by one the amount of ammos, once an ammo reached the target
     */
    Tower.prototype.decAmmo = function () {
        this.ammos -= 1;
    };
    
    
    /**
     * Sets the Iterator lists that points to different cells in the Ranges matrixs
     * @param {{boosts: Array.<Iterator>, towers: Array.<Iterator>, complete: Array.<Iterator>, reduced: Array.<Iterator>}} lists
     */
    Tower.prototype.setLists = function (lists) {
        this.lists = lists;
    };
    
    /**
     * Sets just one list of Iterators
     * @param {string} name
     * @param {Array.<Iterator>} list
     */
    Tower.prototype.setList = function (name, list) {
        this.lists[name] = list;
    };
    
    /**
     * Returns those iterator lists lists
     * @return {{boosts: Array.<Iterator>, towers: Array.<Iterator>, complete: Array.<Iterator>, reduced: Array.<Iterator>}}
     */
    Tower.prototype.getLists = function () {
        return this.lists;
    };
    
    
    /**
     * Returns true if the Tower can slow the targets
     * @return {boolean}
     */
    Tower.prototype.canSlow = function () {
        return !!this.slows;
    };
    
    /**
     * Returns true if the Tower can stun the targets
     * @return {boolean}
     */
    Tower.prototype.canStun = function () {
        return !!this.slows;
    };
    
    /**
     * Returns true if the Tower can make the targets bleed
     * @return {boolean}
     */
    Tower.prototype.canBleed = function () {
        return !!this.bleeds;
    };
    
    /**
     * Returns the Tower name. Using the special name if required
     * @param {boolean} preview  If not true, the level will be added to the name
     * @return {string}
     */
    Tower.prototype.getName = function (preview) {
        return this.level === 6 ? this.special : this.name + " " + (!preview ? this.level : "");
    };
    
    /**
     * Returns the text for the Tower
     * @return {string}
     */
    Tower.prototype.getText = function () {
        return this.text;
    };
    
    /**
     * Returns the name of the sound file used when shooting
     * @return {string}
     */
    Tower.prototype.getSoundName = function () {
        return this.sound;
    };
    
    /**
     * Returns the price for the Tower, depending if is planning or playing
     * @param {boolean} hasStarted
     * @return {number}
     */
    Tower.prototype.getPrice = function (hasStarted) {
        var cost = this.getActualCost();
        return hasStarted ? Math.floor(cost * 0.75) : cost;
    };
    
    /**
     * Returns the cost for the current level of the Tower
     * @return {number}
     */
    Tower.prototype.getActualCost = function () {
        return this.costs[this.level - 1];
    };
    
    /**
     * Returns the upgrade cost for the Tower
     * @return {number}
     */
    Tower.prototype.getUpgradeCost = function () {
        return this.costs[this.level] - this.costs[this.level - 1];
    };
    
    /**
     * Returns the damage for the current level of the Tower, including the Boosts
     * @return {number}
     */
    Tower.prototype.getActualDamage = function () {
        var value = this.damages[this.level - 1];
        return this.getBoostDamage(value);
    };
    
    /**
     * Returns the added damage for the next level of the Tower, including the Boosts
     * @return {number}
     */
    Tower.prototype.getUpgradeDamage = function () {
        var value = this.damages[this.level] - this.damages[this.level - 1];
        return this.getBoostDamage(value);
    };
    
    /**
     * Multiplies the damage with the boost for the Tower
     * @param {number} value
     * @return {number}
     */
    Tower.prototype.getBoostDamage = function (value) {
        return Math.round(value * (this.boost ? this.boost / 100 + 1 : 1));
    };
    
    /**
     * Returns the current boost of the Tower
     * @return {number}
     */
    Tower.prototype.getBoost = function () {
        return this.boost;
    };
    
    
    /**
     * Returns the range of the tower, or the one of a different level
     * @param {number} add
     * @return {number}
     */
    Tower.prototype.getActualRange = function (add) {
        return Math.floor(this.ranges[this.level - 1 + (add || 0)]);
    };
    
    /**
     * Returns the matrix that corresponds to the range of the Tower
     * @return {Array.<Array.<number>>}
     */
    Tower.prototype.getRangeMatrix = function () {
        return ranges[this.getActualRange()];
    };
    
    /**
     * Returns the real range of the Tower with decimals if required
     * @return {number}
     */
    Tower.prototype.getRealRange = function () {
        return this.ranges[this.level - 1];
    };
    
    /**
     * Returns the added range after upgrading th Tower
     * @return {number}
     */
    Tower.prototype.getUpgradeRange = function () {
        return this.ranges[this.level] - this.ranges[this.level - 1];
    };
    
    
    /**
     * Returns the actual speed of the Ammo of the Tower
     * @return {number}
     */
    Tower.prototype.getActualSpeed = function () {
        return this.speeds[this.level - 1];
    };
    
    /**
     * Returns the added speed of the Ammo of the Tower after upgrading
     * @return {number}
     */
    Tower.prototype.getUpgradeSpeed = function () {
        var diff = this.speeds[this.level] - this.speeds[this.level - 1] !== 0;
        return diff ? this.speeds[this.level] : "";
    };
    
    /**
     * Returns the upgrade time
     * @return {number}
     */
    Tower.prototype.getUpgradeTime = function () {
        return this.level * 30;
    };
    
    
    /**
     * Returns the center of the Tower
     * @param {number} cell
     * @return {number}
     */
    Tower.prototype.getTowerCenter = function (cell) {
        return (cell + this.size / 2) * this.boardSize;
    };
    
    
    /**
     * Returns true if the Tower reached the maximum level
     * @return {boolean}
     */
    Tower.prototype.isMaxLevel = function () {
        return this.level === this.levels;
    };
    
    /**
     * Returns true if this is a Boost Tower
     * @return {boolean}
     */
    Tower.prototype.isBoost = function () {
        return this.boosts ? true : false;
    };
    
    /**
     * Returns true if this Tower can be locked
     * @return {boolean}
     */
    Tower.prototype.canLock = function () {
        return this.lock ? true : false;
    };
    
    /**
     * Returns true if this Tower can be fired
     * @return {boolean}
     */
    Tower.prototype.canFire = function () {
        return this.fire ? true : false;
    };
    
    
    
    /**
     * @constructor
     * @extends {Tower}
     * The Shoot Tower Class
     * @param {number} id
     * @param {number} row
     * @param {number} col
     * @param {number} boardSize
     */
    function ShootTower(id, row, col, boardSize) {
        this.type      = "Shoot";
        this.name      = "Shoot Tower";
        this.special   = "Sniper Tower";
        this.text      = "A cheap shooting tower.";
        this.levels    = 6;
        this.size      = 2;
        this.sound     = "shoot";
        
        this.costs     = [   5,  10,  20,  40,  80, 200 ];
        this.damages   = [  10,  20,  40,  80, 160, 400 ];
        this.ranges    = [  60,  60,  60,  60,  60, 150 ];
        this.speeds    = [ 1.5, 1.5, 1.5, 1.5, 1.5, 1.1 ];
        
        this.init(id, row, col, boardSize);
    }
    
    ShootTower.prototype = Object.create(Tower.prototype);
    ShootTower.prototype.constructor = ShootTower;
    ShootTower.prototype.parentClass = Tower.prototype;
    
    
    
    /**
     * @constructor
     * @extends {Tower}
     * The Fast Tower Class
     * @param {number} id
     * @param {number} row
     * @param {number} col
     * @param {number} boardSize
     */
    function FastTower(id, row, col, boardSize) {
        this.type      = "Fast";
        this.name      = "Fast Tower";
        this.special   = "Typhoon Tower";
        this.text      = "A tower that shoots at a really fast speed.";
        this.levels    = 6;
        this.size      = 2;
        this.sound     = "fast";
    
        this.costs     = [ 15, 27, 50, 85, 160, 450 ];
        this.damages   = [  5, 10, 18, 34,  65, 320 ];
        this.ranges    = [ 60, 60, 60, 60,  60,  90 ];
        this.speeds    = [  6,  6,  6,  6,   6,   9 ];
        
        this.init(id, row, col, boardSize);
    }
    
    FastTower.prototype = Object.create(Tower.prototype);
    FastTower.prototype.constructor = FastTower;
    FastTower.prototype.parentClass = Tower.prototype;
    
    
    
    /**
     * @constructor
     * @extends {Tower}
     * The Missile Tower Class
     * @param {number} id
     * @param {number} row
     * @param {number} col
     * @param {number} boardSize
     */
    function MissileTower(id, row, col, boardSize) {
        this.type      = "Missile";
        this.name      = "Missile Tower";
        this.special   = "Dart Tower";
        this.text      = "Does great damage at a low speed. Ground only.";
        this.levels    = 6;
        this.size      = 2;
        this.sound     = "missile";
        
        this.costs     = [ 20,  35,  70, 130, 240, 400 ];
        this.damages   = [  8,  16,  32,  64, 128, 256 ];
        this.ranges    = [ 90,  90, 105, 120, 135, 150 ];
        this.speeds    = [  1,   1,   1,   1,   1,   1 ];
        this.ammoRange = 15;
        
        this.init(id, row, col, boardSize);
    }
    
    MissileTower.prototype = Object.create(Tower.prototype);
    MissileTower.prototype.constructor = MissileTower;
    MissileTower.prototype.parentClass = Tower.prototype;
    
    /**
     * Returns a list of Mobs close to the given one
     * @param {List.<Iterator>} mobs
     * @param {Mob} mob
     * @return {Array.<Array.<Mob>>}
     */
    MissileTower.prototype.getTargets = function (mobs, mob) {
        return [this.getCloseTargets(mobs, mob)];
    };
    
    /**
     * Toggles the attacking class
     * @param {number} amount
     */
    MissileTower.prototype.toggleAttack = function (amount) {
        this.element.classList.toggle("attacking");
    };
    
    /**
     * Returns true if the given Mob is a valid target
     * @param {Mob} mob
     * @return {boolean}
     */
    MissileTower.prototype.isValidTarget = function (mob) {
        return !mob.isFlyer();
    };
    
    
    
    /**
     * @constructor
     * @extends {Tower}
     * The Anti-Air Tower Class
     * @param {number} id
     * @param {number} row
     * @param {number} col
     * @param {number} boardSize
     */
    function AntiAirTower(id, row, col, boardSize) {
        this.type      = "AntiAir";
        this.name      = "Anti-Air Tower";
        this.special   = "Storm Tower";
        this.text      = "Hits the flyer mobs only at a great speed.";
        this.levels    = 6;
        this.size      = 2;
        this.sound     = "antiair";
        
        this.costs     = [ 50, 80, 120, 195, 320, 630 ];
        this.damages   = [ 20, 40,  80, 160, 320, 480 ];
        this.ranges    = [ 60, 60,  60,  60,  60,  75 ];
        this.speeds    = [  4,  4,   4,   4,   4,   6 ];
        this.ammoRange = 30;
        
        this.init(id, row, col, boardSize);
    }
    
    AntiAirTower.prototype = Object.create(Tower.prototype);
    AntiAirTower.prototype.constructor = AntiAirTower;
    AntiAirTower.prototype.parentClass = Tower.prototype;
    
    /**
     * Returns a list of Mobs close to the given one. Maximum of 4
     * @param {List.<Iterator>} mobs
     * @param {Mob} mob
     * @return {Array.<Array.<Mob>>}
     */
    AntiAirTower.prototype.getTargets = function (mobs, mob) {
        var targets = this.getCloseTargets(mobs, mob),
            total   = Math.min(targets.length, 4),
            result  = [],
            i;
        
        for (i = 0; i < total; i += 1) {
            result.push([targets[i]]);
        }
        return result;
    };
    
    /**
     * Toggles the attacking class
     * @param {number} amount
     */
    AntiAirTower.prototype.toggleAttack = function (amount) {
        var i;
        for (i = 1; i <= amount; i += 1) {
            this.toggleMissile(i);
        }
    };
    
    /**
     * Toggles the attacking class for a single Missile
     * @param {number} amount
     */
    AntiAirTower.prototype.toggleMissile = function (index) {
        this.element.classList.toggle("missile" + index);
    };
    
    /**
     * Returns true if the given Mob is a valid target
     * @param {Mob} mob
     * @return {boolean}
     */
    AntiAirTower.prototype.isValidTarget = function (mob) {
        return mob.isFlyer();
    };
    
    
    
    /**
     * @constructor
     * @extends {Tower}
     * The Frost Tower Class
     * @param {number} id
     * @param {number} row
     * @param {number} col
     * @param {number} boardSize
     */
    function FrostTower(id, row, col, boardSize) {
        this.type      = "Frost";
        this.name      = "Frost Tower";
        this.special   = "Blizzard Tower";
        this.text      = "Hits and slow the mobs for some time.";
        this.levels    = 6;
        this.size      = 2;
        this.sound     = "frost";
        this.slows     = true;
        
        this.costs     = [  50,  75, 100, 125, 150, 200 ];
        this.damages   = [  10,  15,  20,  25,  30,  40 ];
        this.ranges    = [  60,  60,  60,  60,  60,  75 ];
        this.speeds    = [ 1.5, 1.5, 1.5, 1.5, 1.5, 1.5 ];
        this.ammoRange = 20;
        
        this.init(id, row, col, boardSize);
    }
    
    FrostTower.prototype = Object.create(Tower.prototype);
    FrostTower.prototype.constructor = FrostTower;
    FrostTower.prototype.parentClass = Tower.prototype;
    
    /**
     * Returns a list of Mobs close to the given one
     * @param {List.<Iterator>} mobs
     * @param {Mob} mob
     * @return {Array.<Array.<Mob>>}
     */
    FrostTower.prototype.getTargets = function (mobs, mob) {
        return [this.getCloseTargets(mobs, mob)];
    };
    
    /**
     * Returns true if the given Mob is a valid target
     * @param {Mob} mob
     * @return {boolean}
     */
    FrostTower.prototype.isValidTarget = function (mob) {
        return !mob.isInmune();
    };
    
    
    
    /**
     * @constructor
     * @extends {Tower}
     * The Earthquake Tower Class
     * @param {number} id
     * @param {number} row
     * @param {number} col
     * @param {number} boardSize
     */
    function EarthquakeTower(id, row, col, boardSize) {
        this.type      = "Earthquake";
        this.name      = "Earthquake Tower";
        this.special   = "Tsunami Tower";
        this.text      = "Damages the ground around it. Has a chance to stun.";
        this.levels    = 6;
        this.size      = 2;
        this.stuns     = true;
        this.sound     = "earth";
        
        this.costs     = [ 100, 220, 365, 540, 800, 1250 ];
        this.damages   = [  60, 120, 240, 480, 960, 2000 ];
        this.ranges    = [  30,  30,  30,  30,  30,   30 ];
        this.speeds    = [ 1.3, 1.3, 1.3, 1.3, 1.3,  1.6 ];
        
        this.init(id, row, col, boardSize);
    }
    
    EarthquakeTower.prototype = Object.create(Tower.prototype);
    EarthquakeTower.prototype.constructor = EarthquakeTower;
    EarthquakeTower.prototype.parentClass = Tower.prototype;
    
    /**
     * Returns a list of Mobs in the range of the tower
     * @param {List.<Iterator>} mobs
     * @param {Mob} mob
     * @return {Array.<Array.<Mob>>}
     */
    EarthquakeTower.prototype.getTargets = function (mobs, mob) {
        return [this.getRangeTargets(mobs)];
    };
    
    /**
     * Returns true if the given Mob is a valid target
     * @param {Mob} mob
     * @return {boolean}
     */
    EarthquakeTower.prototype.isValidTarget = function (mob) {
        return !mob.isFlyer();
    };
    
    /**
     * Returns true if it will stun a mob
     * @return {boolean}
     */
    EarthquakeTower.prototype.shouldStun = function () {
        return Utils.rand(1, 6) === 3;
    };
    
    
    
    /**
     * @constructor
     * @extends {Tower}
     * The Ink Tower Class
     * @param {number} id
     * @param {number} row
     * @param {number} col
     * @param {number} boardSize
     */
    function InkTower(id, row, col, boardSize) {
        this.type      = "Ink";
        this.name      = "Ink Tower";
        this.special   = "Ink-Bolt Tower";
        this.text      = "Deals damage over time. Ground only";
        this.levels    = 6;
        this.size      = 2;
        this.sound     = "ink";
        this.bleeds    = true;
        
        this.costs     = [ 60, 105, 150, 195, 240, 480 ];
        this.damages   = [ 12,  24,  36,  48,  60, 120 ];
        this.ranges    = [ 60,  60,  60,  60,  60,  60 ];
        this.speeds    = [  6,   6,   6,   6,   6,  12 ];
        this.ammoRange = 20;
        
        this.init(id, row, col, boardSize);
    }
    
    InkTower.prototype = Object.create(Tower.prototype);
    InkTower.prototype.constructor = InkTower;
    InkTower.prototype.parentClass = Tower.prototype;
    
    /**
     * Returns a list of Mobs close to the given one
     * @param {List.<Iterator>} mobs
     * @param {Mob} mob
     * @return {Array.<Array.<Mob>>}
     */
    InkTower.prototype.getTargets = function (mobs, mob) {
        return [this.getCloseTargets(mobs, mob)];
    };
    
    
    
    /**
     * @constructor
     * @extends {Tower}
     * The Snap Tower Class
     * @param {number} id
     * @param {number} row
     * @param {number} col
     * @param {number} boardSize
     */
    function SnapTower(id, row, col, boardSize) {
        this.type      = "Snap";
        this.name      = "Snap Tower";
        this.special   = "Spike Tower";
        this.text      = "A one time only range fire tower";
        this.levels    = 6;
        this.size      = 2;
        this.sound     = "snap";
        this.stuns     = true;
        this.fire      = true;
        
        this.costs     = [  50, 100, 150, 250,  400,  600 ];
        this.damages   = [ 100, 200, 400, 800, 1600, 3200 ];
        this.ranges    = [  60,  60,  75,  75,   75,   90 ];
        this.speeds    = [   1,   1,   1,   1,    1,    1 ];
        
        this.init(id, row, col, boardSize);
    }
    
    SnapTower.prototype = Object.create(Tower.prototype);
    SnapTower.prototype.constructor = SnapTower;
    SnapTower.prototype.parentClass = Tower.prototype;
    
    /**
     * Returns a list of Mobs in the range of the tower
     * @param {List.<Iterator>} mobs
     * @param {Mob} mob
     * @return {Array.<Array.<Mob>>}
     */
    SnapTower.prototype.getTargets = function (mobs, mob) {
        var targets = this.getRangeTargets(mobs),
            result  = [],
            i;
        
        for (i = 0; i < targets.length; i += 1) {
            result.push([targets[i]]);
        }
        return result;
    };
    
    /**
     * Returns true if it will stun a mob
     * @return {boolean}
     */
    SnapTower.prototype.shouldStun = function () {
        return Utils.rand(0, 9) === 5;
    };
    
    
    
    /**
     * @constructor
     * @extends {Tower}
     * The Laser Tower Class
     * @param {number} id
     * @param {number} row
     * @param {number} col
     * @param {number} boardSize
     */
    function LaserTower(id, row, col, boardSize) {
        this.type      = "Laser";
        this.name      = "Laser Tower";
        this.special   = "Laser-Beam Tower";
        this.text      = "Great range and damage, but lineal";
        this.levels    = 6;
        this.size      = 3;
        this.sound     = "laser";
        this.lock      = true;
        
        this.costs     = [    30,    67,   140,   265,   410,   590 ];
        this.damages   = [    22,    48,   100,   177,   289,   622 ];
        this.ranges    = [ 112.5, 112.5, 112.5, 112.5, 112.5, 112.5 ];
        this.speeds    = [     1,     1,     1,     1,     1,     1 ];
        
        this.init(id, row, col, boardSize);
    }
    
    LaserTower.prototype = Object.create(Tower.prototype);
    LaserTower.prototype.constructor = LaserTower;
    LaserTower.prototype.parentClass = Tower.prototype;
    
    /**
     * Returns a list of Mobs in a lineal range of the tower
     * @param {List.<Iterator>} mobs
     * @param {Mob} mob
     * @return {Array.<Array.<Mob>>}
     */
    LaserTower.prototype.getTargets = function (mobs, mob) {
        var angle = this.getMobAngle(mob);
        return [this.getLinealTargets(mobs, angle)];
    };
    
    /**
     * Returns true if the given Mob is a valid target
     * @param {Mob} mob
     * @return {boolean}
     */
    LaserTower.prototype.isValidTarget = function (mob) {
        var angle = this.getMobAngle(mob);
        return !this.locked || this.validAngle(this.angle, angle);
    };
    
    /**
     * Rotates the Tower and Ammo right after it starts shooting
     * @param {Mob} mob
     * @param {Ammo} ammo
     */
    LaserTower.prototype.setAngle = function (mob, ammo) {
        var angle = this.getMobAngle(mob);
        if (this.locked) {
            angle = this.angle;
        } else {
            this.rotateCanon(angle);
        }
        ammo.rotate(angle);
    };
    
    
    
    /**
     * @constructor
     * @extends {Tower}
     * The Boost Tower Class
     * @param {number} id
     * @param {number} row
     * @param {number} col
     * @param {number} boardSize
     */
    function BoostTower(id, row, col, boardSize) {
        this.type    = "Boost";
        this.name    = "Boost Tower";
        this.text    = "Increases the damage of the close towers";
        this.levels  = 5;
        this.size    = 2;
        this.boosts  = true;
        
        this.costs   = [ 100, 200, 300, 400, 500 ];
        this.damages = [  10,  20,  30,  40,  50 ];
        this.ranges  = [  30,  30,  30,  30,  30 ];
        this.speeds  = [   0,   0,   0,   0,   0 ];
        
        this.init(id, row, col, boardSize);
    }
    
    BoostTower.prototype = Object.create(Tower.prototype);
    BoostTower.prototype.constructor = BoostTower;
    BoostTower.prototype.parentClass = Tower.prototype;
    
    
    
    // The public API
    return {
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
}());