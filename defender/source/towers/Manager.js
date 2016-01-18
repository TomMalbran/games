/**
 * The Towers Manager Class
 */
class TowersManager {
    
    /**
     * The Towers Manager constructor
     * @param {Towers} parent
     */
    constructor(parent) {
        this.parent    = parent;
        this.list      = [];
        this.upgrading = new List();
        this.selling   = new List();
        this.shooting  = new List();
        this.count     = this.parent.board.getTowerStart();
        
        this.container = document.querySelector(".defenses");
        this.container.innerHTML = "";
    }
    
    /**
     * Adds the given Tower to the list to the List
     * @param {{type: string, row: number, col: number}} data
     */
    add(data) {
        this.count += 1;
        let tower = Tower.create(data.type, this.count, data.row, data.col, this.parent.board.getSize());
        this.list[this.count] = tower;
        return tower;
    }
    
    /**
     * Retrieves a Tower by its ID
     * @param {number} id
     * @return {Tower}
     */
    get(id) {
        return this.list[id];
    }
    
    /**
     * Removes the last Tower
     */
    removeLast() {
        this.list[this.count].destroy();
        this.list[this.count] = null;
        this.count -= 1;
    }
    
    
    /**
     * Build the given Tower
     * @param {{type: string, row: number, col: number, content: string}} data
     * @return {Tower}
     */
    build(data) {
        let tower = this.add(data);
        
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
    }
    
    
    /**
     * Sells the selected Tower
     * @param {Tower} tower
     */
    sell(tower) {
        if (!this.parent.hasStarted) {
            this.processSale(tower);
        } else if (!tower.isLoading()) {
            this.parent.ranges.startShoot(tower);
            tower.startSale();
            this.parent.panel.showTower(tower, this.parent.score.getGold());
            this.selling.addLast(tower.getID());
        }
    }
    
    /**
     * Sells all the Towers
     */
    sellAll() {
        this.parent.sounds.startMute();
        this.list.forEach((tower) => {
            if (tower) {
                this.processSale(tower);
            }
        });
        this.parent.sounds.endMute();
        this.parent.sounds.sell();
    }
    
    /**
     * Upgrades the Selected Tower
     * @param {Tower} tower
     */
    upgrade(tower) {
        if (tower.getUpgradeCost() <= this.parent.score.getGold()) {
            if (!this.parent.hasStarted) {
                this.processUpgrade(tower);
            } else if (!tower.isLoading()) {
                this.parent.ranges.startShoot(tower);
                tower.startUpgrade();
                this.parent.score.decGold(tower.getUpgradeCost());
                this.upgrading.addLast(tower.getID());
            }
        }
    }
    
    
    /**
     * Process the Sale
     * @param {Tower} tower
     */
    processSale(tower) {
        this.parent.score.incGold(tower.getPrice(this.parent.hasStarted));
        this.parent.sounds.sell();
        this.destroyTower(tower);
    }
    
    /**
     * Process the Upgrade
     * @param {Tower} tower
     */
    processUpgrade(tower) {
        tower.upgrade();
        
        if (tower.getActualRange(-1) !== tower.getActualRange()) {
            this.parent.ranges.remove(tower);
            tower.setLists(this.parent.ranges.add(tower));
        }
        this.upgradeBoost(tower);
        
        this.parent.selection.showDescription(tower.getID());
        this.parent.board.upgradeTower(tower);
        this.parent.sounds.upgrade();
    }
    
    
    /**
     * Destroys a Tower
     * @param {Tower} tower
     */
    destroyTower(tower) {
        this.removeBoost(tower);
        this.parent.ranges.remove(tower);
        this.parent.selection.trash(tower.getID());
        this.parent.selection.hideDescription(tower.getID());
        this.parent.board.sellTower(tower);
        this.parent.mobs.createPath();
        
        this.list[tower.getID()].destroy();
        this.list[tower.getID()] = null;
    }
    
    
    /**
     * Adds the Boosts to the given Tower
     * @param {Tower} tower
     */
    addBoost(tower) {
        if (tower.isBoost()) {
            this.boostTower(tower);
        } else {
            this.normalTower(tower);
        }
    }
    
    /**
     * Special case for Boost Towers, adding the bosts ot the Towers around it
     * @param {Tower} tower
     */
    boostTower(tower) {
        tower.getLists().towers.forEach((element) => {
            this.get(element).addBoost(tower.getActualDamage());
        });
    }
    
    /**
     * General case for the other Towers, adding the boost from the Boost Towers around it
     * @param {Tower} tower
     */
    normalTower(tower) {
        let list  = this.parent.ranges.getBoostsList(tower),
            boost = 0;
        
        list.forEach((element) => {
            let btower = self.get(element);
            btower.getLists().towers.push(tower.getID());
            boost += btower.getActualDamage();
        });
        
        if (boost > 0) {
            tower.addBoost(boost);
        }
    }
    
    /**
     * Removes the Boost from the towers around the Boost Tower
     * @param {Tower} tower
     */
    removeBoost(tower) {
        if (tower.isBoost()) {
            tower.getLists().towers.forEach((element) => {
                let subtower = this.get(element);
                if (subtower) {
                    subtower.addBoost(-tower.getActualDamage());
                }
            });
        }
    }
    
    /**
     * Upgrades the Boost in the Boost Tower
     * @param {Tower} tower
     */
    upgradeBoost(tower) {
        if (tower.isBoost()) {
            this.boostTower(tower);
        }
    }
    
    
    /**
     * Adds a new Tower to the shooting list
     * @param {number} id
     */
    addShoot(id) {
        let it = this.shooting.addLast(id);
        this.list[id].setShootIt(it);
    }
    
    /**
     * Decreases the timers from the upgrading Towers
     */
    decUpgrades() {
        if (!this.upgrading.isEmpty()) {
            let it = this.upgrading.iterate();
            while (it.hasNext()) {
                let tower = this.list[it.getNext()];
                
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
    }
    
    /**
     * Decreases the timers from the selling Towers
     */
    decSales() {
        if (!this.selling.isEmpty()) {
            let it = this.selling.iterate();
            while (it.hasNext()) {
                let tower = this.list[it.getNext()];
                
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
    }
    
    /**
     * Decreases the timers from the shooting Towers
     * @param {number} time
     */
    decShoots(time) {
        if (!this.shooting.isEmpty()) {
            let it = this.shooting.iterate();
            while (it.hasNext()) {
                let tower = this.list[it.getNext()];
                
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
    }
    
    
    /**
     * Returns the amount of towers
     * @return {number}
     */
    getAmount() {
        return this.count;
    }
    
    /**
     * Returns true when there are no towers
     * @param {boolean}
     */
    isEmpty() {
        return this.list.length === 0;
    }
    
    /**
     * Returns an Array with all the towers
     * @return {Array.<Tower>}
     */
    getList() {
        return this.list;
    }
}
