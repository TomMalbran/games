import Mob          from "./Mob.js";



/**
 * Defender Inmune Mob
 * @extends {Mob}
 */
export default class InmuneMob extends Mob {

    /**
     * Defender Inmune Mob constructor
     * @param {Object} data
     */
    constructor(data) {
        super();

        this.name      = "Inmune";
        this.slogan    = "Try to slow me";
        this.text      = "A mob that is inmune to slow towers.";
        this.color     = "rgb(220, 120, 254)";

        this.interval  = 400;
        this.amount    = 10;
        this.bosses    = 1;
        this.lifeMult  = 1;
        this.baseSpeed = 1;
        this.money     = 1;
        this.defense   = 0;
        this.isInmune  = true;
        this.content   = `
            <div class="inmune-line1"></div>
            <div class="inmune-line2"></div>
            <div class="inmune-line3"></div>
            <div class="inmune-line4"></div>
            <div class="inmune-body"></div>
        `;

        this.init(data);
    }
}
