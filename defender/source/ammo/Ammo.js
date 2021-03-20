/**
 * The Ammo Base Class
 */
class Ammo {

    /**
     * Initializes the Ammo
     * @param {Tower} tower
     * @param {Array} targets
     * @param {number} boardSize
     */
    init(tower, targets, boardSize) {
        this.tower     = tower;
        this.targets   = targets;
        this.timer     = 300;
        this.top       = this.getPos(tower.getRow());
        this.left      = this.getPos(tower.getCol());
        this.boardSize = boardSize;
        this.display   = false;
        this.missile   = 0;
        this.element   = null;
        this.iterator  = null;
    }

    /**
     * Creates the element for the Ammo
     * @return {DOMElement}
     */
    createElement() {
        this.element              = document.createElement("DIV");
        this.element.className    = this.className;
        this.element.style.top    = this.top  + "px";
        this.element.style.left   = this.left + "px";
        this.element.style.zIndex = 2;
        this.element.innerHTML    = this.content || "";

        return this.element;
    }

    /**
     * Destroys the Ammo
     */
    destroy() {
        Utils.removeElement(this.element);
        this.iterator.removePrev();
    }

    /**
     * Sets the iterator pointing to the Ammos list
     * @param {Iterator}
     */
    setIterator(it) {
        this.iterator = it;
    }

    /**
     * Decreases the timer on the ammo. Returns true when reaching 0
     * @param {number} time
     * @return {boolean}
     */
    decTimer(time) {
        this.timer -= time;
        return this.timer <= 0;
    }


    /**
     * Rotates the Tower Canon, and or the Ammo
     */
    changeAngle() {
        let angle = this.tower.getMobAngle(this.targets[0]);
        if (this.rotateTower) {
            this.tower.rotateCanon(angle);
        }
        if (this.rotateAmmo) {
            this.rotate(angle);
        }
    }

    /**
     * Rotates the Ammo
     * @param {number} angle
     */
    rotate(angle) {
        this.element.style.transform = "rotate(" + angle + "deg)";
    }

    /**
     * Changes the position of the Ammo
     * @param {number} time
     */
    changePos(time) {
        let targetPos = this.targets[0].getCenterPos();
        this.top     += this.getDist(targetPos.top  - this.top, time);
        this.left    += this.getDist(targetPos.left - this.left, time);

        this.element.style.top  = Math.round(this.top)  + "px";
        this.element.style.left = Math.round(this.left) + "px";
    }

    /**
     * Returns the distance to move the ammo depending on the time
     * @param {number} dist
     * @param {number} time
     * @return {number}
     */
    getDist(dist, time) {
        return dist * time / this.timer;
    }

    /**
     * Changes the display of the Ammo
     */
    changeDisplay() {
        if (!this.display) {
            let size = this.tower.getSize() * this.boardSize / 2,
                pos  = this.tower.getCenterPos(),
                dist = Math.hypot(this.top - pos.top, this.left - pos.left);

            if (dist > size) {
                this.element.style.display = "block";
                this.display = true;
            }
        }
    }

    /**
     * Returns the center of the Ammo
     * @param {number} cell
     * @return {number}
     */
    getPos(cell) {
        let center = this.tower.getTowerCenter(cell);
        return center - this.center;
    }


    /**
     * Returns the Tower which shoot this ammo
     * @return {Tower}
     */
    getTower() {
        return this.tower;
    }

    /**
     * Returns the Mobs that this ammo will hit
     * @return {Array.<Mob>}
     */
    getTargets() {
        return this.targets;
    }

    /**
     * Sets the missle index
     * @param {number} index
     */
    setMissile(index) {
        this.missile = index;
    }

    /**
     * Returns the missle index
     * @return {number}
     */
    getMissile() {
        return this.missile;
    }

    /**
     * Returns the sound made when hitting the target, if it has one
     * @return {string}
     */
    getHitSound() {
        return this.hitSound;
    }
}
