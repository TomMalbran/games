/**
 * The Mobs Manager Class
 */
class MobsManager {

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
     * @return {Mob}
     */
    add(mob) {
        let it = this.list.addLast(mob);
        mob.setIterator(it);
        this.id += 1;
        return mob;
    }

    /**
     * Returns the Mob with the given ID, if there is one
     * @param {number} id
     * @return {Mob}
     */
    get(id) {
        let result = null;
        if (!this.list.isEmpty()) {
            this.list.some(function (mob) {
                if (mob.getID() === Number(id)) {
                    result = mob;
                    return true;
                }
            });
        }
        return result;
    }

    /**
     * Mobs all the Mobs in the list at the given speed
     * @param {number} time
     * @param {number} speed
     */
    moveMobs(time, speed) {
        if (!this.moving.isEmpty()) {
            this.moving.forEach((it) => {
                let mob = it.getPrev(), cell, turn;
                mob.move(speed);

                cell = this.moveToNewCell(mob);
                turn = this.turnMob(mob);
                mob.specialPower(time, cell, turn);
            });
        }
    }

    /**
     * Moves the Mob to a new cell
     * @param {Mob} mob
     * @return {boolean}
     */
    moveToNewCell(mob) {
        let pos = mob.getCenterPos(),
            row = mob.getCell(pos.top),
            col = mob.getCell(mob.left),
            ret = false;

        if (this.parent.paths.nextInPath(mob, row, col)) {
            if (!mob.isFlyer()) {
                this.parent.board.removeMob(mob.getRow(), mob.getCol());
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
     * @return {boolean}
     */
    turnMob(mob) {
        let dir, result = false;
        if (mob.passedCenter()) {
            if (this.parent.board.isEqualTo(mob.getRow(), mob.getCol(), mob.getTargetValue())) {
                this.mobExits(mob);
            } else if (!mob.isFlyer()) {
                dir = this.parent.paths.getMobDir(mob.getPath(), mob.getPointer(), mob.isFlyer());
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
     */
    mobExits(mob) {
        this.parent.score.decLives();
        this.parent.alerts.life(mob);
        this.parent.panel.destroyMob(mob);
        this.parent.waves.reduceMob(mob.getWave());
        this.parent.sounds.exit();
        mob.destroy();
    }

    /**
     * Removes the Mob when it's life is lower or equal to cero
     * @param {Mob} mob
     */
    killMob(mob) {
        let gold = mob.getGold();

        if (gold > 0) {
            this.parent.score.incGold(gold);
            this.parent.score.incScore(gold);
            this.parent.alerts.gold(mob);
        }
        this.parent.create.createBlood(mob);

        if (mob.canSpawnChildren()) {
            this.parent.create.childs(mob);
        }

        this.parent.board.removeMob(mob.getRow(), mob.getCol());
        this.parent.panel.destroyMob(mob);
        this.parent.waves.reduceMob(mob.getWave());
        this.parent.sounds.death();
        mob.destroy();

        if (this.parent.waves.isLastWave() && this.isEmpty()) {
            this.parent.score.gameOver();
        }
    }


    /**
     * Adds all the mobs in the array to the create list
     * @param {Array.<Mob>} mobs
     */
    addCreate(mobs) {
        mobs.forEach((mob) => {
            this.creating.addLast(mob);
        });
    }

    /**
     * Iterates through the create list reducing the time of the mobs in it.
     * When the timer of a mob reaches 0, the mob is moved to the moving list
     * @param {number} time
     */
    reduceCreate(time) {
        if (!this.creating.isEmpty()) {
            let it = this.creating.iterate();
            while (it.hasNext()) {
                let mob = it.getNext();
                if (mob.decTimer(time)) {
                    let itm = this.moving.addLast(mob.getIterator());
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
     * @param {Array.<Mob>} mobs
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
     * @param {number} time
     */
    reduceSpawn(time) {
        if (!this.spawning.isEmpty()) {
            let it = this.spawning.iterate();
            while (it.hasNext()) {
                let mob = it.getNext();
                if (mob.moveSpawn(time)) {
                    let itm = this.moving.addLast(mob.getIterator());
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
     * @param {Array.<Mob>} mobs
     */
    addSlow(mobs) {
        mobs.forEach((mob) => {
            if (!mob.isDead() && !mob.isSlowed()) {
                let it = this.slowed.addLast(mob);
                mob.startSlow(it);
                this.parent.panel.updateMob(mob);
            }
        });
    }

    /**
     * Iterates through the slow list reducing the time of the slow event.
     * When the time reaches 0, the mob
     * goes back to it's normal speed
     * @param {number} time
     */
    reduceSlow(time) {
        if (!this.slowed.isEmpty()) {
            let it = this.slowed.iterate();
            while (it.hasNext()) {
                let mob = it.getNext();
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
     * @param {Array.<Mob>} mobs
     * @param {Tower} tower
     */
    addStun(mobs, tower) {
        mobs.forEach((mob) => {
            if (!mob.isDead() && !mob.isStunned() && tower.shouldStun()) {
                let it = this.stunned.addLast(mob);
                mob.startStun(it);
            }
        });
    }

    /**
     * Iterates through the stun list reducing the time of the stun event.
     * When the time reaches 0, the mob
     * goes starts moving again
     * @param {number} time
     */
    reduceStun(time) {
        if (!this.stunned.isEmpty()) {
            let it = this.stunned.iterate();
            while (it.hasNext()) {
                let mob = it.getNext();
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
     * @param {Array.<Mob>} mobs
     * @param {number} damage
     */
    addBleed(mobs, damage) {
        mobs.forEach((mob) => {
            if (!mob.isBleeding()) {
                let it = this.bleeding.addLast(mob);
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
     * @param {number} time
     */
    reduceBleed(time) {
        if (!this.bleeding.isEmpty()) {
            let it = this.bleeding.iterate();
            while (it.hasNext()) {
                let mob = it.getNext();
                mob.decBleed(time);

                this.parent.panel.updateMob(mob);
                if (mob.getLife() <= 0) {
                    this.killMob(mob);
                    it.next();
                } else if (!mob.isBleeding()) {
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
     * @return {boolean}
     */
    isEmpty() {
        return this.list.isEmpty();
    }

    /**
     * Returns the next ID for a new Mob
     * @return {number}
     */
    getNextID() {
        return this.id;
    }

    /**
     * Returns the list with all the Mobs
     * @return {List.<Mob>}
     */
    getList() {
        return this.list;
    }

    /**
     * Returns the list with the Mobs that are moving
     * @return {List.<Iterator>}
     */
    getMovingMobs() {
        return this.moving;
    }
}
