/**
 * The New Level Animation
 * @extends {Animation}
 */
class NewLevelAnimation extends Animation {

    /**
     * The New Level Animation constructor
     * @param {Canvas}   canvas
     * @param {Number}   level
     * @param {Function} callback
     */
    constructor(canvas, level, callback) {
        super();

        this.canvas     = canvas;
        this.level      = level;
        this.callback   = callback;

        this.blinks     = 0;
        this.blocksGame = true;
        this.blinkTimer = 150;
        this.endTime    = 2000;
        this.clearAll   = true;
    }



    /**
     * Does the New Level animation
     * @returns {Void}
     */
    animate() {
        const calc  = Math.round(this.time * 0.03);
        const pos   = calc < 17.15 ? calc - 2 : 15;
        const lvl   = (this.level < 10 ? "0" : "") + this.level;
        const right = Board.cols;

        this.canvas.clear();
        this.canvas.fill(0.8);

        this.canvas.drawText({
            color : "rgb(255,255,255)",
            align : "right",
            text  : "Level",
            pos   : { x: pos, y: Board.centerTextTop },
        });
        this.canvas.drawText({
            color : "rgb(255,255,51)",
            align : "left",
            text  : lvl,
            pos   : { x: right - pos + 2, y: Board.centerTextTop },
        });
    }
}
