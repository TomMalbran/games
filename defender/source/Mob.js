/*jslint browser: true */
/*global List, Utils */

var Mob = (function () {
    "use strict";
    
    /** @cost{number} Time constants used for the mobs */
    var morphTime  = 5000,
        minHopTime = 300,
        maxHopTime = 600,
        spanwTime  = 500,
        slowTime   = 3000,
        stunTime   = 1000,
        bleedTime  = 2000,
        Mobs;
    
    
    /**
     * @private
     * @constructor
     * The Mob Base Class
     */
    function Mob() {
        return undefined;
    }
    
    /**
     * Initializes the Mob
     * @param {Object} data
     */
    Mob.prototype.init = function (data) {
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
    };
    
    /**
     * Creates the element for the Mob
     * @return {DOMElement}
     */
    Mob.prototype.createElement = function () {
        this.element = document.createElement("DIV");
        
        this.element.dataset.id    = this.id;
        this.element.className     = "mob";
        this.element.style.display = "none";
        this.element.style.top     = this.top  + "px";
        this.element.style.left    = this.left + "px";
        this.element.style.zIndex  = this.isFlyer() ? 2 : 1;
        this.element.innerHTML     =
            "<div class='mobDeath'><div class='mobLife'></div></div>" +
            "<div class='mobSlow'></div>" +
            "<div class='mobBleed'></div>" +
            "<div class='mobBody' data-type='mob'>" + this.content + "</div>";
        
        this.mbody    = this.element.querySelector(".mobBody");
        this.lifeElem = this.element.querySelector(".mobLife");
        this.setTransform();
        
        return this.element;
    };
    
    
    /**
     * Decreases the Creation time. Once it reaches cero the mob will start moving in the board
     * @param {number} time
     */
    Mob.prototype.decTimer = function (time) {
        this.timer -= time;
        return this.timer <= 0;
    };
    
    /**
     * Shows the Mob in the board, as it will start moving
     * @param {Iterator} it
     */
    Mob.prototype.create = function (it) {
        this.timer  = 0;
        this.moveIt = it;
        this.element.style.display = "block";
    };
    
    /**
     * Moves the Mob according to the given speed
     * @param {number} spped
     */
    Mob.prototype.move = function (speed) {
        this.moveTo(
            this.realTop  + this.actualSpeed / 2.5 * this.dirTop  * speed,
            this.realLeft + this.actualSpeed / 2.5 * this.dirLeft * speed
        );
    };
    
    /**
     * Moves the Mob to the given position
     * @param {number} top
     * @param {number} left
     */
    Mob.prototype.moveTo = function (top, left) {
        this.top        = Math.round(top);
        this.left       = Math.round(left);
        this.centerTop  = this.top  + this.boardSize / 2;
        this.centerLeft = this.left + this.boardSize / 2;
        this.realTop    = top;
        this.realLeft   = left;
        
        this.element.style.top  = this.top  + "px";
        this.element.style.left = this.left + "px";
    };
    
    /**
     * Makes the mob change its direction
     * @param {{top: number, left: number}}
     * @param {number} deg
     */
    Mob.prototype.turn = function (dir, deg) {
        this.dirTop  = dir.top;
        this.dirLeft = dir.left;
        this.moveTo(this.row * this.boardSize, this.col * this.boardSize);
        this.setTransform(deg);
    };
    
    /**
     * The Mob reached a new cell in the board
     * @param {number} row
     * @param {number} col
     */
    Mob.prototype.newCell = function (row, col) {
        this.row      = row;
        this.col      = col;
        this.atCenter = false;
        this.pointer += 1;
    };
    
    /**
     * Gives the Mob a new path and direction
     * @param {string} path
     * @param {{top: number, left: number}}
     */
    Mob.prototype.newPath = function (path, newDir) {
        this.path    = path;
        this.pointer = 0;
        
        if (this.atCenter && this.shouldTurn(newDir)) {
            this.turn(newDir);
        }
    };
    
        
    /**
     * Hits the Mob reducing its actual life
     * @param {number} dmg
     */
    Mob.prototype.hit = function (dmg) {
        var life = Math.max(this.actualLife - dmg, 0);
        this.lifeElem.style.width = (life * this.boardSize / this.getTotalLife()) + "px";
        this.actualLife -= dmg;
        
        this.element.classList.add("hit");
    };
    
    /**
     * Destroys the Mob, and it removes it from all the required lists
     */
    Mob.prototype.destroy = function () {
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
    };
    
    
    /**
     * Triggers the special behaviour of certain types of mobs. Extended by those
     * @param {number} time
     * @param {boolean} newCell
     * @param {boolean} turned
     */
    Mob.prototype.specialPower = function (time, newCell, turned) {
        return undefined;
    };
    
    
    /**
     * After some mobs die, they spawn into a few offsprings which are spreaded aroung the
     * parent position. Each offspring is then moved to the its new position
     */
    Mob.prototype.startSpawn = function () {
        this.spawning = spanwTime;
        this.element.style.display = "block";
    };
    
    /**
     * Mobs the mob slowly to the new position. Returns true when it reached this position
     * @param {number} time
     */
    Mob.prototype.moveSpawn = function (time) {
        var top  = this.top  + this.getDist(this.spawnTo.top  - this.top, time),
            left = this.left + this.getDist(this.spawnTo.left - this.left, time);
        
        this.spawning -= time;
        this.moveTo(top, left);
        return this.spawning <= 0;
    };
    
    /**
     * The mob reached its spawn position and will start moving like the rest of the mobs
     * @param {Iterator} it
     */
    Mob.prototype.endSpawn = function (it) {
        this.moveTo(this.spawnTo.top, this.spawnTo.left);
        this.moveIt = it;
        this.row    = this.getCell(this.centerTop);
        this.col    = this.getCell(this.centerLeft);
    };
    
    /**
     * Calculates the distance to move the mob depending on the time
     * @param {number} time
     */
    Mob.prototype.getDist = function (dist, time) {
        return dist * time / this.spawning;
    };
    
    
    /**
     * Starts a slow period where the speed of the mob is reduced by halth
     * @param {Iterator}
     */
    Mob.prototype.startSlow = function (it) {
        this.slowed      = slowTime;
        this.slowIt      = it;
        this.actualSpeed = this.speed * 0.5;
        this.element.classList.add("slowed");
    };
    
    /**
     * Decreases the slow timer by the given time. Returns true if the slow period is done
     * @param {number} time
     * @return {boolean}
     */
    Mob.prototype.decSlow = function (time) {
        this.slowed -= time;
        return this.slowed <= 0;
    };
    
    /**
     * Ends the slow period making the mob go back to it's original speed
     */
    Mob.prototype.endSlow = function () {
        this.slowIt      = null;
        this.actualSpeed = this.speed;
        this.element.classList.remove("slowed");
    };
    
    /**
     * Returns true if the mob is already slowed
     * @return {boolean}
     */
    Mob.prototype.isSlowed = function () {
        return this.slowed > 0;
    };
    
    
    /**
     * Starts a stun period, where the mob can't move for some time
     * @param {Iterator}
     */
    Mob.prototype.startStun = function (it) {
        this.stunned     = stunTime;
        this.stunIt      = it;
        this.translate   = -1;
        this.transDir    = 1;
        this.actualSpeed = 0;
    };
    
    /**
     * Decreases the stun timer by the given time, while moving the mob side to side.
     * Returns true if the stun period is done
     * @param {number} time
     * @return {boolean}
     */
    Mob.prototype.decStun = function (time) {
        this.stunned   -= time;
        this.translate += this.transDir / 4;
        if (this.translate === 1 || this.translate === -1) {
            this.transDir *= -1;
        }
        this.setTransform();
        return this.stunned < 0;
    };
    
    /**
     * Ends the stun period making the mob start moving again
     */
    Mob.prototype.endStun = function () {
        this.stunIt      = null;
        this.translate   = 0;
        this.actualSpeed = this.speed;
        this.setTransform();
    };
    
    /**
     * Returns true if the mob is already stunned
     * @return {boolean}
     */
    Mob.prototype.isStunned = function () {
        return this.stunned > 0;
    };
    
    
    /**
     * Makes the mob start bleeding, which decreases its life over some time
     * @param {Iterator} id
     * @param {number} damage
     */
    Mob.prototype.startBleed = function (it, damage) {
        this.bleedIt = it;
        this.addBleed(damage);
        this.element.classList.add("bleeding");
    };
    
    /**
     * Adds a new Bleed period to this mob. Bleeds periods are applied simultaneously
     * @param {number} damage
     */
    Mob.prototype.addBleed = function (damage) {
        this.bleed.addLast({ time: bleedTime, damage: damage });
    };
    
    /**
     * Decreases the bleed timers for all the bleeds and reduces the hit points of the mob.
     * Returns true once the bleed list is empty
     * @param {number} time
     */
    Mob.prototype.decBleed = function (time) {
        if (!this.bleed.isEmpty()) {
            var it = this.bleed.iterate(), bleed, dmg;
            while (it.hasNext()) {
                bleed = it.getNext();
                bleed.time -= time;
                dmg = time / bleedTime * bleed.damage;
                
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
    };
    
    /**
     * Ends the bleed period making the mob stop recieving damage over time
     */
    Mob.prototype.endBleed = function () {
        this.bleedIt = null;
        this.element.classList.remove("bleeding");
    };
    
    /**
     * Returns true if the mob is already bleeding
     * @return {boolean}
     */
    Mob.prototype.isBleeding = function () {
        return !this.bleed.isEmpty();
    };
    
    
    /**
     * Rotates, scales and/or translates the mob
     * @param {number} angle
     */
    Mob.prototype.setTransform = function (angle) {
        if (angle || angle === 0) {
            this.angle = angle;
        }
        var transform = "rotate(" + this.angle + "deg)";
        if (this.boss) {
            transform += " scale(1.5)";
        }
        if (this.translate) {
            transform += " translateX(" + this.translate * 3 + "px)";
        }
        Utils.setTransform(this.mbody, transform);
    };
    
    /**
     * Calculates the total amout of life of the mob
     * @return {number}
     */
    Mob.prototype.getTotalLife = function () {
        var mults  = [ 1, 1.5, 2 ],
            gmult  = mults[this.gameLevel],
            bmult  = this.boss ? 10 : 1,
            life   = 20 + Math.pow(1.2, this.wave - 1);
        
        return Math.round(life * gmult * bmult * this.life);
    };
    
    /**
     * Calculates the amount of gold given by the mob once is dead
     * @return {number}
     */
    Mob.prototype.getGold = function () {
        var mult = this.boss ? 20 : 1,
            gold = 1 + this.gameLevel / 5;
        
        return Math.floor(gold * mult);
    };
    
    /**
     * Returns true if the mob should turn
     * @param {{top: number, left: number}} newDir
     * @return {boolean}
     */
    Mob.prototype.shouldTurn = function (newDir) {
        return this.dirTop !== newDir.top || this.dirLeft !== newDir.left;
    };
    
    /**
     * Returns true if the mob passed the center of a cell
     * @return {boolean}
     */
    Mob.prototype.passedCenter = function () {
        return !this.atCenter && (
            (this.dirLeft > 0 && this.centerLeft >= this.getMiddle(this.col)) ||
            (this.dirLeft < 0 && this.centerLeft <= this.getMiddle(this.col)) ||
            (this.dirTop  > 0 && this.centerTop  >= this.getMiddle(this.row)) ||
            (this.dirTop  < 0 && this.centerTop  <= this.getMiddle(this.row))
        );
    };
    
    /**
     * Calculates the center position of a cell (col/row)
     * @param {number} cell
     * @return {number}
     */
    Mob.prototype.getMiddle = function (cell) {
        return (cell + 0.5) * this.boardSize;
    };
    
    /**
     * Calculates the Cell (col/row) for the given X/Y position
     * @param {number} pos
     * @return {number}
     */
    Mob.prototype.getCell = function (pos) {
        return Math.floor(pos / this.boardSize);
    };
    
    
    /**
     * Returns the Mob ID
     * @return {number}
     */
    Mob.prototype.getID = function () {
        return this.id;
    };
    
    /**
     * Returns an iterator that points to the Mobs list
     * @return {Iterator}
     */
    Mob.prototype.getIterator = function () {
        return this.iterator;
    };
    
    /**
     * Sets the iterator that points to the Mobs list
     * @param {Iterator} it
     */
    Mob.prototype.setIterator = function (it) {
        this.iterator = it;
    };
    
    /**
     * Returns the wave number for this mob
     * @return {number}
     */
    Mob.prototype.getWave = function () {
        return this.wave;
    };
    
    /**
     * Returns true if the Mob is a Boss type
     * @return {boolean}
     */
    Mob.prototype.isBoss = function () {
        return this.boss;
    };
    
    /**
     * Returns the column where the Mob is in the matrix
     * @return {number}
     */
    Mob.prototype.getCol = function () {
        return this.col;
    };
    
    /**
     * Returns the row where the Mob is in the matrix
     * @return {number}
     */
    Mob.prototype.getRow = function () {
        return this.row;
    };
    
    /**
     * Returns the position of the top left corner of the Mob
     * @return {{top: number, left: number}}
     */
    Mob.prototype.getPos = function () {
        return { top: this.top, left: this.left };
    };
    
    /**
     * Returns the position of the center of the Mob
     * @return {{top: number, left: number}}
     */
    Mob.prototype.getCenterPos = function () {
        return { top: this.centerTop, left: this.centerLeft };
    };
    
    /**
     * Returns the direction of the Mob
     * @return {{top: number, left: number}}
     */
    Mob.prototype.getDirection = function () {
        return { top: this.dirTop, left: this.dirLeft };
    };
    
    /**
     * Returns true if the mob is at the center of the cell
     * @return {boolean}
     */
    Mob.prototype.isAtCenter = function () {
        return this.atCenter;
    };
    
    /**
     * Sets as true the center property
     */
    Mob.prototype.setAtCenter = function () {
        this.atCenter = true;
    };
    
    /**
     * Returns the Actual Life of the mob
     * @return {number}
     */
    Mob.prototype.getLife = function () {
        return this.actualLife;
    };
    
    /**
     * Returns the hit points of mob. This is the life before the ammos reached it
     * @return {number}
     */
    Mob.prototype.getHitPoints = function () {
        return this.hitPoints;
    };
    
    /**
     * Decreases the hit points of the mob, right after a ammo leaves a tower
     * @param {number}
     */
    Mob.prototype.decHitPoints = function (points) {
        this.hitPoints -= points;
    };
    
    /**
     * Returns the name of the path the mob is using
     * @return {string}
     */
    Mob.prototype.getPath = function () {
        return this.path;
    };
    
    /**
     * Returns a index of the path array representing the position of the mob inside this array
     * @return {number}
     */
    Mob.prototype.getPointer = function () {
        return this.pointer;
    };
    
    /**
     * Returns the path target for the mob
     * @return {Array.<number>}
     */
    Mob.prototype.getTargetPos = function () {
        return this.targetPos;
    };
    
    /**
     * Returns the path target value for the mob
     * @return {number}
     */
    Mob.prototype.getTargetValue = function () {
        return this.targetValue;
    };
    
    /**
     * Returns true if the Mob is walking dead. Will die once the ammos reach it
     * @return {boolean}
     */
    Mob.prototype.isDead = function () {
        return this.dead;
    };
    
    /**
     * Returns true if the Mob spawns childs after dyieing
     * @return {boolean}
     */
    Mob.prototype.canSpawnChildren = function () {
        return !!this.child;
    };
    
    /**
     * Returns true if the Mob spawns childs after dyieing
     * @return {boolean}
     */
    Mob.prototype.getChildName = function () {
        return this.child;
    };
    
    
    /**
     * Returns true if the Mob is inmune to Slows
     * @return {boolean}
     */
    Mob.prototype.isInmune = function () {
        return !!this.inmune;
    };
    
    /**
     * Returns true if the Mob can Fly
     * @return {boolean}
     */
    Mob.prototype.isFlyer = function () {
        return !!this.flyer;
    };
    
    /**
     * Returns true if the Mob is goes faster in straight lines
     * @return {boolean}
     */
    Mob.prototype.isArrow = function () {
        return !!this.arrow;
    };
    
    /**
     * Returns true if the Mob can jump through corners
     * @return {boolean}
     */
    Mob.prototype.isHopper = function () {
        return !!this.hopper;
    };
    
    /**
     * Returns true if the Mob changes its Type
     * @return {boolean}
     */
    Mob.prototype.isMorph = function () {
        return !!this.morph;
    };
    
    /**
     * Returns the name of the Mob
     * @return {string}
     */
    Mob.prototype.getName = function () {
        return this.name;
    };
    
    /**
     * Returns the slogan of the Mob
     * @return {string}
     */
    Mob.prototype.getSlogan = function () {
        return this.slogan;
    };
    
    /**
     * Returns the description of the Mob
     * @return {string}
     */
    Mob.prototype.getText = function () {
        return this.text;
    };
    
    /**
     * Returns the color of the Mob
     * @return {string}
     */
    Mob.prototype.getColor = function () {
        return this.color;
    };
    
    /**
     * Returns the actual speed of the mob
     * @return {number}
     */
    Mob.prototype.getSpeed = function () {
        return this.actualSpeed;
    };
    
    /**
     * Returns the amount of the Mob
     * @param {boolean} isLast
     * @return {number}
     */
    Mob.prototype.getAmount = function (isLast) {
        return this.boss ? this.bosses : (this.amount * (isLast ? 3 : 1));
    };
    
    /**
     * Returns the defence of the Mob. Towers that do less than this amount can't hit the mob
     * @return {number}
     */
    Mob.prototype.getDefense = function () {
        return this.defense;
    };
    
    /**
     * Returns the initial creation timer for the mob
     * @param {number} pos
     * @return {number}
     */
    Mob.prototype.getCreationTimer = function (pos) {
        return (this.interval * pos) + Utils.rand(0, this.interval);
    };
    
    
    
    /**
     * @constructor
     * @extends {Mob}
     * The Normal Mob Class
     * @param {Object} data
     */
    function NormalMob(data) {
        this.name     = "Normal";
        this.slogan   = "I am a mob!";
        this.text     = "A normal mob without special abilities.";
        this.color    = "rgb(150, 150, 150)";
        
        this.interval = 400;
        this.amount   = 10;
        this.bosses   = 1;
        this.life     = 1;
        this.money    = 1;
        this.speed    = 1;
        this.defense  = 0;
        this.content  = "<div class='normalMob'></div>";
        
        this.init(data);
    }
    
    NormalMob.prototype = Object.create(Mob.prototype);
    NormalMob.prototype.constructor = NormalMob;
    NormalMob.prototype.parentClass = Mob.prototype;
    
    
    
    /**
     * @constructor
     * @extends {Mob}
     * The Inmune Mob Class
     * @param {Object} data
     */
    function InmuneMob(data) {
        this.name     = "Inmune";
        this.slogan   = "Try to slow me";
        this.text     = "A mob that is inmune to slow towers.";
        this.color    = "rgb(220, 120, 254)";
        
        this.interval = 400;
        this.amount   = 10;
        this.bosses   = 1;
        this.life     = 1;
        this.money    = 1;
        this.speed    = 1;
        this.defense  = 0;
        this.inmune   = true;
        this.content  =
            "<div class='inmuneLine1'></div>" +
            "<div class='inmuneLine2'></div>" +
            "<div class='inmuneLine3'></div>" +
            "<div class='inmuneLine4'></div>" +
            "<div class='inmuneBody'></div>";
        
        this.init(data);
    }
    
    InmuneMob.prototype = Object.create(Mob.prototype);
    InmuneMob.prototype.constructor = InmuneMob;
    InmuneMob.prototype.parentClass = Mob.prototype;
    
    
    
    /**
     * @constructor
     * @extends {Mob}
     * The Group Mob Class
     * @param {Object} data
     */
    function GroupMob(data) {
        this.name     = "Group";
        this.slogan   = "We are many";
        this.text     = "A mob that appears close to each other.";
        this.color    = "rgb(138, 152, 239)";
        
        this.interval = 100;
        this.amount   = 10;
        this.bosses   = 2;
        this.life     = 1;
        this.money    = 1;
        this.speed    = 1;
        this.defense  = 0;
        this.content  = "<div class='groupMob'></div>";
        
        this.init(data);
    }
    
    GroupMob.prototype = Object.create(Mob.prototype);
    GroupMob.prototype.constructor = GroupMob;
    GroupMob.prototype.parentClass = Mob.prototype;
    
    
    
    /**
     * @constructor
     * @extends {Mob}
     * The Fast Mob Class
     * @param {Object} data
     */
    function FastMob(data) {
        this.name     = "Fast";
        this.slogan   = "This is speed";
        this.text     = "A mob that moves faster than the others.";
        this.color    = "rgb(216, 135, 152)";
        
        this.interval = 600;
        this.amount   = 10;
        this.bosses   = 1;
        this.life     = 1;
        this.money    = 1;
        this.speed    = 1.5;
        this.defense  = 0;
        this.content  =
            "<div class='fastHead'></div>" +
            "<div class='fastTail'></div>";
        
        this.init(data);
    }
    
    FastMob.prototype = Object.create(Mob.prototype);
    FastMob.prototype.constructor = FastMob;
    FastMob.prototype.parentClass = Mob.prototype;
    
    
    
    /**
     * @constructor
     * @extends {Mob}
     * The Spawn Mob Class
     * @param {Object} data
     */
    function SpawnMob(data) {
        this.name     = "Spawn";
        this.slogan   = "Identity crisis";
        this.text     = "After killing this mob it will split in 2.";
        this.color    = "rgb(31, 142, 30)";
        
        this.interval = 1000;
        this.amount   = 5;
        this.bosses   = 1;
        this.life     = 1.8;
        this.money    = 2.5;
        this.speed    = 1;
        this.defense  = 0;
        this.child    = "SpawnChild";
        this.content  =
            "<div class='spawnHead'></div>" +
            "<div class='spawnTail'></div>";
        
        this.init(data);
    }
    
    SpawnMob.prototype = Object.create(Mob.prototype);
    SpawnMob.prototype.constructor = SpawnMob;
    SpawnMob.prototype.parentClass = Mob.prototype;
    
    
    /**
     * @constructor
     * @extends {SpawnMob}
     * The Spawn Child Class
     * @param {Object} data
     */
    function SpawnChild(data) {
        this.distance = 10;
        this.amount   = 2;
        this.bosses   = 2;
        this.life     = 0.8;
        this.money    = 1;
        this.speed    = 1;
        this.defense  = 0;
        this.content  = "<div class='spawnChild'></div>";
        
        this.init(data);
    }
    
    SpawnChild.prototype = Object.create(SpawnMob.prototype);
    SpawnChild.prototype.constructor = SpawnChild;
    SpawnChild.prototype.parentClass = SpawnChild.prototype;
    
    
    
    /**
     * @constructor
     * @extends {Mob}
     * The Flying Mob Class
     * @param {Object} data
     */
    function FlyingMob(data) {
        this.name     = "Flying";
        this.slogan   = "I can Fly!";
        this.text     = "This mob goes in straight line to the exit.";
        this.color    = "rgb(192, 169, 46)";
        
        this.interval = 400;
        this.amount   = 10;
        this.bosses   = 1;
        this.life     = 0.5;
        this.money    = 1;
        this.speed    = 1;
        this.defense  = 0;
        this.flyer    = true;
        this.content  =
            "<div class='flyingMob'></div>" +
            "<div class='flyingShadow'></div>";
        
        this.init(data);
    }
    
    FlyingMob.prototype = Object.create(Mob.prototype);
    FlyingMob.prototype.constructor = FlyingMob;
    FlyingMob.prototype.parentClass = Mob.prototype;
    
    
    
    /**
     * @constructor
     * @extends {Mob}
     * The Arrow Mob Class
     * @param {Object} data
     */
    function ArrowMob(data) {
        this.name     = "Arrow";
        this.slogan   = "Fast and furious";
        this.text     = "Fast in straight lines, slow in curves";
        this.color    = "rgb(207, 99, 99)";
        
        this.interval = 600;
        this.amount   = 10;
        this.bosses   = 1;
        this.life     = 0.8;
        this.money    = 1;
        this.speed    = 2;
        this.defense  = 0;
        this.arrow    = true;
        this.content  =
            "<div class='arrowHead'></div>" +
            "<div class='arrowTail'></div>";
        
        this.init(data);
    }
    
    ArrowMob.prototype = Object.create(Mob.prototype);
    ArrowMob.prototype.constructor = ArrowMob;
    ArrowMob.prototype.parentClass = Mob.prototype;
    
    /**
     * Changes the speed of the mob depending on whether is in a straight line or turning
     * @param {number} time
     * @param {boolean} newCell
     * @param {boolean} turned
     */
    ArrowMob.prototype.specialPower = function (time, newCell, turned) {
        if (newCell) {
            this.counter += 1;
            if (this.count > 1) {
                this.actualSpeed = this.speed;
            }
        }
        if (turned) {
            this.counter = 0;
            this.actualSpeed = this.speed / 2;
        }
    };
    
    
    
    /**
     * @constructor
     * @extends {Mob}
     * The Dark Mob Class
     * @param {Object} data
     */
    function DarkMob(data) {
        this.name     = "Dark";
        this.slogan   = "The creepy mob";
        this.text     = "They have a defense that protects them from some damage.";
        this.color    = "rgb(90, 90, 90)";
        
        this.interval = 800;
        this.amount   = 5;
        this.bosses   = 1;
        this.life     = 1.8;
        this.money    = 1.5;
        this.speed    = 0.6;
        this.defense  = 10;
        this.content  =
            "<div class='darkHead'></div>" +
            "<div class='darkTail'></div>";
        
        this.init(data);
    }
    
    DarkMob.prototype = Object.create(Mob.prototype);
    DarkMob.prototype.constructor = DarkMob;
    DarkMob.prototype.parentClass = Mob.prototype;
    
    
    
    /**
     * @constructor
     * @extends {Mob}
     * The Decoy Mob Class
     * @param {Object} data
     */
    function DecoyMob(data) {
        this.name     = "Decoy";
        this.slogan   = "Harder, but easier";
        this.text     = "After killing it, it will split into 4 very slow mobs.";
        this.color    = "rgb(113, 150, 105)";
        
        this.interval = 1000;
        this.amount   = 4;
        this.bosses   = 1;
        this.life     = 0.8;
        this.money    = 2;
        this.speed    = 1.5;
        this.defense  = 0;
        this.child    = "DecoyChild";
        this.content  =
            "<div class='decoyHead'></div>" +
            "<div class='decoyBody'></div>";
        
        this.init(data);
    }
    
    DecoyMob.prototype = Object.create(Mob.prototype);
    DecoyMob.prototype.constructor = DecoyMob;
    DecoyMob.prototype.parentClass = Mob.prototype;
    
    
    /**
     * @constructor
     * @extends {DecoyMob}
     * The Decoy Child Class
     * @param {Object} data
     */
    function DecoyChild(data) {
        this.distance = 5;
        this.amount   = 4;
        this.bosses   = 4;
        this.life     = 1;
        this.money    = 1;
        this.speed    = 0.5;
        this.defense  = 0;
        this.content  = "<div class='decoyChild'></div>";
        
        this.init(data);
    }
    
    DecoyChild.prototype = Object.create(DecoyMob.prototype);
    DecoyChild.prototype.constructor = DecoyChild;
    DecoyChild.prototype.parentClass = DecoyMob.prototype;
    
    
    
    /**
     * @constructor
     * @extends {Mob}
     * The Hopper Mob Class
     * @param {Object} data
     */
    function HopperMob(data) {
        this.name     = "Hopper";
        this.slogan   = "Jumping all around";
        this.text     = "This mob can jump throught diagonal spaces in between towers.";
        this.color    = "rgb(195, 60, 195)";
        
        this.interval = 600;
        this.amount   = 10;
        this.bosses   = 1;
        this.life     = 1;
        this.money    = 1;
        this.speed    = 2;
        this.defense  = 0;
        this.hopper   = true;
        this.content  = "<div class='hopperMob'></div>";
        
        this.init(data);
    }
    
    HopperMob.prototype = Object.create(Mob.prototype);
    HopperMob.prototype.constructor = HopperMob;
    HopperMob.prototype.parentClass = Mob.prototype;
    
    /**
     * Allows this mob to jump through small gaps in the layout
     * @param {number} time
     * @param {boolean} newCell
     * @param {boolean} turned
     */
    HopperMob.prototype.specialPower = function (time, newCell, turned) {
        this.timer += time;
        if (this.timer > minHopTime && this.timer < maxHopTime) {
            this.actualSpeed = 0;
        } else if (this.timer > maxHopTime) {
            this.actualSpeed = this.speed;
            this.timer = 0;
        }
    };
    
    
    
    /**
     * @constructor
     * @extends {Mob}
     * The Morph Mob Class
     * @param {Object} data
     */
    function MorphMob(data) {
        this.name     = "Morph";
        this.slogan   = "Cannot decide";
        this.text     = "They change of type after a few seconds";
        this.color    = "rgb(0, 128, 128)";
        
        this.interval = 400;
        this.amount   = 10;
        this.bosses   = 1;
        this.life     = 1;
        this.money    = 1;
        this.speed    = 1;
        this.defense  = 0;
        this.morph    = [ "Normal", "Dark", "Inmune", "Fast" ];
        this.content  = "<div class='normalMob'></div>";
        
        this.init(data);
    }
    
    MorphMob.prototype = Object.create(Mob.prototype);
    MorphMob.prototype.constructor = MorphMob;
    MorphMob.prototype.parentClass = Mob.prototype;
    
    /**
     * Changes the type of the Mob, after some time
     * @param {number} time
     * @param {boolean} newCell
     * @param {boolean} turned
     */
    MorphMob.prototype.specialPower = function (time, newCell, turned) {
        this.timer += time;
        if (this.timer > morphTime) {
            this.counter     = (this.counter + 1) % this.morph.length;
            this.type        = this.morph[this.counter];
            var mob          = new Mobs[this.type]({});
            this.actualSpeed = mob.speed;
            this.inmune      = !!mob.inmune;
            this.defense     = mob.defense || 0;
            this.timer       = 0;
            
            this.mbody.innerHTML = mob.content;
        }
    };
    
    
    
    // The public API
    Mobs = {
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
    return Mobs;
}());