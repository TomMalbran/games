import Tower        from "./Tower.js";
import FastAmmo     from "../ammo/FastAmmo.js";
import Mob          from "../mob/Mob.js";



/**
 * Defender Fast Tower
 * @extends {Tower}
 */
export default class FastTower extends Tower {

    /**
     * Defender Fast Tower constructor
     * @param {Number} id
     * @param {Number} row
     * @param {Number} col
     * @param {Number} boardSize
     */
    constructor(id, row, col, boardSize) {
        super();

        this.type    = "Fast";
        this.name    = "Fast Tower";
        this.special = "Typhoon Tower";
        this.text    = "A tower that shoots at a really fast speed.";
        this.levels  = 6;
        this.size    = 2;
        this.sound   = "fast";

        this.costs   = [ 15, 27, 50, 85, 160, 450 ];
        this.damages = [  5, 10, 18, 34,  65, 320 ];
        this.ranges  = [ 60, 60, 60, 60,  60,  90 ];
        this.speeds  = [  6,  6,  6,  6,   6,   9 ];

        this.init(id, row, col, boardSize);
    }

    /**
     * Creates a new Ammo
     * @param {Mob[]} targets
     * @returns {FastAmmo}
     */
    createAmmo(targets) {
        return new FastAmmo(this, targets, this.boardSize);
    }
}
