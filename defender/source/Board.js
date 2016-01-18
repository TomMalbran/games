/**
 * The Board Class
 */
class Board {
    
    /**
     * The Board constructor
     * @param {string} gameMap
     */
    constructor(gameMap) {
        this.board      = document.querySelector(".board");
        this.walls      = document.querySelector(".walls");
        this.pos        = Utils.getPosition(this.board);
        this.width      = this.board.offsetWidth;
        this.height     = this.board.offsetHeight;
        
        this.map        = new Map(gameMap);
        this.matrix     = [];
        this.starts     = [];
        this.targets    = [];
        this.listeners  = {};
        this.defaults   = [];
        this.handler    = this.clickListener.bind(this);
        this.hasStarted = false;
        
        this.board.addEventListener("click", this.handler);
        this.create();
    }
    
    
    /**
     * Updates the inner started state when the game starts
     */
    gameStarted() {
        this.hasStarted = true;
    }
    
    /**
     * Removes the event listener
     */
    destroy() {
        this.board.removeEventListener("click", this.handler);
    }
    
    /**
     * Returns the Towers that will be built when starting this map
     * @return {Array.<{type: string, col: number, row: number, level: number}>}
     */
    getInitialSetup() {
        return this.map.getInitialSetup();
    }
    
    /**
     * Adds a new function for the board event listener
     * @param {string} name
     * @param {function(Event, DOMElement)} callback
     */
    addListener(name, callback) {
        if (name === "default") {
            this.defaults.push(callback);
        } else {
            this.listeners[name] = callback;
        }
    }
    
    /**
     * The click listern in the Board DOM element
     * @param {Event} event
     */
    clickListener(event) {
        let target = event.target.parentNode,
            type   = target.dataset.type;
        
        if (this.listeners[type]) {
            this.listeners[type](event, target);
        } else {
            this.defaults.forEach(function (callback) {
                callback(event, target);
            });
        }
    }
    
    
    /**
     * Creates the Board and Map
     */
    create() {
        for (let i = 0; i < this.map.getPathsAmount(); i += 1) {
            this.starts[i]  = [];
            this.targets[i] = [];
        }
        
        for (let i = 0; i < this.map.getRowsAmount(); i += 1) {
            this.matrix[i] = [];
            for (let j = 0; j < this.map.getColsAmount(); j += 1) {
                this.matrix[i][j] = this.map.getMatrixXY(i, j);
                this.addPaths(this.matrix[i][j], j, i);
            }
        }
        
        this.fixPaths();
        this.createWalls();
    }
    
    /**
     * Adds the paths starts and targets
     * @param {number} value
     * @param {number} row
     * @param {number} col
     */
    addPaths(value, col, row) {
        if (this.map.isStart1(value)) {
            this.starts[0].push({ pos: [ col, row ], value: value });
        
        } else if (this.map.isStart2(value)) {
            this.starts[1].push({ pos: [ col, row ], value: value });
        
        } else if (this.map.isTarget1(value)) {
            this.targets[0].push({ pos: [ col, row ], value: value });
        
        } else if (this.map.isTarget2(value)) {
            this.targets[1].push({ pos: [ col, row ], value: value });
        }
    }
    
    /**
     * Fixes the paths starts and targets to have equal amount of starts and targets
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
     */
    createWalls() {
        let walls = this.map.getWalls();
        this.walls.innerHTML = "";
        
        for (let i = 1; i < walls.length; i += 1) {
            let el = document.createElement("div");
            el.className    = walls[i].cl;
            el.style.top    = walls[i].top    * this.map.getSquareSize() + "px";
            el.style.left   = walls[i].left   * this.map.getSquareSize() + "px";
            el.style.width  = walls[i].width  * this.map.getSquareSize() + "px";
            el.style.height = walls[i].height * this.map.getSquareSize() + "px";
            this.walls.appendChild(el);
        }
    }
    
    
    /**
     * Adds the given Tower to the board matrix and map setup, if required
     * @param {Tower} tower
     */
    buildTower(tower) {
        let row  = tower.getRow(),
            col  = tower.getCol(),
            rows = row + tower.getSize(),
            cols = col + tower.getSize();
        
        for (let i = row; i < rows; i += 1) {
            for (let j = col; j < cols; j += 1) {
                this.matrix[i][j] = tower.getID();
            }
        }
        
        if (!this.hasStarted) {
            this.map.buildTower(tower);
        }
    }
    
    /**
     * Upgrades the level of the given Tower in the map setup, if required
     * @param {Tower} tower
     */
    upgradeTower(tower) {
        if (!this.hasStarted) {
            this.map.upgradeTower(tower);
        }
    }
    
