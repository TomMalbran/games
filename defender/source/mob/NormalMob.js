/**
 * @extends {Mob}
 * The Normal Mob Class
 */
class NormalMob extends Mob {

    /**
     * The Normal Mob constructor
     * @param {Object} data
     */
    constructor(data) {
        super();

        this.name     = "Normal";
        this.slogan   = "I am a mob!";
        this.text     = "A normal mob without special abilities.";
        this.color    = "rgb(150, 150, 150)";

        this.interval = 400;
        this.amount   = 10;
        this.bosses   = 1;
        this.life     = 1;
        this.money    = 1;
        this.speed    = 1;
        this.defense  = 0;
        this.content  = "<div class='normalMob'></div>";

        this.init(data);
    }
}
