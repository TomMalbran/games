/**
 * The Mob Base Class
 */
class Mob {

    /**
     * The Mob Base constructor
     * @param {Object} data
     * @returns {Void}
     */
    init(data) {
        this.id          = data.id;
        this.type        = this.name;
        this.iterator    = null;
        this.element     = null;
        this.mbody       = null;
        this.lifeElem    = null;

        this.gameLevel   = data.gameLevel;
        this.boss        = data.boss;
        this.wave        = data.wave;
        this.actualLife  = this.getTotalLife();
        this.hitPoints   = this.getTotalLife();
        this.dead        = false;
        this.actualSpeed = this.speed;

        this.boardSize   = data.boardSize;
        this.timer       = this.getCreationTimer(data.pos);
        this.counter     = 0;
        this.col         = data.col;
        this.row         = data.row;
        this.atCenter    = false;
        this.top         = data.top;
        this.left        = data.left;
        this.centerTop   = data.top  + data.boardSize / 2;
        this.centerLeft  = data.left + data.boardSize / 2;
        this.realTop     = data.top;
        this.realLeft    = data.left;
        this.dirTop      = data.dirTop;
        this.dirLeft     = data.dirLeft;
        this.angle       = this.flyer ? data.angle : data.deg;
        this.path        = data.path;
        this.pointer     = 0;
        this.targetPos   = data.targetPos;
        this.targetValue = data.targetValue;

        this.moveIt      = null;
        this.spawning    = 0;
        this.spawnTo     = data.spawnTo;
        this.slowed      = 0;
        this.slowIt      = null;
        this.stunned     = 0;
        this.translate   = 0;
        this.transDir    = 1;
        this.stunIt      = null;
        this.bleed       = new List();
        this.bleedIt     = null;

        this.spawnTime   = 500;
        this.slowTime    = 3000;
        this.stunTime    = 1000;
        this.bleedTime   = 2000;
    }


    /**
     * Creates the element for the Mob
     * @returns {DOMElement}
     */
    createElement() {
        this.element = document.createElement("DIV");

        this.element.dataset.id    = this.id;
        this.element.className     = "mob";
        this.element.style.display = "none";
        this.element.style.top     = Utils.toPX(this.top);
        this.element.style.left    = Utils.toPX(this.left);
        this.element.style.zIndex  = this.isFlyer() ? 2 : 1;
        this.element.innerHTML     = `
            <div class="mobDeath"><div class="mobLife"></div></div>
            <div class="mobSlow"></div>
            <div class="mobBleed"></div>
            <div class="mobBody" data-type="mob">${this.content}</div>
        `;

        this.mbody    = this.element.querySelector(".mobBody");
        this.lifeElem = this.element.querySelector(".mobLife");
        this.setTransform();

        return this.element;
    }


    /**
     * Decreases the Creation time. Once it reaches cero the mob will start moving in the board
     * @param {Number} time
     * @returns {Void}
     */
    decTimer(time) {
        this.timer -= time;
        return this.timer <= 0;
    }

    /**
     * Shows the Mob in the board, as it will start moving
     * @param {Iterator} it
     * @returns {Void}
     */
    create(it) {
        this.timer  = 0;
        this.moveIt = it;
        this.element.style.display = "block";
    }

    /**
     * Moves the Mob according to the given speed
     * @param {Number} spped
     * @returns {Void}
     */
    move(speed) {
        this.moveTo(
            this.realTop  + this.actualSpeed / 2.5 * this.dirTop  * speed,
            this.realLeft + this.actualSpeed / 2.5 * this.dirLeft * speed
        );
    }

    /**
     * Moves the Mob to the given position
     * @param {Number} top
     * @param {Number} left
     * @returns {Void}
     */
    moveTo(top, left) {
        this.top        = Math.round(top);
        this.left       = Math.round(left);
        this.centerTop  = this.top  + this.boardSize / 2;
        this.centerLeft = this.left + this.boardSize / 2;
        this.realTop    = top;
        this.realLeft   = left;

        this.element.style.top  = Utils.toPX(this.top);
        this.element.style.left = Utils.toPX(this.left);
    }

