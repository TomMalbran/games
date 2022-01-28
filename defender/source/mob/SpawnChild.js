import Mob          from "./Mob.js";



/**
 * Defender Spawn Child
 * @extends {Mob}
 */
export default class SpawnChild extends Mob {

    /**
     * Defender Spawn Child constructor
     * @param {Object} data
     */
    constructor(data) {
        super();

        this.name      = "Spawn Child";
        this.slogan    = "Identity crisis";
        this.text      = "The Child of a Spawn Mob.";
        this.color     = "rgb(31, 142, 30)";

        this.interval  = 1000;
        this.distance  = 10;
        this.amount    = 2;
        this.bosses    = 2;
        this.lifeMult  = 0.8;
        this.baseSpeed = 1;
        this.money     = 1;
        this.defense   = 0;
        this.content   = `<div class="spawn-child"></div>`;

        this.init(data);
    }
}
