/**
 * @extends {Tower}
 * The Anti-Air Tower Class
 */
class AntiAirTower extends Tower {
    
    /**
     * The Anti-Air Tower constructor
     * @param {number} id
     * @param {number} row
     * @param {number} col
     * @param {number} boardSize
     */
    constructor(id, row, col, boardSize) {
        super();
        
        this.type      = "AntiAir";
        this.name      = "Anti-Air Tower";
        this.special   = "Storm Tower";
        this.text      = "Hits the flyer mobs only at a great speed.";
        this.levels    = 6;
        this.size      = 2;
        this.sound     = "antiair";
        
        this.costs     = [ 50, 80, 120, 195, 320, 630 ];
        this.damages   = [ 20, 40,  80, 160, 320, 480 ];
        this.ranges    = [ 60, 60,  60,  60,  60,  75 ];
        this.speeds    = [  4,  4,   4,   4,   4,   6 ];
        this.ammoRange = 30;
        
        this.init(id, row, col, boardSize);
    }
    
    /**
     * Creates a new Ammo
     * @param {Array.<Mob>} targets
     * @param {number}      index
     * @return {AntiAirAmmo}
     */
    createAmmo(targets, index) {
        return new AntiAirAmmo(this, targets, this.boardSize, index);
    }
    
    
    /**
     * Returns a list of Mobs close to the given one. Maximum of 4
     * @param {List.<Iterator>} mobs
     * @param {Mob} mob
     * @return {Array.<Array.<Mob>>}
     */
    getTargets(mobs, mob) {
        let targets = this.getCloseTargets(mobs, mob),
            total   = Math.min(targets.length, 4),
            result  = [];
        
        for (let i = 0; i < total; i += 1) {
            result.push([targets[i]]);
        }
        return result;
    }
    
    /**
     * Toggles the attacking class
     * @param {number} amount
     */
    toggleAttack(amount) {
        for (let i = 1; i <= amount; i += 1) {
            this.toggleMissile(i);
        }
    }
    
    /**
     * Toggles the attacking class for a single Missile
     * @param {number} amount
     */
    toggleMissile(index) {
        this.element.classList.toggle("missile" + index);
    }
    
    /**
     * Returns true if the given Mob is a valid target
     * @param {Mob} mob
     * @return {boolean}
     */
    isValidTarget(mob) {
        return mob.isFlyer();
    }
}
