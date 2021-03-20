/**
 * The Inmune Mob Class
 * @extends {Mob}
 */
class InmuneMob extends Mob {

    /**
     * The Inmune Mob constructor
     * @param {Object} data
     */
    constructor(data) {
        super();

        this.name     = "Inmune";
        this.slogan   = "Try to slow me";
        this.text     = "A mob that is inmune to slow towers.";
        this.color    = "rgb(220, 120, 254)";

        this.interval = 400;
        this.amount   = 10;
        this.bosses   = 1;
        this.life     = 1;
        this.money    = 1;
        this.speed    = 1;
        this.defense  = 0;
        this.inmune   = true;
        this.content  = `
            <div class="inmuneLine1"></div>
            <div class="inmuneLine2"></div>
            <div class="inmuneLine3"></div>
            <div class="inmuneLine4"></div>
            <div class="inmuneBody"></div>
        `;

        this.init(data);
    }
}
