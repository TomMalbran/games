/**
 * @extends {Ammo}
 * The Snap Ammo Class
 */
class SnapAmmo extends Ammo {
    
    /**
     * The Snap Ammo constructor
     * @param {Tower} tower
     * @param {Array} targets
     * @param {number} boardSize
     */
    constructor(tower, targets, boardSize) {
        super();
        
        this.center      = 0;
        this.rotateTower = false;
        this.rotateAmmo  = true;
        this.className   = "snapAmmo";
        
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
        
        if (this.decTimer(time)) {
            this.tower.decAmmo();
            this.destroy();
            return true;
        }
        return false;
    }
}
