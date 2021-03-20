/**
 * @extends {Tower}
 * The Frost Tower Class
 */
class FrostTower extends Tower {

    /**
     * The Frost Tower constructor
     * @param {number} id
     * @param {number} row
     * @param {number} col
     * @param {number} boardSize
     */
    constructor(id, row, col, boardSize) {
        super();

        this.type      = "Frost";
        this.name      = "Frost Tower";
        this.special   = "Blizzard Tower";
        this.text      = "Hits and slow the mobs for some time.";
        this.levels    = 6;
        this.size      = 2;
        this.sound     = "frost";
        this.slows     = true;

        this.costs     = [  50,  75, 100, 125, 150, 200 ];
        this.damages   = [  10,  15,  20,  25,  30,  40 ];
        this.ranges    = [  60,  60,  60,  60,  60,  75 ];
        this.speeds    = [ 1.5, 1.5, 1.5, 1.5, 1.5, 1.5 ];
        this.ammoRange = 20;

        this.init(id, row, col, boardSize);
    }

    /**
     * Creates a new Ammo
     * @param {Array.<Mob>} targets
     * @return {FrostAmmo}
     */
    createAmmo(targets) {
        return new FrostAmmo(this, targets, this.boardSize);
    }


    /**
     * Returns a list of Mobs close to the given one
     * @param {List.<Iterator>} mobs
     * @param {Mob} mob
     * @return {Array.<Array.<Mob>>}
     */
    getTargets(mobs, mob) {
        return [ this.getCloseTargets(mobs, mob) ];
    }

    /**
     * Returns true if the given Mob is a valid target
     * @param {Mob} mob
     * @return {boolean}
     */
    isValidTarget(mob) {
        return !mob.isInmune();
    }
}
