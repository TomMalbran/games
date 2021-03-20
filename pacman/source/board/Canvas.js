/**
 * The Canvas Base Class
 */
class Canvas {

    /**
     * Initializes the Canvas Object
     * @param {String} name
     * @returns {Canvas}
     */
    init(name) {
        const canvas  = document.querySelector(`.${name}`);
        canvas.width  = Board.width;
        canvas.height = Board.height;

        this.ctx              = canvas.getContext("2d");
        this.ctx.font         = `2em "Whimsy TT"`;
        this.ctx.fillStyle    = "white";
        this.ctx.textAlign    = "center";
        this.ctx.textBaseline = "middle";

        this.rects            = [];

        return this;
    }

    /**
     * Returns the conetext for the board element
     * @returns {RenderingContext}
     */
    get context() {
        return this.ctx;
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
        this.ctx.fillRect(x || 0, y || 0, width || Board.width, height || Board.height);
        this.ctx.restore();
    }

    /**
     * Clear the entire board
     * @returns {Void}
     */
    clear() {
        this.ctx.clearRect(0, 0, Board.width, Board.height);
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
            x      : x - Board.eraseSize / 2,
            y      : y - Board.eraseSize / 2,
            width  : Board.eraseSize,
            height : Board.eraseSize,
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
     * @param {{text: String, pos: {x: Number, y: Number}, color: String, size: ?numer, align: ?String}} data
     * @returns {Void}
     */
    drawText(data) {
        let mult = 0.5;

        this.ctx.save();
        if (data.size) {
            this.ctx.font = `${data.size}em "Whimsy TT"`;
        }
        if (data.align) {
            this.ctx.textAlign = data.align;
            mult = data.align === "left" ? 1 : 0;
        }
        this.ctx.fillStyle = data.color;
        this.ctx.fillText(data.text, data.pos.x * Board.tileSize, data.pos.y * Board.tileSize);
        this.ctx.restore();

        const metrics = this.ctx.measureText(data.text);
        const width   = metrics.width + Board.tileSize;
        const height  = data.size ? (data.size + 0.5) * Board.tileSize : 2.5 * Board.tileSize;

        this.saveRect({
            x      : data.pos.x * Board.tileSize - mult * width,
            y      : data.pos.y * Board.tileSize - height / 2,
            width  : width,
            height : height,
            alpha  : data.alpha || 0,
        });
    }
}
