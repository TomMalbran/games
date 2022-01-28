import Ammo         from "./Ammo.js";
import Tower        from "../tower/Tower.js";
import Mob          from "../mob/Mob.js";



/**
 * Defender Missile Ammo
 * @extends {Ammo}
 */
export default class MissileAmmo extends Ammo {

    /**
     * Defender Missile Ammo constructor
     * @param {Tower}  tower
     * @param {Mob[]}  targets
     * @param {Number} boardSize
     */
    constructor(tower, targets, boardSize) {
        super();

        this.center      = 11;
        this.rotateTower = true;
        this.rotateAmmo  = true;
        this.className   = "missile-ammo";
        this.content     = `
            <div class="missile-tail"></div>
            <div class="missile-body"></div>
            <div class="missile-head"></div>
        `;

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

        if (this.decTimer(time)) {
            this.tower.toggleAttack(0);
            this.destroy();
            return true;
        }
        return false;
    }
}
