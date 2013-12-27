/*jslint sloppy: true, browser: true */
/*global pmBlob, pmGhosts, pmScore*/


/* --------------
    Gama Data  */

var pmData = {

	// Size Values and Functions
	cornering:     6,
	
	
	// Food Data
	fruitPos:   [ 159, 202 ],
	fruitText:  [ 167, 210 ],
	fruitDots:  [ 174,  74 ],
	fruitSize:  20,
	
	fruitTimer: function () {
		return Math.round(Math.random() * 1000) + 9000;
	}
};