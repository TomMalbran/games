/**
 * @extends {Tower}
 * The Laser Tower Class
 */
class LaserTower extends Tower {

    /**
     * The Laser Tower Class
     * @param {number} id
     * @param {number} row
     * @param {number} col
     * @param {number} boardSize
     */
    constructor(id, row, col, boardSize) {
        super();

        this.type    = "Laser";
        this.name    = "Laser Tower";
        this.special = "Laser-Beam Tower";
        this.text    = "Great range and damage, but lineal";
        this.levels  = 6;
        this.size    = 3;
        this.sound   = "laser";
        this.lock    = true;

        this.costs   = [    30,    67,   140,   265,   410,   590 ];
        this.damages = [    22,    48,   100,   177,   289,   622 ];
        this.ranges  = [ 112.5, 112.5, 112.5, 112.5, 112.5, 112.5 ];
        this.speeds  = [     1,     1,     1,     1,     1,     1 ];

        this.init(id, row, col, boardSize);
    }


    /**
     * Returns a list of Mobs in a lineal range of the tower
     * @param {List.<Iterator>} mobs
     * @param {Mob} mob
     * @return {Array.<Array.<Mob>>}
     */
    getTargets(mobs, mob) {
        let angle = this.getMobAngle(mob);
        return [ this.getLinealTargets(mobs, angle) ];
    }

    /**
     * Returns a list with the targets in the same line as the position of the tower canon
     * @param {Array.<Mob>} mobs
     * @param {number} angle
     * @return {Array.<Mob>}
     */
    getLinealTargets(mobs, angle) {
        let list = [];

        mobs.forEach((it) => {
            let mob        = it.getPrev(),
                inRange    = this.inRange(mob, 3),
                validAngle = this.validAngle(angle, this.getMobAngle(mob));

            if (mob.getHitPoints() > 0 && inRange && validAngle) {
                list.push(mob);
            }
        });
        return list;
    }


    /**
     * Returns true if the given Mob is a valid target
     * @param {Mob} mob
     * @return {boolean}
     */
    isValidTarget(mob) {
        let angle = this.getMobAngle(mob);
        return !this.locked || this.validAngle(this.angle, angle);
    }

    /**
     * Rotates the Tower and Ammo right after it starts shooting
     * @param {Mob} mob
     * @param {Ammo} ammo
     */
    setAngle(mob, ammo) {
        let angle = this.getMobAngle(mob);
        if (this.locked) {
            angle = this.angle;
        } else {
            this.rotateCanon(angle);
        }
        ammo.rotate(angle);
    }
}