    /**
     * Makes the mob change its direction
     * @param {{top: Number, left: Number}}
     * @param {Number} deg
     * @returns {Void}
     */
    turn(dir, deg) {
        this.dirTop  = dir.top;
        this.dirLeft = dir.left;
        this.moveTo(this.row * this.boardSize, this.col * this.boardSize);
        this.setTransform(deg);
    }

    /**
     * The Mob reached a new cell in the board
     * @param {Number} row
     * @param {Number} col
     * @returns {Void}
     */
    newCell(row, col) {
        this.row      = row;
        this.col      = col;
        this.atCenter = false;
        this.pointer += 1;
    }

    /**
     * Gives the Mob a new path and direction
     * @param {String} path
     * @param {{top: Number, left: Number}}
     * @returns {Void}
     */
    newPath(path, newDir) {
        this.path    = path;
        this.pointer = 0;

        if (this.atCenter && this.shouldTurn(newDir)) {
            this.turn(newDir);
        }
    }


    /**
     * Hits the Mob reducing its actual life
     * @param {Number} dmg
     * @returns {Void}
     */
    hit(dmg) {
        const life = Math.max(this.actualLife - dmg, 0);
        this.lifeElem.style.width = Utils.toPX(life * this.boardSize / this.getTotalLife());
        this.actualLife -= dmg;

        this.element.classList.add("hit");
    }

    /**
     * Destroys the Mob, and it removes it from all the required lists
     * @returns {Void}
     */
    destroy() {
        if (this.slowIt) {
            this.slowIt.removePrev();
        }
        if (this.stunIt) {
            this.stunIt.removePrev();
        }
        if (this.bleedIt) {
            this.bleedIt.removePrev();
        }

        this.dead = true;
        Utils.removeElement(this.element);
        this.moveIt.removePrev();
        this.iterator.removePrev();
    }


    /**
     * Triggers the special behaviour of certain types of mobs. Extended by those
     * @param {Number}  time
     * @param {Boolean} newCell
     * @param {Boolean} turned
     * @returns {Void}
     */
    specialPower(time, newCell, turned) {
        return undefined;
    }


    /**
     * After some mobs die, they spawn into a few offsprings which are spreaded aroung the
     * parent position. Each offspring is then moved to the its new position
     * @returns {Void}
     */
    startSpawn() {
        this.spawning = this.spawnTime;
        this.element.style.display = "block";
    }

    /**
     * Mobs the mob slowly to the new position. Returns true when it reached this position
     * @param {Number} time
     * @returns {Void}
     */
    moveSpawn(time) {
        const top  = this.top  + this.getDist(this.spawnTo.top  - this.top, time);
        const left = this.left + this.getDist(this.spawnTo.left - this.left, time);

        this.spawning -= time;
        this.moveTo(top, left);
        return this.spawning <= 0;
    }

    /**
     * The mob reached its spawn position and will start moving like the rest of the mobs
     * @param {Iterator} it
     */
    endSpawn(it) {
        this.moveTo(this.spawnTo.top, this.spawnTo.left);
        this.moveIt = it;
        this.row    = this.getCell(this.centerTop);
        this.col    = this.getCell(this.centerLeft);
    }

    /**
     * Calculates the distance to move the mob depending on the time
     * @param {Number} time
     * @returns {Void}
     */
    getDist(dist, time) {
        return dist * time / this.spawning;
    }


    /**
     * Starts a slow period where the speed of the mob is reduced by halth
     * @param {Iterator}
     * @returns {Void}
     */
    startSlow(it) {
        this.slowed      = this.slowTime;
        this.slowIt      = it;
        this.actualSpeed = this.speed * 0.5;
        this.element.classList.add("slowed");
    }

