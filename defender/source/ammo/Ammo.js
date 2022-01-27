import Tower        from "../tower/Tower.js";
import Mob          from "../mob/Mob.js";

// Utils
import { Iterator } from "../../../utils/List.js";
import Utils        from "../../../utils/Utils.js";



/**
 * Defender Ammo
 */
export default class Ammo {

    /**
     * Defender Ammo constructor
     */
    constructor() {
        this.content     = "";
        this.className   = "";
        this.center      = 0;
        this.rotateTower = false;
        this.rotateAmmo  = false;
    }

    /**
     * Initializes the Ammo
     * @param {Tower}  tower
     * @param {Mob[]}  targets
     * @param {Number} boardSize
     * @returns {Void}
     */
    init(tower, targets, boardSize) {
        this.tower     = tower;
        this.targets   = targets;
        this.timer     = 300;
        this.top       = this.getPos(tower.row);
        this.left      = this.getPos(tower.col);
        this.boardSize = boardSize;
        this.display   = false;
        this.missile   = 0;
        this.element   = null;
        this.iterator  = null;
    }

    /**
     * Creates the element for the Ammo
     * @returns {HTMLElement}
     */
    createElement() {
        this.element              = document.createElement("DIV");
        this.element.className    = this.className;
        this.element.style.top    = Utils.toPX(this.top);
        this.element.style.left   = Utils.toPX(this.left);
        this.element.style.zIndex = String(2);
        this.element.innerHTML    = this.content;

        return this.element;
    }

    /**
     * Destroys the Ammo
     * @returns {Void}
     */
    destroy() {
        Utils.removeElement(this.element);
        this.iterator.removePrev();
    }

    /**
     * Sets the iterator pointing to the Ammos list
     * @param {Iterator} it
     * @returns {Void}
     */
    setIterator(it) {
        this.iterator = it;
    }

    /**
     * Decreases the timer on the ammo. Returns true when reaching 0
     * @param {Number} time
     * @returns {Boolean}
     */
    decTimer(time) {
        this.timer -= time;
        return this.timer <= 0;
    }


    /**
     * Rotates the Tower Canon, and or the Ammo
     * @returns {Void}
     */
    changeAngle() {
        const angle = this.tower.getMobAngle(this.targets[0]);
        if (this.rotateTower) {
            this.tower.rotateCanon(angle);
        }
        if (this.rotateAmmo) {
            this.rotate(angle);
        }
    }

    /**
     * Rotates the Ammo
     * @param {Number} angle
     * @returns {Void}
     */
    rotate(angle) {
        this.element.style.transform = Utils.rotate(angle);
    }

    /**
     * Changes the position of the Ammo
     * @param {Number} time
     * @returns {Void}
     */
    changePos(time) {
        const targetPos = this.targets[0].centerPos;
        this.top       += this.getDist(targetPos.top  - this.top, time);
        this.left      += this.getDist(targetPos.left - this.left, time);

        this.element.style.top  = Utils.toPX(this.top);
        this.element.style.left = Utils.toPX(this.left);
    }

    /**
     * Returns the distance to move the ammo depending on the time
     * @param {Number} dist
     * @param {Number} time
     * @returns {Number}
     */
    getDist(dist, time) {
        return dist * time / this.timer;
    }

    /**
     * Changes the display of the Ammo
     * @returns {Void}
     */
    changeDisplay() {
        if (!this.display) {
            const size = this.tower.size * this.boardSize / 2;
            const pos  = this.tower.centerPos;
            const dist = Math.hypot(this.top - pos.top, this.left - pos.left);

            if (dist > size) {
                this.element.style.display = "block";
                this.display = true;
            }
        }
    }

    /**
     * Returns the center of the Ammo
     * @param {Number} cell
     * @returns {Number}
     */
    getPos(cell) {
        const center = this.tower.getTowerCenter(cell);
        return center - this.center;
    }



    /**
     * Sets the missle index
     * @param {Number} index
     * @returns {Void}
     */
    setMissile(index) {
        this.missile = index;
    }
}
