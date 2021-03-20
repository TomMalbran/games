/**
 * The Mobs Paths Class
 */
class Paths {

    /**
     * The Mobs Paths constructor
     * @param {Mobs} parent
     */
    constructor(parent) {
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
     * @returns {Boolean}
     */
    createPaths() {
        let paths = {}, blocking = false;
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
    }

    /**
     * Creates the Paths for non-flyer mobs
     * @param {Object.<Array.<[Number, Number]>>}
     * @returns {Void}
     */
    createNormalPaths(paths) {
        let starts  = this.parent.board.getStarts(),
            targets = this.parent.board.getTargets(),
            wall    = this.parent.board.getWallsValue(),
            matrix  = this.parent.board.getMatrix();

        return starts.some((list, i) => {
            return list.some((start, j) => {
                return [0, 1].some((k) => {
                    let cell    = this.getCellName(start.pos[0], start.pos[1], k);
                    paths[cell] = new AStar(matrix, start.pos, targets[i][j].pos, this.getType(k), wall);

                    if (paths[cell].length === 0) {
                        return true;
                    }
                });
            });
        });
    }

    /**
     * Creates special Paths that start on the mobs location and goes to its previows target.
     * This is used when creating towers while playing
     * @param {Object.<Array.<[Number, Number]>>}
     * @returns {Void}
     */
    createMobsPaths(paths) {
        if (!this.parent.manager.isEmpty()) {
            this.parent.manager.getList().forEach((mob) => {
                let cell = this.getCellName(mob.getCol(), mob.getRow(), mob.isHopper());

                if (this.parent.board.inMatrix(mob.getRow(), mob.getCol()) && !mob.isFlyer()) {
                    paths[cell] = this.createMobPath(mob);
                    if (paths[cell].length === 0) {
                        return true;
                    }
                    this.mobs[mob.getID()] = cell;
                }
            });
            return false;
        }
    }

    /**
     * Creates the paths for the flyer mobs, which is just a direction and an angle, since flyers
     * go straight from start to end
     * @returns {Void}
     */
    createFlyersPaths() {
        let starts  = this.parent.board.getStarts(),
            targets = this.parent.board.getTargets();

        starts.forEach((list, i) => {
            list.forEach((start, j) => {
                let p = this.getCellName(start.pos[0], start.pos[1], false),
                    x = targets[i][j].pos[0] - start.pos[0],
                    y = targets[i][j].pos[1] - start.pos[1],
                    h = Math.hypot(x, y),
                    d = Utils.calcAngle(x, y);

                this.flyerPaths[p] = { dir: { top: y / h, left: x / h }, deg: d };
            });
        });
    }


    /**
     * Asings to each mob a new path
     * @returns {Void}
     */
    asignPathsToMobs() {
        if (!this.parent.manager.isEmpty()) {
            this.parent.manager.getList().forEach((mob) => {
                this.asignPathToMob(mob, this.mobs[mob.getID()]);
            });
        }
    }

    /**
     * Asings the given path to the given mob, if posible
     * @returns {Void}
     */
    asignPathToMob(mob, path) {
        if (path) {
            mob.newPath(path, this.getPathDir(path, 0));
        }
    }

    /**
     * Sets a new Path for the given mob
     * @param {Mob} mob
     * @returns {String}
     */
    newPath(mob) {
        let cell = this.getCellName(mob.getCol(), mob.getRow(), mob.isHopper());
        this.normalPaths[cell] = this.createMobPath(mob);
        return cell;
    }

    /**
     * Creates a path for the given mob
     * @param {Mob} mob
     * @returns {Array.<[Number, Number]>}
     */
    createMobPath(mob) {
        let start  = [ mob.getCol(), mob.getRow() ],
            matrix = this.parent.board.getMatrix(),
            type   = this.getType(mob.isHopper()),
            wall   = this.parent.board.getWallsValue();

        return new AStar(matrix, start, mob.getTargetPos(), type, wall);
    }


    /**
     * Shows the Blocking sign and sets a timeout to hide it after 1.5s
     * @returns {Void}
     */
    blocking() {
        this.blocker.style.display = "block";
        this.parent.sounds.blocking();

        window.setTimeout(() => {
            this.blocker.style.display = "none";
        }, 1500);
    }

    /**
     * Shows a preview of the paths, only in the planning mode
     * @returns {Void}
     */
    showPreview() {
        this.hidePreview();

        Object.keys(this.normalPaths).forEach((name) => {
            if (name.substr(-1) !== "f") {
                this.normalPaths[name].forEach((path, pos) => {
                    let row  = path[1],
                        col  = path[0],
                        cell = this.getCellName(col, row, false);

                    if (!this.arrows[cell] && !this.parent.board.isTarget(row, col)) {
                        this.createElement(name, pos, row, col);
                        this.arrows[cell] = 1;
                    }
                });
            }
        });
    }

    /**
     * Destroys the preview of the paths
     * @returns {Void}
     */
    hidePreview() {
        this.element.innerHTML = "";
        this.arrows = {};
    }

    /**
     * Creates each arrow for the paths preview
     * @param {String} path
     * @param {Number} pos
     * @param {Number} row
     * @param {Number} col
     * @returns {Void}
     */
    createElement(path, pos, row, col) {
        let angle   = this.getDeg(this.getPathDir(path, pos, false)),
            element = document.createElement("DIV");

        element.style.top       = Utils.toPX(row * this.parent.board.getSize());
        element.style.left      = Utils.toPX(col * this.parent.board.getSize());
        element.style.transform = Utils.rotate(angle);

        this.element.appendChild(element);
    }


    /**
     * Returns an ID for a path using the given parameters
     * @param {Number}  col
     * @param {Number}  row
     * @param {Boolean} free
     * @returns {String}
     */
    getCellName(col, row, free) {
        return `c${col}r${row}${free ? "f" : ""}`;
    }

    /**
     * Returns the type of Paths to use, which are used for different type of mobs
     * @param {Boolean} free
     * @returns {String}
     */
    getType(free) {
        return free ? "DiagonalFree" : "Diagonal";
    }

    /**
     * Returns the direction of the path at the given position for a mob
     * @param {String}  path
     * @param {Number}  pos
     * @param {Boolean} isFlyer
     * @returns {{top: Number, left: Number}}
     */
    getMobDir(path, pos, isFlyer) {
        if (isFlyer) {
            return this.flyerPaths[path].dir;
        }
        let dir = this.getPathDir(path, pos);
        if (dir.top === 1 && dir.left === 1) {
            return { top: dir.top / 1.414, left: dir.left / 1.414 };
        }
        return { top: dir.top, left: dir.left };
    }

    /**
     * Returns the direction of the path at the given position using the information of the path
     * @param {String} path
     * @param {Number} pos
     * @returns {{top: Number, left: Number}}
     */
    getPathDir(path, pos) {
        if (!this.normalPaths[path][pos + 1]) {
            return { top: null, left: null };
        }
        return {
            top  : this.normalPaths[path][pos + 1][1] - this.normalPaths[path][pos][1],
            left : this.normalPaths[path][pos + 1][0] - this.normalPaths[path][pos][0]
        };
    }

    /**
     * Returns the Angle depending on the given direction
     * @param {{top: Number, left: Number}} dir
     * @returns {Number}
     */
    getDeg(dir) {
        let deg;
        if (dir.top === 0 && dir.left  >  0) { deg =   0; }
        if (dir.top  >  0 && dir.left  >  0) { deg =  45; }
        if (dir.top  >  0 && dir.left === 0) { deg =  90; }
        if (dir.top  >  0 && dir.left  <  0) { deg = 135; }
        if (dir.top === 0 && dir.left  <  0) { deg = 180; }
        if (dir.top  <  0 && dir.left  <  0) { deg = 225; }
        if (dir.top  <  0 && dir.left === 0) { deg = 270; }
        if (dir.top  <  0 && dir.left  >  0) { deg = 315; }
        return deg;
    }

    /**
     * Returns the Angle using the flyers paths data
     * @param {String} path
     * @returns {Number}
     */
    getAngle(path) {
        return this.flyerPaths[path] ? this.flyerPaths[path].deg : 0;
    }

    /**
     * Returns true if the given position represents the next cell in the path
     * @param {Mob}    mob
     * @param {Number} row
     * @param {Number} col
     * @returns {Boolean}
     */
    nextInPath(mob, row, col) {
        if (mob.isFlyer()) {
            return row !== mob.getRow() || col !== mob.getCol();
        }
        let path = this.normalPaths[mob.getPath()][mob.getPointer() + 1];
        if (path) {
            return path[0] === col && path[1] === row;
        }
        return false;
    }
}
