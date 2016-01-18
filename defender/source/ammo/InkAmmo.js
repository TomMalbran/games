/**
 * @extends {Ammo}
 * The Ink Ammo Class
 */
class InkAmmo extends Ammo {
    
    /**
     * The Ink Ammo constructor
     * @param {Tower} tower
     * @param {Array} targets
     * @param {number} boardSize
     */
    constructor(tower, targets, boardSize) {
        super();
        
        this.center      = 0.5;
        this.rotateTower = true;
        this.rotateAmmo  = false;
        this.className   = "inkAmmo";
        
        this.init(tower, targets, boardSize);
    }
    
    /**
     * Moves the ammo according to the given time. Returns true if it reached the target
     * @param {number} time
     * @return {boolean}
     */
    move(time) {
        this.changeAngle();
        this.changePos(time);
        this.changeDisplay();
        
        if (this.decTimer(time)) {
            this.destroy();
            return true;
        }
        return false;
    }
}
