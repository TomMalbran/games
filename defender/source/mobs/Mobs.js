import Alerts       from "./Alerts.js";
import Create       from "./Create.js";
import Manager      from "./Manager.js";
import Paths        from "./Paths.js";
import Waves        from "./Waves.js";
import Board        from "../Board.js";
import Panel        from "../Panel.js";
import Score        from "../Score.js";
import Mob          from "../mob/Mob.js";
import Tower        from "../tower/Tower.js";

// Utils
import Sounds       from "../../../utils/Sounds.js";
import List         from "../../../utils/List.js";



/**
 * Defender Mobs
 */
export default class Mobs {

    /**
     * Defender Mobs constructor
     * @param {Board}  board
     * @param {Panel}  panel
     * @param {Score}  score
     * @param {Sounds} sounds
     * @param {Number} gameLevel
     */
    constructor(board, panel, score, sounds, gameLevel) {
        this.board      = board;
        this.panel      = panel;
        this.score      = score;
        this.sounds     = sounds;
        this.manager    = new Manager(this);
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
     * Removes the Mob when it's life is lower or equal to cero
     * @param {Mob} mob
     * @returns {Void}
     */
    killMob(mob) {
        this.manager.killMob(mob);
    }

    /**
     * Adds all the mobs to one of the lists, if possible
     * @param {Mob[]} mobs
     * @param {Tower} tower
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
