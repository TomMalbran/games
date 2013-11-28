/*jslint browser: true */
/*global Tower, Ammo, List, Utils */

var Towers = (function () {
    "use strict";
    
    
    /**
     * @constructor
     * @private
     * The Towers Manager Class
     * @param {Towers} parent
     */
    function Manager(parent) {
        this.parent = parent;
        this.list       = [];
        this.upgrading  = new List();
        this.selling    = new List();
        this.shooting   = new List();
        this.count      = this.parent.board.getTowerStart();
        
        this.container  = document.querySelector(".defenses");
        this.container.innerHTML = "";
    }
    
    /**
     * Adds the given Tower to the list to the List
     * @param {{type: string, row: number, col: number}} data
     */
    Manager.prototype.add = function (data) {
        this.count += 1;
        var tower = new Tower[data.type](this.count, data.row, data.col, this.parent.board.getSize());
        this.list[this.count] = tower;
        return tower;
    };
    
    /**
     * Retrieves a Tower by its ID
     * @param {number} id
     * @return {Tower}
     */
    Manager.prototype.get = function (id) {
        return this.list[id];
    };
    
    /**
     * Removes the last Tower
     */
    Manager.prototype.removeLast = function () {
        this.list[this.count].destroy();
        this.list[this.count] = null;
        this.count -= 1;
    };
    
    
    /**
     * Build the given Tower
     * @param {{type: string, row: number, col: number, content: string}} data
     * @return {Tower}
     */
    Manager.prototype.build = function (data) {
        var tower = this.add(data);
        
        this.parent.board.buildTower(tower);
        if (!this.parent.mobs.createPath()) {
            this.parent.board.sellTower(tower);
            this.removeLast();
        } else {
            this.container.appendChild(tower.createElement());
            tower.setLists(this.parent.ranges.add(tower));
            this.addBoost(tower);
            this.parent.score.decGold(tower.getActualCost());
            this.parent.sounds.build();
        }
        return tower;
    };
    
    
    /**
     * Sells the selected Tower
     * @param {Tower} tower
     */
    Manager.prototype.sell = function (tower) {
        if (!this.parent.hasStarted) {
            this.processSale(tower);
        } else if (!tower.isLoading()) {
            this.parent.ranges.startShoot(tower);
            tower.startSale();
            this.parent.panel.showTower(tower, this.parent.score.getGold());
            this.selling.addLast(tower.getID());
        }
    };
    
    /**
     * Sells all the Towers
     */
    Manager.prototype.sellAll = function () {
        var self = this;
        
        this.parent.sounds.startMute();
        this.list.forEach(function (tower) {
            if (tower) {
                self.processSale(tower);
            }
        });
        this.parent.sounds.endMute();
        this.parent.sounds.sell();
    };
    
    /**
     * Upgrades the Selected Tower
     * @param {Tower} tower
     */
    Manager.prototype.upgrade = function (tower) {
        if (tower.getUpgradeCost() <= this.parent.score.getGold()) {
            if (!this.parent.hasStarted) {
                this.processUpgrade(tower);
            } else if (!tower.isLoading()) {
                this.parent.ranges.startShoot(tower);
                tower.startUpgrade();
                this.upgrading.addLast(tower.getID());
            }
        }
    };
    
    
    /**
     * Process the Sale
     * @param {Tower} tower
     */
    Manager.prototype.processSale = function (tower) {
        this.parent.score.incGold(tower.getPrice(this.parent.hasStarted));
        this.parent.sounds.sell();
        this.destroyTower(tower);
    };
    
    /**
     * Process the Upgrade
     * @param {Tower} tower
     */
    Manager.prototype.processUpgrade = function (tower) {
        this.parent.score.decGold(tower.getUpgradeCost());
        tower.upgrade();
        
        if (tower.getActualRange(-1) !== tower.getActualRange()) {
            this.parent.ranges.remove(tower);
            tower.setLists(this.parent.ranges.add(tower));
        }
        this.upgradeBoost(tower);
        
        this.parent.selection.showDescription(tower.getID());
        this.parent.board.upgradeTower(tower);
        this.parent.sounds.upgrade();
    };
    
    
    /**
     * Destroys a Tower
     * @param {Tower} tower
     */
    Manager.prototype.destroyTower = function (tower) {
        this.removeBoost(tower);
        this.parent.ranges.remove(tower);
        this.parent.selection.trash(tower.getID());
        this.parent.selection.hideDescription(tower.getID());
        this.parent.board.sellTower(tower);
        this.parent.mobs.createPath();
        
        this.list[tower.getID()].destroy();
        this.list[tower.getID()] = null;
    };
    
    
    /**
     * Adds the Boosts to the given Tower
     * @param {Tower} tower
     */
    Manager.prototype.addBoost = function (tower) {
        if (tower.isBoost()) {
            this.boostTower(tower);
        } else {
            this.normalTower(tower);
        }
    };
    
    /**
     * Special case for Boost Towers, adding the bosts ot the Towers around it
     * @param {Tower} tower
     */
    Manager.prototype.boostTower = function (tower) {
        var subtower, self = this;
        
        tower.getLists().towers.forEach(function (element) {
            self.get(element).addBoost(tower.getActualDamage());
        });
    };
    
    /**
     * General case for the other Towers, adding the boost from the Boost Towers around it
     * @param {Tower} tower
     */
    Manager.prototype.normalTower = function (tower) {
        var list  = this.parent.ranges.getBoostsList(tower),
            boost = 0,
            self  = this,
            btower;
        
        list.forEach(function (element) {
            btower = self.get(element);
            btower.getLists().towers.push(tower.getID());
            boost += btower.getActualDamage();
        });
        
        if (boost > 0) {
            tower.addBoost(boost);
        }
    };
    
    /**
     * Removes the Boost from the towers around the Boost Tower
     * @param {Tower} tower
     */
    Manager.prototype.removeBoost = function (tower) {
        var subtower, self = this;
        
        if (tower.isBoost()) {
            tower.getLists().towers.forEach(function (element) {
                subtower = self.get(element);
                if (subtower) {
                    subtower.addBoost(-tower.getActualDamage());
                }
            });
        }
    };
    
    /**
     * Upgrades the Boost in the Boost Tower
     * @param {Tower} tower
     */
    Manager.prototype.upgradeBoost = function (tower) {
        if (tower.isBoost()) {
            this.boostTower(tower);
        }
    };
    
    
    /**
     * Adds a new Tower to the shooting list
     * @param {number} id
     */
    Manager.prototype.addShoot = function (id) {
        var it = this.shooting.addLast(id);
        this.list[id].setShootIt(it);
    };
    
    /**
     * Decreases the timers from the upgrading Towers
     */
    Manager.prototype.decUpgrades = function () {
        if (!this.upgrading.isEmpty()) {
            var tower, it = this.upgrading.iterate();
            while (it.hasNext()) {
                tower = this.list[it.getNext()];
                
                tower.incLoader();
                this.parent.selection.showDescription(it.getNext());
                if (!tower.isLoading()) {
                    this.parent.ranges.endShoot(tower);
                    tower.endUpgrade();
                    this.processUpgrade(tower);
                    it.removeNext();
                } else {
                    it.next();
                }
            }
        }
    };
    
    /**
     * Decreases the timers from the selling Towers
     */
    Manager.prototype.decSales = function () {
        if (!this.selling.isEmpty()) {
            var tower, it = this.selling.iterate();
            while (it.hasNext()) {
                tower = this.list[it.getNext()];
                
                tower.decLoader();
                this.parent.selection.showDescription(it.getNext());
                if (!tower.isLoading()) {
                    this.processSale(tower);
                    it.removeNext();
                } else {
                    it.next();
                }
            }
        }
    };
    
    /**
     * Decreases the timers from the shooting Towers
     * @param {number} time
     */
    Manager.prototype.decShoots = function (time) {
        if (!this.shooting.isEmpty()) {
            var tower, it = this.shooting.iterate();
            while (it.hasNext()) {
                tower = this.list[it.getNext()];
                
                if (tower.decTimer(time)) {
                    if (!tower.isLoading()) {
                        this.parent.ranges.endShoot(tower);
                    }
                    tower.endShoot();
                    it.removeNext();
                } else {
                    it.next();
                }
            }
        }
    };
    
    
    /**
     * Returns the amount of towers
     * @return {number}
     */
    Manager.prototype.getAmount = function () {
        return this.count;
    };
    
    /**
     * Returns true when there are no towers
     * @param {boolean}
     */
    Manager.prototype.isEmpty = function () {
        return this.list.length === 0;
    };
    
    /**
     * Returns an Array with all the towers
     * @return {Array.<Tower>}
     */
    Manager.prototype.getList = function () {
        return this.list;
    };
    
    
    
    /**
     * @constructor
     * @private
     * The Towers Shooter Class
     * @param {Towers} parent
     */
    function Shooter(parent) {
        this.parent  = parent;
        this.ammos   = new List();
        this.bullets = document.querySelector(".bullets");

        this.bullets.innerHTML = "";
    }
    
    /**
     * Iterates through the moving list of mobs and when posible, it asigns a tower to shoot each mob
     */
    Shooter.prototype.shoot = function () {
        var self = this;
        this.parent.mobs.getMovingMobs().forEach(function (it) {
            var mob    = it.getPrev(),
                towers = self.parent.ranges.getReducedList(mob.getRow(), mob.getCol());
            
            if (mob.getHitPoints() > 0 && towers && !towers.isEmpty()) {
                self.shootMob(towers, mob);
            }
        });
    };
    
    /**
     * For a single mob, shot it with all the towers that can reach it and attack it
     * @param {List.<Tower>} towers
     * @param {Mob} mob
     */
    Shooter.prototype.shootMob = function (towers, mob) {
        var self = this;
        towers.some(function (element) {
            var tower = self.parent.manager.get(element.id);
            if (tower && !tower.isShooting() && tower.canShoot(mob)) {
                self.processShot(tower, mob);
            }
            if (mob.getHitPoints() <= 0) {
                return true;
            }
        });
    };
    
    /**
     * Makes the Tower shoot the mob and others depending on the tower
     * @param {Tower} tower
     * @param {Mob} mob
     */
    Shooter.prototype.processShot = function (tower, mob) {
        var targets = tower.getTargets(this.parent.mobs.getMovingMobs(), mob),
            self    = this;
        
        this.parent.ranges.startShoot(tower);
        tower.startShoot();
        
        targets.forEach(function (list, index) {
            var ammo = self.createAmmo(tower, list, index + 1);
            self.parent.sounds[tower.getSoundName()]();
            
            list.forEach(function (nmob) {
                nmob.decHitPoints(tower.getDamage());
            });
            
            if (tower.canLock()) {
                tower.setAngle(mob, ammo);
            }
            tower.addAmmo(list.length);
        });
        
        this.parent.manager.addShoot(tower.getID());
        tower.toggleAttack(targets.length);
    };
    
    /**
     * Creates a new Ammo
     * @param {Tower} tower
     * @param {Array.<Mob>} targets
     * @param {number} index
     * @return {Ammo}
     */
    Shooter.prototype.createAmmo = function (tower, targets, index) {
        var ammo = new Ammo[tower.getType()](tower, targets, this.parent.board.getSize(), index),
            it   = this.ammos.addLast(ammo);
        
        ammo.setIterator(it);
        this.bullets.appendChild(ammo.createElement());
        return ammo;
    };
    
    /**
     * Moves all the Ammos till they reach the target, and it then performs the required tasks
     * @param {number} time
     */
    Shooter.prototype.moveAmmos = function (time) {
        var self = this;
        this.ammos.forEach(function (ammo) {
            var tower = ammo.getTower();
            if (ammo.move(time)) {
                self.attackTargets(ammo.getTargets(), tower.getDamage());
                self.parent.mobs.addToList(ammo.getTargets(), tower);
                
                if (tower.canFire() && tower.canDestroy()) {
                    self.parent.manager.destroyTower(tower);
                }
                if (ammo.getHitSound()) {
                    self.parent.sounds[ammo.getHitSound()]();
                }
            }
        });
    };
    
    /**
     * Does the final attack on the mobs reducing their actual life
     * @param {Array.<Mob>} targets
     * @param {number} damage
     */
    Shooter.prototype.attackTargets = function (targets, damage) {
        var self = this;
        targets.forEach(function (mob) {
            mob.hit(damage);
            self.parent.panel.updateMob(mob);
            
            if (mob.getLife() <= 0 && !mob.isDead()) {
                self.parent.mobs.killMob(mob);
            }
        });
    };
    
    
    
    /**
     * @constructor
     * @private
     * The Tower Builder Class
     * @param {Towers} parent
     */
    function Builder(parent) {
        this.parent   = parent;
        this.tower    = null;
        this.row      = 1;
        this.col      = 1;
        this.top      = 0;
        this.left     = 0;
        this.size     = 2;
        this.range    = 120;
        this.selected = null;
        this.canPay   = true;
        this.canBuild = true;
        
        this.towers   = document.querySelector(".towersPanel");
        this.building = document.querySelector(".building");
        
        this.addListeners();
    }
    
    /**
     * Creates the event handlers and adds them
     */
    Builder.prototype.addListeners = function () {
        this.selectHandler  = this.selectEvent.bind(this);
        this.previewHandler = this.previewEvent.bind(this);
        this.hideHandler    = this.hideEvent.bind(this);
        this.dragHandler    = this.drag.bind(this);
        
        document.addEventListener("mousemove",    this.dragHandler);
        this.towers.addEventListener("click",     this.selectHandler);
        this.towers.addEventListener("mouseover", this.previewHandler);
        this.towers.addEventListener("mouseout",  this.hideHandler);
        this.parent.board.addListener("build",    this.build.bind(this));
    };
    
    /**
     * Removes the events listeners
     */
    Builder.prototype.removeListeners = function () {
        document.removeEventListener("mousemove",    this.dragHandler);
        this.towers.removeEventListener("click",     this.selectHandler);
        this.towers.removeEventListener("mouseover", this.previewHandler);
        this.towers.removeEventListener("mouseout",  this.hideHandler);
    };
    
    
    /**
     * The select Tower listener
     * @param {Event} event
     */
    Builder.prototype.selectEvent = function (event) {
        if (event.target.classList.contains("towerBuild")) {
            this.selectByElement(event.target);
        }
    };
    
    /**
     * The preview Tower listener
     * @param {Event} event
     */
    Builder.prototype.previewEvent = function (event) {
        if (event.target.classList.contains("towerBuild")) {
            this.showPreview(event.target);
        }
    };
    
    /**
     * The hide Tower listener
     * @param {Event} event
     */
    Builder.prototype.hideEvent = function (event) {
        if (event.target.classList.contains("towerBuild")) {
            this.hidePreview();
        }
    };
    
    
    /**
     * Shows the Tower Description
     * @param {DOMElement} element
     */
    Builder.prototype.showPreview = function (element) {
        if (!this.selected && !this.parent.selection.hasSelected()) {
            this.parent.panel.previewTower(new Tower[element.dataset.type]());
        }
    };
    
    /**
     * Hides the Tower Description
     */
    Builder.prototype.hidePreview = function () {
        if (!this.selected && !this.parent.selection.hasSelected()) {
            this.parent.panel.disappear();
        }
    };
    
        
    /**
     * Selects a new tower to build from a Dom Element, or it ends the builder
     * if the selected tower is the currently selected one
     * @param {DOMElement} element
     */
    Builder.prototype.selectByElement = function (element) {
        if (this.selected !== element) {
            this.pick(element);
        } else {
            this.drop();
        }
    };
    
    /**
     * Selects a new tower to build from a number
     * @param {number} type
     */
    Builder.prototype.selectByType = function (type) {
        var selects = this.getTowersElems();
        if (selects[type]) {
            this.pick(selects[type]);
        }
    };
    
    /**
     * Picks the tower and starts the Dragging
     * @param {DOMElement} element
     */
    Builder.prototype.pick = function (element) {
        if (this.selected) {
            this.selected.classList.remove("selected");
        }
        this.parent.selection.drop();
        
        this.tower    = new Tower[element.dataset.type]();
        this.selected = element;
        this.canBuild = false;
        
        this.selected.classList.add("selected");
        this.parent.panel.previewTower(this.tower);
        
        this.initBuildingElem();
        this.setPosition(this.row, this.col);
    };
    
    /**
     * Drops the tower endind the drag and building process
     */
    Builder.prototype.drop = function () {
        if (this.selected) {
            this.selected.classList.remove("selected");
            this.building.style.display = "none";
            this.selected = null;
        }
    };
    
    /**
     * Drags the Tower around the board
     * @param {Event} event
     */
    Builder.prototype.drag = function (event) {
        if (this.selected) {
            var mouse = Utils.getMousePos(event),
                board = this.parent.board.getPos(),
                size  = this.parent.board.getSize(),
                top   = mouse.top  - board.top,
                left  = mouse.left - board.left,
                row   = Math.floor(top  / size) - 1,
                col   = Math.floor(left / size) - 1;
            
            if (this.row !== row || this.col !== col) {
                if (this.parent.board.inMatrix(row, col, this.size - 1)) {
                    this.setPosition(row, col);
                } else {
                    this.canBuild = false;
                    this.building.style.display = "none";
                }
            }
        }
    };
    
    /**
     * Moves the Tower using the keayboard
     * @param {number} deltaX
     * @param {number} deltaY
     */
    Builder.prototype.move = function (deltaX, deltaY) {
        if (this.row === null || this.col === null) {
            this.setPosition(1, 1);
        } else if (this.parent.board.inMatrix(this.row + deltaY, this.col + deltaX, this.size - 1)) {
            this.setPosition(this.row + deltaY, this.col + deltaX);
        }
    };
    
    /**
     * Updates the can build property while playing the game
     */
    Builder.prototype.updateBuild = function () {
        if (this.selected) {
            this.canBuild = this.parent.board.canBuild(this.row, this.col, this.size);
            this.setClass();
        }
    };
    
    /**
     * Sets the position of the tower on drag
     * @param {number} row
     * @param {number} col
     */
    Builder.prototype.setPosition = function (row, col) {
        this.row      = row;
        this.col      = col;
        this.top      = this.cellToPx(this.row);
        this.left     = this.cellToPx(this.col);
        this.canBuild = this.parent.board.canBuild(this.row, this.col, this.size);
        this.canPay   = this.tower.getActualCost() <= this.parent.score.getGold();
        
        this.building.style.display = "block";
        this.building.style.top     = this.top;
        this.building.style.left    = this.left;
        
        this.setClass();
    };
    
    /**
     * Sets the classes on the bluiding element
     */
    Builder.prototype.setClass = function () {
        if (this.canBuild && this.canPay) {
            this.setValidClass();
        } else {
            this.setInvalidClass();
        }
    };
    
    /**
     * Adds the valid class and removes the invalid one
     */
    Builder.prototype.setValidClass = function () {
        this.building.classList.add("valid");
        this.building.classList.remove("invalid");
    };
    
    /**
     * Adds the invalid class and removes the valid one
     */
    Builder.prototype.setInvalidClass = function () {
        this.building.classList.add("invalid");
        this.building.classList.remove("valid");
    };
    
        
    /**
     * It builds the tower
     */
    Builder.prototype.build = function () {
        if (this.canBuild && this.canPay) {
            this.building.classList.remove("invalid");
            
            this.parent.manager.build({
                type : this.tower.getType(),
                row  : this.row,
                col  : this.col
            });
        }
    };
    
    
    /**
     * Enables the Towers that can be build depending on the amount of gold
     * @param {number} gold
     */
    Builder.prototype.enableBuilds = function (gold) {
        var i, type, tower,
            selects = this.getTowersElems();
        
        for (i = 0; i < selects.length; i += 1) {
            type  = selects[i].dataset.type;
            tower = new Tower[type]();
            
            
            if (tower.getActualCost() <= gold) {
                selects[i].classList.remove("disabled");
                if (this.tower && this.tower.getType() === type) {
                    this.setValidClass();
                    this.canPay = true;
                }
            }
        }
    };
    
    /**
     * Disables the Towers that can't be build depending on the amount of gold
     * @param {number} gold
     */
    Builder.prototype.disableBuilds = function (gold) {
        var i, type, tower,
            selects = this.getTowersElems();
        
        for (i = 0; i < selects.length; i += 1) {
            type  = selects[i].dataset.type;
            tower = new Tower[type]();
            
            if (tower.getActualCost() > gold) {
                selects[i].classList.add("disabled");
                if (this.tower && this.tower.getType() === type) {
                    this.setInvalidClass();
                    this.canPay = false;
                }
            }
        }
    };
    
    
    /**
     * Initializes the building element
     */
    Builder.prototype.initBuildingElem = function () {
        this.building.classList.remove("towerRange" + Math.floor(this.range));
        this.building.classList.remove("dim"   + this.size);
        
        this.range = this.tower.getRealRange();
        this.size  = this.tower.getSize();
        
        this.building.classList.add("towerRange" + Math.floor(this.range));
        this.building.classList.add("dim"   + this.size);
    };
    
    /**
     * Transform a cell number to a px position
     * @param {number} cell
     * @return {number}
     */
    Builder.prototype.cellToPx = function (pos) {
        var center = (this.size * this.parent.board.getSize()) / 2;
        return ((pos + this.size) * this.parent.board.getSize() - center) + "px";
    };
    
    /**
     * Returns the Towers Element
     * @return {Array.<DOMElement>}
     */
    Builder.prototype.getTowersElems = function () {
        return this.towers.querySelectorAll(".towerBuild");
    };
    
    /**
     * Returns true if there is a Tower selected
     * @return {boolean}
     */
    Builder.prototype.hasSelected = function () {
        return this.selected !== null;
    };
    
    
    
    /**
     * @constructor
     * @private
     * The Tower Selection Class
     * @param {Towers} parent
     */
    function Selection(parent) {
        this.parent = parent;
        this.tower  = null;
        
        this.parent.board.addListener("tower",   this.select.bind(this));
        this.parent.board.addListener("default", this.drop.bind(this));
    }
    
    /**
     * Selects the Tower with the given element, if the target is not in the range
     * @param {Event} event
     * @param {DOMEvent} element
     */
    Selection.prototype.select = function (event, element) {
        var tower, id;
        if (event.target.classList.contains("towerRange")) {
            this.drop();
        } else {
            id    = element.dataset.id;
            tower = this.parent.manager.get(id);
            this.pick(tower);
        }
    };
    
    /**
     * Does the actual selection of the given Tower
     * @param {Tower} tower
     */
    Selection.prototype.pick = function (tower) {
        if ((this.tower && this.tower.getID() !== tower.getID()) || !this.tower) {
            this.parent.builder.drop();
            if (this.tower) {
                this.tower.toggleSelect(false);
            }
            
            this.tower = tower;
            this.tower.toggleSelect(true);
            
            this.parent.panel.showTower(this.tower, this.parent.score.getGold());
            this.enableUpgrades();
        }
    };
    
    /**
     * Unselects the currently selected tower if its ID is the same as the given one
     * @param {number} ID
     */
    Selection.prototype.trash = function (id) {
        if (this.tower && this.tower.getID() === id) {
            this.drop();
        }
    };
    
    /**
     * Unselects the currently selected tower, if there is one slected
     */
    Selection.prototype.drop = function () {
        if (this.tower) {
            this.tower.toggleSelect(false);
            this.tower = null;
            this.parent.panel.hide();
        }
    };
    
        
    /**
     * Select the First Tower of the list
     */
    Selection.prototype.first = function () {
        this.drop();
        this.nextPrev(1);
    };
    
    /**
     * Selects the Last Tower of the list
     */
    Selection.prototype.last = function () {
        this.drop();
        this.nextPrev(-1);
    };
    
    /**
     * Selects the Next/Prev Tower. >0 for next, <0 for prev
     * @param {number} add
     */
    Selection.prototype.nextPrev = function (add) {
        var ids   = Object.keys(this.parent.manager.getList()),
            pos   = this.tower ? ids.indexOf(String(this.tower.getID())) : (add < 0 ? ids.length : -1),
            added = (pos + add) % ids.length,
            index = added < 0 ? ids.length + added : added,
            tower = this.parent.manager.get(ids[index]);
        
        this.pick(tower);
    };
    
    
    /**
     * Shows the Tower Description
     * @param {?number} id
     */
    Selection.prototype.showDescription = function (id) {
        if (this.tower && (this.tower.getID() === id || !id)) {
            this.parent.panel.showTower(this.tower, this.parent.score.getGold());
        }
    };
    
    /**
     * Hides the Tower Description
     * @param {?number} id
     */
    Selection.prototype.hideDescription = function (id) {
        if (this.tower && (this.tower.getID() === id || !id)) {
            this.parent.panel.hide();
        }
    };
    
    /**
     * Enables the Towers Upgrades from the Description
     * @param {number} gold
     */
    Selection.prototype.enableUpgrades = function (gold) {
        if (this.tower && this.tower.getUpgradeCost() <= gold) {
            this.parent.panel.showTower(this.tower, gold);
        }
    };
    
    /**
     * Disable the Towers Upgrades from the Description
     * @param {number} gold
     */
    Selection.prototype.disableUpgrades = function (gold) {
        if (this.tower && this.tower.getUpgradeCost() > gold) {
            this.parent.panel.showTower(this.tower, gold);
        }
    };
    
    
    /**
     * Returns true if a Tower is selected
     * @return {boolean}
     */
    Selection.prototype.hasSelected = function () {
        return this.tower !== null;
    };
    
    /**
     * Returns the selected Tower
     * @return {Tower}
     */
    Selection.prototype.getTower = function () {
        return this.tower;
    };
    
    
    
    /**
     * @constructor
     * @private
     * The Towers Ranges Class
     * @param {Towers} parent
     */
    function Ranges(parent) {
        this.parent   = parent;
        this.reduced  = {};
        this.complete = {};
        this.boosts   = {};
    }
    
    /**
     * It adds the Tower to the diferent cells in the matrices of Iterators where its range reaches it
     * @return {({boosts: Array.<Iterator>, towers: Array.<Iterator>} | {complete: Array.<Iterator>, reduced: Array.<Iterator>})}
     */
    Ranges.prototype.add = function (tower) {
        var row, col, list1 = [], list2 = [],
            matrix = tower.getRangeMatrix(),
            reduce = (matrix.length - tower.getSize()) / 2,
            self   = this;
        
        matrix.forEach(function (line, i) {
            line.forEach(function (cell, j) {
                row = tower.getRow() - reduce + i;
                col = tower.getCol() - reduce + j;
                
                if (cell === 1 && self.parent.board.inBoard(row, col)) {
                    if (tower.isBoost()) {
                        self.addBoost(list1, list2, tower.getID(), row, col);
                    } else if (!tower.canFire()) {
                        self.addNormal(list1, list2, tower.getID(), row, col);
                    }
                }
            });
        });
        
        if (tower.isBoost()) {
            return { boosts: list1, towers: list2 };
        }
        return { complete: list1, reduced: list2 };
    };
    
    /**
     * Adds the boost Tower to the "boost" list and if there is a tower in the given position,
     * it adds it's id to the second given array
     * @param {Array.<Iterator>} list1
     * @param {Array.<number>} list2
     * @param {number} id
     * @param {number} row
     * @param {number} col
     */
    Ranges.prototype.addBoost = function (list1, list2, id, row, col) {
        var cell    = this.getCell(row, col),
            towerID = this.parent.board.getContent(row, col),
            tower   = this.parent.manager.get(towerID);
        
        list1.push(this.addTower("boosts", cell, id));
        if (tower && !tower.isBoost() && list2.indexOf(towerID) === -1) {
            list2.push(towerID);
        }
    };
    
    /**
     * Adds a non-boost Tower to the "complete" and "reduced" lists in the given position,
     * updating the given arrays
     * @param {Array.<Iterator>} list1
     * @param {Array.<Iterator>} list2
     * @param {number} id
     * @param {number} row
     * @param {number} col
     */
    Ranges.prototype.addNormal = function (list1, list2, id, row, col) {
        var cell = this.getCell(row, col);
        list1.push(this.addTower("complete", cell, id));
        list2.push(this.addTower("reduced",  cell, id));
    };
    
    /**
     * Adds the tower with the given ID, to the given list in the given cell
     * @param {string} list
     * @param {string} cell
     * @param {number} id
     * @return {Iterator}
     */
    Ranges.prototype.addTower = function (list, cell, id) {
        if (!this[list][cell]) {
            this[list][cell] = new List();
        }
        return this[list][cell].addLast({ id: id, cell: cell });
    };
    
    
    /**
     * Removes the Tower from all the internal lists
     * @param {Tower} tower
     */
    Ranges.prototype.remove = function (tower) {
        var lists = tower.getLists(), self = this;
        Object.keys(lists).forEach(function (name) {
            lists[name].forEach(function (it) {
                if (self[name]) {
                    it.removePrev();
                }
            });
        });
    };
    
    
    /**
     * When starting to shoot, it removes the Tower from the reduced array
     * @param {Tower} tower
     */
    Ranges.prototype.startShoot = function (tower) {
        tower.getLists().reduced.forEach(function (it) {
            it.removePrev();
        });
    };
    
    /**
     * When ending a shoot, it readds the Tower to the reduced array
     * @param {Tower} tower
     */
    Ranges.prototype.endShoot = function (tower) {
        var list = [], self = this;
        tower.getLists().complete.forEach(function (it) {
            list.push(self.addTower("reduced", it.getPrev().cell, it.getPrev().id));
        });
        tower.setList("reduced", list);
    };
    
    
    /**
     * Returns all the Boost Towers where it's range reaches the given Tower
     * @param {Tower} tower
     * @return {Array.<number>}
     */
    Ranges.prototype.getBoostsList = function (tower) {
        var i, j, pos, it,
            startRow = tower.getRow(),
            startCol = tower.getCol(),
            endRow   = startRow + tower.getSize(),
            endCol   = startCol + tower.getSize(),
            list     = [];
        
        for (i = startRow; i < endRow; i += 1) {
            for (j = startCol; j < endCol; j += 1) {
                pos = this.getCell(i, j);
                if (this.boosts[pos] && !this.boosts[pos].isEmpty()) {
                    it = this.boosts[pos].iterate();
                    while (it.hasNext()) {
                        if (list.indexOf(it.getNext()) !== -1) {
                            list.push(it.getNext());
                        }
                        it.next();
                    }
                }
            }
        }
        return list;
    };
    
    
    /**
     * Returns a string that represents a position
     * @param {number} row
     * @param {number} col
     * @return {string}
     */
    Ranges.prototype.getCell = function (row, col) {
        return "r" + row + "c" + col;
    };
    
    /**
     * Returns true if there is a Tower in the "reduced" list in the given position
     * @param {number} row
     * @param {number} col
     * @return {boolean}
     */
    Ranges.prototype.hasTowers = function (row, col) {
        var pos = this.getCell(row, col);
        return this.reduced[pos] && !this.reduced[pos].isEmpty();
    };
    
    /**
     * Returns all the Towers in the "reduced" list in the given position
     * @return {?Array.<Iterator>}
     */
    Ranges.prototype.getReducedList = function (row, col) {
        return this.reduced[this.getCell(row, col)];
    };
    
    
    
    /**
     * @constructor
     * The Towers Class
     * @param {Score} score
     * @param {Board} board
     * @param {Panel} panel
     * @param {Sounds} sounds
     */
    function Towers(score, board, panel, mobs, sounds) {
        this.score      = score;
        this.board      = board;
        this.panel      = panel;
        this.mobs       = mobs;
        this.sounds     = sounds;
        this.manager    = new Manager(this);
        this.shooter    = new Shooter(this);
        this.builder    = new Builder(this);
        this.selection  = new Selection(this);
        this.ranges     = new Ranges(this);
        this.hasStarted = false;
        
        this.score.setFunctions(this.enable.bind(this), this.disable.bind(this));
        this.enable();
        this.disable();
        this.createInitialSetup();
    }
    
    /**
     * Enables the Tower Build and Upgrade
     */
    Towers.prototype.enable = function () {
        this.builder.enableBuilds(this.score.getGold());
        this.selection.enableUpgrades(this.score.getGold());
    };
    
    /**
     * Disables the Tower Build and Upgrade
     */
    Towers.prototype.disable = function () {
        this.builder.disableBuilds(this.score.getGold());
        this.selection.disableUpgrades(this.score.getGold());
    };
    
    /**
     * Creates the initial Towers Setup for the current map
     */
    Towers.prototype.createInitialSetup = function () {
        var tower, i,
            list = this.board.getInitialSetup(),
            self = this;
        
        this.sounds.startMute();
        list.forEach(function (data) {
            tower = self.manager.build(data);
            for (i = 2; i <= data.level; i += 1) {
                self.manager.processUpgrade(tower);
            }
        });
        this.sounds.endMute();
    };
    
    
    /**
     * Updates the inner started state when the game starts
     */
    Towers.prototype.gameStarted = function () {
        this.hasStarted = true;
        
        if (this.selection.hasSelected()) {
            this.selection.showDescription();
        }
    };
    
    /**
     * Called on each animation frame to decreases the timers from the different lists,
     * update the build status and move the ammos
     * @param {number} time
     */
    Towers.prototype.animate = function (time) {
        this.manager.decUpgrades();
        this.manager.decSales();
        this.manager.decShoots(time);
        
        this.shooter.shoot();
        this.shooter.moveAmmos(time);
        this.builder.updateBuild();
    };
    
    /**
     * Destroys the event listeners and Ends the required events
     */
    Towers.prototype.destroy = function () {
        this.builder.removeListeners();
        this.drop();
    };
    
    /**
     * Ends the Tower Build and Selection
     */
    Towers.prototype.drop = function () {
        this.builder.drop();
        this.selection.drop();
    };
    
    
    /**
     * Sells the Selected Tower
     */
    Towers.prototype.sell = function () {
        if (this.selection.hasSelected()) {
            this.manager.sell(this.selection.getTower());
        }
    };
    
    /**
     * Sells all the Towers
     */
    Towers.prototype.sellAll = function () {
        if (!this.hasStarted) {
            this.manager.sellAll();
        }
    };
    
    /**
     * Upgrades the Selected Tower
     */
    Towers.prototype.upgrade = function () {
        if (this.selection.hasSelected()) {
            this.manager.upgrade(this.selection.getTower());
            this.selection.showDescription();
        }
    };
    
    /**
     * Locks the Selected Tower
     */
    Towers.prototype.lock = function () {
        if (this.selection.hasSelected()) {
            var tower = this.selection.getTower();
            
            if (tower.canLock()) {
                tower.toggleLock();
                this.selection.showDescription();
            }
        }
    };
    
    /**
     * Fires the Selected Tower
     */
    Towers.prototype.fire = function () {
        if (this.selection.hasSelected() && this.hasStarted) {
            var tower = this.selection.getTower();
            
            if (tower.canFire() && tower.canDestroy()) {
                this.shooter.processShot(tower);
                this.selection.hideDescription();
            }
        }
    };
    
    
    /**
     * Starts building a Tower
     * @param {number} type
     */
    Towers.prototype.startBuilding = function (type) {
        this.builder.selectByType(type);
    };
    
    /**
     * Moves the building element with the keyboard
     * @param {number} deltaX
     * @param {number} deltaY
     */
    Towers.prototype.moveTower = function (deltaX, deltaY) {
        if (this.builder.hasSelected()) {
            this.builder.move(deltaX, deltaY);
        }
    };
    
    /**
     * Builds the Tower in the builder
     */
    Towers.prototype.buildTower = function () {
        if (this.builder.hasSelected()) {
            this.builder.build();
        }
    };
    
    
    /**
     * Selects the first Tower
     */
    Towers.prototype.selectFirst = function () {
        if (!this.manager.isEmpty()) {
            this.selection.first();
        }
    };
    
    /**
     * Selects the last Tower
     */
    Towers.prototype.selectLast = function () {
        if (!this.manager.isEmpty()) {
            this.selection.last();
        }
    };
    
    /**
     * Selects the previows or next Tower
     * @param {number} add
     */
    Towers.prototype.selectNextPrev = function (add) {
        if (!this.manager.isEmpty()) {
            this.selection.nextPrev(add);
        }
    };
    
    
    
    // The public API
    return Towers;
}());