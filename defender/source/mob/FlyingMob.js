import Mob          from "./Mob.js";



/**
 * Defender Flying Mob
 * @extends {Mob}
 */
export default class FlyingMob extends Mob {

    /**
     * Defender Flying Mob constructor
     * @param {Object} data
     */
    constructor(data) {
        super();

        this.name      = "Flying";
        this.slogan    = "I can Fly!";
        this.text      = "This mob goes in straight line to the exit.";
        this.color     = "rgb(192, 169, 46)";

        this.interval  = 400;
        this.amount    = 10;
        this.bosses    = 1;
        this.lifeMult  = 0.5;
        this.baseSpeed = 1;
        this.money     = 1;
        this.defense   = 0;
        this.isFlyer   = true;
        this.content   = `
            <div class="flying-mob"></div>
            <div class="flying-shadow"></div>
        `;

        this.init(data);
    }
}