    /**
     * Decreases the slow timer by the given time. Returns true if the slow period is done
     * @param {Number} time
     * @returns {Boolean}
     */
    decSlow(time) {
        this.slowed -= time;
        return this.slowed <= 0;
    }

    /**
     * Ends the slow period making the mob go back to it's original speed
     * @returns {Void}
     */
    endSlow() {
        this.slowIt      = null;
        this.actualSpeed = this.speed;
        this.element.classList.remove("slowed");
    }

    /**
     * Returns true if the mob is already slowed
     * @returns {Boolean}
     */
    isSlowed() {
        return this.slowed > 0;
    }


    /**
     * Starts a stun period, where the mob can't move for some time
     * @param {Iterator}
     * @returns {Void}
     */
    startStun(it) {
        this.stunned     = this.stunTime;
        this.stunIt      = it;
        this.translate   = -1;
        this.transDir    = 1;
        this.actualSpeed = 0;
    }

    /**
     * Decreases the stun timer by the given time, while moving the mob side to side.
     * Returns true if the stun period is done
     * @param {Number} time
     * @returns {Boolean}
     */
    decStun(time) {
        this.stunned   -= time;
        this.translate += this.transDir / 4;
        if (this.translate === 1 || this.translate === -1) {
            this.transDir *= -1;
        }
        this.setTransform();
        return this.stunned < 0;
    }

    /**
     * Ends the stun period making the mob start moving again
     * @returns {Void}
     */
    endStun() {
        this.stunIt      = null;
        this.translate   = 0;
        this.actualSpeed = this.speed;
        this.setTransform();
    }

    /**
     * Returns true if the mob is already stunned
     * @returns {Boolean}
     */
    isStunned() {
        return this.stunned > 0;
    }


    /**
     * Makes the mob start bleeding, which decreases its life over some time
     * @param {Iterator} it
     * @param {Number}   damage
     * @returns {Void}
     */
    startBleed(it, damage) {
        this.bleedIt = it;
        this.addBleed(damage);
        this.element.classList.add("bleeding");
    }

    /**
     * Adds a new Bleed period to this mob. Bleeds periods are applied simultaneously
     * @param {Number} damage
     * @returns {Void}
     */
    addBleed(damage) {
        this.bleed.addLast({ time: this.bleedTime, damage: damage });
    }

    /**
     * Decreases the bleed timers for all the bleeds and reduces the hit points of the mob.
     * Returns true once the bleed list is empty
     * @param {Number} time
     * @returns {Void}
     */
    decBleed(time) {
        if (!this.bleed.isEmpty()) {
            const it = this.bleed.iterate();
            while (it.hasNext()) {
                const bleed = it.getNext();
                const dmg   = time / this.bleedTime * bleed.damage;
                bleed.time -= time;

                this.decHitPoints(dmg);
                this.hit(dmg);

                if (bleed.time <= 0) {
                    it.removeNext();
                } else {
                    it.next();
                }
            }
        }
        return this.bleed.isEmpty();
    }

    /**
     * Ends the bleed period making the mob stop recieving damage over time
     * @returns {Void}
     */
    endBleed() {
        this.bleedIt = null;
        this.element.classList.remove("bleeding");
    }

    /**
     * Returns true if the mob is already bleeding
     * @returns {Boolean}
     */
    isBleeding() {
        return !this.bleed.isEmpty();
    }


    /**
     * Rotates, scales and/or translates the mob
     * @param {Number} angle
     * @returns {Void}
     */
    setTransform(angle) {
        if (angle || angle === 0) {
            this.angle = angle;
        }
        let transform = Utils.rotate(this.angle);
        if (this.boss) {
            transform += " scale(1.5)";
        }
        if (this.translate) {
            transform += ` translateX(${this.translate * 3}px)`;
        }
        this.mbody.style.transform = transform;
    }

