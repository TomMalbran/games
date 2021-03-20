/**
 * The Ready Animation
 * @extends {Animation}
 */
class ReadyAnimation extends Animation {

    /**
     * The Ready Animation constructor
     * @param {Canvas}   canvas
     * @param {Function} callback
     */
    constructor(canvas, callback) {
        super();

        this.canvas     = canvas;
        this.callback   = callback;
        this.blocksGame = true;
        this.endTime    = 3000;

        this.canvas.drawText({
            color : "rgb(255, 255, 51)",
            text  : "Ready!",
            pos   : { x: 14, y: Board.centerTextTop },
        });
    }
}
