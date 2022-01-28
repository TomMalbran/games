import Ammo         from "./Ammo.js";
import Tower        from "../tower/Tower.js";
import Mob          from "../mob/Mob.js";



/**
 * Defender Laser Ammo
 * @extends {Ammo}
 */
export default class LaserAmmo extends Ammo {

    /**
     * Defender Laser Ammo constructor
     * @param {Tower}  tower
     * @param {Mob[]}  targets
     * @param {Number} boardSize
     */
    constructor(tower, targets, boardSize) {
        super();

        this.center      = 0;
        this.rotateTower = true;
        this.rotateAmmo  = false;
        this.className   = "laser-ammo";

        this.init(tower, targets, boardSize);
    }

    /**
     * Moves the ammo according to the given time. Returns true if it reached the target
     * @param {Number} time
     * @returns {Boolean}
     */
    move(time) {
        if (this.decTimer(time)) {
            this.destroy();
            return true;
        }
        return false;
    }

    /**
     * Rotates the Ammo
     * @param {Number} angle
     * @returns {Void}
     */
    rotate(angle) {
        this.element.style.transform = `rotate(${angle}deg) translateX(20px)`;
    }
}
