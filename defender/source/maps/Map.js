/**
 * The Map Class
 */
class Map {
    
    /**
     * The Map Class
     * @param {string} gameMap
     */
    constructor(gameMap) {
        this.mapData = MapsData.maps[gameMap];
        this.storage = new Storage("defender.maps." + gameMap);
    }
    
    /**
     * Returns the amount of paths in the current map
     * @return {number}
     */
    getPathsAmount() {
        return this.mapData.paths;
    }
    
    /**
     * Returns the value in the map matrix at the given position
     * @param {number} row
     * @param {number} col
     * @return {number}
     */
    getMatrixXY(row, col) {
        return this.mapData.matrix[row][col];
    }
    
    
    /**
     * Returns the Size of a Square in the map
     * @return {number}
     */
    getSquareSize() {
        return MapsData.squareSize;
    }
    
    /**
     * Returns the Amount of columns in a map
     * @return {number}
     */
    getColsAmount() {
        return MapsData.colsAmount;
    }
    
    /**
     * Returns the Amount of rows in a map
     * @return {number}
     */
    getRowsAmount() {
        return MapsData.rowsAmount;
    }
    
    /**
     * Returns the value used for nothing
     * @return {number}
     */
    getNothingValue() {
        return MapsData.nothing;
    }
    
    /**
     * Returns the value used for the walls
     * @return {number}
     */
    getWallsValue() {
        return MapsData.wall;
    }
    
    /**
     * Returns the value used as the ID for the first tower
     * @return {number}
     */
    getTowerStart() {
        return MapsData.towerStart;
    }
    
    
    /**
     * Returns true if the given value is equal to the start 1 value
     * @param {number} value
     * @return {boolean}
     */
    isStart1(value) {
        return value === MapsData.start1;
    }
    
    /**
     * Returns true if the given value is equal to the start 2 value
     * @param {number} value
     * @return {boolean}
     */
    isStart2(value) {
        return value === MapsData.start2;
    }
    
    /**
     * Returns true if the given value is equal to the target 1 or 2 value
     * @param {number} value
     * @return {boolean}
     */
    isTarget(value) {
        return value === MapsData.target1 || value === MapsData.target2;
    }
    
    /**
     * Returns true if the given value is equal to the target 1 value
     * @param {number} value
     * @return {boolean}
     */
    isTarget1(value) {
        return value === MapsData.target1;
    }
    
    /**
     * Returns true if the given value is equal to the target 2 value
     * @param {number} value
     * @return {boolean}
     */
    isTarget2(value) {
        return value === MapsData.target2;
    }
    
    
    /**
     * Returns all the map Walls
     * @return {Array.<Object>}
     */
    getWalls() {
        let className,
            walls  = [null],
            matrix = [];
        
        for (let i = 0; i < this.mapData.matrix.length; i += 1) {
            matrix[i] = [];
            for (let j = 0; j < this.mapData.matrix[i].length; j += 1) {
                switch (this.mapData.matrix[i][j]) {
                case MapsData.start1:
                case MapsData.start2:
                    className = "start";
                    break;
                case MapsData.target1:
                case MapsData.target2:
                    className = "target";
                    break;
                case MapsData.wall:
                    className = "wall";
                    break;
                default:
                    className = null;
                }
                
                if (className) {
                    this.processWall(walls, matrix, i, j, className);
                }
            }
        }
        this.compressWalls(walls);
        return walls;
    }
    
    /**
     * Process the walls to reduce the amount of diva
     * @param {Array.<Object>} walls
     * @param {Array.<Array.<number>>} matrix
     * @param {number} i
     * @param {number} j
     * @param {string} cl
     */
    processWall(walls, matrix, i, j, cl) {
        let id, type;
        if (this.expandHorizontal(walls, matrix, i, j, cl)) {
            id   = matrix[i - 1][j];
            type = "horizontal";
        } else if (this.expandVertical(walls, matrix, i, j, cl)) {
            id   = matrix[i][j - 1];
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
            matrix[i][j] = id;
        
        } else {
            walls.push({
                cl:     cl,
                type:   null,
                top:    i,
                left:   j,
                width:  1,
                height: 1
            });
            matrix[i][j] = walls.length - 1;
        }
    }
    
