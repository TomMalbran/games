import Mobs         from "./Mobs.js";
import Data         from "../Data.js";
import Mob          from "../mob/Mob.js";

// Utils
import AStar        from "../../../utils/AStar.js";
import Utils        from "../../../utils/Utils.js";



/**
 * Defender Mobs Paths
 */
export default class Paths {

    /**
     * Defender Mobs Paths constructor
     * @param {Mobs} parent
     */
    constructor(parent) {
        this.parent      = parent;
        this.normalPaths = {};
        this.flyerPaths  = {};
        this.mobs        = {};
        this.arrows      = {};

        /** @type {HTMLElement} */
        this.element     = document.querySelector(".path");

        /** @type {HTMLElement} */
        this.blocker     = document.querySelector(".blocking");

        this.createPaths();
        this.createFlyersPaths();
    }



    /**
     * Creates the Paths. Shows the preview if the game hasn't started and returns true
     * when there isn't possible to create at least one of the required paths
     * @returns {Boolean}
     */
    createPaths() {
        const paths    = {};
        let   blocking = false;
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
     * @param {Object} paths
     * @returns {Boolean}
     */
    createNormalPaths(paths) {
        const starts  = this.parent.board.starts;
        const targets = this.parent.board.targets;
        const matrix  = this.parent.board.matrix;

        return starts.some((list, i) => {
            return list.some((start, j) => {
                return [ false, true ].some((free) => {
                    const cell      = this.getCellName(start.col, start.row, free);
                    const startPos  = { x: start.col, y: start.row };
                    const targetPos = { x: targets[i][j].col, y: targets[i][j].row };
                    paths[cell]     = AStar(matrix, startPos, targetPos, this.getType(free), Data.wall);

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
     * @param {Object} paths
     * @returns {Boolean}
     */
    createMobsPaths(paths) {
        if (this.parent.manager.isEmpty) {
            return false;
        }
        this.parent.manager.list.forEach((mob) => {
            const cell = this.getCellName(mob.col, mob.row, mob.isHopper);

            if (this.parent.board.inMatrix(mob.row, mob.col) && !mob.isFlyer) {
                paths[cell] = this.createMobPath(mob);
                if (paths[cell].length === 0) {
                    return true;
                }
                this.mobs[mob.id] = cell;
            }
        });
        return false;
    }

    /**
     * Creates the paths for the flyer mobs, which is just a direction and an angle, since flyers
     * go straight from start to end
     * @returns {Void}
     */
    createFlyersPaths() {
        const starts  = this.parent.board.starts;
        const targets = this.parent.board.targets;

        starts.forEach((list, i) => {
            list.forEach((start, j) => {
                const cell = this.getCellName(start.col, start.row, false);
                const x    = targets[i][j].col - start.col;
                const y    = targets[i][j].row - start.row;
                const h    = Math.hypot(x, y);
                const deg  = Utils.calcAngle(x, y);

                this.flyerPaths[cell] = { dir: { top: y / h, left: x / h }, deg };
            });
        });
    }



    /**
     * Asings to each mob a new path
     * @returns {Void}
     */
    asignPathsToMobs() {
        if (!this.parent.manager.isEmpty) {
            this.parent.manager.list.forEach((mob) => {
                this.asignPathToMob(mob, this.mobs[mob.id]);
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
        const cell = this.getCellName(mob.col, mob.row, mob.isHopper);
        this.normalPaths[cell] = this.createMobPath(mob);
        return cell;
    }

    /**
     * Creates a path for the given mob
     * @param {Mob} mob
     * @returns {{x: Number, y: Number}[]}
     */
    createMobPath(mob) {
        const matrix    = this.parent.board.matrix;
        const type      = this.getType(mob.isHopper);
        const startPos  = { x: mob.col, y: mob.row };
        const targetPos = { x: mob.target.col, y: mob.target.row };

        return AStar(matrix, startPos, targetPos, type, Data.wall);
    }



    /**
     * Shows the Blocking sign and sets a timeout to hide it after 1.5s
     * @returns {Void}
     */
    blocking() {
        this.blocker.style.display = "block";
        this.parent.sounds.play("blocking");

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
                    const row  = path.y;
                    const col  = path.x;
                    const cell = this.getCellName(col, row, false);

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
        const angle   = this.getDeg(this.getPathDir(path, pos));
        const element = document.createElement("DIV");

        element.style.top       = Utils.toPX(row * Data.squareSize);
        element.style.left      = Utils.toPX(col * Data.squareSize);
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
        const dir = this.getPathDir(path, pos);
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
            top  : this.normalPaths[path][pos + 1].y - this.normalPaths[path][pos].y,
            left : this.normalPaths[path][pos + 1].x - this.normalPaths[path][pos].x,
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
        if (mob.isFlyer) {
            return row !== mob.row || col !== mob.col;
        }
        const path = this.normalPaths[mob.path][mob.pointer + 1];
        if (path) {
            return path.x === col && path.y === row;
        }
        return false;
    }
}
