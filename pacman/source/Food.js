import Board        from "./board/Board.js";



/**
 * Pacman Food
 */
export default class Food {

    /**
     * Pacman Food constructor
     * @param {Board} board
     */
    constructor(board) {
        this.board = board;
        this.level = board.level;
        this.ctx   = board.boardCanvas.ctx;

        this.init();
        this.createMatrix();
        this.createEnergizers();
    }

    /**
     * Initializes the instance
     * @returns {Void}
     */
    init() {
        this.total      = this.board.pillAmount;
        this.minRadius  = this.board.pillSize;
        this.maxRadius  = this.board.energizerSize;
        this.radius     = this.maxRadius;
        this.energizers = [];
        this.matrix     = [];
        this.mult       = -1;
    }

    /**
     * Creates a Matrix with the positions of the pills and energizers
     * @returns {Void}
     */
    createMatrix() {
        for (let i = 0; i < this.board.rows; i += 1) {
            this.matrix[i] = [];
            for (let j = 0; j < this.board.cols; j += 1) {
                this.matrix[i][j] = this.board.hasPill(j, i) ? this.level.pillValue : 0;
            }
        }

        this.board.energizers.forEach((pos) => {
            this.matrix[pos.y][pos.x] = this.level.energizerValue;
        });
    }

    /**
     * Creates a list with only the active energizers
     * @returns {Void}
     */
    createEnergizers() {
        this.energizers = [];

        this.board.energizers.forEach((pos) => {
            if (this.matrix[pos.y][pos.x] === this.level.energizerValue) {
                this.energizers.push(this.board.getTileXYCenter(pos));
            }
        });
    }



    /**
     * Does the Enerigizers animation
     * @returns {Void}
     */
    wink() {
        this.calcRadius();
        this.drawEnergizers();
    }

    /**
     * Calculates the Radius for the Energizers
     * @returns {Void}
     */
    calcRadius() {
        this.radius += this.mult * 0.1;

        if (this.radius <= this.minRadius) {
            this.mult = 1;
        } else if (this.radius >= this.maxRadius) {
            this.mult = -1;
        }
    }



    /**
     * Draws all the Pills and Energizers in the board
     * @returns {Void}
     */
    draw() {
        this.drawPills();
        this.drawEnergizers();
    }

    /**
     * Draws all the Pills in the board
     * @returns {Void}
     */
    drawPills() {
        this.ctx.save();
        this.ctx.fillStyle = "white";

        this.matrix.forEach((row, y) => {
            row.forEach((value, x) => {
                const rect = this.board.getPillRect(x, y);
                if (value === this.level.pillValue) {
                    this.ctx.fillRect(rect.x, rect.y, rect.size, rect.size);
                }
            });
        });
        this.ctx.restore();
    }

    /**
     * Clears a Pill at the given position
     * @param {Number} x
     * @param {Number} y
     * @returns {Void}
     */
    clearPill(x, y) {
        const rect = this.board.getPillRect(x, y);
        this.ctx.clearRect(rect.x, rect.y, rect.size, rect.size);
    }

    /**
     * Draws all the remaining Energizers with the given radius
     * @returns {Void}
     */
    drawEnergizers() {
        this.energizers.forEach((pos) => {
            this.clearEnergizer(pos.x, pos.y);
            this.drawEnergizer(pos.x, pos.y, this.radius);
        });
    }

    /**
     * Draws an Energizer at the given position with the given radius
     * @param {Number} x
     * @param {Number} y
     * @param {Number} radius
     * @returns {Void}
     */
    drawEnergizer(x, y, radius) {
        this.ctx.save();
        this.ctx.fillStyle = "white";
        this.ctx.beginPath();
        this.ctx.arc(x, y, radius, 0, 2 * Math.PI);
        this.ctx.fill();
        this.ctx.restore();
    }

    /**
     * Clears an Energizer at the given position
     * @param {Number} x
     * @param {Number} y
     * @returns {Void}
     */
    clearEnergizer(x, y) {
        const radius = this.maxRadius;
        this.ctx.clearRect(x - radius, y - radius, radius * 2, radius * 2);
    }



    /**
     * Returns true if there is a Pill at the given cell
     * @param {{x: Number, y: Number}} tile
     * @returns {Boolean}
     */
    isAtPill(tile) {
        return this.matrix[tile.y][tile.x] > 0;
    }

    /**
     * The Blob eats the Pill at the given cell. Returns the value of the pill. 1 for dot, 5 for energizer
     * @param {{x: Number, y: Number}} tile
     * @returns {Number}
     */
    eatPill(tile) {
        const value = this.matrix[tile.y][tile.x];
        const pos   = this.board.getTileXYCenter(tile);

        this.clearPill(tile.x, tile.y);
        this.matrix[tile.y][tile.x] = 0;
        this.total -= 1;

        if (value === this.level.energizerValue) {
            this.clearEnergizer(pos.x, pos.y);
            this.createEnergizers();
        }
        return value;
    }

    /**
     * Returns the amount of Pîlls left
     * @returns {Number}
     */
    getLeftPills() {
        return this.total;
    }
}
