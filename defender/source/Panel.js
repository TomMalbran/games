import Tower        from "./tower/Tower.js";
import Mob          from "./mob/Mob.js";



/**
 * Defender Panel
 */
export default class Panel {

    /**
     * Defender Panel constructor
     */
    constructor() {
        this.hasStarted = false;
        this.container  = document.querySelector(".info-panel");
        this.towerSel   = null;
        this.mobSel     = null;
    }



    /**
     * Updates the inner started state when the game starts
     * @returns {Void}
     */
    gameStarted() {
        this.hasStarted = true;
    }

    /**
     * Shows the Tower Preview Description
     * @param {Tower} tower
     * @returns {Void}
     */
    previewTower(tower) {
        this.create(
            tower.getName(true),
            tower.text,

            this.towerInfo({
                aCost   : tower.actualCost,
                aDamage : tower.actualDamage,
                isBoost : tower.isBoost,
                aRange  : tower.getActualRange(),
                aSpeed  : tower.actualSpeed,
            })
        );
        this.towerSel = null;
        this.mobSel   = null;
    }



    /**
     * Shows the given Tower Loading bar or Information
     * @param {Tower}  tower
     * @param {Number} gold
     * @returns {Void}
     */
    showTower(tower, gold) {
        if (tower.isLoading) {
            this.showLoad(tower);
        } else {
            this.showInfo(tower, gold);
        }
        this.towerSel = tower;
        this.mobSel   = null;
    }

    /**
     * Shows the given Tower Loading Bar
     * @param {Tower} tower
     * @returns {Void}
     */
    showLoad(tower) {
        this.create(
            tower.getName(false),
            tower.text,
            this.towerLoading(tower.loadValue)
        );
    }

    /**
     * Shows the given Tower Information
     * @param {Tower}  tower
     * @param {Number} gold
     * @returns {Void}
     */
    showInfo(tower, gold) {
        this.create(
            tower.getName(false),
            tower.text,

            this.towerInfo({
                aCost   : tower.actualCost,
                uCost   : tower.upgradeCost,
                aDamage : tower.actualDamage,
                uDamage : tower.upgradeDamage,
                isBoost : tower.isBoost,
                boost   : tower.boost,
                aRange  : tower.getActualRange(),
                uRange  : tower.upgradeRange,
                aSpeed  : tower.actualSpeed,
                uSpeed  : tower.upgradeSpeed,
            }),

            this.towerButtons({
                cantUpgrade : tower.upgradeCost > gold,
                isMaxed     : tower.isMaxLevel,
                canLock     : tower.canLock,
                isLocked    : tower.isLocked,
                canFire     : tower.canFire && this.hasStarted,
                price       : tower.getPrice(this.hasStarted)
            })
        );
    }



    /**
     * Shows the given Mob Information
     * @param {Mob} mob
     * @returns {Void}
     */
    showMob(mob) {
        this.create(
            mob.name,
            `${mob.wave}. ${mob.text}`,
            this.mobInfo(mob.life, mob.gold, mob.speed)
        );
        this.towerSel = null;
        this.mobSel   = mob;
    }


    /**
     * Creates the Information Panel
     * @param {String}  name
     * @param {String}  text
     * @param {String}  information
     * @param {String=} buttons
     * @returns {Void}
     */
    create(name, text, information, buttons) {
        this.container.innerHTML = `
            <h2>${name}</h2>
            <div class="panel-content">
                <p>${text}</p>
                <div class="information">${information}</div>
                ${buttons || ""}
            </div>
        `;
        this.container.className = "info-panel fade-in";
    }

    /**
     * Returns the Tower Information HTML
     * @param {Object} data
     * @returns {String}
     */
    towerInfo(data) {
        return `
            <div class="tower-cost text">Cost:</div>
            <div class="tower-cost actual">${data.aCost}</div>
            <div class="tower-cost next">${data.uCost ? `+${data.uCost}` : ""}</div>

            <div class="tower-damage text">Damage:</div>
            <div class="tower-damage actual">${data.aDamage}${data.isBoost ? "%" : ""}</div>
            <div class="tower-damage next">${data.uDamage ? `+${data.uDamage}${data.isBoost ? "%" : ""}` : ""}</div>

            <div class="tower-distance text">Range:</div>
            <div class="tower-distance actual">${data.aRange}</div>
            <div class="tower-distance next">${data.uRange ? `+ ${data.uRange}` : ""}</div>

            <div class="tower-speed text">Speed:</div>
            <div class="tower-speed actual">${data.aSpeed}</div>
            <div class="tower-speed next">${data.uSpeed || ""}</div>

            <div class="tower-boost-value">${data.boost ? `Boost: ${data.boost} %` : ""}</div>
        `;
    }

    /**
     * Returns the Tower Buttons HTML
     * @param {Object} data
     * @returns {String}
     */
    towerButtons(data) {
        const classes = [ "info-buttons" ];
        let   button  = "";

        if (data.isMaxed) {
            classes.push("hide-buttons");
        }
        if (data.cantUpgrade) {
            classes.push("cant-upgrade");
        }

        if (data.canFire) {
            classes.push("extra-button");
            button = `<button class="action-button menu-button" data-action="fire">Fire!</button>`;
        } else if (data.canLock) {
            classes.push("extra-button");
            button = `<button class="action-button menu-button" data-action="lock">${data.isLocked ? "Unlock" : "Lock"}</button>`;
        }

        return `
            <div class="${classes.join(" ")}">
                <button class="upgrade-button menu-button" data-action="upgrade">Upgrade</button>
                ${button}
                <button class="menu-button" data-action="sell">Sell &#36;${data.price}</button>
            </div>
        `;
    }

    /**
     * Returns the Tower Loading HTML
     * @param {Number} loaded
     * @returns {String}
     */
    towerLoading(loaded) {
        return `
            <div class="info-loading">
                <div class="info-loading-bar" style="width: ${loaded * 100}%"></div>
            </div>
        `;
    }

    /**
     * Returns the Mob Information HTML
     * @param {Number} life
     * @param {Number} gold
     * @param {Number} speed
     * @returns {String}
     */
    mobInfo(life, gold, speed) {
        return `
            <div class="mob-points text">Life:</div>
            <div class="mob-points actual">${Math.round(life)}</div>
            <div></div>

            <div class="mob-gold text">Gold:</div>
            <div class="mob-gold actual">${gold}</div>
            <div></div>

            <div class="mob-speed text">Speed:</div>
            <div class="mob-speed actual">${speed}</div>
            <div></div>
        `;
    }



    /**
     * Hides the Information Panel after a few seconds
     * @returns {Void}
     */
    disappear() {
        this.towerSel = null;
        this.mobSel   = null;
        this.container.className = "info-panel delayed-fade-out";
    }

    /**
     * Hides the Information Panel inmediatelly
     * @returns {Void}
     */
    hide() {
        this.towerSel = null;
        this.mobSel   = null;
        this.container.className = "info-panel fade-out";
    }



    /**
     * Updates the Description of the currently selected Mob
     * @returns {Void}
     */
    updateMob(mob) {
        if (this.mobSel && this.mobSel.id === mob.id) {
            this.showMob(mob);
        }
    }

    /**
     * Hides the Description of the Mob
     * @returns {Void}
     */
    destroyMob(mob) {
        if (this.mobSel && this.mobSel.id === mob.id) {
            this.hide();
        }
    }
}
