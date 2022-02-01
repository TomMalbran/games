import Data         from "./Data.js";
import Map          from "./maps/Map.js";
import Tower        from "./tower/Tower.js";

// Utils
import Utils        from "../../utils/Utils.js";



/**
 * Defender Board
 */
export default class Board {

    /**
     * Defender Board constructor
     * @param {String} gameMap
     */
    constructor(gameMap) {
        this.map        = new Map(gameMap);
        this.hasStarted = false;

        /** @type {Number[][]} */
        this.matrix     = [];

        /** @type {{col: Number, row: Number, value: Number}[][]} */
        this.starts     = [];

        /** @type {{col: Number, row: Number, value: Number}[][]} */
        this.targets    = [];

        this.listeners  = {};
        this.defaults   = [];

        /** @type {HTMLElement} */
        this.board      = document.querySelector(".board");

        /** @type {HTMLElement} */
        this.walls      = document.querySelector(".walls");

        this.bounds     = this.board.getBoundingClientRect();
        this.width      = this.bounds.width;
        this.height     = this.bounds.height;

        this.board.addEventListener("click", (e) => this.onClick(e));
        this.create();
    }



    /**
     * Updates the inner started state when the game starts
     * @returns {Void}
     */
    gameStarted() {
        this.hasStarted = true;
    }

    /**
     * Removes the event listener
     * @returns {Void}
     */
    destroy() {
        this.board.removeEventListener("click", (e) => this.onClick(e));
    }

    /**
     * Returns the Towers that will be built when starting this map
     * @returns {{type: String, col: Number, row: Number, level: Number}[]}
     */
    getInitialSetup() {
        return this.map.getInitialSetup();
    }

    /**
     * Adds a new function for the board event listener
     * @param {String}   name
     * @param {Function} callback
     * @returns {Void}
     */
    addListener(name, callback) {
        if (name === "default") {
            this.defaults.push(callback);
        } else {
            if (!this.listeners[name]) {
                this.listeners[name] = [];
            }
            this.listeners[name].push(callback);
        }
    }

    /**
     * The click listern in the Board DOM element
     * @param {Event} event
     * @returns {Void}
     */
    onClick(event) {
        // @ts-ignore
        const target = event.target.parentNode;
        const type   = target.dataset.type;

        if (this.listeners[type]) {
            this.listeners[type].forEach((callback) => {
                callback(event, target);
            });
        } else {
            this.defaults.forEach((callback) => {
                callback(event, target);
            });
        }
    }



    /**
     * Creates the Board and Map
     * @returns {Void}
     */
    create() {
        for (let i = 0; i < this.map.getPathsAmount(); i += 1) {
            this.starts[i]  = [];
            this.targets[i] = [];
        }

        for (let row = 0; row < Data.rowsAmount; row += 1) {
            this.matrix[row] = [];
            for (let col = 0; col < Data.colsAmount; col += 1) {
                this.matrix[row][col] = this.map.getMatrixXY(row, col);
                this.addPaths(this.matrix[row][col], col, row);
            }
        }

        this.fixPaths();
        this.createWalls();
    }

    /**
     * Adds the paths starts and targets
     * @param {Number} value
     * @param {Number} col
     * @param {Number} row
     * @returns {Void}
     */
    addPaths(value, col, row) {
        if (this.map.isStart1(value)) {
            this.starts[0].push({ col, row, value });

        } else if (this.map.isStart2(value)) {
            this.starts[1].push({ col, row, value });

        } else if (this.map.isTarget1(value)) {
            this.targets[0].push({ col, row, value });

        } else if (this.map.isTarget2(value)) {
            this.targets[1].push({ col, row, value });
        }
    }

    /**
     * Fixes the paths starts and targets to have equal amount of starts and targets
     * @returns {Void}
     */
    fixPaths() {
        for (let i = 0; i < this.starts.length; i += 1) {
            let j = 0;
            while (this.starts[i].length > this.targets[i].length) {
                if (j % 2 === 0) {
                    this.targets[i].unshift(this.targets[i][j]);
                } else {
                    this.targets[i].push(this.targets[i][this.targets[i].length - j]);
                }
                j += 1;
            }
        }
    }

