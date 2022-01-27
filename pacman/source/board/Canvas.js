import Board        from "./Board.js";

// Utils
import Utils        from "../../../utils/Utils.js";



/**
 * Pacman Canvas
 */
export default class Canvas {

    /**
     * Pacman Canvas Constructor
     * @param {Board}  board
     * @param {String} name
     */
    constructor(board, name) {
        this.board = board;

        /** @type {HTMLCanvasElement} */
        const canvas  = document.querySelector(`.${name}`);
        canvas.width  = this.board.width;
        canvas.height = this.board.height;

        /** @type {CanvasRenderingContext2D} */
        this.ctx              = canvas.getContext("2d");
        this.ctx.font         = `2em "Whimsy TT"`;
        this.ctx.fillStyle    = "white";
        this.ctx.textAlign    = "center";
        this.ctx.textBaseline = "middle";

        this.rects            = [];

        return this;
    }

    /**
     * Fills the canvas with black at the given alpha value
     * @param {Number}  alpha
     * @param {Number=} x
     * @param {Number=} y
     * @param {Number=} width
     * @param {Number=} height
     * @returns {Void}
     */
    fill(alpha, x, y, width, height) {
        this.ctx.save();
        this.ctx.fillStyle = Utils.rgba(0, 0, 0, alpha);
        this.ctx.fillRect(x || 0, y || 0, width || this.board.width, height || this.board.height);
        this.ctx.restore();
    }

    /**
     * Clear the entire board
     * @returns {Void}
     */
    clear() {
        this.ctx.clearRect(0, 0, this.board.width, this.board.height);
        this.rects = [];
    }

    /**
     * Clears only the saved rects
     * @returns {Void}
     */
    clearSavedRects() {
        this.rects.forEach((rect) => {
            this.ctx.clearRect(rect.x, rect.y, rect.width, rect.height);
            if (rect.alpha) {
                this.fill(rect.alpha, rect.x, rect.y, rect.width, rect.height);
            }
        });
        this.rects = [];
    }

    /**
     * Saves a new position to clear in the future
     * @param {Number} x
     * @param {Number} y
     * @returns {Void}
     */
    savePos(x, y) {
        this.rects.push({
            x      : x - this.board.eraseSize / 2,
            y      : y - this.board.eraseSize / 2,
            width  : this.board.eraseSize,
            height : this.board.eraseSize,
        });
    }

    /**
     * Saves a new rectangle to clear in the future
     * @param {{x: Number, y: Number, width: Number, height: Number, alpha: ?Number}} data
     * @returns {Void}
     */
    saveRect(data) {
        this.rects.push(data);
    }

    /**
     * Draws the Text in the canvas
     * @param {{text: String, pos: {x: Number, y: Number}, color: ?String, size: ?Number, align: ?String, alpha: ?Number}} data
     * @returns {Void}
     */
    drawText(data) {
        const posX = data.pos.x * this.board.tileSize;
        const posY = data.pos.y * this.board.tileSize;
        let   mult = 0.5;

        this.ctx.save();
        if (data.size) {
            this.ctx.font = `${data.size}em "Whimsy TT"`;
        }
        if (data.align) {
            // @ts-ignore
            this.ctx.textAlign = data.align;
            mult = data.align === "left" ? 1 : 0;
        }
        this.ctx.fillStyle = data.color;
        this.ctx.fillText(data.text, posX, posY);
        this.ctx.restore();

        const metrics = this.ctx.measureText(data.text);
        const width   = metrics.width + this.board.tileSize;
        const height  = data.size ? (data.size + 0.5) * this.board.tileSize : 2.5 * this.board.tileSize;

        this.saveRect({
            x      : posX - mult * width,
            y      : posY - height / 2,
            width  : width,
            height : height,
            alpha  : data.alpha || 0,
        });
    }
}
