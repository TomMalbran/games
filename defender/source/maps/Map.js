import Wall         from "./Wall.js";
import Data         from "../Data.js";
import Tower        from "../tower/Tower.js";

// Utils
import Storage      from "../../../utils/Storage.js";



/**
 * Defender Map
 */
export default class Map {

    /**
     * Defender Map constructor
     * @param {String} gameMap
     */
    constructor(gameMap) {
        this.mapData = Data.maps[gameMap];
        this.storage = new Storage(`defender.maps.${gameMap}`);
    }

    /**
     * Returns the amount of paths in the current map
     * @returns {Number}
     */
    getPathsAmount() {
        return this.mapData.paths;
    }

    /**
     * Returns the value in the map matrix at the given position
     * @param {Number} row
     * @param {Number} col
     * @returns {Number}
     */
    getMatrixXY(row, col) {
        return this.mapData.matrix[row][col];
    }



    /**
     * Returns true if the given value is equal to the start 1 value
     * @param {Number} value
     * @returns {Boolean}
     */
    isStart1(value) {
        return value === Data.start1;
    }

    /**
     * Returns true if the given value is equal to the start 2 value
     * @param {Number} value
     * @returns {Boolean}
     */
    isStart2(value) {
        return value === Data.start2;
    }

    /**
     * Returns true if the given value is equal to the target 1 or 2 value
     * @param {Number} value
     * @returns {Boolean}
     */
    isTarget(value) {
        return value === Data.target1 || value === Data.target2;
    }

    /**
     * Returns true if the given value is equal to the target 1 value
     * @param {Number} value
     * @returns {Boolean}
     */
    isTarget1(value) {
        return value === Data.target1;
    }

    /**
     * Returns true if the given value is equal to the target 2 value
     * @param {Number} value
     * @returns {Boolean}
     */
    isTarget2(value) {
        return value === Data.target2;
    }



    /**
     * Returns all the map Walls
     * @returns {Wall[]}
     */
    getWalls() {
        const walls  = [ null ];
        const matrix = [];
        let   className;

        for (let row = 0; row < this.mapData.matrix.length; row += 1) {
            matrix[row] = [];
            for (let col = 0; col < this.mapData.matrix[row].length; col += 1) {
                switch (this.mapData.matrix[row][col]) {
                case Data.start1:
                case Data.start2:
                    className = "start";
                    break;
                case Data.target1:
                case Data.target2:
                    className = "target";
                    break;
                case Data.wall:
                    className = "wall";
                    break;
                default:
                    className = null;
                }

                if (className) {
                    this.processWall(walls, matrix, row, col, className);
                }
            }
        }
        this.compressWalls(walls);
        return walls;
    }

    /**
     * Process the walls to reduce the amount of diva
     * @param {Wall[]}     walls
     * @param {Number[][]} matrix
     * @param {Number}     row
     * @param {Number}     col
     * @param {String}     className
     * @returns {Void}
     */
    processWall(walls, matrix, row, col, className) {
        let id, type;
        if (this.canExpandHorizontal(walls, matrix, row, col, className)) {
            id   = matrix[row - 1][col];
            type = "horizontal";
        } else if (this.canExpandVertical(walls, matrix, row, col, className)) {
            id   = matrix[row][col - 1];
            type = "vertical";
        }

        if (type) {
            if (!walls[id].type) {
                walls[id].type = type;
            }
            if (walls[id].type === "horizontal") {
                walls[id].height += 1;
            }
            if (walls[id].type === "vertical") {
                walls[id].width += 1;
            }
            matrix[row][col] = id;

        } else {
            walls.push(new Wall(className, row, col));
            matrix[row][col] = walls.length - 1;
        }
    }

    /**
     * Process the walls to reduce the amount of diva
     * @param {Wall[]} walls
     * @returns {Void}
     */
    compressWalls(walls) {
        for (let i = 1; i < walls.length; i += 1) {
            let j;
            for (j = 1; j < walls.length; j += 1) {
                if (walls[i].canIncreaseHeight(walls[j])) {
                    walls[i].height += walls[j].height;
                    walls.splice(j, 1);
                    j -= 1;

                } else if (walls[i].canIncreaseWidth(walls[j])) {
                    walls[i].width += walls[j].width;
                    walls.splice(j, 1);
                    j -= 1;
                }
            }
        }
    }

    /**
     * Expands a Wall Horizontally
     * @param {Wall[]}     walls
     * @param {Number[][]} matrix
     * @param {Number}     row
     * @param {Number}     col
     * @param {String}     className
     * @returns {Boolean}
     */
    canExpandHorizontal(walls, matrix, row, col, className) {
        if (matrix[row - 1]) {
            const id = matrix[row - 1][col];
            return id && (!walls[id].type || walls[id].type === "horizontal") && walls[id].className === className;
        }
        return false;
    }

    /**
     * Expands a Wall Vertically
     * @param {Wall[]}     walls
     * @param {Number[][]} matrix
     * @param {Number}     row
     * @param {Number}     col
     * @param {String}     className
     * @returns {Boolean}
     */
    canExpandVertical(walls, matrix, row, col, className) {
        const id = matrix[row][col - 1];
        return id && (!walls[id].type || walls[id].type === "vertical") && walls[id].className === className;
    }



    /**
     * Returns the Towers that will be built when starting this map
     * @returns {{type: String, col: Number, row: Number, level: Number}[]}
     */
    getInitialSetup() {
        const amount = this.storage.get("towers");
        const list   = [];

        if (amount) {
            for (let i = Data.towerStart; i <= amount; i += 1) {
                const data = this.storage.get(`tower.${i}`);
                if (data) {
                    this.storage.remove(`tower.${i}`);
                    list.push(data);
                }
            }
        }
        return list;
    }

    /**
     * Saves a the given Tower in the map storage for the initial setup
     * @param {Tower} tower
     * @returns {Void}
     */
    buildTower(tower) {
        this.storage.set(`tower.${tower.id}`, {
            type  : tower.type,
            row   : tower.row,
            col   : tower.col,
            level : tower.level,
        });
        this.storage.set("towers", tower.id);
    }

    /**
     * Upgrades the level of the given Tower in the map storage for the initial setup
     * @param {Tower} tower
     * @returns {Void}
     */
    upgradeTower(tower) {
        const data = this.storage.get(`tower.${tower.id}`);
        if (data) {
            data.level = tower.level;
            this.storage.set(`tower.${tower.id}`, data);
        }
    }

    /**
     * Removes the given Tower from the map storage for the initial setup
     * @param {Tower} tower
     * @returns {Void}
     */
    sellTower(tower) {
        this.storage.remove(`tower.${tower.id}`);
    }
}
