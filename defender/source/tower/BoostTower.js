/**
 * @extends {Tower}
 * The Boost Tower Class
 */
class BoostTower extends Tower {

    /**
     * The Boost Tower constructor
     * @param {number} id
     * @param {number} row
     * @param {number} col
     * @param {number} boardSize
     */
    constructor(id, row, col, boardSize) {
        super();

        this.type    = "Boost";
        this.name    = "Boost Tower";
        this.text    = "Increases the damage of the close towers";
        this.levels  = 5;
        this.size    = 2;
        this.boosts  = true;

        this.costs   = [ 100, 200, 300, 400, 500 ];
        this.damages = [  10,  20,  30,  40,  50 ];
        this.ranges  = [  30,  30,  30,  30,  30 ];
        this.speeds  = [   0,   0,   0,   0,   0 ];

        this.init(id, row, col, boardSize);
    }
}
