/**
 * @extends {Mob}
 * The Decoy Child Class
 */
class DecoyChild extends Mob {

    /**
     * The Decoy Child Class
     * @param {Object} data
     */
    constructor(data) {
        super();

        this.name     = "Decoy Child";
        this.slogan   = "Harder, but easier";
        this.text     = "The Child of the Decoy Mob.";
        this.color    = "rgb(113, 150, 105)";

        this.interval = 1000;
        this.distance = 5;
        this.amount   = 4;
        this.bosses   = 4;
        this.life     = 1;
        this.money    = 1;
        this.speed    = 0.5;
        this.defense  = 0;
        this.content  = `<div class="decoyChild"></div>`;

        this.init(data);
    }
}
