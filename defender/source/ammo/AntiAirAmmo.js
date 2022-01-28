import Ammo         from "./Ammo.js";
import Tower        from "../tower/Tower.js";
import Mob          from "../mob/Mob.js";



/**
 * Defender Anti-Air Ammo
 * @extends {Ammo}
 */
export default class AntiAirAmmo extends Ammo {

    /**
     * Defender Anti-Air Ammo constructor
     * @param {Tower}  tower
     * @param {Mob[]}  targets
     * @param {Number} boardSize
     * @param {Number} index
     */
    constructor(tower, targets, boardSize, index) {
        super();

        this.center      = 5;
        this.rotateTower = false;
        this.rotateAmmo  = true;
        this.className   = "air-ammo";
        this.content     = `<div class="air-missile1"></div>`;

        this.init(tower, targets, boardSize);
        this.setMissile(index);
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
            this.tower.toggleMissile(this.missile);
            this.destroy();
            return true;
        }
        return false;
    }
}