    /**
     * Calculates the total amout of life of the mob
     * @returns {Number}
     */
    getTotalLife() {
        const mults = [ 1, 1.5, 2 ];
        const gmult = mults[this.gameLevel];
        const bmult = this.boss ? 10 : 1;
        const life  = 20 + Math.pow(1.2, this.wave - 1);

        return Math.round(life * gmult * bmult * this.life);
    }

    /**
     * Calculates the amount of gold given by the mob once is dead
     * @returns {Number}
     */
    getGold() {
        const mult = this.boss ? 20 : 1;
        const gold = 1 + this.gameLevel / 5;

        return Math.floor(gold * mult);
    }

    /**
     * Returns true if the mob should turn
     * @param {{top: Number, left: Number}} newDir
     * @returns {Boolean}
     */
    shouldTurn(newDir) {
        return this.dirTop !== newDir.top || this.dirLeft !== newDir.left;
    }

    /**
     * Returns true if the mob passed the center of a cell
     * @returns {Boolean}
     */
    passedCenter() {
        return !this.atCenter && (
            (this.dirLeft > 0 && this.centerLeft >= this.getMiddle(this.col)) ||
            (this.dirLeft < 0 && this.centerLeft <= this.getMiddle(this.col)) ||
            (this.dirTop  > 0 && this.centerTop  >= this.getMiddle(this.row)) ||
            (this.dirTop  < 0 && this.centerTop  <= this.getMiddle(this.row))
        );
    }

    /**
     * Calculates the center position of a cell (col/row)
     * @param {Number} cell
     * @returns {Number}
     */
    getMiddle(cell) {
        return (cell + 0.5) * this.boardSize;
    }

    /**
     * Calculates the Cell (col/row) for the given X/Y position
     * @param {Number} pos
     * @returns {Number}
     */
    getCell(pos) {
        return Math.floor(pos / this.boardSize);
    }


    /**
     * Returns the Mob ID
     * @returns {Number}
     */
    getID() {
        return this.id;
    }

    /**
     * Returns an iterator that points to the Mobs list
     * @returns {Iterator}
     */
    getIterator() {
        return this.iterator;
    }

    /**
     * Sets the iterator that points to the Mobs list
     * @param {Iterator} it
     * @returns {Void}
     */
    setIterator(it) {
        this.iterator = it;
    }

    /**
     * Returns the wave number for this mob
     * @returns {Number}
     */
    getWave() {
        return this.wave;
    }

    /**
     * Returns true if the Mob is a Boss type
     * @returns {Boolean}
     */
    isBoss() {
        return this.boss;
    }

    /**
     * Returns the column where the Mob is in the matrix
     * @returns {Number}
     */
    getCol() {
        return this.col;
    }

    /**
     * Returns the row where the Mob is in the matrix
     * @returns {Number}
     */
    getRow() {
        return this.row;
    }

    /**
     * Returns the position of the top left corner of the Mob
     * @returns {{top: Number, left: Number}}
     */
    getPos() {
        return { top: this.top, left: this.left };
    }

    /**
     * Returns the position of the center of the Mob
     * @returns {{top: Number, left: Number}}
     */
    getCenterPos() {
        return { top: this.centerTop, left: this.centerLeft };
    }

    /**
     * Returns the direction of the Mob
     * @returns {{top: Number, left: Number}}
     */
    getDirection() {
        return { top: this.dirTop, left: this.dirLeft };
    }

    /**
     * Returns true if the mob is at the center of the cell
     * @returns {Boolean}
     */
    isAtCenter() {
        return this.atCenter;
    }

    /**
     * Sets as true the center property
     * @returns {Void}
     */
    setAtCenter() {
        this.atCenter = true;
    }

    /**
     * Returns the Actual Life of the mob
     * @returns {Number}
     */
    getLife() {
        return this.actualLife;
    }

    /**
     * Returns the hit points of mob. This is the life before the ammos reached it
     * @returns {Number}
     */
    getHitPoints() {
        return this.hitPoints;
    }

