/*jslint browser: true */
/*global Mob, List, AStar, Utils */

var Mobs = (function () {
    "use strict";
    
    var showWaves = 8,
        simWaves  = 3,
        waveWidth = 79,
        waves     = [
            "Normal",    "Inmune", "Group",  "Fast",   "Normal", "Spawn",  "Flying", "NormalBoss",
            "Inmune",    "Group",  "Arrow",  "Normal", "Spawn",  "Flying", "Normal", "InmuneBoss",
            "Group",     "Arrow",  "Dark",   "Spawn",  "Flying", "Normal", "Inmune", "GroupBoss",
            "Arrow",     "Dark",   "Spawn",  "Flying", "Decoy",  "Hopper", "Morph",  "FastBoss",
            "Dark",      "Spawn",  "Flying", "Decoy",  "Hopper", "Morph",  "Fast",   "DarkBoss",
            "Spawn",     "Flying", "Decoy",  "Hopper", "Morth",  "Fast",   "Dark",   "FlyingBoss",
            "SpawnBoss", "Normal"
        ],
        moveDirs    = [[ 0, 1 ], [ 1, 1 ], [ 1, 0 ], [ 1, -1 ], [ 0, -1 ], [ -1, -1 ], [ -1, 0 ], [ -1, 1 ], [ 0, 0 ]],
        moveAlertsX = [  0, -1, -1, -1, -1,  0,  0,  0 ],
        moveAlertsY = [ -1, -1,  0,  0,  1,  1,  1,  0 ];
    
    
    
    /**
     * @constructor
     * @private
     * The Mobs Manager Class
     * @param {Mobs} parent
     */
    function Manager(parent) {
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
     * @return {Iterator}
     */
    Manager.prototype.add = function (mob) {
        var it = this.list.addLast(mob);
        
        mob.setIterator(it);
        this.id += 1;
        return mob;
    };
    
    /**
     * Returns the Mob with the given ID, if there is one
     * @return {Mob}
     */
    Manager.prototype.get = function (id) {
        var result = null;
        if (!this.list.isEmpty()) {
            this.list.some(function (mob) {
                if (mob.getID() === Number(id)) {
                    result = mob;
                    return true;
                }
            });
        }
        return result;
    };
    
    /**
     * Mobs all the Mobs in the list at the given speed
     * @param {number} time
     * @param {number} speed
     */
    Manager.prototype.moveMobs = function (time, speed) {
        var self = this;
        if (!this.moving.isEmpty()) {
            this.moving.forEach(function (it) {
                var mob = it.getPrev(), cell, turn;
                mob.move(speed);
                
                cell = self.moveToNewCell(mob);
                turn = self.turnMob(mob);
                mob.specialPower(time, cell, turn);
            });
        }
    };
    
    /**
     * Moves the Mob to a new cell
     * @param {Mob} mob
     */
    Manager.prototype.moveToNewCell = function (mob) {
        var	pos = mob.getCenterPos(),
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
    };
    
    /**
     * Turns the mob, when required
     * @param {Mob} mob
     */
    Manager.prototype.turnMob = function (mob) {
        var dir, result = false;
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
    };
    
    /**
     * Removes the Mob when it reached the Exit
     * @param {Mob} mob
     */
    Manager.prototype.mobExits = function (mob) {
        this.parent.score.decLives();
        this.parent.alerts.life(mob);
        this.parent.panel.destroyMob(mob);
        this.parent.sounds.exit();
        mob.destroy();
    };
    
    /**
     * Removes the Mob when it's life is lower or equal to cero
     * @param {Mob} mob
     */
    Manager.prototype.killMob = function (mob) {
        var gold = mob.getGold();
        
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
        this.parent.sounds.death();
        mob.destroy();
        
        if (this.parent.waves.isLastWave() && this.isEmpty()) {
            this.parent.score.gameOver();
        }
    };
    
    
    /**
     * Adds all the mobs in the array to the create list
     * @param {Array.<Mob>} mobs
     */
    Manager.prototype.addCreate = function (mobs) {
        var self = this;
        mobs.forEach(function (mob) {
            self.creating.addLast(mob);
        });
    };
    
    /**
     * Iterates through the create list reducing the time of the mobs in it. When the timer of a mob
     * reaches 0, the mob is moved to the moving list
     * @param {number} time
     */
    Manager.prototype.reduceCreate = function (time) {
        var mob, it, itm;
        if (!this.creating.isEmpty()) {
            it = this.creating.iterate();
            while (it.hasNext()) {
                mob = it.getNext();
                if (mob.decTimer(time)) {
                    itm = this.moving.addLast(mob.getIterator());
                    mob.create(itm);
                    it.removeNext();
                } else {
                    it.next();
                }
            }
        }
    };
    
    
    /**
     * Adds all the mobs in the array to the spawn list
     * @param {Array.<Mob>} mobs
     */
    Manager.prototype.addSpawn = function (mobs) {
        var self = this;
        mobs.forEach(function (mob) {
            self.spawning.addLast(mob);
            mob.startSpawn();
        });
    };
    
    /**
     * Iterates through the spawn list moving the mob to the original cell. When it reaches it, the mob
     * is moved to the moving list, and the spawn process for the mob is ended
     * @param {number} time
     */
    Manager.prototype.reduceSpawn = function (time) {
        var mob, it, itm;
        if (!this.spawning.isEmpty()) {
            it = this.spawning.iterate();
            while (it.hasNext()) {
                mob = it.getNext();
                if (mob.moveSpawn(time)) {
                    itm = this.moving.addLast(mob.getIterator());
                    mob.endSpawn(itm);
                    this.parent.paths.asignPathToMob(mob, this.parent.paths.newPath(mob));
                    it.removeNext();
                } else {
                    it.next();
                }
            }
        }
    };
    
    
    /**
     * Adds all the mobs in the array to the slow list, to slow them for a short period
     * @param {Array.<Mob>} mobs
     */
    Manager.prototype.addSlow = function (mobs) {
        var self = this;
        mobs.forEach(function (mob) {
            if (!mob.isDead() && !mob.isSlowed()) {
                var it = self.slowed.addLast(mob);
                mob.startSlow(it);
                self.parent.panel.updateMob(mob);
            }
        });
    };
    
    /**
     * Iterates through the slow list reducing the time of the slow event. When the time reaches 0, the mob
     * goes back to it's normal speed
     * @param {number} time
     */
    Manager.prototype.reduceSlow = function (time) {
        var mob, it;
        if (!this.slowed.isEmpty()) {
            it = this.slowed.iterate();
            while (it.hasNext()) {
                mob = it.getNext();
                if (mob.decSlow(time)) {
                    mob.endSlow();
                    it.removeNext();
                } else {
                    it.next();
                }
            }
        }
    };
    
    
    /**
     * Adds all the mobs in the array to the stun list, to stun them for a short period
     * @param {Array.<Mob>} mobs
     * @param {Tower} tower
     */
    Manager.prototype.addStun = function (mobs, tower) {
        var self = this;
        mobs.forEach(function (mob) {
            if (!mob.isDead() && !mob.isStunned() && tower.shouldStun()) {
                var it = self.stunned.addLast(mob);
                mob.startStun(it);
            }
        });
    };
    
    /**
     * Iterates through the stun list reducing the time of the stun event. When the time reaches 0, the mob
     * goes starts moving again
     * @param {number} time
     */
    Manager.prototype.reduceStun = function (time) {
        var mob, it;
        if (!this.stunned.isEmpty()) {
            it = this.stunned.iterate();
            while (it.hasNext()) {
                mob = it.getNext();
                if (mob.decStun(time)) {
                    mob.endStun();
                    it.removeNext();
                } else {
                    it.next();
                }
            }
        }
    };
    
    
    /**
     * Adds all the mobs in the array to the bleed list, to make them bleed for a short period
     * @param {Array.<Mob>} mobs
     * @param {number} damage
     */
    Manager.prototype.addBleed = function (mobs, damage) {
        var self = this;
        mobs.forEach(function (mob) {
            if (!mob.isBleeding()) {
                var it = self.bleeding.addLast(mob);
                mob.startBleed(it, damage);
            } else {
                mob.addBleed(damage);
            }
        });
    };
    
    /**
     * Iterates through the bleed list reducing the time of the bleed events. When all the bleeding times
     * reached 0, the mob stops bleeding. If it dies before, the mob is removed
     * @param {number} time
     */
    Manager.prototype.reduceBleed = function (time) {
        var mob, it;
        if (!this.bleeding.isEmpty()) {
            it = this.bleeding.iterate();
            while (it.hasNext()) {
                mob = it.getNext();
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
    };
    
    
    /**
     * Returns true if there are no Mobs in the Game
     * @return {boolean}
     */
    Manager.prototype.isEmpty = function () {
        return this.list.isEmpty();
    };
    
    /**
     * Returns the next ID for a new Mob
     * @return {number}
     */
    Manager.prototype.getNextID = function () {
        return this.id;
    };
    
    /**
     * Returns the list with all the Mobs
     * @return {List.<Mob>}
     */
    Manager.prototype.getList = function () {
        return this.list;
    };
    
    /**
     * Returns the list with the Mobs that are moving
     * @return {List.<Iterator>}
     */
    Manager.prototype.getMovingMobs = function () {
        return this.moving;
    };
    
    
    
    /**
     * @constructor
     * @private
     * The Mobs Create Class
     * @param {Mobs} parent
     */
    function Create(parent) {
        this.parent   = parent;
        this.monsters = document.querySelector(".monsters");
        this.blooder  = document.querySelector(".blood");
        
        this.monsters.innerHTML = "";
        this.blooder.innerHTML  = "";
    }
    
    /**
     * Creates the Mobs for all the starts
     * @param {{type: string, isBoss: boolean, wave: number, lastWave: boolean}} data
     */
    Create.prototype.mobs = function (data) {
        var starts  = this.parent.board.getStarts(),
            targets = this.parent.board.getTargets(),
            self    = this;
        
        starts.forEach(function (element, index) {
            self.createMobs(data, starts[index], targets[index]);
        });
    };
    
    /**
     * For a single path, it creates all the required Mobs
     * @param {{type: string, isBoss: boolean, wave: number, lastWave: boolean}} data
     * @param {Array.<Array.<[number, number]>>} starts
     * @param {Array.<Array.<[number, number]>>} targets
     */
    Create.prototype.createMobs = function (data, starts, targets) {
        var pos, start, path, dir, mob, i = 0, mobs = [];
        
        do {
            pos   = Utils.rand(0, starts.length - 1);
            start = starts[pos].pos;
            path  = this.parent.paths.getCellName(start[0], start[1], data.type === "Hopper");
            dir   = this.parent.paths.getMobDir(path, 0, data.type === "Flying");
            
            mob   = new Mob[data.type]({
                id          : this.parent.manager.getNextID(),
                pos         : i,
                boss        : data.isBoss,
                wave        : data.wave,
                row         : start[1],
                col         : start[0],
                top         : start[1] * this.parent.board.getSize(),
                left        : start[0] * this.parent.board.getSize(),
                dirTop      : dir.top,
                dirLeft     : dir.left,
                path        : path,
                targetPos   : targets[pos].pos,
                targetValue : targets[pos].value,
                angle       : this.parent.paths.getAngle(path),
                deg         : this.parent.paths.getDeg(dir),
                gameLevel   : this.parent.gameLevel,
                boardSize   : this.parent.board.getSize()
            });
            
            this.parent.manager.add(mob);
            this.monsters.appendChild(mob.createElement());
            mobs.push(mob);
            i += 1;
        } while (mob.getAmount(data.lastWave) > i);
        
        this.parent.manager.addCreate(mobs);
    };
    
    /**
     * Creates all the childs of a single parent
     * @param {Mob} parent
     */
    Create.prototype.childs = function (parent) {
        var dist, move, dtop, dleft, dir, cell, mob, i = 0,
            cells  = this.getCloseCells(parent),
            childs = [];
        
        do {
            dist  = Math.floor(this.parent.board.getSize() / 2);
            move  = Utils.rand(-dist, dist);
            dtop  = Utils.rand(0, 1);
            dleft = 1 - dtop;
            dir   = { top: move < 0 ? -dtop : dtop, left: move < 0 ? -dleft : dleft };
            cell  = cells[i % cells.length];
            
            mob   = new Mob[parent.getChildName()]({
                pos         : i,
                id          : this.parent.manager.getNextID(),
                boss        : parent.isBoss(),
                wave        : parent.getWave(),
                row         : parent.getRow(),
                col         : parent.getCol(),
                top         : parent.getPos().top,
                left        : parent.getPos().left,
                dirTop      : dir.top,
                dirLeft     : dir.left,
                path        : null,
                targetPos   : parent.getTargetPos(),
                targetValue : parent.getTargetValue(),
                angle       : 0,
                deg         : this.parent.paths.getDeg(dir),
                spawnTo     : {
                    top  : cell[0] * this.parent.board.getSize() + move * dtop,
                    left : cell[1] * this.parent.board.getSize() + move * dleft
                },
                gameLevel : this.parent.gameLevel,
                boardSize : this.parent.board.getSize()
            });
            
            this.parent.manager.add(mob);
            this.monsters.appendChild(mob.createElement());
            childs.push(mob);
            i += 1;
        } while (mob.getAmount() > i);
        
        this.parent.manager.addSpawn(childs);
    };
    
    /**
     * Creates the blood after killing a mob
     * @param {Mob} mob
     */
    Create.prototype.createBlood = function (mob) {
        var element = document.createElement("DIV");
        element.className  = "blood";
        element.style.top  = mob.getPos().top  + "px";
        element.style.left = mob.getPos().left + "px";
        this.blooder.appendChild(element);
    };
    
    
    /**
     * Returns a random list with all the cells around the given Mob with nothing on them
     * @param {Mob} mob
     */
    Create.prototype.getCloseCells = function (mob) {
        var nothing = this.parent.board.getNothingValue(),
            cells   = [],
            self    = this;
        
        moveDirs.forEach(function (dir) {
            var row = mob.getRow() + dir[0],
                col = mob.getCol() + dir[1];
            
            if (self.parent.board.inMatrix(row, col) && self.parent.board.getContent(row, col) <= nothing) {
                cells.push([ row, col ]);
            }
        });
        
        cells.forEach(function (cell, i) {
            var pos = Utils.rand(0, cells.length - 1);
            
            cells[i]   = cells[pos];
            cells[pos] = cell;
        });
        
        return cells;
    };
    
    
    
    /**
     * @constructor
     * @private
     * The Mobs Alerts Class
     */
    function Alerts() {
        this.list   = new List();
        this.alerts = document.querySelector(".alerts");
        this.alerts.innerHTML = "";
    }
        
    /**
     * Adds a minus 1 life alert
     * @param {Mob} mob
     */
    Alerts.prototype.life = function (mob) {
        this.add(mob, "alertRed", "-1");
    };
    
    /**
     * Adds a plus gold amount alert
     * @param {Mob} mob
     */
    Alerts.prototype.gold = function (mob) {
        this.add(mob, "alertYellow", "+" + mob.getGold());
    };
    
    /**
     * Used to add any type of alert to thealert list
     * @param {Mob} mob
     * @param {string} className
     * @param {string} text
     */
    Alerts.prototype.add = function (mob, className, text) {
        this.list.addLast({
            element: this.create(mob, className, text),
            top:     0,
            left:    0,
            timer:   100,
            pointer: 0
        });
    };
    
    /**
     * Creates, appends and returns the element for the alert
     * @param {Mob} mob
     * @param {string} className
     * @param {string} text
     */
    Alerts.prototype.create = function (mob, className, text) {
        var element = document.createElement("DIV");
        element.style.top  = mob.getPos().top  + "px";
        element.style.left = mob.getPos().left + "px";
        element.className  = "alert " + className;
        element.innerHTML  = text;
        
        this.alerts.appendChild(element);
        return element;
    };
    
    /**
     * It iterates through the alerts moving them and removing them from the list when done
     * @param {number} time
     */
    Alerts.prototype.move = function (time) {
        if (!this.list.isEmpty()) {
            var it = this.list.iterate(), data;
            while (it.hasNext()) {
                data = it.getNext();
                data.timer -= time;
                if (data.timer <= 0) {
                    data.top     += moveAlertsY[data.pointer];
                    data.left    += moveAlertsX[data.pointer];
                    data.timer    = 100;
                    data.pointer += 1;
                    Utils.setTransform(data.element, "translate(" + data.left + "px, " + data.top + "px)");
                }
                if (data.pointer >= moveAlertsX.length) {
                    Utils.removeElement(data.element);
                    it.removeNext();
                } else {
                    it.next();
                }
            }
        }
    };
    
    
    
    /**
     * @constructor
     * The Mobs Paths Class
     * @param {Mobs} parent
     */
    function Paths(parent) {
        this.parent      = parent;
        this.element     = document.querySelector(".path");
        this.blocker     = document.querySelector(".blocking");
        this.normalPaths = {};
        this.flyerPaths  = {};
        this.mobs        = {};
        this.arrows      = {};
        
        this.createPaths();
        this.createFlyersPaths();
    }
    
    /**
     * Creates the Paths. Shows the preview if the game hasn't started and returns true
     * when there isn't possible to create at least one of the required paths
     * @return {boolean}
     */
    Paths.prototype.createPaths = function () {
        var paths = {}, blocking = false;
        this.mobs = [];
        
        blocking = this.createNormalPaths(paths);
        if (!blocking) {
            blocking = this.createMobsPaths(paths);
        }
        if (!blocking) {
            this.normalPaths = paths;
            if (this.parent.hasStarted) {
                this.asignPathsToMobs();
            } else {
                this.showPreview();
            }
        } else {
            this.blocking();
        }
        return !blocking;
    };
    
    /**
     * Creates the Paths for non-flyer mobs
     * @param {Object.<Array.<[number, number]>>}
     */
    Paths.prototype.createNormalPaths = function (paths) {
        var starts  = this.parent.board.getStarts(),
            targets = this.parent.board.getTargets(),
            wall    = this.parent.board.getWallsValue(),
            matrix  = this.parent.board.getMatrix(),
            self    = this;
        
        return starts.some(function (list, i) {
            return list.some(function (start, j) {
                return [0, 1].some(function (k) {
                    var cell    = self.getCellName(start.pos[0], start.pos[1], k);
                    paths[cell] = new AStar(matrix, start.pos, targets[i][j].pos, self.getType(k), wall);
                    
                    if (paths[cell].length === 0) {
                        return true;
                    }
                });
            });
        });
    };
    
    /**
     * Creates special Paths that start on the mobs location and goes to its previows target.
     * This is used when creating towers while playing
     * @param {Object.<Array.<[number, number]>>}
     */
    Paths.prototype.createMobsPaths = function (paths) {
        var self = this;
        if (!this.parent.manager.isEmpty()) {
            this.parent.manager.getList().forEach(function (mob) {
                var cell = self.getCellName(mob.getCol(), mob.getRow(), mob.isHopper());
                
                if (self.parent.board.inMatrix(mob.getRow(), mob.getCol()) && !mob.isFlyer()) {
                    paths[cell] = self.createMobPath(mob);
                    if (paths[cell].length === 0) {
                        return true;
                    } else {
                        self.mobs[mob.getID()] = cell;
                    }
                }
            });
            return false;
        }
    };
    
    /**
     * Creates the paths for the flyer mobs, which is just a direction and an angle, since flyers
     * go straight from start to end
     */
    Paths.prototype.createFlyersPaths = function () {
        var starts  = this.parent.board.getStarts(),
            targets = this.parent.board.getTargets(),
            self    = this;
        
        starts.forEach(function (list, i) {
            list.forEach(function (start, j) {
                var p = self.getCellName(start.pos[0], start.pos[1], false),
                    x = targets[i][j].pos[0] - start.pos[0],
                    y = targets[i][j].pos[1] - start.pos[1],
                    h = Utils.calcDistance(x, y),
                    d = Utils.calcAngle(x, y);
                
                self.flyerPaths[p] = { dir: { top: y / h, left: x / h }, deg: d };
            });
        });
    };
    
    
    /**
     * Asings to each mob a new path
     */
    Paths.prototype.asignPathsToMobs = function () {
        var self = this;
        if (!this.parent.manager.isEmpty()) {
            this.parent.manager.getList().forEach(function (mob) {
                self.asignPathToMob(mob, self.mobs[mob.getID()]);
            });
        }
    };
    
    /**
     * Asings the given path to the given mob, if posible
     */
    Paths.prototype.asignPathToMob = function (mob, path) {
        if (path) {
            mob.newPath(path, this.getPathDir(path, 0));
        }
    };
    
    /**
     * Sets a new Path for the given mob
     * @param {Mob} mob
     * @return {string}
     */
    Paths.prototype.newPath = function (mob) {
        var cell = this.getCellName(mob.getCol(), mob.getRow(), mob.isHopper());
        this.normalPaths[cell] = this.createMobPath(mob);
        return cell;
    };
    
    /**
     * Creates a path for the given mob
     * @param {Mob} mob
     * @return {Array.<[number, number]>}
     */
    Paths.prototype.createMobPath = function (mob) {
        var start  = [ mob.getCol(), mob.getRow() ],
            matrix = this.parent.board.getMatrix(),
            type   = this.getType(mob.isHopper()),
            wall   = this.parent.board.getWallsValue();
        
        return new AStar(matrix, start, mob.getTargetPos(), type, wall);
    };
    
    
    
    /**
     * Shows the Blocking sign and sets a timeout to hide it after 1.5s
     */
    Paths.prototype.blocking = function () {
        var self = this;
        this.blocker.style.display = "block";
        this.parent.sounds.blocking();
        
        window.setTimeout(function () {
            self.blocker.style.display = "none";
        }, 1500);
    };
        
    /**
     * Shows a preview of the paths, only in the planning mode
     */
    Paths.prototype.showPreview = function () {
        var self = this;
        this.hidePreview();
        
        Object.keys(this.normalPaths).forEach(function (name) {
            if (name.substr(-1) !== "f") {
                self.normalPaths[name].forEach(function (path, pos) {
                    var row  = path[1],
                        col  = path[0],
                        cell = self.getCellName(col, row, false);
                    
                    if (!self.arrows[cell] && !self.parent.board.isTarget(row, col)) {
                        self.createElement(name, pos, row, col);
                        self.arrows[cell] = 1;
                    }
                });
            }
        });
    };
    
    /**
     * Destroys the preview of the paths
     */
    Paths.prototype.hidePreview = function () {
        this.element.innerHTML = "";
        this.arrows = {};
    };
    
    /**
     * Creates each arrow for the paths preview
     * @param {string} path
     * @param {number} pos
     * @param {number} row
     * @param {number} col
     */
    Paths.prototype.createElement = function (path, pos, row, col) {
        var angle   = this.getDeg(this.getPathDir(path, pos, false)),
            element = document.createElement("DIV");
        
        element.style.top  = (row * this.parent.board.getSize()) + "px";
        element.style.left = (col * this.parent.board.getSize()) + "px";
        
        Utils.setTransform(element, "rotate(" + angle + "deg)");
        this.element.appendChild(element);
    };
    
    
    /**
     * Returns an ID for a path using the given parameters
     * @param {number} col 
     * @param {number} row 
     * @param {boolean} free 
     */
    Paths.prototype.getCellName = function (col, row, free) {
        return "c" + col + "r" + row + (free ? "f" : "");
    };
    
    /**
     * Returns the type of Paths to use, which are used for different type of mobs
     * @param {boolean} free
     */
    Paths.prototype.getType = function (free) {
        return free ? "DiagonalFree" : "Diagonal";
    };
    
    /**
     * Returns the direction of the path at the given position for a mob
     * @param {string} path
     * @param {number} pos
     * @param {boolean} isFlyer
     * @return {{top: number, left: number}}
     */
    Paths.prototype.getMobDir = function (path, pos, isFlyer) {
        if (isFlyer) {
            return this.flyerPaths[path].dir;
        } else {
            var dir = this.getPathDir(path, pos);
            if (dir.top === dir.left === 1) {
                return { top: dir.top / 1.414, left: dir.left / 1.414 };
            } else {
                return { top: dir.top, left: dir.left };
            }
        }
    };
    
    /**
     * Returns the direction of the path at the given position using the information of the path
     * @param {string} path
     * @param {number} pos
     * @return {{top: number, left: number}}
     */
    Paths.prototype.getPathDir = function (path, pos) {
        if (!this.normalPaths[path][pos + 1]) {
            return { top: null, left: null };
        } else {
            return {
                top  : this.normalPaths[path][pos + 1][1] - this.normalPaths[path][pos][1],
                left : this.normalPaths[path][pos + 1][0] - this.normalPaths[path][pos][0]
            };
        }
    };
    
    /**
     * Returns the Angle depending on the given direction
     * @param {{top: number, left: number}} dir
     * @return {number}
     */
    Paths.prototype.getDeg = function (dir) {
        var deg;
        if (dir.top === 0 && dir.left  >  0) { deg =   0; }
        if (dir.top  >  0 && dir.left  >  0) { deg =  45; }
        if (dir.top  >  0 && dir.left === 0) { deg =  90; }
        if (dir.top  >  0 && dir.left  <  0) { deg = 135; }
        if (dir.top === 0 && dir.left  <  0) { deg = 180; }
        if (dir.top  <  0 && dir.left  <  0) { deg = 225; }
        if (dir.top  <  0 && dir.left === 0) { deg = 270; }
        if (dir.top  <  0 && dir.left  >  0) { deg = 315; }
        return deg;
    };
    
    /**
     * Returns the Angle using the flyers paths data
     * @param {string} path
     * @return {number}
     */
    Paths.prototype.getAngle = function (path) {
        return this.flyerPaths[path] ? this.flyerPaths[path].deg : 0;
    };
    
    /**
     * Returns true if the given position represents the next cell in the path
     * @param {Mob} mob
     * @param {number} row
     * @param {number} col
     * @return {boolean}
     */
    Paths.prototype.nextInPath = function (mob, row, col) {
        if (mob.isFlyer()) {
            return row !== mob.getRow() || col !== mob.getCol();
        }
        var path = this.normalPaths[mob.getPath()][mob.getPointer() + 1];
        if (path) {
            return path[0] === col && path[1] === row;
        }
        return false;
    };
    
    
    
    /**
     * @constructor
     * @private
     * The Mobs Waves Class
     * @param {Mobs} parent
     */
    function Waves(parent) {
        this.parent    = parent;
        this.container = document.querySelector(".waves");
        this.waver     = document.querySelector(".currentWave");
        this.total     = document.querySelector(".totalWaves");
        this.button    = document.querySelector(".nextButton");
        
        this.elements  = [];
        this.wave      = 0;
        this.count     = Math.min(showWaves, waves.length);
        this.simWaves  = simWaves - 1;
        
        this.setWave();
        
        var i;
        this.container.innerHTML = "";
        for (i = 0; i < this.count; i += 1) {
            this.createElement(i);
        }
        
        this.button.style.display = "";
        this.total.innerHTML      = waves.length;
    }
    
    /**
     * Moves to the next Wave
     */
    Waves.prototype.next = function () {
        if (!this.isLastWave() && this.simWaves > 0) {
            this.newWave();
            this.setLeft();
            this.simWaves -= 1;
            
            if (this.simWaves <= 0) {
                this.button.style.display = "none";
            }
        }
    };
    
    /**
     * Sends the moves from the new Wave
     */
    Waves.prototype.sendMobs = function () {
        this.parent.create.mobs({
            type     : this.getType(),
            isBoss   : this.isBossWave(),
            wave     : this.wave + 1,
            lastWave : this.isLastWave()
        });
        this.parent.score.startTimer();
        this.parent.sounds.enter();
    };
    
    /**
     * Moves all the waves elements
     */
    Waves.prototype.move = function () {
        if (this.isLastWave()) {
            this.button.style.display = "none";
            this.parent.score.removeTimer();
        } else {
            if (this.parent.score.getTimer() === 0) {
                this.newWave();
                this.simWaves = Math.min(this.simWaves + 1, simWaves);
            
                if (this.simWaves > 0) {
                    this.button.style.display = "";
                }
            }
            this.setLeft();
        }
    };
    
    /**
     * Adds a new Wave element
     */
    Waves.prototype.newWave = function () {
        if (this.wave + this.count < waves.length) {
            this.createElement(this.count);
        }
        
        this.removeElement();
        this.left  = 0;
        this.wave += 1;
        this.setWave();
        this.sendMobs();
    };
        
    /**
     * Creates the Wave element
     * @param {number} add
     */
    Waves.prototype.createElement = function (add) {
        var mob = new Mob[this.getType(add)]({ boss : this.isBossWave(add) }),
            div = document.createElement("DIV");
        
        div.style.backgroundColor = mob.getColor();
        div.style.left = this.getLeft(this.wave + add, 0) + "px";
        div.className  = "wave";
        div.innerHTML  =
            "<h3>" + (this.wave + add + 1) + ". " + (mob.isBoss() ? "Boss" : mob.getName()) + "</h3>" +
            "<p>"  + mob.getSlogan() + "</p>";
        
        this.container.appendChild(div);
        this.elements[this.elements.length] = div;
    };
    
    /**
     * Removes the first Wave element
     */
    Waves.prototype.removeElement = function () {
        Utils.removeElement(this.elements[0]);
        this.elements = this.elements.splice(1);
    };
    
    /**
     * Sets the left position of the waves elements
     */
    Waves.prototype.setLeft = function () {
        var start = (this.parent.score.getTimer() - 25) * waveWidth / 25,
            self  = this;
        
        this.elements.forEach(function (element, index) {
            element.style.left = self.getLeft(index, start) + "px";
        });
    };
    
    
    /**
     * Returns the type of the current + add wave
     * @return {string}
     */
    Waves.prototype.getType = function (add) {
        return waves[this.wave + (add || 0)].replace("Boss", "");
    };
    
    /**
     * Returns true if the wave of the current + add is a boss wave
     * @return {boolean}
     */
    Waves.prototype.isBossWave = function (add) {
        return waves[this.wave + (add || 0)].indexOf("Boss") > -1;
    };
    
    /**
     * Returns the left property for the element at the given index
     * @param {number} index
     * @param {number} start
     */
    Waves.prototype.getLeft = function (index, start) {
        return Math.round(start + index * waveWidth);
    };
    
    /**
     * Returns true if this is the last wave
     * @return {boolean}
     */
    Waves.prototype.isLastWave = function () {
        return this.wave + 1 === waves.length;
    };
    
    /**
     * Sets the inner HTML for the current wave
     */
    Waves.prototype.setWave = function () {
        this.waver.innerHTML = this.wave + 1;
    };
    
    
    
    /**
     * @constructor
     * The Mobs Class
     * @param {Score} score
     * @param {Board} board
     * @param {Panel} panel
     * @param {Sounds} sounds
     */
    function Mobs(score, board, panel, sounds, gameLevel) {
        this.score      = score;
        this.board      = board;
        this.panel      = panel;
        this.sounds     = sounds;
        this.manager    = new Manager(this);
        this.create     = new Create(this);
        this.alerts     = new Alerts();
        this.paths      = new Paths(this);
        this.waves      = new Waves(this);
        
        this.gameLevel  = gameLevel;
        this.hasStarted = false;
        
        var self = this;
        this.board.addListener("mob", function (event, element) {
            self.panel.showMob(self.manager.get(element.parentNode.dataset.id));
        });
        this.board.addListener("default", function () {
            self.panel.hide();
        });
    }
    
    /**
     * Updates the inner started state when the game starts
     */
    Mobs.prototype.gameStarted = function () {
        this.hasStarted = true;
        
        this.paths.hidePreview();
        this.waves.sendMobs();
    };
    
    /**
     * Called on each animation frame to decreases the timers from the different lists,
     * update the build status and move the ammos
     * @param {number} time
     * @param {number} speed
     * @param {boolean} moveWave
     */
    Mobs.prototype.animate = function (time, speed, moveWave) {
        this.manager.moveMobs(time, speed);
        this.manager.reduceCreate(time);
        this.manager.reduceSpawn(time);
        this.manager.reduceSlow(time);
        this.manager.reduceBleed(time);
        this.manager.reduceStun(time);
        this.alerts.move(time);
        
        if (moveWave) {
            this.waves.move();
        }
    };
    
    /**
     * Creates the new Paths
     */
    Mobs.prototype.createPath = function () {
        return this.paths.createPaths();
    };
    
    /**
     * Sends the next Wave
     */
    Mobs.prototype.sendNextWave = function () {
        this.waves.next();
    };
    
    /**
     * Returns the list with the Mobs that are moving
     * @return {List}
     */
    Mobs.prototype.getMovingMobs = function () {
        return this.manager.getMovingMobs();
    };
    
    /**
     * Removes the Mob when it's life is lower or equal to cero
     * @param {Mob} mob
     */
    Mobs.prototype.killMob = function (mob) {
        this.manager.killMob(mob);
    };
    
    /**
     * Adds all the mobs to one of the lists, if possible
     * @param {Array.<Mob>} mobs
     * @param {Tower} tower
     */
    Mobs.prototype.addToList = function (mobs, tower) {
        if (tower.canSlow()) {
            this.manager.addSlow(mobs);
        } else if (tower.canStun()) {
            this.manager.addStun(mobs, tower);
        } else if (tower.canBleed()) {
            this.manager.addBleed(mobs, tower.getActualDamage());
        }
    };
    
    
    
    // The public API
    return Mobs;
}());