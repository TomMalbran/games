/**
 * @extends {Ammo}
 * The Earthquake Ammo Class
 */
class EarthquakeAmmo extends Ammo {

    /**
     * The Earthquake Ammo constructor
     * @param {Tower} tower
     * @param {Array} targets
     * @param {number} boardSize
     */
    constructor(tower, targets, boardSize) {
        super();

        this.center      = 40;
        this.rotateTower = false;
        this.rotateAmmo  = false;
        this.className   = "earthAmmo";
        this.opacity     = 0;

        this.init(tower, targets, boardSize);
    }

    /**
     * Moves the ammo according to the given time. Returns true if it reached the target
     * @param {number} time
     * @return {boolean}
     */
    move(time) {
        this.fadeIn();

        if (this.decTimer(time)) {
            this.destroy();
            return true;
        }
        return false;
    }

    /**
     * Makes the ammo fade in
     */
    fadeIn() {
        this.opacity += 0.1;
        this.element.style.opacity = this.opacity;
    }
}