    /**
     * Decreases the hit points of the mob, right after a ammo leaves a tower
     * @param {Number}
     * @returns {Void}
     */
    decHitPoints(points) {
        this.hitPoints -= points;
    }

    /**
     * Returns the name of the path the mob is using
     * @returns {String}
     */
    getPath() {
        return this.path;
    }

    /**
     * Returns a index of the path array representing the position of the mob inside this array
     * @returns {Number}
     */
    getPointer() {
        return this.pointer;
    }

    /**
     * Returns the path target for the mob
     * @returns {Array.<Number>}
     */
    getTargetPos() {
        return this.targetPos;
    }

    /**
     * Returns the path target value for the mob
     * @returns {Number}
     */
    getTargetValue() {
        return this.targetValue;
    }

    /**
     * Returns true if the Mob is walking dead. Will die once the ammos reach it
     * @returns {Boolean}
     */
    isDead() {
        return this.dead;
    }

    /**
     * Returns true if the Mob spawns childs after dyieing
     * @returns {Boolean}
     */
    canSpawnChildren() {
        return !!this.child;
    }

    /**
     * Returns true if the Mob spawns childs after dyieing
     * @returns {Boolean}
     */
    getChildName() {
        return this.child;
    }


    /**
     * Returns true if the Mob is inmune to Slows
     * @returns {Boolean}
     */
    isInmune() {
        return !!this.inmune;
    }

    /**
     * Returns true if the Mob can Fly
     * @returns {Boolean}
     */
    isFlyer() {
        return !!this.flyer;
    }

    /**
     * Returns true if the Mob is goes faster in straight lines
     * @returns {Boolean}
     */
    isArrow() {
        return !!this.arrow;
    }

    /**
     * Returns true if the Mob can jump through corners
     * @returns {Boolean}
     */
    isHopper() {
        return !!this.hopper;
    }

    /**
     * Returns true if the Mob changes its Type
     * @returns {Boolean}
     */
    isMorph() {
        return !!this.morph;
    }

    /**
     * Returns the name of the Mob
     * @returns {String}
     */
    getName() {
        return this.name;
    }

    /**
     * Returns the slogan of the Mob
     * @returns {String}
     */
    getSlogan() {
        return this.slogan;
    }

    /**
     * Returns the description of the Mob
     * @returns {String}
     */
    getText() {
        return this.text;
    }

    /**
     * Returns the color of the Mob
     * @returns {String}
     */
    getColor() {
        return this.color;
    }

    /**
     * Returns the actual speed of the mob
     * @returns {Number}
     */
    getSpeed() {
        return this.actualSpeed;
    }

    /**
     * Returns the amount of the Mob
     * @param {Boolean} isLast
     * @returns {Number}
     */
    getAmount(isLast) {
        return this.boss ? this.bosses : (this.amount * (isLast ? 3 : 1));
    }

    /**
     * Returns the defence of the Mob. Towers that do less than this amount can't hit the mob
     * @returns {Number}
     */
    getDefense() {
        return this.defense;
    }

    /**
     * Returns the initial creation timer for the mob
     * @param {Number} pos
     * @returns {Number}
     */
    getCreationTimer(pos) {
        return (this.interval * pos) + Utils.rand(0, this.interval);
    }



    /**
     * Creates a new Mob given is type
     * @param {String} type
     * @param {...}    params
     * @returns {Mob}
     */
    static create(type, ...params) {
        const Mob = {
            Normal     : NormalMob,
            Inmune     : InmuneMob,
            Group      : GroupMob,
            Fast       : FastMob,
            Spawn      : SpawnMob,
            SpawnChild : SpawnChild,
            Flying     : FlyingMob,
            Arrow      : ArrowMob,
            Dark       : DarkMob,
            Decoy      : DecoyMob,
            DecoyChild : DecoyChild,
            Hopper     : HopperMob,
            Morph      : MorphMob
        };
        return new Mob[type](...params);
    }
}
