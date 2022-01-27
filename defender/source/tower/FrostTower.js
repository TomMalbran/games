import Tower        from "./Tower.js";
import FrostAmmo    from "../ammo/FrostAmmo.js";
import Mob          from "../mob/Mob.js";

// Utils
import List         from "../../../utils/List.js";



/**
 * Defender Frost Tower
 * @extends {Tower}
 */
export default class FrostTower extends Tower {

    /**
     * Defender Frost Tower constructor
     * @param {Number} id
     * @param {Number} row
     * @param {Number} col
     * @param {Number} boardSize
     */
    constructor(id, row, col, boardSize) {
        super();

        this.type      = "Frost";
        this.name      = "Frost Tower";
        this.special   = "Blizzard Tower";
        this.text      = "Hits and slow the mobs for some time.";
        this.levels    = 6;
        this.size      = 2;
        this.sound     = "frost";
        this.slows     = true;

        this.costs     = [  50,  75, 100, 125, 150, 200 ];
        this.damages   = [  10,  15,  20,  25,  30,  40 ];
        this.ranges    = [  60,  60,  60,  60,  60,  75 ];
        this.speeds    = [ 1.5, 1.5, 1.5, 1.5, 1.5, 1.5 ];
        this.ammoRange = 20;

        this.init(id, row, col, boardSize);
    }

    /**
     * Creates a new Ammo
     * @param {Mob[]} targets
     * @returns {FrostAmmo}
     */
    createAmmo(targets) {
        return new FrostAmmo(this, targets, this.boardSize);
    }



    /**
     * Returns a list of Mobs close to the given one
     * @param {List} mobs
     * @param {Mob}  mob
     * @returns {Mob[][]}
     */
    getTargets(mobs, mob) {
        return [ this.getCloseTargets(mobs, mob) ];
    }

    /**
     * Returns true if the given Mob is a valid target
     * @param {Mob} mob
     * @returns {Boolean}
     */
    isValidTarget(mob) {
        return !mob.isInmune;
    }
}
