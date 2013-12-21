/*jslint browser: true */

var Panel = (function () {
    "use strict";
    
    
    /**
     * @constructor
     * The Panel Class
     */
    function Panel() {
        this.hasStarted = false;
        this.container  = document.querySelector(".description");
        this.towerSel   = null;
        this.mobSel     = null;
        this.width      = 161;
    }
    
    /**
     * Updates the inner started state when the game starts
     */
    Panel.prototype.gameStarted = function () {
        this.hasStarted = true;
    };
    
    /**
     * Shows the Tower Preview Description
     * @param {Tower} tower
     */
    Panel.prototype.previewTower = function (tower) {
        this.create(
            tower.getName(true),
            tower.getText(),
            
            this.towerInfo({
                aCost   : tower.getActualCost(),
                aDamage : tower.getActualDamage(),
                isBoost : tower.isBoost(),
                aRange  : tower.getActualRange(),
                aSpeed  : tower.getActualSpeed()
            })
        );
        this.towerSel = null;
        this.mobSel   = null;
    };
    
    
    /**
     * Shows the given Tower Loading bar or Information
     * @param {Tower} tower
     * @param {number} gold
     */
    Panel.prototype.showTower = function (tower, gold) {
        if (tower.isLoading()) {
            this.showLoad(tower);
        } else {
            this.showInfo(tower, gold);
        }
        this.towerSel = tower;
        this.mobSel   = null;
    };
    
    /**
     * Shows the given Tower Loading Bar
     * @param {Tower} tower
     */
    Panel.prototype.showLoad = function (tower) {
        this.create(
            tower.getName(),
            tower.getText(),
            this.towerLoading(tower.getLoad())
        );
    };
    
    /**
     * Shows the given Tower Information
     * @param {Tower} tower
     * @param {number} gold
     */
    Panel.prototype.showInfo = function (tower, gold) {
        var cost = tower.getUpgradeCost();
        this.create(
            tower.getName(),
            tower.getText(),
            
            this.towerInfo({
                aCost   : tower.getActualCost(),
                uCost   : tower.getUpgradeCost(),
                aDamage : tower.getActualDamage(),
                uDamage : tower.getUpgradeDamage(),
                isBoost : tower.isBoost(),
                boost   : tower.getBoost(),
                aRange  : tower.getActualRange(),
                uRange  : tower.getUpgradeRange(),
                aSpeed  : tower.getActualSpeed(),
                uSpeed  : tower.getUpgradeSpeed()
            }),
            
            this.towerButtons({
                cantUpgrade : tower.getUpgradeCost() > gold,
                isMaxed     : tower.isMaxLevel(),
                canLock     : tower.canLock(),
                isLocked    : tower.isLocked(),
                canFire     : tower.canFire() && this.hasStarted,
                price       : tower.getPrice(this.hasStarted)
            })
        );
    };
    
    
    /**
     * Shows the given Mob Information
     * @param {Mob} mob
     */
    Panel.prototype.showMob = function (mob) {
        this.create(
            mob.getName(),
            mob.getWave() + ". " + mob.getText(),
            this.mobInfo(mob.getLife(), mob.getGold(), mob.getSpeed())
        );
        this.towerSel = null;
        this.mobSel   = mob;
    };
    
    
    /**
     * Creates the Description HTML
     * @param {string} name
     * @param {string} text
     * @param {string} information
     * @param {string} buttons
     */
    Panel.prototype.create = function (name, text, information, buttons) {
        this.container.innerHTML =
            "<h2>" + name + "</h2>" +
            "<div class='content'>" +
            "    <p>" + text + "</p>" +
            "    <div class='information'>" + information + "</div>" + (buttons || "") +
            "</div>";
        
        this.container.className = "description fadeIn";
    };
    
    /**
     * Creates the Tower Information HTML
     * @param {Object} data
     * @return {string}
     */
    Panel.prototype.towerInfo = function (data) {
        var content =
            "<div class='towerCost'>" +
            "    <div class='text'>Cost:</div>" +
            "    <div class='actual'>" + data.aCost + "</div>" +
            "    <div class='next'>" + (data.uCost ? "+" + data.uCost : "") + "</div>" +
            "</div>" +
            "<div class='towerDamage'>" +
            "    <div class='text'>Damage:</div>" +
            "    <div class='actual'>" + data.aDamage + (data.isBoost ? "%" : "") + "</div>" +
            "    <div class='next'>" + (data.uDamage ? "+" + data.uDamage + (data.isBoost ? "%" : "") : "") + "</div>" +
            "</div>" +
            "<div class='towerDistance'>" +
            "    <div class='text'>Range:</div>" +
            "    <div class='actual'>" + data.aRange + "</div>" +
            "    <div class='next'>" + (data.uRange ? "+ " + data.uRange : "") + "</div>" +
            "</div>" +
            "<div class='towerSpeed'>" +
            "    <div class='text'>Speed:</div>" +
            "    <div class='actual'>" + data.aSpeed + "</div>" +
            "    <div class='next'>" + (data.uSpeed || "") + "</div>" +
            "</div>" +
            "<div class='towerBoost'>" + (data.boost ? "Boost: " + data.boost + "%" : "") + "</div>";
        
        return content;
    };
    
    /**
     * Creates the Tower Buttons HTML
     * @param {Object} data
     * @return {string}
     */
    Panel.prototype.towerButtons = function (data) {
        var classes = [], button = "", content;
        
        if (data.isMaxed) {
            classes.push("hideButtons");
        }
        if (data.cantUpgrade) {
            classes.push("cantUpgrade");
        }
        if (data.canFire) {
            classes.push("extraButton");
        }
        
        if (data.canFire) {
            button = "<button class='actionButton menuButton' data-action='fire'>Fire!</button>";
        } else if (data.canLock) {
            button = "<button class='actionButton menuButton' data-action='lock'>" + (data.isLocked ? "Unlock" : "Lock") + "</button>";
        }
        
        content =
            "<div class='" + classes.join(" ") + "'>" +
            "    <button class='upgradeButton menuButton' data-action='upgrade'>Upgrade</button>" + button +
            "    <button class='sellButton menuButton' data-action='sell'>Sell &#36;" + data.price + "</button>" +
            "</div>";
        
        return content;
    };
    
    /**
     * Creates the Tower Loading HTML
     * @param {number} data
     * @return {string}
     */
    Panel.prototype.towerLoading = function (loaded) {
        var content =
            "<div class='descLoad'>" +
            "    <div class='descLoadBar' style='width: " + (loaded * this.width) + "px'></div>" +
            "</div>";
        
        return content;
    };
    
    /**
     * Creates the Mob Information HTML
     * @param {number} life
     * @param {number} gold
     * @param {number} speed
     * @return {string}
     */
    Panel.prototype.mobInfo = function (life, gold, speed) {
        var content =
            "<div class='mobPoints'>" +
            "    <div class='text'>Life:</div>" +
            "   <div class='actual'>" + life + "</div>" +
            "</div>" +
            "<div class='mobGold'>" +
            "    <div class='text'>Gold:</div>" +
            "    <div class='actual'>" + gold + "</div>" +
            "</div>" +
            "<div class='mobSpeed'>" +
            "    <div class='text'>Speed:</div>" +
            "    <div class='actual'>" + speed + "</div>" +
            "</div>";
        return content;
    };
    
    
    /**
     * Hides the Panel after a few seconds
     */
    Panel.prototype.disappear = function () {
        this.towerSel = null;
        this.mobSel   = null;
        this.container.className = "description delayedFadeOut";
    };
    
    /**
     * Hides the Panel inmediatelly
     */
    Panel.prototype.hide = function () {
        this.towerSel = null;
        this.mobSel   = null;
        this.container.className = "description fadeOut";
    };
    
    
    /**
     * Updates the Description of the currently selected Mob
     */
    Panel.prototype.updateMob = function (mob) {
        if (this.mobSel && this.mobSel.getID() === mob.getID()) {
            this.showMob(mob);
        }
    };
    
    /**
     * Hides the Description of the Mob
     */
    Panel.prototype.destroyMob = function (mob) {
        if (this.mobSel && this.mobSel.getID() === mob.getID()) {
            this.hide();
        }
    };
    
    
    
    // The puublic API
    return Panel;
}());