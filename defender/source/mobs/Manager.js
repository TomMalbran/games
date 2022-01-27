import Mobs         from "./Mobs.js";
import Mob          from "../mob/Mob.js";
import Tower        from "../tower/Tower.js";

// Utils
import List         from "../../../utils/List.js";



/**
 * Defender Mobs Manager
 */
export default class Manager {

    /**
     * The Mobs Manager constructor
     * @param {Mobs} parent
     */
    constructor(parent) {
        this.parent   = parent;
        this.list     = new List();
        this.moving   = new List();
        this.creating = new List();
        this.spawning = new List();
        this.slowed   = new List();
        this.stunned  = new List();
        this.bleeding = new List();
        this.id       = 0;
    }



    /**
     * Creates a new Mob with the given type and data and adds it to the list
     * @param {Mob} mob
     * @returns {Mob}
     */
    add(mob) {
        const it = this.list.addLast(mob);
        mob.setIterator(it);
        this.id += 1;
        return mob;
    }

    /**
     * Returns the Mob with the given ID, if there is one
     * @param {Number} id
     * @returns {Mob}
     */
    get(id) {
        let result = null;
        if (!this.list.isEmpty) {
            this.list.some((mob) => {
                if (mob.id === Number(id)) {
                    result = mob;
                    return true;
                }
            });
        }
        return result;
    }

    /**
     * Mobs all the Mobs in the list at the given speed
     * @param {Number} time
     * @param {Number} speed
     * @returns {Void}
     */
    moveMobs(time, speed) {
        if (!this.moving.isEmpty) {
            this.moving.forEach((it) => {
                /** @type {Mob} */
                const mob = it.getPrev();
                mob.move(speed);

                const cell = this.moveToNewCell(mob);
                const turn = this.turnMob(mob);
                mob.specialPower(time, cell, turn);
            });
        }
    }

    /**
     * Moves the Mob to a new cell
     * @param {Mob} mob
     * @returns {Boolean}
     */
    moveToNewCell(mob) {
        const pos = mob.centerPos;
        const row = mob.getCell(pos.top);
        const col = mob.getCell(mob.left);
        let   ret = false;

        if (this.parent.paths.nextInPath(mob, row, col)) {
            if (!mob.isFlyer) {
                this.parent.board.removeMob(mob.row, mob.col);
                this.parent.board.addMob(row, col);
            }
            mob.newCell(row, col);
            ret = true;
        }
        return ret;
    }

    /**
     * Turns the mob, when required
     * @param {Mob} mob
     * @returns {Boolean}
     */
    turnMob(mob) {
        let result = false;
        if (mob.passedCenter) {
            if (this.parent.board.isEqualTo(mob.row, mob.col, mob.target.value)) {
                this.mobExits(mob);
            } else if (!mob.isFlyer) {
                const dir = this.parent.paths.getMobDir(mob.path, mob.pointer, mob.isFlyer);
                if (mob.shouldTurn(dir)) {
                    result = true;
                    mob.turn(dir, this.parent.paths.getDeg(dir));
                }
            }
            mob.setAtCenter();
        }
        return result;
    }

    /**
     * Removes the Mob when it reached the Exit
     * @param {Mob} mob
     * @returns {Void}
     */
    mobExits(mob) {
        this.parent.score.decLives();
        this.parent.alerts.life(mob);
        this.parent.panel.destroyMob(mob);
        this.parent.waves.reduceMob(mob.wave);
        this.parent.sounds.play("exit");
        mob.destroy();
    }

    /**
     * Removes the Mob when it's life is lower or equal to cero
     * @param {Mob} mob
     * @returns {Void}
     */
    killMob(mob) {
        const gold = mob.gold;
        if (gold > 0) {
            this.parent.score.incGold(gold);
            this.parent.score.incScore(gold);
            this.parent.alerts.gold(mob);
        }
        this.parent.create.createBlood(mob);

        if (mob.canSpawnChildren) {
            this.parent.create.childs(mob);
        }

        this.parent.board.removeMob(mob.row, mob.col);
        this.parent.panel.destroyMob(mob);
        this.parent.waves.reduceMob(mob.wave);
        this.parent.sounds.play("death");
        mob.destroy();

        if (this.parent.waves.isLastWave() && this.isEmpty) {
            this.parent.score.gameOver();
        }
    }



    /**
     * Adds all the mobs in the array to the create list
     * @param {Mob[]} mobs
     * @returns {Void}
     */
    addCreate(mobs) {
        mobs.forEach((mob) => {
            this.creating.addLast(mob);
        });
    }

