/**
 * @extends {Mob}
 * The Dark Mob Class
 */
class DarkMob extends Mob {

    /**
     * The Dark Mob Class
     * @param {Object} data
     */
    constructor(data) {
        super();

        this.name     = "Dark";
        this.slogan   = "The creepy mob";
        this.text     = "They have a defense that protects them from some damage.";
        this.color    = "rgb(90, 90, 90)";

        this.interval = 800;
        this.amount   = 5;
        this.bosses   = 1;
        this.life     = 1.8;
        this.money    = 1.5;
        this.speed    = 0.6;
        this.defense  = 10;
        this.content  =
            "<div class='darkHead'></div>" +
            "<div class='darkTail'></div>";

        this.init(data);
    }
}