    /**
     * Process the walls to reduce the amount of diva
     * @param {Array.<Object>} walls
     */
    compressWalls(walls) {
        for (let i = 1; i < walls.length; i += 1) {
            let j;
            for (j = 1; j < walls.length; j += 1) {
                if (this.canIncreaseHeight(walls[i], walls[j])) {
                    walls[i].height += walls[j].height;
                    walls.splice(j, 1);
                    j -= 1;
                
                } else if (this.canIncreaseWidth(walls[i], walls[j])) {
                    walls[i].width += walls[j].width;
                    walls.splice(j, 1);
                    j -= 1;
                }
            }
        }
    }
    
    
    /**
     * Expands a Wall Horizontally
     * @param {Array.<Object>} walls
     * @param {Array.<Array.<number>>} matrix
     * @param {number} i
     * @param {number} j
     * @param {string} cl
     * @return {boolean}
     */
    expandHorizontal(walls, matrix, i, j, cl) {
        if (matrix[i - 1]) {
            let id = matrix[i - 1][j];
            return id && (!walls[id].type || walls[id].type === "horizontal") && walls[id].cl === cl;
        }
        return false;
    }
    
    /**
     * Expands a Wall Vertically
     * @param {Array.<Object>} walls
     * @param {Array.<Array.<number>>} matrix
     * @param {number} i
     * @param {number} j
     * @param {string} cl
     * @return {boolean}
     */
    expandVertical(walls, matrix, i, j, cl) {
        let id = matrix[i][j - 1];
        return id && (!walls[id].type || walls[id].type === "vertical") && walls[id].cl === cl;
    }
    
    /**
     * Checks if it can increase the height of the wall
     * @param {Array.<Object>} w1
     * @param {Array.<Object>} w2
     * @return {boolean}
     */
    canIncreaseHeight(w1, w2) {
        return w1.cl === w2.cl && w1.width === w2.width && w1.left === w2.left && w1.top + w1.height === w2.top;
    }
    
    /**
     * Checks if it can increase the width of the wall
     * @param {Array.<Object>} w1
     * @param {Array.<Object>} w2
     * @return {boolean}
     */
    canIncreaseWidth(w1, w2) {
        return w1.cl === w2.cl && w1.height === w2.height && w1.top === w2.top && w1.left + w1.width === w2.left;
    }
    
    
    /**
     * Returns the Towers that will be built when starting this map
     * @return {Array.<{type: string, col: number, row: number, level: number}>}
     */
    getInitialSetup() {
        let amount = this.storage.get("towers"),
            list   = [];
        
        if (amount) {
            for (let i = MapsData.towerStart; i <= amount; i += 1) {
                let data = this.storage.get("tower." + i);
                if (data) {
                    this.storage.remove("tower." + i);
                    list.push(data);
                }
            }
        }
        return list;
    }
    
    /**
     * Saves a the given Tower in the map storage for the initial setup
     * @param {Tower} tower
     */
    buildTower(tower) {
        this.storage.set("tower." + tower.getID(), {
            type  : tower.getType(),
            row   : tower.getRow(),
            col   : tower.getCol(),
            level : tower.getLevel()
        });
        this.storage.set("towers", tower.getID());
    }
    
    /**
     * Upgrades the level of the given Tower in the map storage for the initial setup
     * @param {Tower} tower
     */
    upgradeTower(tower) {
        let data = this.storage.get("tower." + tower.getID());
        if (data) {
            data.level = tower.getLevel();
            this.storage.set("tower." + tower.getID(), data);
        }
    }
    
    /**
     * Removes the given Tower from the map storage for the initial setup
     * @param {Tower} tower
     */
    sellTower(tower) {
        this.storage.remove("tower." + tower.getID());
    }
}
