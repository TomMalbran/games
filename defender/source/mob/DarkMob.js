import Mob          from "./Mob.js";



/**
 * Defender Dark Mob
 * @extends {Mob}
 */
export default class DarkMob extends Mob {

    /**
     * Defender Dark Mob constructor
     * @param {Object} data
     */
    constructor(data) {
        super();

        this.name      = "Dark";
        this.slogan    = "The creepy mob";
        this.text      = "They have a defense that protects them from some damage.";
        this.color     = "rgb(90, 90, 90)";

        this.interval  = 800;
        this.amount    = 5;
        this.bosses    = 1;
        this.lifeMult  = 1.8;
        this.baseSpeed = 0.6;
        this.money     = 1.5;
        this.defense   = 10;
        this.content   = `
            <div class="dark-head"></div>
            <div class="dark-tail"></div>
        `;

        this.init(data);
    }
}
