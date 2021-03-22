/**
 * The Earthquake Tower Class
 * @extends {Tower}
 */
class EarthquakeTower extends Tower {

    /**
     * The Earthquake Tower constructor
     * @param {Number} id
     * @param {Number} row
     * @param {Number} col
     * @param {Number} boardSize
     */
    constructor(id, row, col, boardSize) {
        super();

        this.type    = "Earthquake";
        this.name    = "Earthquake Tower";
        this.special = "Tsunami Tower";
        this.text    = "Damages the ground around it. Has a chance to stun.";
        this.levels  = 6;
        this.size    = 2;
        this.stuns   = true;
        this.sound   = "earth";

        this.costs   = [ 100, 220, 365, 540, 800, 1250 ];
        this.damages = [  60, 120, 240, 480, 960, 2000 ];
        this.ranges  = [  30,  30,  30,  30,  30,   30 ];
        this.speeds  = [ 1.3, 1.3, 1.3, 1.3, 1.3,  1.6 ];

        this.init(id, row, col, boardSize);
    }

    /**
     * Creates a new Ammo
     * @param {Array.<Mob>} targets
     * @returns {EarthquakeAmmo}
     */
    createAmmo(targets) {
        return new EarthquakeAmmo(this, targets, this.boardSize);
    }



    /**
     * Returns a list of Mobs in the range of the tower
     * @param {List.<Iterator>} mobs
     * @param {Mob} mob
     * @returns {Array.<Array.<Mob>>}
     */
    getTargets(mobs, mob) {
        return [ this.getRangeTargets(mobs) ];
    }

    /**
     * Returns true if the given Mob is a valid target
     * @param {Mob} mob
     * @returns {Boolean}
     */
    isValidTarget(mob) {
        return !mob.isFlyer;
    }

    /**
     * Returns true if it will stun a mob
     * @returns {Boolean}
     */
    get shouldStun() {
        return Utils.rand(1, 6) === 3;
    }
}
