import Tower        from "./Tower.js";
import MissileAmmo  from "../ammo/MissileAmmo.js";
import Mob          from "../mob/Mob.js";

// Utils
import List         from "../../../utils/List.js";



/**
 * Defender Missile Tower
 * @extends {Tower}
 */
export default class MissileTower extends Tower {

    /**
     * Defender Missile Tower constructor
     * @param {Number} id
     * @param {Number} row
     * @param {Number} col
     * @param {Number} boardSize
     */
    constructor(id, row, col, boardSize) {
        super();

        this.type      = "Missile";
        this.name      = "Missile Tower";
        this.special   = "Dart Tower";
        this.text      = "Does great damage at a low speed. Ground only.";
        this.levels    = 6;
        this.size      = 2;
        this.sound     = "missile";

        this.costs     = [ 20,  35,  70, 130, 240, 400 ];
        this.damages   = [  8,  16,  32,  64, 128, 256 ];
        this.ranges    = [ 90,  90, 105, 120, 135, 150 ];
        this.speeds    = [  1,   1,   1,   1,   1,   1 ];
        this.ammoRange = 15;

        this.init(id, row, col, boardSize);
    }

    /**
     * Creates a new Ammo
     * @param {Mob[]} targets
     * @returns {MissileAmmo}
     */
    createAmmo(targets) {
        return new MissileAmmo(this, targets, this.boardSize);
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
     * Toggles the attacking class
     * @param {Number} amount
     * @returns {Void}
     */
    toggleAttack(amount) {
        this.element.classList.toggle("attacking");
    }

    /**
     * Returns true if the given Mob is a valid target
     * @param {Mob} mob
     * @returns {Boolean}
     */
    isValidTarget(mob) {
        return !mob.isFlyer;
    }
}
