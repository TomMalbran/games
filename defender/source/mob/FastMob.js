/**
 * The Fast Mob Class
 * @extends {Mob}
 */
class FastMob extends Mob {

    /**
     * The Fast Mob constructor
     * @param {Object} data
     */
    constructor(data) {
        super();

        this.name     = "Fast";
        this.slogan   = "This is speed";
        this.text     = "A mob that moves faster than the others.";
        this.color    = "rgb(216, 135, 152)";

        this.interval = 600;
        this.amount   = 10;
        this.bosses   = 1;
        this.life     = 1;
        this.money    = 1;
        this.speed    = 1.5;
        this.defense  = 0;
        this.content  = `
            <div class="fastHead"></div>
            <div class="fastTail"></div>
        `;

        this.init(data);
    }
}
