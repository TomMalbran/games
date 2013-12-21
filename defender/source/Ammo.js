/*jslint browser: true */
/*global Utils */

var Ammo = (function () {
    "use strict";
    
    
    /**
     * @private
     * @constructor
     * The Ammo Base Class
     */
    function Ammo() {
        return undefined;
    }
    
    /**
     * Initializes the Ammo
     * @param {Tower} tower
     * @param {Array} targets
     * @param {number} boardSize
     */
    Ammo.prototype.init = function (tower, targets, boardSize) {
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
    };
    
    /**
     * Creates the element for the Ammo
     * @return {DOMElement}
     */
    Ammo.prototype.createElement = function () {
        this.element              = document.createElement("DIV");
        this.element.className    = this.className;
        this.element.style.top    = this.top  + "px";
        this.element.style.left   = this.left + "px";
        this.element.style.zIndex = 2;
        this.element.innerHTML    = this.content || "";
        
        return this.element;
    };
    
    /**
     * Destroys the Ammo
     */
    Ammo.prototype.destroy = function () {
        Utils.removeElement(this.element);
        this.iterator.removePrev();
    };
    
    /**
     * Sets the iterator pointing to the Ammos list
     * @param {Iterator}
     */
    Ammo.prototype.setIterator = function (it) {
        this.iterator = it;
    };
    
    /**
     * Decreases the timer on the ammo. Returns true when reaching 0
     * @param {number} time
     * @return {boolean}
     */
    Ammo.prototype.decTimer = function (time) {
        this.timer -= time;
        return this.timer <= 0;
    };
        
    
    /**
     * Rotates the Tower Canon, and or the Ammo
     */
    Ammo.prototype.changeAngle = function () {
        var angle = this.tower.getMobAngle(this.targets[0]);
        if (this.rotateTower) {
            this.tower.rotateCanon(angle);
        }
        if (this.rotateAmmo) {
            this.rotate(angle);
        }
    };
    
    /**
     * Rotates the Ammo
     * @param {number} angle
     */
    Ammo.prototype.rotate = function (angle) {
        Utils.setTransform(this.element, "rotate(" + angle + "deg)");
    };
    
    /**
     * Changes the position of the Ammo
     * @param {number} time
     */
    Ammo.prototype.changePos = function (time) {
        var targetPos = this.targets[0].getCenterPos();
        this.top     += this.getDist(targetPos.top  - this.top, time);
        this.left    += this.getDist(targetPos.left - this.left, time);
        
        this.element.style.top  = Math.round(this.top)  + "px";
        this.element.style.left = Math.round(this.left) + "px";
    };
    
    /**
     * Returns the distance to move the ammo depending on the time
     * @param {number} dist
     * @param {number} time
     * @return {number}
     */
    Ammo.prototype.getDist = function (dist, time) {
        return dist * time / this.timer;
    };
    
    /**
     * Changes the display of the Ammo
     */
    Ammo.prototype.changeDisplay = function () {
        if (!this.display) {
            var size = this.tower.getSize() * this.boardSize / 2,
                pos  = this.tower.getCenterPos(),
                dist = Utils.calcDistance(this.top - pos.top, this.left - pos.left);
            
            if (dist > size) {
                this.element.style.display = "block";
                this.display = true;
            }
        }
    };
    
    /**
     * Returns the center of the Ammo
     * @param {number} cell
     * @return {number}
     */
    Ammo.prototype.getPos = function (cell) {
        var center = this.tower.getTowerCenter(cell);
        return center - this.center;
    };
    
    
    /**
     * Returns the Tower which shoot this ammo
     * @return {Tower}
     */
    Ammo.prototype.getTower = function () {
        return this.tower;
    };
    
    /**
     * Returns the Mobs that this ammo will hit
     * @return {Array.<Mob>}
     */
    Ammo.prototype.getTargets = function () {
        return this.targets;
    };
    
    /**
     * Sets the missle index
     * @param {number} index
     */
    Ammo.prototype.setMissile = function (index) {
        this.missile = index;
    };
    
    /**
     * Returns the missle index
     * @return {number}
     */
    Ammo.prototype.getMissile = function () {
        return this.missile;
    };
    
    /**
     * Returns the sound made when hitting the target, if it has one
     * @return {string}
     */
    Ammo.prototype.getHitSound = function () {
        return this.hitSound;
    };
    
    
    
    /**
     * @constructor
     * @extends {Ammo}
     * The Shoot Ammo Class
     * @param {Tower} tower
     * @param {Array} targets
     * @param {number} boardSize
     */
    function ShootAmmo(tower, targets, boardSize) {
        this.center      = 3;
        this.rotateTower = true;
        this.rotateAmmo  = false;
        this.className   = "shootAmmo";
        this.hitSound    = "hit";
        
        this.init(tower, targets, boardSize);
    }
    
    ShootAmmo.prototype = Object.create(Ammo.prototype);
    ShootAmmo.prototype.constructor = ShootAmmo;
    ShootAmmo.prototype.parentClass = Ammo.prototype;
    
    /**
     * Moves the ammo according to the given time. Returns true if it reached the target
     * @param {number} time
     * @return {boolean}
     */
    ShootAmmo.prototype.move = function (time) {
        this.changeAngle();
        this.changePos(time);
        this.changeDisplay();
                        
        if (this.decTimer(time)) {
            this.destroy();
            return true;
        }
        return false;
    };
    
    
    
    /**
     * @constructor
     * @extends {Ammo}
     * The Fast Ammo Class
     * @param {Tower} tower
     * @param {Array} targets
     * @param {number} boardSize
     */
    function FastAmmo(tower, targets, boardSize) {
        this.center      = 3.5;
        this.rotateTower = true;
        this.rotateAmmo  = false;
        this.className   = "fastAmmo";
        this.spinAngle   = 0;
        
        this.init(tower, targets, boardSize);
    }
    
    FastAmmo.prototype = Object.create(Ammo.prototype);
    FastAmmo.prototype.constructor = FastAmmo;
    FastAmmo.prototype.parentClass = Ammo.prototype;
    
    /**
     * Moves the ammo according to the given time. Returns true if it reached the target
     * @param {number} time
     * @return {boolean}
     */
    FastAmmo.prototype.move = function (time) {
        this.changeAngle();
        this.changePos(time);
        this.changeDisplay();
        this.spin();
        
        if (this.decTimer(time)) {
            this.destroy();
            return true;
        }
        return false;
    };
    
    /**
     * Spins the ammo
     */
    FastAmmo.prototype.spin = function () {
        this.spinAngle += 5;
        Utils.setTransform(this.element, "rotate(" + this.spinAngle + "deg)");
    };
    
    
    
    /**
     * @constructor
     * @extends {Ammo}
     * The Missile Ammo Class
     * @param {Tower} tower
     * @param {Array} targets
     * @param {number} boardSize
     */
    function MissileAmmo(tower, targets, boardSize) {
        this.center      = 11;
        this.rotateTower = true;
        this.rotateAmmo  = true;
        this.className   = "missileAmmo";
        this.content     =
            "<div class='missileTail'></div>" +
            "<div class='missileBody'></div>" +
            "<div class='missileHead'></div>";
        
        this.init(tower, targets, boardSize);
    }
    
    MissileAmmo.prototype = Object.create(Ammo.prototype);
    MissileAmmo.prototype.constructor = MissileAmmo;
    MissileAmmo.prototype.parentClass = Ammo.prototype;
    
    /**
     * Moves the ammo according to the given time. Returns true if it reached the target
     * @param {number} time
     * @return {boolean}
     */
    MissileAmmo.prototype.move = function (time) {
        this.changeAngle();
        this.changePos(time);
            
        if (this.decTimer(time)) {
            this.tower.toggleAttack();
            this.destroy();
            return true;
        }
        return false;
    };
    
    
    
    /**
     * @constructor
     * @extends {Ammo}
     * The Anti-Air Ammo Class
     * @param {Tower} tower
     * @param {Array} targets
     * @param {number} boardSize
     * @param {number} index
     */
    function AntiAirAmmo(tower, targets, boardSize, index) {
        this.center      = 5;
        this.rotateTower = false;
        this.rotateAmmo  = true;
        this.className   = "airAmmo";
        this.content     = "<div class='airMissile1'></div>";
        
        this.init(tower, targets, boardSize);
        this.setMissile(index);
    }
    
    AntiAirAmmo.prototype = Object.create(Ammo.prototype);
    AntiAirAmmo.prototype.constructor = AntiAirAmmo;
    AntiAirAmmo.prototype.parentClass = Ammo.prototype;
    
    /**
     * Moves the ammo according to the given time. Returns true if it reached the target
     * @param {number} time
     * @return {boolean}
     */
    AntiAirAmmo.prototype.move = function (time) {
        this.changeAngle();
        this.changePos(time);
            
        if (this.decTimer(time)) {
            this.tower.toggleMissile(this.missile);
            this.destroy();
            return true;
        }
        return false;
    };
    
    
    
    /**
     * @constructor
     * @extends {Ammo}
     * The Frost Ammo Class
     * @param {Tower} tower
     * @param {Array} targets
     * @param {number} boardSize
     */
    function FrostAmmo(tower, targets, boardSize) {
        this.center      = 0.5;
        this.rotateTower = true;
        this.rotateAmmo  = false;
        this.className   = "frostAmmo";
        
        this.init(tower, targets, boardSize);
    }
    
    FrostAmmo.prototype = Object.create(Ammo.prototype);
    FrostAmmo.prototype.constructor = FrostAmmo;
    FrostAmmo.prototype.parentClass = Ammo.prototype;
    
    /**
     * Moves the ammo according to the given time. Returns true if it reached the target
     * @param {number} time
     * @return {boolean}
     */
    FrostAmmo.prototype.move = function (time) {
        this.changeAngle();
        this.changePos(time);
        this.changeDisplay();
            
        if (this.decTimer(time)) {
            this.destroy();
            return true;
        }
        return false;
    };
    
    
    
    /**
     * @constructor
     * @extends {Ammo}
     * The Earthquake Ammo Class
     * @param {Tower} tower
     * @param {Array} targets
     * @param {number} boardSize
     */
    function EarthquakeAmmo(tower, targets, boardSize) {
        this.center      = 40;
        this.rotateTower = false;
        this.rotateAmmo  = false;
        this.className   = "earthAmmo";
        this.opacity     = 0;
        
        this.init(tower, targets, boardSize);
    }
    
    EarthquakeAmmo.prototype = Object.create(Ammo.prototype);
    EarthquakeAmmo.prototype.constructor = EarthquakeAmmo;
    EarthquakeAmmo.prototype.parentClass = Ammo.prototype;
    
    /**
     * Moves the ammo according to the given time. Returns true if it reached the target
     * @param {number} time
     * @return {boolean}
     */
    EarthquakeAmmo.prototype.move = function (time) {
        this.fadeIn();
        
        if (this.decTimer(time)) {
            this.destroy();
            return true;
        }
        return false;
    };
    
    /**
     * Makes the ammo fade in
     */
    EarthquakeAmmo.prototype.fadeIn = function () {
        this.opacity += 0.1;
        this.element.style.opacity = this.opacity;
    };
    
    
    
    /**
     * @constructor
     * @extends {Ammo}
     * The Ink Ammo Class
     * @param {Tower} tower
     * @param {Array} targets
     * @param {number} boardSize
     */
    function InkAmmo(tower, targets, boardSize) {
        this.center      = 0.5;
        this.rotateTower = true;
        this.rotateAmmo  = false;
        this.className   = "inkAmmo";
        
        this.init(tower, targets, boardSize);
    }
    
    InkAmmo.prototype = Object.create(Ammo.prototype);
    InkAmmo.prototype.constructor = InkAmmo;
    InkAmmo.prototype.parentClass = Ammo.prototype;
    
    /**
     * Moves the ammo according to the given time. Returns true if it reached the target
     * @param {number} time
     * @return {boolean}
     */
    InkAmmo.prototype.move = function (time) {
        this.changeAngle();
        this.changePos(time);
        this.changeDisplay();
        
        if (this.decTimer(time)) {
            this.destroy();
            return true;
        }
        return false;
    };
    
    
    
    /**
     * @constructor
     * @extends {Ammo}
     * The Snap Ammo Class
     * @param {Tower} tower
     * @param {Array} targets
     * @param {number} boardSize
     */
    function SnapAmmo(tower, targets, boardSize) {
        this.center      = 0;
        this.rotateTower = false;
        this.rotateAmmo  = true;
        this.className   = "snapAmmo";
        
        this.init(tower, targets, boardSize);
    }
    
    SnapAmmo.prototype = Object.create(Ammo.prototype);
    SnapAmmo.prototype.constructor = SnapAmmo;
    SnapAmmo.prototype.parentClass = Ammo.prototype;
    
    /**
     * Moves the ammo according to the given time. Returns true if it reached the target
     * @param {number} time
     * @return {boolean}
     */
    SnapAmmo.prototype.move = function (time) {
        this.changeAngle();
        this.changePos(time);
        
        if (this.decTimer(time)) {
            this.tower.decAmmo();
            this.destroy();
            return true;
        }
        return false;
    };
    
    
    
    /**
     * @constructor
     * @extends {Ammo}
     * The Laser Ammo Class
     * @param {Tower} tower
     * @param {Array} targets
     * @param {number} boardSize
     */
    function LaserAmmo(tower, targets, boardSize) {
        this.center      = 0;
        this.rotateTower = true;
        this.rotateAmmo  = false;
        this.className   = "laserAmmo";
        
        this.init(tower, targets, boardSize);
    }
    
    LaserAmmo.prototype = Object.create(Ammo.prototype);
    LaserAmmo.prototype.constructor = LaserAmmo;
    LaserAmmo.prototype.parentClass = Ammo.prototype;
    
    /**
     * Moves the ammo according to the given time. Returns true if it reached the target
     * @param {number} time
     * @return {boolean}
     */
    LaserAmmo.prototype.move = function (time) {
        if (this.decTimer(time)) {
            this.destroy();
            return true;
        }
        return false;
    };
    
    /**
     * Rotates the Ammo
     * @param {number} angle
     */
    LaserAmmo.prototype.rotate = function (angle) {
        Utils.setTransform(this.element, "rotate(" + angle + "deg) translateX(20px)");
    };
    
    
    
    // The public API
    return {
        Shoot      : ShootAmmo,
        Fast       : FastAmmo,
        Missile    : MissileAmmo,
        AntiAir    : AntiAirAmmo,
        Frost      : FrostAmmo,
        Earthquake : EarthquakeAmmo,
        Ink        : InkAmmo,
        Snap       : SnapAmmo,
        Laser      : LaserAmmo
    };
}());