import Mob          from "./Mob.js";



/**
 * Defender Arrow Mob
 * @extends {Mob}
 */
export default class ArrowMob extends Mob {

    /**
     * Defender Arrow Mob constructor
     * @param {Object} data
     */
    constructor(data) {
        super();

        this.name      = "Arrow";
        this.slogan    = "Fast and furious";
        this.text      = "Fast in straight lines, slow in curves";
        this.color     = "rgb(207, 99, 99)";

        this.interval  = 600;
        this.amount    = 10;
        this.bosses    = 1;
        this.lifeMult  = 0.8;
        this.baseSpeed = 2;
        this.money     = 1;
        this.defense   = 0;
        this.isArrow   = true;
        this.content   = `
            <div class="arrow-head"></div>
            <div class="arrow-tail"></div>
        `;

        this.init(data);
    }



    /**
     * Changes the speed of the mob depending on whether is in a straight line or turning
     * @param {Number}  time
     * @param {Boolean} newCell
     * @param {Boolean} turned
     * @returns {Void}
     */
    specialPower(time, newCell, turned) {
        if (newCell) {
            this.counter += 1;
            if (this.counter > 1) {
                this.actualSpeed = this.baseSpeed;
            }
        }
        if (turned) {
            this.counter = 0;
            this.actualSpeed = this.baseSpeed / 2;
        }
    }
}
