/*jslint es5: true, plusplus: true, sloppy: true, white: false, browser: true */
/*global pmData, pmFood, pmDraw, pmGhosts*/

/* Contents:
  I.	Board Canvas
  II.	Game Canvas
  III.	Screen Canvas
  IV.	Fruit Drawings
*/


/* ----------------
    Game Canvas  */

var pmDraw = {
	
	ctx:  "",
	pos:  [],		// Blob/Ghosts old position	
	

	// Other Drawings
	targets: function () {
		var i, ghost, x, y;
        
        this.ctx.save();
		for (i = 0; i < pmData.ghosts.length; i++) {
			ghost = pmData.ghosts[i];
			this.ctx.fillStyle   = pmData[ghost].color;
			this.ctx.strokeStyle = pmData[ghost].color;
			
			x = pmData.getTileCenter(pmGhosts[ghost].target[0]);
			y = pmData.getTileCenter(pmGhosts[ghost].target[1]);
			this.ctx.beginPath();
			this.ctx.moveTo(pmGhosts[ghost].x, pmGhosts[ghost].y);
			this.ctx.lineTo(x, y);
			this.ctx.fillRect(x - 4, y - 4, 8, 8);
			this.ctx.stroke();
		}
		this.ctx.restore();
	}
};