    /**
     * Create the element for a Wall, Entrance or Exit
     * @returns {Void}
     */
    createWalls() {
        const walls = this.map.getWalls();
        this.walls.innerHTML = "";

        for (let i = 1; i < walls.length; i += 1) {
            const el = walls[i].createElement();
            this.walls.appendChild(el);
        }
    }



    /**
     * Adds the given Tower to the board matrix and map setup, if required
     * @param {Tower} tower
     * @returns {Void}
     */
    buildTower(tower) {
        for (let row = tower.row; row < tower.endRow; row += 1) {
            for (let col = tower.col; col < tower.endCol; col += 1) {
                this.matrix[row][col] = tower.id;
            }
        }

        if (!this.hasStarted) {
            this.map.buildTower(tower);
        }
    }

    /**
     * Upgrades the level of the given Tower in the map setup, if required
     * @param {Tower} tower
     * @returns {Void}
     */
    upgradeTower(tower) {
        if (!this.hasStarted) {
            this.map.upgradeTower(tower);
        }
    }

    /**
     * Removes the given Tower from the board matrix and from the map setup, if required
     * @param {Tower} tower
     * @returns {Void}
     */
    sellTower(tower) {
        for (let i = tower.row; i < tower.endRow; i += 1) {
            for (let j = tower.col; j < tower.endCol; j += 1) {
                this.matrix[i][j] = Data.nothing;
            }
        }

        if (!this.hasStarted) {
            this.map.sellTower(tower);
        }
    }

    /**
     * Returns true if a Tower with the given size can be build in the given position
     * @param {Number} row
     * @param {Number} col
     * @param {Number} size
     * @returns {Boolean}
     */
    canBuild(row, col, size) {
        for (let i = row; i < row + size; i += 1) {
            for (let j = col; j < col + size; j += 1) {
                if (this.matrix[i] && this.matrix[i][j] !== Data.nothing) {
                    return false;
                }
            }
        }
        return true;
    }



    /**
     * Substracts 1 from the given position in the board matrix. We can then know how many mobs are in a given cell
     * @param {Number} row
     * @param {Number} col
     * @returns {Void}
     */
    addMob(row, col) {
        if (this.matrix[row] && this.matrix[row][col] <= Data.nothing) {
            this.matrix[row][col] -= 1;
        }
    }

    /**
     * Adds 1 to the given position in the board matrix
     * @param {Number} row
     * @param {Number} col
     * @returns {Void}
     */
    removeMob(row, col) {
        if (this.matrix[row] && this.matrix[row][col] < Data.nothing) {
            this.matrix[row][col] += 1;
        }
    }



    /**
     * Returns true if the given position corresponds to a border in the matrix
     * @param {Number} row
     * @param {Number} col
     * @returns {Boolean}
     */
    isBorder(row, col) {
        return row < 1 || col < 1 || row > Data.rowsAmount - 2 || col > Data.colsAmount - 2;
    }

    /**
     * Returns true if the given position is not a border
     * @param {Number} row
     * @param {Number} col
     * @returns {Boolean}
     */
    inMatrix(row, col, dim) {
        return !this.isBorder(row, col) && !this.isBorder(row + (dim || 0), col + (dim || 0));
    }

    /**
     * Returns true if the given position is inside the board, including borders
     * @param {Number} row
     * @param {Number} col
     * @returns {Boolean}
     */
    inBoard(row, col) {
        return row >= 0 && col >= 0 && row < Data.rowsAmount && col < Data.colsAmount;
    }

    /**
     * Returns true if the given position corresponds to a target
     * @param {Number} row
     * @param {Number} col
     * @returns {Boolean}
     */
    isTarget(row, col) {
        return this.map.isTarget(this.matrix[row][col]);
    }

    /**
     * Returns true if the content at the given position is equal to the given value
     * @param {Number} row
     * @param {Number} col
     * @param {Number} value
     * @returns {Boolean}
     */
    isEqualTo(row, col, value) {
        return this.matrix[row][col] === value;
    }

    /**
     * Returns the content of a cell in the board at the given position
     * @param {Number} row
     * @param {Number} col
     * @returns {Number}
     */
    getContent(row, col) {
        return this.matrix[row][col];
    }
}
