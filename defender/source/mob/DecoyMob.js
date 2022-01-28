import Mob          from "./Mob.js";



/**
 * Defender Decoy Mob
 * @extends {Mob}
 */
export default class DecoyMob extends Mob {

    /**
     * Defender Decoy Mob constructor
     * @param {Object} data
     */
    constructor(data) {
        super();

        this.name      = "Decoy";
        this.slogan    = "Harder, but easier";
        this.text      = "After killing it, it will split into 4 very slow mobs.";
        this.color     = "rgb(113, 150, 105)";

        this.interval  = 1000;
        this.amount    = 4;
        this.bosses    = 1;
        this.lifeMult  = 0.8;
        this.baseSpeed = 1.5;
        this.money     = 2;
        this.defense   = 0;
        this.childName = "DecoyChild";
        this.content   = `
            <div class="decoy-head"></div>
            <div class="decoy-body"></div>
        `;

        this.init(data);
    }
}
