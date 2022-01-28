import Mob          from "./Mob.js";



/**
 * Defender Normal Mob
 * @extends {Mob}
 */
export default class NormalMob extends Mob {

    /**
     * Defender Normal Mob constructor
     * @param {Object} data
     */
    constructor(data) {
        super();

        this.name      = "Normal";
        this.slogan    = "I am a mob!";
        this.text      = "A normal mob without special abilities.";
        this.color     = "rgb(150, 150, 150)";

        this.interval  = 400;
        this.amount    = 10;
        this.bosses    = 1;
        this.lifeMult  = 1;
        this.baseSpeed = 1;
        this.money     = 1;
        this.defense   = 0;
        this.content   = `<div class="normal-mob"></div>`;

        this.init(data);
    }
}
