import Tower        from "./Tower.js";
import SnapAmmo     from "../ammo/SnapAmmo.js";
import Mob          from "../mob/Mob.js";

// Utils
import List         from "../../../utils/List.js";
import Utils        from "../../../utils/Utils.js";



/**
 * The Snap Tower Class
 * @extends {Tower}
 */
export default class SnapTower extends Tower {

    /**
     * The Snap Tower constructor
     * @param {Number} id
     * @param {Number} row
     * @param {Number} col
     * @param {Number} boardSize
     */
    constructor(id, row, col, boardSize) {
        super();

        this.type    = "Snap";
        this.name    = "Snap Tower";
        this.special = "Spike Tower";
        this.text    = "A one time only range fire tower";
        this.levels  = 6;
        this.size    = 2;
        this.sound   = "snap";
        this.stuns   = true;
        this.fire    = true;

        this.costs   = [  50, 100, 150, 250,  400,  600 ];
        this.damages = [ 100, 200, 400, 800, 1600, 3200 ];
        this.ranges  = [  60,  60,  75,  75,   75,   90 ];
        this.speeds  = [   1,   1,   1,   1,    1,    1 ];

        this.init(id, row, col, boardSize);
    }

    /**
     * Creates a new Ammo
     * @param {Mob[]} targets
     * @returns {SnapAmmo}
     */
    createAmmo(targets) {
        return new SnapAmmo(this, targets, this.boardSize);
    }



    /**
     * Returns a list of Mobs in the range of the tower
     * @param {List} mobs
     * @param {Mob}  mob
     * @returns {Mob[][]}
     */
    getTargets(mobs, mob) {
        const targets = this.getRangeTargets(mobs);
        const result  = [];

        for (let i = 0; i < targets.length; i += 1) {
            result.push([ targets[i] ]);
        }
        return result;
    }

    /**
     * Returns true if it will stun a mob
     * @returns {Boolean}
     */
    get shouldStun() {
        return Utils.rand(0, 9) === 5;
    }
}
