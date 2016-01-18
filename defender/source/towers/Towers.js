/**
 * The Towers Class
 */
class Towers {
    
    /**
     * The Towers constructor
     * @param {Score}  score
     * @param {Board}  board
     * @param {Panel}  panel
     * @param {Mobs}   mobs
     * @param {Sounds} sounds
     */
    constructor(score, board, panel, mobs, sounds) {
        this.score      = score;
        this.board      = board;
        this.panel      = panel;
        this.mobs       = mobs;
        this.sounds     = sounds;
        this.manager    = new TowersManager(this);
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
    enable() {
        this.builder.enableBuilds(this.score.getGold());
        this.selection.enableUpgrades(this.score.getGold());
    }
    
    /**
     * Disables the Tower Build and Upgrade
     */
    disable() {
        this.builder.disableBuilds(this.score.getGold());
        this.selection.disableUpgrades(this.score.getGold());
    }
    
    
    /**
     * Creates the initial Towers Setup for the current map
     */
    createInitialSetup() {
        let list = this.board.getInitialSetup();
        
        this.sounds.startMute();
        list.forEach((data) => {
            let tower = this.manager.build(data);
            for (let i = 2; i <= data.level; i += 1) {
                this.manager.processUpgrade(tower);
            }
        });
        this.sounds.endMute();
    }
    
    
    /**
     * Updates the inner started state when the game starts
     */
    gameStarted() {
        this.hasStarted = true;
        
        if (this.selection.hasSelected()) {
            this.selection.showDescription();
        }
    }
    
    /**
     * Called on each animation frame to decreases the timers from the different lists,
     * update the build status and move the ammos
     * @param {number} time
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
     */
    destroy() {
        this.builder.removeListeners();
        this.drop();
    }
    
    /**
     * Ends the Tower Build and Selection
     */
    drop() {
        this.builder.drop();
        this.selection.drop();
    }
    
    
    /**
     * Sells the Selected Tower
     */
    sell() {
        if (this.selection.hasSelected()) {
            this.manager.sell(this.selection.getTower());
        }
    }
    
    /**
     * Sells all the Towers
     */
    sellAll() {
        if (!this.hasStarted) {
            this.manager.sellAll();
        }
    }
    
    /**
     * Upgrades the Selected Tower
     */
    upgrade() {
        if (this.selection.hasSelected()) {
            this.manager.upgrade(this.selection.getTower());
            this.selection.showDescription();
        }
    }
    
    /**
     * Locks the Selected Tower
     */
    lock() {
        if (this.selection.hasSelected()) {
            let tower = this.selection.getTower();
            
            if (tower.canLock()) {
                tower.toggleLock();
                this.selection.showDescription();
            }
        }
    }
    
    /**
     * Fires the Selected Tower
     */
    fire() {
        if (this.selection.hasSelected() && this.hasStarted) {
            let tower = this.selection.getTower();
            
            if (tower.canFire() && tower.canDestroy()) {
                this.shooter.processShot(tower);
                this.selection.hideDescription();
            }
        }
    }
    
    /**
     * Starts building a Tower
     * @param {number} type
     */
    startBuilding(type) {
        this.builder.selectByType(type);
    }
    
    /**
     * Moves the building element with the keyboard
     * @param {number} deltaX
     * @param {number} deltaY
     */
    moveTower(deltaX, deltaY) {
        if (this.builder.hasSelected()) {
            this.builder.move(deltaX, deltaY);
        }
    }
    
    /**
     * Builds the Tower in the builder
     */
    buildTower() {
        if (this.builder.hasSelected()) {
            this.builder.build();
        }
    }
    
    
    /**
     * Selects the first Tower
     */
    selectFirst() {
        if (!this.manager.isEmpty()) {
            this.selection.first();
        }
    }
    
    /**
     * Selects the last Tower
     */
    selectLast() {
        if (!this.manager.isEmpty()) {
            this.selection.last();
        }
    }
    
    /**
     * Selects the previows or next Tower
     * @param {number} add
     */
    selectNextPrev(add) {
        if (!this.manager.isEmpty()) {
            this.selection.nextPrev(add);
        }
    }
}
