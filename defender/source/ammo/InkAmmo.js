import Ammo         from "./Ammo.js";
import Tower        from "../tower/Tower.js";
import Mob          from "../mob/Mob.js";



/**
 * Defender Ink Ammo
 * @extends {Ammo}
 */
export default class InkAmmo extends Ammo {

    /**
     * Defender Ink Ammo constructor
     * @param {Tower}  tower
     * @param {Mob[]}  targets
     * @param {Number} boardSize
     */
    constructor(tower, targets, boardSize) {
        super();

        this.center      = 0.5;
        this.rotateTower = true;
        this.rotateAmmo  = false;
        this.className   = "ink-ammo";

        this.init(tower, targets, boardSize);
    }

    /**
     * Moves the ammo according to the given time. Returns true if it reached the target
     * @param {Number} time
     * @returns {Boolean}
     */
    move(time) {
        this.changeAngle();
        this.changePos(time);
        this.changeDisplay();

        if (this.decTimer(time)) {
            this.destroy();
            return true;
        }
        return false;
    }
}
