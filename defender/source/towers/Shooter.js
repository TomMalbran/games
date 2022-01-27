import Towers       from "./Towers.js";
import Tower        from "../tower/Tower.js";
import Ammo         from "../ammo/Ammo.js";
import Mob          from "../mob/Mob.js";

// Utils
import List, { Iterator } from "../../../utils/List.js";



/**
 * Defender Towers Shooter
 */
export default class Shooter {

    /**
     * The Towers Shooter constructor
     * @param {Towers} parent
     */
    constructor(parent) {
        this.parent  = parent;
        this.ammos   = new List();
        this.bullets = document.querySelector(".bullets");

        this.bullets.innerHTML = "";
    }



    /**
     * Iterates through the moving list of mobs and when posible, it asigns a tower to shoot each mob
     * @returns {Void}
     */
    shoot() {
        this.parent.mobs.manager.moving.forEach((it) => {
            /** @type {Mob} */
            const mob    = it.getPrev();
            const towers = this.parent.ranges.getReducedList(mob.row, mob.col);

            if (mob.hitPoints > 0 && towers && !towers.isEmpty) {
                towers.some((data) => {
                    const tower = this.parent.manager.get(data.id);
                    if (tower && !tower.isShooting && tower.canShoot(mob)) {
                        this.processShot(tower, mob);
                    }
                    if (mob.hitPoints <= 0) {
                        return true;
                    }
                });
            }
        });
    }

    /**
     * Makes the Tower shoot the mob and others depending on the tower
     * @param {Tower} tower
     * @param {Mob}   mob
     * @returns {Void}
     */
    processShot(tower, mob) {
        const targets = tower.getTargets(this.parent.mobs.manager.moving, mob);

        this.parent.ranges.startShoot(tower);
        tower.startShoot();

        targets.forEach((list, index) => {
            const ammo = this.createAmmo(tower, list, index + 1);
            this.parent.sounds[tower.sound]();

            list.forEach(function (nmob) {
                nmob.decHitPoints(tower.damage);
            });

            if (tower.canLock) {
                tower.setAngle(mob, ammo);
            }
            tower.addAmmo(list.length);
        });

        this.parent.manager.addShoot(tower.id);
        tower.toggleAttack(targets.length);
    }



    /**
     * Creates a new Ammo
     * @param {Tower}  tower
     * @param {Mob[]}  targets
     * @param {Number} index
     * @returns {Ammo}
     */
    createAmmo(tower, targets, index) {
        const ammo = tower.createAmmo(targets, index);
        const it   = this.ammos.addLast(ammo);

        ammo.setIterator(it);
        this.bullets.appendChild(ammo.createElement());
        return ammo;
    }

    /**
     * Moves all the Ammos till they reach the target, and it then performs the required tasks
     * @param {Number} time
     * @returns {Void}
     */
    moveAmmos(time) {
        this.ammos.forEach((ammo) => {
            const tower = ammo.tower;
            if (ammo.move(time)) {
                this.attackTargets(ammo.targets, tower.damage);
                this.parent.mobs.addToList(ammo.targets, tower);

                if (tower.canFire && tower.canDestroy) {
                    this.parent.manager.destroyTower(tower);
                }
                if (ammo.hitSound) {
                    this.parent.sounds[ammo.hitSound]();
                }
            }
        });
    }



    /**
     * Does the final attack on the mobs reducing their actual life
     * @param {Mob[]} targets
     * @param {Number}      damage
     * @returns {Void}
     */
    attackTargets(targets, damage) {
        targets.forEach((mob)=> {
            mob.hit(damage);
            this.parent.panel.updateMob(mob);

            if (mob.life <= 0 && !mob.isDead) {
                this.parent.mobs.killMob(mob);
            }
        });
    }
}
