import Towers       from "./Towers.js";
import Data         from "../Data.js";
import Factory      from "../Factory.js";
import Tower        from "../tower/Tower.js";

// Utils
import List         from "../../../utils/List.js";



/**
 * Defender Towers Manager
 */
export default class Manager {

    /**
     * Defender Towers Manager constructor
     * @param {Towers} parent
     */
    constructor(parent) {
        this.parent    = parent;
        this.list      = [];
        this.upgrading = new List();
        this.selling   = new List();
        this.shooting  = new List();
        this.count     = Data.towerStart;

        this.container = document.querySelector(".defenses");
        this.container.innerHTML = "";
    }

    /**
     * Adds the given Tower to the list to the List
     * @param {{type: String, row: Number, col: Number}} data
     * @returns {Tower}
     */
    add(data) {
        this.count += 1;
        const tower = Factory.createTower(data.type, this.count, data.row, data.col, Data.squareSize);
        this.list[this.count] = tower;
        return tower;
    }

    /**
     * Retrieves a Tower by its ID
     * @param {Number} id
     * @returns {Tower}
     */
    get(id) {
        return this.list[id];
    }

    /**
     * Removes the last Tower
     * @returns {Void}
     */
    removeLast() {
        this.list[this.count].destroy();
        this.list[this.count] = null;
        this.count -= 1;
    }


    /**
     * Build the given Tower
     * @param {{type: String, row: Number, col: Number, level: Number}} data
     * @returns {Tower}
     */
    build(data) {
        const tower = this.add(data);

        this.parent.board.buildTower(tower);
        if (!this.parent.mobs.createPath()) {
            this.parent.board.sellTower(tower);
            this.removeLast();
        } else {
            this.container.appendChild(tower.createElement());
            tower.setLists(this.parent.ranges.add(tower));
            this.addBoost(tower);
            this.parent.score.decGold(tower.actualCost);
            this.parent.sounds.play("build");
        }
        return tower;
    }



    /**
     * Sells the selected Tower
     * @param {Tower} tower
     * @returns {Void}
     */
    sell(tower) {
        if (!this.parent.hasStarted) {
            this.processSale(tower);
        } else if (!tower.isLoading) {
            this.parent.ranges.startShoot(tower);
            tower.startSale();
            this.parent.panel.showTower(tower, this.parent.score.gold);
            this.selling.addLast(tower.id);
        }
    }

    /**
     * Sells all the Towers
     * @returns {Void}
     */
    sellAll() {
        this.parent.sounds.startMute();
        this.list.forEach((tower) => {
            if (tower) {
                this.processSale(tower);
            }
        });
        this.parent.sounds.endMute();
        this.parent.sounds.play("sell");
    }

    /**
     * Upgrades the Selected Tower
     * @param {Tower} tower
     * @returns {Void}
     */
    upgrade(tower) {
        if (tower.upgradeCost <= this.parent.score.gold) {
            if (!this.parent.hasStarted) {
                this.processUpgrade(tower);
            } else if (!tower.isLoading) {
                this.parent.ranges.startShoot(tower);
                tower.startUpgrade();
                this.parent.score.decGold(tower.upgradeCost);
                this.upgrading.addLast(tower.id);
            }
        }
    }

    /**
     * Process the Sale
     * @param {Tower} tower
     * @returns {Void}
     */
    processSale(tower) {
        this.parent.score.incGold(tower.getPrice(this.parent.hasStarted));
        this.parent.sounds.play("sell");
        this.destroyTower(tower);
    }

    /**
     * Process the Upgrade
     * @param {Tower} tower
     * @returns {Void}
     */
    processUpgrade(tower) {
        tower.upgrade();

        if (tower.getActualRange(-1) !== tower.getActualRange()) {
            this.parent.ranges.remove(tower);
            tower.setLists(this.parent.ranges.add(tower));
        }
        this.upgradeBoost(tower);

        this.parent.selection.showDescription(tower.id);
        this.parent.board.upgradeTower(tower);
        this.parent.sounds.play("upgrade");
    }



