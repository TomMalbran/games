import Towers       from "./Towers.js";
import Tower        from "../tower/Tower.js";

// Utils
import Utils        from "../../../utils/Utils.js";



/**
 * Defender Towers Selection
 */
export default class Selection {

    /**
     * Defender Towers Selection constructor
     * @param {Towers} parent
     */
    constructor(parent) {
        this.parent = parent;
        this.tower  = null;

        this.parent.board.addListener("tower",   (event, element) => this.select(event, element));
        this.parent.board.addListener("mob",     () => this.unselect());
        this.parent.board.addListener("default", () => this.drop());
    }



    /**
     * Selects the Tower with the given element, if the target is not in the range
     * @param {MouseEvent}  event
     * @param {HTMLElement} element
     */
    select(event, element) {
        const target = Utils.getElement(event);
        if (target.classList.contains("tower-range")) {
            this.drop();
        } else {
            const id    = Number(element.dataset.id);
            const tower = this.parent.manager.get(id);
            this.pick(tower);
        }
    }

    /**
     * Does the actual selection of the given Tower
     * @param {Tower} tower
     * @returns {Void}
     */
    pick(tower) {
        if ((this.tower && this.tower.id !== tower.id) || !this.tower) {
            this.parent.builder.drop();
            if (this.tower) {
                this.tower.toggleSelect(false);
            }

            this.tower = tower;
            this.tower.toggleSelect(true);

            this.parent.panel.showTower(this.tower, this.parent.score.gold);
            this.enableUpgrades(this.parent.score.gold);
        }
    }

    /**
     * Unselects the currently selected tower if its ID is the same as the given one
     * @param {Number} id
     * @returns {Void}
     */
    trash(id) {
        if (this.tower && this.tower.id === id) {
            this.drop();
        }
    }

    /**
     * Unselects the currently selected tower, if there is one slected
     * @returns {Void}
     */
    unselect() {
        if (this.tower) {
            this.tower.toggleSelect(false);
            this.tower = null;
        }
    }

    /**
     * Unselects the currently selected tower and closes the panel, if there is one slected
     * @returns {Void}
     */
    drop() {
        if (this.tower) {
            this.unselect();
            this.parent.panel.hide();
        }
    }



    /**
     * Select the First Tower of the list
     * @returns {Void}
     */
    selectFirst() {
        this.drop();
        this.nextPrev(1);
    }

    /**
     * Selects the Last Tower of the list
     * @returns {Void}
     */
    selectLast() {
        this.drop();
        this.nextPrev(-1);
    }

    /**
     * Selects the Next/Prev Tower. >0 for next, <0 for prev
     * @param {Number} add
     * @returns {Void}
     */
    nextPrev(add) {
        const ids   = Object.keys(this.parent.manager.list);
        const pos   = this.tower ? ids.indexOf(String(this.tower.id)) : (add < 0 ? ids.length : -1);
        const added = (pos + add) % ids.length;
        const index = added < 0 ? ids.length + added : added;
        const id    = Number(ids[index]);
        const tower = this.parent.manager.get(id);

        this.pick(tower);
    }



    /**
     * Shows the Tower Description
     * @param {Number=} id
     * @returns {Void}
     */
    showDescription(id) {
        if (this.tower && (this.tower.id === id || !id)) {
            this.parent.panel.showTower(this.tower, this.parent.score.gold);
        }
    }

    /**
     * Hides the Tower Description
     * @param {Number=} id
     * @returns {Void}
     */
    hideDescription(id) {
        if (this.tower && (this.tower.id === id || !id)) {
            this.parent.panel.hide();
        }
    }



    /**
     * Enables the Towers Upgrades from the Description
     * @param {Number} gold
     * @returns {Void}
     */
    enableUpgrades(gold) {
        if (this.tower && this.tower.upgradeCost <= gold) {
            this.parent.panel.showTower(this.tower, gold);
        }
    }

    /**
     * Disable the Towers Upgrades from the Description
     * @param {Number} gold
     * @returns {Void}
     */
    disableUpgrades(gold) {
        if (this.tower && this.tower.upgradeCost > gold) {
            this.parent.panel.showTower(this.tower, gold);
        }
    }



    /**
     * Returns true if a Tower is selected
     * @returns {Boolean}
     */
    get hasSelected() {
        return this.tower !== null;
    }
}
