import Mob          from "./Mob.js";



/**
 * Defender Decoy Child
 * @extends {Mob}
 */
export default class DecoyChild extends Mob {

    /**
     * Defender Decoy Child constructor
     * @param {Object} data
     */
    constructor(data) {
        super();

        this.name      = "Decoy Child";
        this.slogan    = "Harder, but easier";
        this.text      = "The Child of the Decoy Mob.";
        this.color     = "rgb(113, 150, 105)";

        this.interval  = 1000;
        this.distance  = 5;
        this.amount    = 4;
        this.bosses    = 4;
        this.lifeMult  = 1;
        this.baseSpeed = 0.5;
        this.money     = 1;
        this.defense   = 0;
        this.content   = `<div class="decoy-child"></div>`;

        this.init(data);
    }
}