    /**
     * Removes the given Tower from the board matrix and from the map setup, if required
     * @param {Tower} tower
     */
    sellTower(tower) {
        let row  = tower.getRow(),
            col  = tower.getCol(),
            rows = row + tower.getSize(),
            cols = col + tower.getSize();
        
        for (let i = row; i < rows; i += 1) {
            for (let j = col; j < cols; j += 1) {
                this.matrix[i][j] = this.map.getNothingValue();
            }
        }
        
        if (!this.hasStarted) {
            this.map.sellTower(tower);
        }
    }
    
    /**
     * Returns true if a Tower with the given size can be build in the given position
     * @param {number} row
     * @param {number} col
     * @param {number} size
     * @return {boolean}
     */
    canBuild(row, col, size) {
        for (let i = row; i < row + size; i += 1) {
            for (let j = col; j < col + size; j += 1) {
                if (this.matrix[i] && this.matrix[i][j] !== this.map.getNothingValue()) {
                    return false;
                }
            }
        }
        return true;
    }
    
    
    /**
     * Substracts 1 from the given position in the board matrix. We can then know how many mobs are in a given cell
     * @param {number} row
     * @param {number} col
     */
    addMob(row, col) {
        if (this.matrix[row] && this.matrix[row][col] <= this.map.getNothingValue()) {
            this.matrix[row][col] -= 1;
        }
    }
    
    /**
     * Adds 1 to the given position in the board matrix
     * @param {number} row
     * @param {number} col
     */
    removeMob(row, col) {
        if (this.matrix[row] && this.matrix[row][col] < this.map.getNothingValue()) {
            this.matrix[row][col] += 1;
        }
    }
    
    
    /**
     * Returns true if the given position corresponds to a border in the matrix
     * @param {number} row
     * @param {number} col
     * @return {boolean}
     */
    isBorder(row, col) {
        return row < 1 || col < 1 || row > this.map.getRowsAmount() - 2 || col > this.map.getColsAmount() - 2;
    }
    
    /**
     * Returns true if the given position is not a border
     * @param {number} row
     * @param {number} col
     * @return {boolean}
     */
    inMatrix(row, col, dim) {
        return !this.isBorder(row, col) && !this.isBorder(row + (dim || 0), col + (dim || 0));
    }
    
    /**
     * Returns true if the given position is inside the board, including borders
     * @param {number} row
     * @param {number} col
     * @return {boolean}
     */
    inBoard(row, col) {
        return row >= 0 && col >= 0 && row < this.map.getRowsAmount() && col < this.map.getColsAmount();
    }
    
    /**
     * Returns true if the given position corresponds to a target
     * @param {number} row
     * @param {number} col
     * @return {boolean}
     */
    isTarget(row, col) {
        return this.map.isTarget(this.matrix[row][col]);
    }
    
    /**
     * Returns true if the content at the given position is equal to the given value
     * @param {number} row
     * @param {number} col
     * @param {number} value
     * @return {boolean}
     */
    isEqualTo(row, col, value) {
        return this.matrix[row][col] === value;
    }
    
    /**
     * Returns the content of a cell in the board at the given position
     * @param {number} row
     * @param {number} col
     * @return {number}
     */
    getContent(row, col) {
        return this.matrix[row][col];
    }
    
    
    /**
     * Returns the position of the board in the DOM
     * @return {{top: number, left: number}}
     */
    getPos() {
        return this.pos;
    }
    
    /**
     * Returns the board matrix
     * @return {Array.<Array.<number>>}
     */
    getMatrix() {
        return this.matrix;
    }
    
    /**
     * Returns the positions of the starting cells
     * @return {Array.<Array.<Array.<number>>>}
     */
    getStarts() {
        return this.starts;
    }
    
    /**
     * Returns the positions of the target cells
     * @return {Array.<Array.<Array.<number>>>}
     */
    getTargets() {
        return this.targets;
    }
    
    
    /**
     * Returns the size of a square in the map
     * @return {boolean}
     */
    getSize() {
        return this.map.getSquareSize();
    }
        
    /**
     * Returns the ID for the first Tower
     * @return {number}
     */
    getTowerStart() {
        return this.map.getTowerStart();
    }
    
    /**
     * Returns the value for Nothing in the board
     * @return {number}
     */
    getNothingValue() {
        return this.map.getNothingValue();
    }
    
    /**
     * Returns the ID for the Walls in the board
     * @return {number}
     */
    getWallsValue() {
        return this.map.getWallsValue();
    }
}
