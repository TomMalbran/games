import Tower        from "./Tower.js";
import AntiAirAmmo  from "../ammo/AntiAirAmmo.js";
import Mob          from "../mob/Mob.js";

// Utils
import List         from "../../../utils/List.js";



/**
 * Defender Anti-Air Tower
 * @extends {Tower}
 */
export default class AntiAirTower extends Tower {

    /**
     * Defender Anti-Air Tower constructor
     * @param {Number} id
     * @param {Number} row
     * @param {Number} col
     * @param {Number} boardSize
     */
    constructor(id, row, col, boardSize) {
        super();

        this.type      = "AntiAir";
        this.name      = "Anti-Air Tower";
        this.special   = "Storm Tower";
        this.text      = "Hits the flyer mobs only at a great speed.";
        this.levels    = 6;
        this.size      = 2;
        this.sound     = "antiair";

        this.costs     = [ 50, 80, 120, 195, 320, 630 ];
        this.damages   = [ 20, 40,  80, 160, 320, 480 ];
        this.ranges    = [ 60, 60,  60,  60,  60,  75 ];
        this.speeds    = [  4,  4,   4,   4,   4,   6 ];
        this.ammoRange = 30;

        this.init(id, row, col, boardSize);
    }

    /**
     * Creates a new Ammo
     * @param {Mob[]}  targets
     * @param {Number} index
     * @returns {AntiAirAmmo}
     */
    createAmmo(targets, index) {
        return new AntiAirAmmo(this, targets, this.boardSize, index);
    }



    /**
     * Returns a list of Mobs close to the given one. Maximum of 4
     * @param {List} mobs
     * @param {Mob}  mob
     * @returns {Mob[][]}
     */
    getTargets(mobs, mob) {
        const targets = this.getCloseTargets(mobs, mob);
        const total   = Math.min(targets.length, 4);
        const result  = [];

        for (let i = 0; i < total; i += 1) {
            result.push([targets[i]]);
        }
        return result;
    }

    /**
     * Toggles the attacking class
     * @param {Number} amount
     * @returns {Void}
     */
    toggleAttack(amount) {
        for (let i = 1; i <= amount; i += 1) {
            this.toggleMissile(i);
        }
    }

    /**
     * Toggles the attacking class for a single Missile
     * @param {Number} index
     * @returns {Void}
     */
    toggleMissile(index) {
        this.element.classList.toggle(`missile${index}`);
    }

    /**
     * Returns true if the given Mob is a valid target
     * @param {Mob} mob
     * @returns {Boolean}
     */
    isValidTarget(mob) {
        return mob.isFlyer;
    }
}
