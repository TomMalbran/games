/**
 * The Tower Selection Class
 */
class Selection {

    /**
     * The Tower Selection constructor
     * @param {Towers} parent
     */
    constructor(parent) {
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
    select(event, element) {
        if (event.target.classList.contains("towerRange")) {
            this.drop();
        } else {
            let id    = element.dataset.id,
                tower = this.parent.manager.get(id);
            this.pick(tower);
        }
    }

    /**
     * Does the actual selection of the given Tower
     * @param {Tower} tower
     */
    pick(tower) {
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
    }

    /**
     * Unselects the currently selected tower if its ID is the same as the given one
     * @param {number} ID
     */
    trash(id) {
        if (this.tower && this.tower.getID() === id) {
            this.drop();
        }
    }

    /**
     * Unselects the currently selected tower, if there is one slected
     */
    drop() {
        if (this.tower) {
            this.tower.toggleSelect(false);
            this.tower = null;
            this.parent.panel.hide();
        }
    }


    /**
     * Select the First Tower of the list
     */
    first() {
        this.drop();
        this.nextPrev(1);
    }

    /**
     * Selects the Last Tower of the list
     */
    last() {
        this.drop();
        this.nextPrev(-1);
    }

    /**
     * Selects the Next/Prev Tower. >0 for next, <0 for prev
     * @param {number} add
     */
    nextPrev(add) {
        let ids   = Object.keys(this.parent.manager.getList()),
            pos   = this.tower ? ids.indexOf(String(this.tower.getID())) : (add < 0 ? ids.length : -1),
            added = (pos + add) % ids.length,
            index = added < 0 ? ids.length + added : added,
            tower = this.parent.manager.get(ids[index]);

        this.pick(tower);
    }


    /**
     * Shows the Tower Description
     * @param {?number} id
     */
    showDescription(id) {
        if (this.tower && (this.tower.getID() === id || !id)) {
            this.parent.panel.showTower(this.tower, this.parent.score.getGold());
        }
    }

    /**
     * Hides the Tower Description
     * @param {?number} id
     */
    hideDescription(id) {
        if (this.tower && (this.tower.getID() === id || !id)) {
            this.parent.panel.hide();
        }
    }


    /**
     * Enables the Towers Upgrades from the Description
     * @param {number} gold
     */
    enableUpgrades(gold) {
        if (this.tower && this.tower.getUpgradeCost() <= gold) {
            this.parent.panel.showTower(this.tower, gold);
        }
    }

    /**
     * Disable the Towers Upgrades from the Description
     * @param {number} gold
     */
    disableUpgrades(gold) {
        if (this.tower && this.tower.getUpgradeCost() > gold) {
            this.parent.panel.showTower(this.tower, gold);
        }
    }


    /**
     * Returns true if a Tower is selected
     * @return {boolean}
     */
    hasSelected() {
        return this.tower !== null;
    }

    /**
     * Returns the selected Tower
     * @return {Tower}
     */
    getTower() {
        return this.tower;
    }
}
