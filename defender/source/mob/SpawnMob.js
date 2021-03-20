/**
 * The Spawn Mob Class
 * @extends {Mob}
 */
class SpawnMob extends Mob {

    /**
     * The Spawn Mob constructor
     * @param {Object} data
     */
    constructor(data) {
        super();

        this.name     = "Spawn";
        this.slogan   = "Identity crisis";
        this.text     = "After killing this mob it will split in 2.";
        this.color    = "rgb(31, 142, 30)";

        this.interval = 1000;
        this.amount   = 5;
        this.bosses   = 1;
        this.life     = 1.8;
        this.money    = 2.5;
        this.speed    = 1;
        this.defense  = 0;
        this.child    = "SpawnChild";
        this.content  = `
            <div class="spawnHead"></div>
            <div class="spawnTail"></div>
        `;

        this.init(data);
    }
}
