/**
 * The Mobs Class
 */
class Mobs {

    /**
     * The Mobs constructor
     * @param {Score}  score
     * @param {Board}  board
     * @param {Panel}  panel
     * @param {Sounds} sounds
     * @param {Number} gameLevel
     */
    constructor(score, board, panel, sounds, gameLevel) {
        this.score      = score;
        this.board      = board;
        this.panel      = panel;
        this.sounds     = sounds;
        this.manager    = new MobsManager(this);
        this.create     = new Create(this);
        this.alerts     = new Alerts();
        this.paths      = new Paths(this);
        this.waves      = new Waves(this);

        this.gameLevel  = gameLevel;
        this.hasStarted = false;

        this.board.addListener("mob", (event, element) => {
            this.panel.showMob(this.manager.get(element.parentNode.dataset.id));
        });
        this.board.addListener("default", () => {
            this.panel.hide();
        });
    }



    /**
     * Updates the inner started state when the game starts
     * @returns {Void}
     */
    gameStarted() {
        this.hasStarted = true;

        this.paths.hidePreview();
        this.waves.sendMobs();
    }

    /**
     * Called on each animation frame to decreases the timers from the different lists,
     * update the build status and move the ammos
     * @param {Number}  time
     * @param {Number}  speed
     * @param {Boolean} moveWave
     * @returns {Void}
     */
    animate(time, speed, moveWave) {
        this.manager.moveMobs(time, speed);
        this.manager.reduceCreate(time);
        this.manager.reduceSpawn(time);
        this.manager.reduceSlow(time);
        this.manager.reduceBleed(time);
        this.manager.reduceStun(time);
        this.alerts.move(time);

        if (moveWave) {
            this.waves.move();
        }
    }

    /**
     * Creates the new Paths
     * @returns {Boolean}
     */
    createPath() {
        return this.paths.createPaths();
    }

    /**
     * Sends the next Wave
     * @returns {Void}
     */
    sendNextWave() {
        this.waves.next();
    }



    /**
     * Returns the list with the Mobs that are moving
     * @returns {List}
     */
    get moving() {
        return this.manager.moving;
    }

    /**
     * Removes the Mob when it's life is lower or equal to cero
     * @param {Mob} mob
     * @returns {Void}
     */
    killMob(mob) {
        this.manager.killMob(mob);
    }

    /**
     * Adds all the mobs to one of the lists, if possible
     * @param {Array.<Mob>} mobs
     * @param {Tower}       tower
     * @returns {Void}
     */
    addToList(mobs, tower) {
        if (tower.canSlow) {
            this.manager.addSlow(mobs);
        } else if (tower.canStun) {
            this.manager.addStun(mobs, tower);
        } else if (tower.canBleed) {
            this.manager.addBleed(mobs, tower.actualDamage);
        }
    }
}
