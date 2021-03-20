/**
 * @extends {Mob}
 * The Hopper Mob Class
 */
class HopperMob extends Mob {

    /**
     * The Hopper Mob constructor
     * @param {Object} data
     */
    constructor(data) {
        super();

        this.name     = "Hopper";
        this.slogan   = "Jumping all around";
        this.text     = "This mob can jump throught diagonal spaces in between towers.";
        this.color    = "rgb(195, 60, 195)";

        this.interval = 600;
        this.amount   = 10;
        this.bosses   = 1;
        this.life     = 1;
        this.money    = 1;
        this.speed    = 2;
        this.defense  = 0;
        this.hopper   = true;
        this.content  = "<div class='hopperMob'></div>";

        this.minHopTime = 300;
        this.maxHopTime = 600;

        this.init(data);
    }


    /**
     * Allows this mob to jump through small gaps in the layout
     * @param {number} time
     * @param {boolean} newCell
     * @param {boolean} turned
     */
    specialPower(time, newCell, turned) {
        this.timer += time;
        if (this.timer > this.minHopTime && this.timer < this.maxHopTime) {
            this.actualSpeed = 0;
        } else if (this.timer > this.maxHopTime) {
            this.actualSpeed = this.speed;
            this.timer = 0;
        }
    }
}