    /**
     * Iterates through the create list reducing the time of the mobs in it.
     * When the timer of a mob reaches 0, the mob is moved to the moving list
     * @param {Number} time
     * @returns {Void}
     */
    reduceCreate(time) {
        if (!this.creating.isEmpty) {
            const it = this.creating.iterate();
            while (it.hasNext()) {
                /** @type {Mob} */
                const mob = it.getNext();
                if (mob.decTimer(time)) {
                    const itm = this.moving.addLast(mob.iterator);
                    mob.create(itm);
                    it.removeNext();
                } else {
                    it.next();
                }
            }
        }
    }



    /**
     * Adds all the mobs in the array to the spawn list
     * @param {Mob[]} mobs
     * @returns {Void}
     */
    addSpawn(mobs) {
        mobs.forEach((mob) => {
            this.spawning.addLast(mob);
            mob.startSpawn();
        });
    }

    /**
     * Iterates through the spawn list moving the mob to the original cell.
     * When it reaches it, the mob is moved to the moving list, and the spawn
     * process for the mob is ended
     * @param {Number} time
     * @returns {Void}
     */
    reduceSpawn(time) {
        if (!this.spawning.isEmpty) {
            const it = this.spawning.iterate();
            while (it.hasNext()) {
                const mob = it.getNext();
                if (mob.moveSpawn(time)) {
                    const itm = this.moving.addLast(mob.iterator);
                    mob.endSpawn(itm);
                    this.parent.paths.asignPathToMob(mob, this.parent.paths.newPath(mob));
                    it.removeNext();
                } else {
                    it.next();
                }
            }
        }
    }



    /**
     * Adds all the mobs in the array to the slow list, to slow them for a short period
     * @param {Mob[]} mobs
     * @returns {Void}
     */
    addSlow(mobs) {
        mobs.forEach((mob) => {
            if (!mob.isDead && !mob.isSlowed) {
                const it = this.slowed.addLast(mob);
                mob.startSlow(it);
                this.parent.panel.updateMob(mob);
            }
        });
    }

    /**
     * Iterates through the slow list reducing the time of the slow event.
     * When the time reaches 0, the mob
     * goes back to it's normal speed
     * @param {Number} time
     * @returns {Void}
     */
    reduceSlow(time) {
        if (!this.slowed.isEmpty) {
            const it = this.slowed.iterate();
            while (it.hasNext()) {
                /** @type {Mob} */
                const mob = it.getNext();
                if (mob.decSlow(time)) {
                    mob.endSlow();
                    it.removeNext();
                } else {
                    it.next();
                }
            }
        }
    }



    /**
     * Adds all the mobs in the array to the stun list, to stun them for a short period
     * @param {Mob[]} mobs
     * @param {Tower}       tower
     * @returns {Void}
     */
    addStun(mobs, tower) {
        mobs.forEach((mob) => {
            if (!mob.isDead && !mob.isStunned && tower.shouldStun) {
                const it = this.stunned.addLast(mob);
                mob.startStun(it);
            }
        });
    }

    /**
     * Iterates through the stun list reducing the time of the stun event.
     * When the time reaches 0, the mob
     * goes starts moving again
     * @param {Number} time
     * @returns {Void}
     */
    reduceStun(time) {
        if (!this.stunned.isEmpty) {
            const it = this.stunned.iterate();
            while (it.hasNext()) {
                /** @type {Mob} */
                const mob = it.getNext();
                if (mob.decStun(time)) {
                    mob.endStun();
                    it.removeNext();
                } else {
                    it.next();
                }
            }
        }
    }



    /**
     * Adds all the mobs in the array to the bleed list, to make them bleed for a short period
     * @param {Mob[]} mobs
     * @param {Number}      damage
     * @returns {Void}
     */
    addBleed(mobs, damage) {
        mobs.forEach((mob) => {
            if (!mob.isBleeding) {
                const it = this.bleeding.addLast(mob);
                mob.startBleed(it, damage);
            } else {
                mob.addBleed(damage);
            }
        });
    }

    /**
     * Iterates through the bleed list reducing the time of the bleed events.
     * When all the bleeding times reached 0, the mob stops bleeding. If it dies before,
     * the mob is removed
     * @param {Number} time
     * @returns {Void}
     */
    reduceBleed(time) {
        if (!this.bleeding.isEmpty) {
            const it = this.bleeding.iterate();
            while (it.hasNext()) {
                /** @type {Mob} */
                const mob = it.getNext();
                mob.decBleed(time);

                this.parent.panel.updateMob(mob);
                if (mob.life <= 0) {
                    this.killMob(mob);
                    it.next();
                } else if (!mob.isBleeding) {
                    mob.endBleed();
                    it.removeNext();
                } else {
                    it.next();
                }
            }
        }
    }



    /**
     * Returns true if there are no Mobs in the Game
     * @returns {Boolean}
     */
    get isEmpty() {
        return this.list.isEmpty;
    }

    /**
     * Returns the next ID for a new Mob
     * @returns {Number}
     */
    get nextID() {
        return this.id;
    }
}
