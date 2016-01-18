/**
 * @extends {Mob}
 * The Decoy Mob Class
 */
class DecoyMob extends Mob {
    
    /**
     * The Decoy Mob constructor
     * @param {Object} data
     */
    constructor(data) {
        super();
        
        this.name     = "Decoy";
        this.slogan   = "Harder, but easier";
        this.text     = "After killing it, it will split into 4 very slow mobs.";
        this.color    = "rgb(113, 150, 105)";
        
        this.interval = 1000;
        this.amount   = 4;
        this.bosses   = 1;
        this.life     = 0.8;
        this.money    = 2;
        this.speed    = 1.5;
        this.defense  = 0;
        this.child    = "DecoyChild";
        this.content  =
            "<div class='decoyHead'></div>" +
            "<div class='decoyBody'></div>";
        
        this.init(data);
    }
}
