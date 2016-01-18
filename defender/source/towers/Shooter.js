/**
 * The Towers Shooter Class
 */
class Shooter {
    
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
     */
    shoot() {
        this.parent.mobs.getMovingMobs().forEach((it) => {
            let mob    = it.getPrev(),
                towers = this.parent.ranges.getReducedList(mob.getRow(), mob.getCol());
            
            if (mob.getHitPoints() > 0 && towers && !towers.isEmpty()) {
                this.shootMob(towers, mob);
            }
        });
    }
    
    /**
     * For a single mob, shot it with all the towers that can reach it and attack it
     * @param {List.<Tower>} towers
     * @param {Mob} mob
     */
    shootMob(towers, mob) {
        towers.some((element) => {
            let tower = this.parent.manager.get(element.id);
            if (tower && !tower.isShooting() && tower.canShoot(mob)) {
                this.processShot(tower, mob);
            }
            if (mob.getHitPoints() <= 0) {
                return true;
            }
        });
    }
    
    /**
     * Makes the Tower shoot the mob and others depending on the tower
     * @param {Tower} tower
     * @param {Mob} mob
     */
    processShot(tower, mob) {
        let targets = tower.getTargets(this.parent.mobs.getMovingMobs(), mob);
        
        this.parent.ranges.startShoot(tower);
        tower.startShoot();
        
        targets.forEach((list, index) => {
            let ammo = this.createAmmo(tower, list, index + 1);
            this.parent.sounds[tower.getSoundName()]();
            
            list.forEach(function (nmob) {
                nmob.decHitPoints(tower.getDamage());
            });
            
            if (tower.canLock()) {
                tower.setAngle(mob, ammo);
            }
            tower.addAmmo(list.length);
        });
        
        this.parent.manager.addShoot(tower.getID());
        tower.toggleAttack(targets.length);
    }
    
    
    /**
     * Creates a new Ammo
     * @param {Tower} tower
     * @param {Array.<Mob>} targets
     * @param {number} index
     * @return {Ammo}
     */
    createAmmo(tower, targets, index) {
        let ammo = tower.createAmmo(targets, index),
            it   = this.ammos.addLast(ammo);
        
        ammo.setIterator(it);
        this.bullets.appendChild(ammo.createElement());
        return ammo;
    }
    
    /**
     * Moves all the Ammos till they reach the target, and it then performs the required tasks
     * @param {number} time
     */
    moveAmmos(time) {
        this.ammos.forEach((ammo) => {
            let tower = ammo.getTower();
            if (ammo.move(time)) {
                this.attackTargets(ammo.getTargets(), tower.getDamage());
                this.parent.mobs.addToList(ammo.getTargets(), tower);
                
                if (tower.canFire() && tower.canDestroy()) {
                    this.parent.manager.destroyTower(tower);
                }
                if (ammo.getHitSound()) {
                    this.parent.sounds[ammo.getHitSound()]();
                }
            }
        });
    }
    
    
    /**
     * Does the final attack on the mobs reducing their actual life
     * @param {Array.<Mob>} targets
     * @param {number} damage
     */
    attackTargets(targets, damage) {
        targets.forEach((mob)=> {
            mob.hit(damage);
            this.parent.panel.updateMob(mob);
            
            if (mob.getLife() <= 0 && !mob.isDead()) {
                this.parent.mobs.killMob(mob);
            }
        });
    }
}
