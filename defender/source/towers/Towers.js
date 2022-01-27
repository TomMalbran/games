import Builder      from "./Builder.js";
import Manager      from "./Manager.js";
import Ranges       from "./Ranges.js";
import Selection    from "./Selection.js";
import Shooter      from "./Shooter.js";
import Board        from "../Board.js";
import Panel        from "../Panel.js";
import Score        from "../Score.js";
import Mobs         from "../mobs/Mobs.js";

// Utils
import Sounds       from "../../../utils/Sounds.js";



/**
 * Defender Towers
 */
export default class Towers {

    /**
     * Defender Towers constructor
     * @param {Board}  board
     * @param {Panel}  panel
     * @param {Score}  score
     * @param {Mobs}   mobs
     * @param {Sounds} sounds
     */
    constructor(board, panel, score, mobs, sounds) {
        this.board      = board;
        this.panel      = panel;
        this.score      = score;
        this.mobs       = mobs;
        this.sounds     = sounds;
        this.builder    = new Builder(this);
        this.manager    = new Manager(this);
        this.ranges     = new Ranges(this);
        this.selection  = new Selection(this);
        this.shooter    = new Shooter(this);
        this.hasStarted = false;

        this.score.setFunctions(() => this.enable(), () => this.disable());
        this.enable();
        this.disable();
        this.createInitialSetup();
    }



    /**
     * Enables the Tower Build and Upgrade
     * @returns {Void}
     */
    enable() {
        this.builder.enableBuilds(this.score.gold);
        this.selection.enableUpgrades(this.score.gold);
    }

    /**
     * Disables the Tower Build and Upgrade
     * @returns {Void}
     */
    disable() {
        this.builder.disableBuilds(this.score.gold);
        this.selection.disableUpgrades(this.score.gold);
    }



    /**
     * Creates the initial Towers Setup for the current map
     * @returns {Void}
     */
    createInitialSetup() {
        const list = this.board.getInitialSetup();

        this.sounds.startMute();
        list.forEach((data) => {
            const tower = this.manager.build(data);
            for (let i = 2; i <= data.level; i += 1) {
                this.manager.processUpgrade(tower);
            }
        });
        this.sounds.endMute();
    }

    /**
     * Updates the inner started state when the game starts
     * @returns {Void}
     */
    gameStarted() {
        this.hasStarted = true;

        if (this.selection.hasSelected) {
            this.selection.showDescription();
        }
    }

    /**
     * Called on each animation frame to decreases the timers from the different lists,
     * update the build status and move the ammos
     * @param {Number} time
     * @returns {Void}
     */
    animate(time) {
        this.manager.decUpgrades();
        this.manager.decSales();
        this.manager.decShoots(time);

        this.shooter.shoot();
        this.shooter.moveAmmos(time);
        this.builder.updateBuild();
    }

    /**
     * Destroys the event listeners and Ends the required events
     * @returns {Void}
     */
    destroy() {
        this.builder.removeListeners();
        this.drop();
    }

    /**
     * Ends the Tower Build and Selection
     * @returns {Void}
     */
    drop() {
        this.builder.drop();
        this.selection.drop();
    }



    /**
     * Sells the Selected Tower
     * @returns {Void}
     */
    sell() {
        if (this.selection.hasSelected) {
            this.manager.sell(this.selection.tower);
        }
    }

    /**
     * Sells all the Towers
     * @returns {Void}
     */
    sellAll() {
        if (!this.hasStarted) {
            this.manager.sellAll();
        }
    }

    /**
     * Upgrades the Selected Tower
     * @returns {Void}
     */
    upgrade() {
        if (this.selection.hasSelected) {
            this.manager.upgrade(this.selection.tower);
            this.selection.showDescription();
        }
    }

    /**
     * Locks the Selected Tower
     * @returns {Void}
     */
    lock() {
        if (this.selection.hasSelected) {
            const tower = this.selection.tower;

            if (tower.canLock) {
                tower.toggleLock();
                this.selection.showDescription();
            }
        }
    }

    /**
     * Fires the Selected Tower
     * @returns {Void}
     */
    fire() {
        if (this.selection.hasSelected && this.hasStarted) {
            const tower = this.selection.tower;

            if (tower.canFire && tower.canDestroy) {
                this.shooter.processShot(tower, null);
                this.selection.hideDescription();
            }
        }
    }

    /**
     * Starts building a Tower
     * @param {Number} type
     * @returns {Void}
     */
    startBuilding(type) {
        this.builder.selectByType(type);
    }

    /**
     * Moves the building element with the keyboard
     * @param {Number} deltaX
     * @param {Number} deltaY
     * @returns {Void}
     */
    moveTower(deltaX, deltaY) {
        if (this.builder.hasSelected) {
            this.builder.move(deltaX, deltaY);
        }
    }

    /**
     * Builds the Tower in the builder
     * @returns {Void}
     */
    buildTower() {
        if (this.builder.hasSelected) {
            this.builder.build();
        }
    }



    /**
     * Selects the first Tower
     * @returns {Void}
     */
    selectFirst() {
        if (!this.manager.isEmpty) {
            this.selection.selectFirst();
        }
    }

    /**
     * Selects the last Tower
     * @returns {Void}
     */
    selectLast() {
        if (!this.manager.isEmpty) {
            this.selection.selectLast();
        }
    }

    /**
     * Selects the previows or next Tower
     * @param {Number} add
     * @returns {Void}
     */
    selectNextPrev(add) {
        if (!this.manager.isEmpty) {
            this.selection.nextPrev(add);
        }
    }
}
