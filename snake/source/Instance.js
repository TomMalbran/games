/**
 * A local storage saved version of the Instance
 */
class Instance {
    
    /**
     * The Instance constructor
     * @param {Board} board
     */
    constructor(board) {
        this.board = board;
        this.data  = new Storage("snake.game");
        this.main  = document.querySelector(".main");
        
        if (this.hasGame()) {
            this.main.classList.remove("help");
            this.main.classList.add("continue");
        }
    }
    
    
    /**
     * Saves the initial values for a new game
     * @param {number} level
     */
    newGame(level) {
        this.destroyGame();
        
        this.data.set("playing",     1);
        this.data.set("level",       level);
        this.data.set("dirTop",      1);
        this.data.set("dirLeft",     0);
        this.data.set("matrix.head", 0);
        this.data.set("matrix.tail", 0);
    }
    
    /**
     * Remove the data for this game
     */
    destroyGame() {
        for (let i = 0; i < this.board.matrixRows; i += 1) {
            for (let j = 0; j < this.board.matrixColumns; j += 1) {
                let name = "matrix." + i + "." + j;
                if (this.data.get(name)) {
                    this.data.remove(name);
                }
            }
        }
        
        this.data.set("playing", 0);
        this.data.remove("matrix.head");
        this.data.remove("matrix.tail");
        this.data.remove("dirTop");
        this.data.remove("dirLeft");
        this.data.remove("score");
        this.data.remove("level");
        
        this.main.classList.add("help");
        this.main.classList.remove("continue");
    }
    
    
    /**
     * Returns the saved data of a game
     */
    getData() {
        let head    = this.data.get("matrix.head"),
            matrix  = [],
            links   = [],
            foodPos = {};
        
        for (let i = 0; i < this.board.matrixRows; i += 1) {
            matrix[i] = [];
            for (let j = 0; j < this.board.matrixColumns; j += 1) {
                let value = this.data.get("matrix." + i + "." + j);
                if (value) {
                    matrix[i][j] = value;
                    
                    if (value >= 0) {
                        let pointer;
                        if (value - head >= 0) {
                            pointer = value - head;
                        } else {
                            pointer = this.board.totalCells + value - head;
                        }
                        links[pointer] = { top : i, left : j };
                    } else {
                        foodPos = { top : i, left : j };
                    }
                } else {
                    matrix[i][j] = this.board.getDefault(i, j);
                }
            }
        }
        
        return {
            level    : this.data.get("level"),
            score    : this.data.get("score"),
            matrix   : matrix,
            head     : head,
            tail     : this.data.get("matrix.tail") + 1,
            links    : links,
            dirTop   : this.data.get("dirTop"),
            dirLeft  : this.data.get("dirLeft"),
            foodTop  : foodPos.top,
            foodLeft : foodPos.left
        };
    }
    
    
    /**
     * Adds the given value in the given position in the matrix
     * @param {number} top
     * @param {number} left
     * @param {number} value
     */
    addToMatrix(top, left, value) {
        this.data.set("matrix." + top + "." + left, value);
        if (value > 0) {
            this.data.set("matrix.tail", value);
        }
    }
    
    /**
     * Removes the given value in the given position in the matrix
     * @param {number} top
     * @param {number} left
     * @param {number} value
     */
    removeFromMatrix(top, left, value) {
        this.data.remove("matrix." + top + "." + left);
        if (value) {
            this.data.set("matrix.head", value);
        }
    }
    
    /**
     * Saves the score
     * @param {number} score
     */
    saveScore(score) {
        this.data.set("score", score);
    }
    
    /**
     * Saves the Snake directions
     * @param {{top: number, left: number}} dir
     */
    saveDirection(dir) {
        this.data.set("dirTop",  dir.top);
        this.data.set("dirLeft", dir.left);
    }
    
    /**
     * Returns true if there is a saved Game
     */
    hasGame() {
        return this.data.get("playing");
    }
}
