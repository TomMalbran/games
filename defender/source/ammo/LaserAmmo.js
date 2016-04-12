/**
 * @extends {Ammo}
 * The Laser Ammo Class
 */
class LaserAmmo extends Ammo {
    
    /**
     * The Laser Ammo constructor
     * @param {Tower} tower
     * @param {Array} targets
     * @param {number} boardSize
     */
    constructor(tower, targets, boardSize) {
        super();
        
        this.center      = 0;
        this.rotateTower = true;
        this.rotateAmmo  = false;
        this.className   = "laserAmmo";
        
        this.init(tower, targets, boardSize);
    }
    
    /**
     * Moves the ammo according to the given time. Returns true if it reached the target
     * @param {number} time
     * @return {boolean}
     */
    move(time) {
        if (this.decTimer(time)) {
            this.destroy();
            return true;
        }
        return false;
    }
    
    /**
     * Rotates the Ammo
     * @param {number} angle
     */
    rotate(angle) {
        this.element.style.transform = "rotate(" + angle + "deg) translateX(20px)";
    }
}
