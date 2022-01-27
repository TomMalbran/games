import Board        from "../board/Board.js";
import Food         from "../Food.js";
import DemoData     from "./DemoData.js";



/**
 * Pacman Demo Food
 * @extends {Food}
 */
export default class DemoFood extends Food {

    /**
     * Pacman Demo Food constructor
     * @param {Board} board
     */
    constructor(board) {
        super(board);
        this.ctx = board.screenCanvas.ctx;
    }



    /**
     * The wink animation used for the chase anmiation
     * @returns {Void}
     */
    wink() {
        const x = this.board.getTileCenter(DemoData.chase.enerX);
        const y = this.board.getTileCenter(DemoData.chase.enerY);

        this.calcRadius();
        this.clearEnergizer(x, y);
        this.drawEnergizer(x, y, this.radius);
    }
}
