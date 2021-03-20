/**
 * The Flying Mob Class
 * @extends {Mob}
 */
class FlyingMob extends Mob {

    /**
     * The Flying Mob constructor
     * @param {Object} data
     */
    constructor(data) {
        super();

        this.name     = "Flying";
        this.slogan   = "I can Fly!";
        this.text     = "This mob goes in straight line to the exit.";
        this.color    = "rgb(192, 169, 46)";

        this.interval = 400;
        this.amount   = 10;
        this.bosses   = 1;
        this.life     = 0.5;
        this.money    = 1;
        this.speed    = 1;
        this.defense  = 0;
        this.flyer    = true;
        this.content  = `
            <div class="flyingMob"></div>
            <div class="flyingShadow"></div>
        `;

        this.init(data);
    }
}
