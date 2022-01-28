import Mob          from "./Mob.js";



/**
 * Defender Fast Mob
 * @extends {Mob}
 */
export default class FastMob extends Mob {

    /**
     * Defender Fast Mob constructor
     * @param {Object} data
     */
    constructor(data) {
        super();

        this.name      = "Fast";
        this.slogan    = "This is speed";
        this.text      = "A mob that moves faster than the others.";
        this.color     = "rgb(216, 135, 152)";

        this.interval  = 600;
        this.amount    = 10;
        this.bosses    = 1;
        this.lifeMult  = 1;
        this.baseSpeed = 1.5;
        this.money     = 1;
        this.defense   = 0;
        this.content   = `
            <div class="fast-head"></div>
            <div class="fast-tail"></div>
        `;

        this.init(data);
    }
}