    /**
     * Destroys a Tower
     * @param {Tower} tower
     * @returns {Void}
     */
    destroyTower(tower) {
        this.removeBoost(tower);
        this.parent.ranges.remove(tower);
        this.parent.selection.trash(tower.id);
        this.parent.selection.hideDescription(tower.id);
        this.parent.board.sellTower(tower);
        this.parent.mobs.createPath();

        this.list[tower.id].destroy();
        this.list[tower.id] = null;
    }

    /**
     * Adds the Boosts to the given Tower
     * @param {Tower} tower
     * @returns {Void}
     */
    addBoost(tower) {
        if (tower.isBoost) {
            this.boostTower(tower);
        } else {
            this.normalTower(tower);
        }
    }

    /**
     * Special case for Boost Towers, adding the bosts ot the Towers around it
     * @param {Tower} tower
     * @returns {Void}
     */
    boostTower(tower) {
        tower.lists.towers.forEach((towerID) => {
            this.get(towerID).addBoost(tower.actualDamage);
        });
    }

    /**
     * General case for the other Towers, adding the boost from the Boost Towers around it
     * @param {Tower} tower
     * @returns {Void}
     */
    normalTower(tower) {
        const list  = this.parent.ranges.getBoostsList(tower);
        let   boost = 0;

        list.forEach((element) => {
            const btower = this.get(element);
            btower.lists.towers.push(tower.id);
            boost += btower.actualDamage;
        });

        if (boost > 0) {
            tower.addBoost(boost);
        }
    }

    /**
     * Removes the Boost from the towers around the Boost Tower
     * @param {Tower} tower
     * @returns {Void}
     */
    removeBoost(tower) {
        if (tower.isBoost) {
            tower.lists.towers.forEach((towerID) => {
                const subtower = this.get(towerID);
                if (subtower) {
                    subtower.addBoost(-tower.actualDamage);
                }
            });
        }
    }

    /**
     * Upgrades the Boost in the Boost Tower
     * @param {Tower} tower
     * @returns {Void}
     */
    upgradeBoost(tower) {
        if (tower.isBoost) {
            this.boostTower(tower);
        }
    }



    /**
     * Adds a new Tower to the shooting list
     * @param {Number} id
     * @returns {Void}
     */
    addShoot(id) {
        const it = this.shooting.addLast(id);
        this.list[id].setShootIt(it);
    }

    /**
     * Decreases the timers from the upgrading Towers
     * @returns {Void}
     */
    decUpgrades() {
        if (!this.upgrading.isEmpty) {
            const it = this.upgrading.iterate();
            while (it.hasNext()) {
                const tower = this.list[it.getNext()];

                tower.incLoader();
                this.parent.selection.showDescription(it.getNext());
                if (!tower.isLoading) {
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
     * @returns {Void}
     */
    decSales() {
        if (!this.selling.isEmpty) {
            const it = this.selling.iterate();
            while (it.hasNext()) {
                const tower = this.list[it.getNext()];

                tower.decLoader();
                this.parent.selection.showDescription(it.getNext());
                if (!tower.isLoading) {
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
     * @param {Number} time
     * @returns {Void}
     */
    decShoots(time) {
        if (this.shooting.isEmpty) {
            return;
        }
        const it = this.shooting.iterate();
        while (it.hasNext()) {
            /** @type {Tower} */
            const tower = this.list[it.getNext()];

            if (tower.decTimer(time)) {
                if (!tower.isLoading) {
                    this.parent.ranges.endShoot(tower);
                }
                tower.endShoot();
                it.removeNext();
            } else {
                it.next();
            }
        }
    }



    /**
     * Returns true when there are no towers
     * @returns {Boolean}
     */
    get isEmpty() {
        return this.list.length === 0;
    }
}
