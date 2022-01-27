import Tower        from "./Tower.js";
import LaserAmmo    from "../ammo/LaserAmmo.js";
import Mob          from "../mob/Mob.js";

// Utils
import List         from "../../../utils/List.js";



/**
 * Defender Laser Tower
 * @extends {Tower}
 */
export default class LaserTower extends Tower {

    /**
     * Defender Laser Tower Class
     * @param {Number} id
     * @param {Number} row
     * @param {Number} col
     * @param {Number} boardSize
     */
    constructor(id, row, col, boardSize) {
        super();

        this.type    = "Laser";
        this.name    = "Laser Tower";
        this.special = "Laser-Beam Tower";
        this.text    = "Great range and damage, but lineal";
        this.levels  = 6;
        this.size    = 3;
        this.sound   = "laser";
        this.lock    = true;

        this.costs   = [    30,    67,   140,   265,   410,   590 ];
        this.damages = [    22,    48,   100,   177,   289,   622 ];
        this.ranges  = [ 112.5, 112.5, 112.5, 112.5, 112.5, 112.5 ];
        this.speeds  = [     1,     1,     1,     1,     1,     1 ];

        this.init(id, row, col, boardSize);
    }

    /**
     * Creates a new Ammo
     * @param {Mob[]}  targets
     * @param {Number} index
     * @returns {LaserAmmo}
     */
    createAmmo(targets, index) {
        return new LaserAmmo(this, targets, this.boardSize);
    }



    /**
     * Returns a list of Mobs in a lineal range of the tower
     * @param {List} mobs
     * @param {Mob}  mob
     * @returns {Mob[][]}
     */
    getTargets(mobs, mob) {
        const angle = this.getMobAngle(mob);
        return [ this.getLinealTargets(mobs, angle) ];
    }

    /**
     * Returns a list with the targets in the same line as the position of the tower canon
     * @param {List}   mobs
     * @param {Number} angle
     * @returns {Mob[]}
     */
    getLinealTargets(mobs, angle) {
        const list = [];
        mobs.forEach((it) => {
            /** @type {Mob} */
            const mob        = it.getPrev();
            const inRange    = this.inRange(mob, 3);
            const validAngle = this.validAngle(angle, this.getMobAngle(mob));

            if (mob.hitPoints > 0 && inRange && validAngle) {
                list.push(mob);
            }
        });
        return list;
    }



    /**
     * Returns true if the given Mob is a valid target
     * @param {Mob} mob
     * @returns {Boolean}
     */
    isValidTarget(mob) {
        const angle = this.getMobAngle(mob);
        return !this.isLocked || this.validAngle(this.angle, angle);
    }
}
