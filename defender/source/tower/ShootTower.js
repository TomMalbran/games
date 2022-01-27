import Tower        from "./Tower.js";
import ShootAmmo    from "../ammo/ShootAmmo.js";
import Mob          from "../mob/Mob.js";



/**
 * Defender Shoot Tower
 * @extends {Tower}
 */
export default class ShootTower extends Tower {

    /**
     * Defender Shoot Tower constructor
     * @param {Number} id
     * @param {Number} row
     * @param {Number} col
     * @param {Number} boardSize
     */
    constructor(id, row, col, boardSize) {
        super();

        this.type    = "Shoot";
        this.name    = "Shoot Tower";
        this.special = "Sniper Tower";
        this.text    = "A cheap shooting tower.";
        this.levels  = 6;
        this.size    = 2;
        this.sound   = "shoot";

        this.costs   = [   5,  10,  20,  40,  80, 200 ];
        this.damages = [  10,  20,  40,  80, 160, 400 ];
        this.ranges  = [  60,  60,  60,  60,  60, 150 ];
        this.speeds  = [ 1.5, 1.5, 1.5, 1.5, 1.5, 1.1 ];

        this.init(id, row, col, boardSize);
    }

    /**
     * Creates a new Ammo
     * @param {Mob[]} targets
     * @returns {ShootAmmo}
     */
    createAmmo(targets) {
        return new ShootAmmo(this, targets, this.boardSize);
    }
}
