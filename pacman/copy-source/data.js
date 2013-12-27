/*jslint es5: true, plusplus: true, sloppy: true, white: true, browser: true */
/*global pmBlob, pmGhosts, pmScore*/


/* --------------
    Gama Data  */

var pmData = {

	// Size Values and Functions
	canvasWidth:   336,
	canvasHeight:  372,
	scoreHeight:   25,
	tileSize:      12,
	cornering:     6,
	blobRadius:    8,
	bigBlobRadius: 30,
	eraseSize:     20,
	
	getMiddle: function (amount) {
		return Math.round(amount * this.tileSize + this.tileSize / 2);
	},
	getCorner: function (amount) {
		return Math.round(amount * this.tileSize);
	},
	getTile: function (x, y) {
		return [ Math.floor(x / this.tileSize), Math.floor(y / this.tileSize) ];
	},
	
	
	// Food Data
	energizers: [ [ 1, 3 ], [ 26, 3 ], [ 1, 23 ], [ 26, 23 ] ],
	fruitPos:   [ 159, 202 ],
	fruitText:  [ 167, 210 ],
	fruitDots:  [ 174,  74 ],
	fruitSize:  20,
	
	fruitTimer: function () {
		return Math.round(Math.random() * 1000) + 9000;
	},
	
	
	// Board 28x31
	// 0 Wall | 1 Path | 2 Pill Path | 3 Intersection | 4 Pill Interection | 5 Tunnel
	dimensions: [ 28, 31 ],
	board: [
		[ 0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0 ],
		[ 0,4,2,2,2,2,4,2,2,2,2,2,4,0,0,4,2,2,2,2,2,4,2,2,2,2,4,0 ],
		[ 0,2,0,0,0,0,2,0,0,0,0,0,2,0,0,2,0,0,0,0,0,2,0,0,0,0,2,0 ],
		[ 0,1,0,0,0,0,2,0,0,0,0,0,2,0,0,2,0,0,0,0,0,2,0,0,0,0,1,0 ],
		[ 0,2,0,0,0,0,2,0,0,0,0,0,2,0,0,2,0,0,0,0,0,2,0,0,0,0,2,0 ],
		[ 0,4,2,2,2,2,4,2,2,4,2,2,4,2,2,4,2,2,4,2,2,4,2,2,2,2,4,0 ],
		[ 0,2,0,0,0,0,2,0,0,2,0,0,0,0,0,0,0,0,2,0,0,2,0,0,0,0,2,0 ],
		[ 0,2,0,0,0,0,2,0,0,2,0,0,0,0,0,0,0,0,2,0,0,2,0,0,0,0,2,0 ],
		[ 0,4,2,2,2,2,4,0,0,4,2,2,4,0,0,4,2,2,4,0,0,4,2,2,2,2,4,0 ],
		[ 0,0,0,0,0,0,2,0,0,0,0,0,1,0,0,1,0,0,0,0,0,2,0,0,0,0,0,0 ],
		[ 0,0,0,0,0,0,2,0,0,0,0,0,1,0,0,1,0,0,0,0,0,2,0,0,0,0,0,0 ],
		[ 0,0,0,0,0,0,2,0,0,3,1,1,3,1,1,3,1,1,3,0,0,2,0,0,0,0,0,0 ],
		[ 0,0,0,0,0,0,2,0,0,1,0,0,0,0,0,0,0,0,1,0,0,2,0,0,0,0,0,0 ],
		[ 0,0,0,0,0,0,2,0,0,1,0,0,0,0,0,0,0,0,1,0,0,2,0,0,0,0,0,0 ],
		[ 5,5,5,5,5,5,4,1,1,3,0,0,0,0,0,0,0,0,3,1,1,4,5,5,5,5,5,5 ],
		[ 0,0,0,0,0,0,2,0,0,1,0,0,0,0,0,0,0,0,1,0,0,2,0,0,0,0,0,0 ],
		[ 0,0,0,0,0,0,2,0,0,1,0,0,0,0,0,0,0,0,1,0,0,2,0,0,0,0,0,0 ],
		[ 0,0,0,0,0,0,2,0,0,3,1,1,1,1,1,1,1,1,3,0,0,2,0,0,0,0,0,0 ],
		[ 0,0,0,0,0,0,2,0,0,1,0,0,0,0,0,0,0,0,1,0,0,2,0,0,0,0,0,0 ],
		[ 0,0,0,0,0,0,2,0,0,1,0,0,0,0,0,0,0,0,1,0,0,2,0,0,0,0,0,0 ],
		[ 0,4,2,2,2,2,4,2,2,4,2,2,4,0,0,4,2,2,4,2,2,4,2,2,2,2,4,0 ],
		[ 0,2,0,0,0,0,2,0,0,0,0,0,2,0,0,2,0,0,0,0,0,2,0,0,0,0,2,0 ],
		[ 0,2,0,0,0,0,2,0,0,0,0,0,2,0,0,2,0,0,0,0,0,2,0,0,0,0,2,0 ],
		[ 0,3,2,4,0,0,4,2,2,4,2,2,4,1,1,4,2,2,4,2,2,4,0,0,4,2,3,0 ],
		[ 0,0,0,2,0,0,2,0,0,2,0,0,0,0,0,0,0,0,2,0,0,2,0,0,2,0,0,0 ],
		[ 0,0,0,2,0,0,2,0,0,2,0,0,0,0,0,0,0,0,2,0,0,2,0,0,2,0,0,0 ],
		[ 0,4,2,4,2,2,4,0,0,4,2,2,4,0,0,4,2,2,4,0,0,4,2,2,4,2,4,0 ],
		[ 0,2,0,0,0,0,0,0,0,0,0,0,2,0,0,2,0,0,0,0,0,0,0,0,0,0,2,0 ],
		[ 0,2,0,0,0,0,0,0,0,0,0,0,2,0,0,2,0,0,0,0,0,0,0,0,0,0,2,0 ],
		[ 0,4,2,2,2,2,2,2,2,2,2,2,4,2,2,4,2,2,2,2,2,2,2,2,2,2,4,0 ],
		[ 0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0 ]
	],
	
	isWall: function (col, row) {
		return this.board[row][col] === 0;
	},
	isIntersection: function (col, row) {
		return this.board[row][col] === 3 || this.board[row][col] === 4;
	},
	isTunnel: function (col, row) {
		return this.board[row][col] === 5;
	},
	hasPill: function (col, row) {
		return this.board[row][col] === 2 || this.board[row][col] === 4;
	},
	
	
	// Possible Turns at the Intersections
	// 0 Up | 1 Left | 2 Down | 3 Right
	turns: {
		x1y1:   [ 2,3 ],		x6y1:   [ 1,2,3 ],		x12y1:  [ 1,2 ],
		x15y1:  [ 2,3 ],		x21y1:  [ 1,2,3 ],		x26y1:  [ 1,2 ],
		x1y5:   [ 0,2,3 ],		x6y5:   [ 0,1,2,3 ],	x9y5:   [ 1,2,3 ],
		x12y5:  [ 0,1,3 ],		x15y5:  [ 0,1,3 ],		x18y5:  [ 1,2,3 ],
		x21y5:  [ 0,1,2,3 ],	x26y5:  [ 0,1,2 ],		x1y8:   [ 0,3 ],
		x6y8:   [ 0,1,2 ],		x9y8:   [ 0,3 ],		x12y8:  [ 1,2 ],
		x15y8:  [ 2,3 ],		x18y8:  [ 0,1 ],		x21y8:  [ 0,2,3 ],
		x26y8:  [ 0,1 ],		x9y11:  [ 2,3 ],		x12y11: [ 1,3 ],
		x15y11: [ 1,3 ],		x18y11: [ 1,2 ],		x6y14:  [ 0,1,2,3 ],
		x9y14:  [ 0,1,2 ],		x18y14: [ 0,2,3 ],		x21y14: [ 0,1,2,3 ],
		x9y17:  [ 0,2,3 ],		x18y17: [ 0,1,2 ],		x1y20:  [ 2,3 ],
		x6y20:  [ 0,1,2,3 ],	x9y20:  [ 0,1,3 ],		x12y20: [ 1,2 ],
		x15y20: [ 2,3 ],		x18y20: [ 0,1,3 ],		x21y20: [ 0,1,2,3 ],
		x26y20: [ 1,2 ],		x1y23:  [ 0,3 ],		x3y23:  [ 1,2 ],
		x6y23:  [ 0,2,3 ],		x9y23:  [ 1,2,3 ],		x12y23: [ 1,3 ],
		x15y23: [ 1,3 ],		x18y23: [ 1,2,3 ],		x21y23: [ 0,1,2 ],
		x24y23: [ 2,3 ],		x26y23: [ 0,1 ],		x1y26:  [ 2,3 ],
		x3y26:  [ 0,1,3 ],		x6y26:  [ 0,1 ],		x9y26:  [ 0,3 ],
		x12y26: [ 1,2 ],		x15y26: [ 2,3 ],		x18y26: [ 0,1 ],
		x21y26: [ 0,3 ],		x24y26: [ 0,1,3 ],		x26y26: [ 1,2 ],
		x1y29:  [ 0,3 ],		x12y29: [ 0,1,3 ],		x15y29: [ 0,1,3 ],
		x26y29: [ 0,1 ]
	},
    
    tileToString: function (tile) {
        return 'x' + tile[0] + 'y' + tile[1];
    },
	
	
	// Predefined Paths
	paths: [
		[ // Pinky moving inside Pen path
			{ dir: [ 0,-1 ], disty: 168, next: 1 },
			{ dir: [ 0, 1 ], disty: 180, next: 0 }
		],
		[ // Inky moving inside Pen path
			{ dir: [ 0,-1 ], disty: 168, next: 1 },
			{ dir: [ 0, 1 ], disty: 180, next: 0 }
		],
		[ // Clyde moving inside Pen path
			{ dir: [ 0,-1 ], disty: 168, next: 1 },
			{ dir: [ 0, 1 ], disty: 180, next: 0 }
		],
		
		[ // Blinky exit Pen path
			{ dir: [ 0,-1 ], disty: 138, next: null }
		],
		[ // Pinky exit Pen path
			{ dir: [ 0,-1 ], disty: 138, next: null }
		],
		[ // Inky exit Pen path
			{ dir: [ 1, 0 ], distx: 168, next: 1    },
			{ dir: [ 0,-1 ], disty: 138, next: null }
		],
		[ // Clyde exit Pen path
			{ dir: [-1, 0 ], distx: 168, next: 1    },
			{ dir: [ 0,-1 ], disty: 138, next: null }
		],
		
		[ // Blinky entering Pen path
			{ dir: [-1, 0 ], distx: 168, next: 1    },
			{ dir: [ 0, 1 ], disty: 174, next: null }
		],
		[ // Pinky entering Pen path
			{ dir: [-1, 0 ], distx: 168, next: 1    },
			{ dir: [ 0, 1 ], disty: 174, next: null }
		],
		[ // Inky entering Pen path
			{ dir: [-1, 0 ], distx: 168, next: 1    },
			{ dir: [ 0, 1 ], disty: 174, next: 2    },
			{ dir: [-1, 0 ], distx: 144, next: null }
		],
		[ // Clyde entering Pen path
			{ dir: [-1, 0 ], distx: 168, next: 1    },
			{ dir: [ 0, 1 ], disty: 174, next: 2    },
			{ dir: [ 1, 0 ], distx: 192, next: null }
		]
	],
	
	isInPenPath:  function (path) { return path <= 2; },
	isExitPath:   function (path) { return path >= 3 && path <= 6; },
	isEnterPath:  function (path) { return path >= 7; },
	getInPenPath: function (id) { return id;   },
	getExitPath:  function (id) { return id+3; },
	getEnterPath: function (id) { return id+7; },
	
	getPathSpeed: function (path){
		if (this.isInPenPath(path)) { return this.inPenSpeed;   }
		if (this.isExitPath(path)) {  return this.exitPenSpeed; }
		if (this.isEnterPath(path)) { return this.eyesSpeed;    }
	},
	
	
	// Constant Ghost Data
	alternateDotsCount: [ 0, 7, 17, 32 ],
	inPenSpeed: 0.6,
	exitPenSpeed: 0.4,
	eyesSpeed: 2,
	eyesTarget: [ 13, 11 ],
	
	
	// Specific Ghosts Data
	// Modes: 0 Scatter | 1 Chase | 2 Frighten | 3 Blink | 4 Eyes
	getGhost: function (id) { return this[this.ghosts[id]]; },
	
	ghosts: [ 'blinky', 'pinky', 'inky', 'clyde' ],
	blinky: {
		position:  [ 168, 138 ],      inpen: false,
		direction: [  -1,   0 ],      path:  null,
		scatter:   [  25,  -3 ],      color: 'rgb(221,0,0)',
		
		// Blinky always follws player
		chase: function (){ return pmBlob.getTile(); }
	},
	pinky: {
		position:  [ 168, 174 ],      inpen: true,
		direction: [   0,  -1 ],      path:  0,
		scatter:   [   2,  -3 ],      color: 'rgb(255,153,153)',
		
		// Pinky follows a tile ahead of player
		chase: function (){
			var targetx = pmBlob.getTile()[0] + 4 * pmBlob.getDir()[0],
                targety = pmBlob.getTile()[1] + 4 * pmBlob.getDir()[1];
			if (pmBlob.getDir()[1] === -1) { // Recreating bug where Up = Up+Left
				targetx -= 4;
            }
			return [ targetx, targety ];
		}
	},
	inky: {
		position:  [ 144, 174 ],      inpen: true,
		direction: [   0,  -1 ],      path:  1,
		scatter:   [  27,  31 ],      color: 'rgb(102,255,255)',
		
		// Inky averages Blinky's position and an offset
		chase: function (){
			var offsetx = pmBlob.getTile()[0] + 2 * pmBlob.getDir()[0],
                offsety = pmBlob.getTile()[1] + 2 * pmBlob.getDir()[1];
			if (pmBlob.getDir()[1] === -1) { // Recreating bug where Up = Up+Left
				offsetx -= 2;
			}
			return [ offsetx * 2 - pmGhosts.getTile('blinky')[0], offsety * 2 - pmGhosts.getTile('blinky')[1] ];
		}
	},
	clyde: {
		position:  [ 192, 174 ],      inpen: true,
		direction: [   0,  -1 ],      path:  2,
		scatter:   [   0,  31 ],      color: 'rgb(255,153,0)',
		
		// Clyde uses pm possition if further away and scatter if closer
		chase: function (){
			var x = Math.pow(pmGhosts.getTile('clyde')[0] - pmBlob.getTile()[0], 2),
                y = Math.pow(pmGhosts.getTile('clyde')[1] - pmBlob.getTile()[1], 2);
			if (Math.sqrt(x + y) > 8) {
				return pmBlob.getTile();
			} else {
				return pmData.clyde.scatter;
            }
		}
	},
	
	
	// Ghost Modes
	isScatter:  function (mode) { return mode === 0; },
	isChase:    function (mode) { return mode === 1; },
	isFrighten: function (mode) { return mode === 2 || mode === 3; },
	isBlue:     function (mode) { return mode === 2; },
	isWhite:    function (mode) { return mode === 3; },
	isEyes:     function (mode) { return mode === 4; },
	
	// Ghosts Colors
	getBodyColor: function (id, mode) {
		switch (mode) {
			case 0:
			case 1: return this[this.ghosts[id]].color;
			case 2: return 'rgb(0,51,255)';
			case 3: return 'rgb(255,255,255)';
			case 4: return 'rgba(0,0,0,0)';
		}
	},
	getFaceColor: function (mode) {
		return this.isBlue(mode) ? 'rgb(255,255,255)' : 'rgb(255,0,0)';
	},
	
	// Ghosts Directions
	valueToAxis: function (number) {
		switch (number) {
			case 0: return [ 0,-1 ];   // Up
			case 1: return [-1, 0 ];   // Left
			case 2: return [ 0, 1 ];   // Down
			case 3: return [ 1, 0 ];   // Right
		}
	},
	axisToValue: function (array) {
		switch (array.toString()) {
			case '0,-1': return 0;   // Up
			case '-1,0': return 1;   // Left
			case '0,1':  return 2;   // Down
			case '1,0':  return 3;   // Right
		}
	},
	
	
	// Get Level Data
	getLevel: function () {
		var level = pmScore.getLevel();
		return level > 21 ? this.levels[20] : this.levels[level - 1];
	},
	getPenForceTime: function () {
		return this.getLevel().penForceTime * 1000;
	},
	getSwitchTime: function (mode) {
		return this.getLevel().switchTimes[mode] * 1000;
	},
	getFrightTime: function () {
		return this.getLevel().frightTime * 1000;
	},
	getBlinks: function () {
		return this.getLevel().frightBlinks * 2;
	},
	
	
	// Levels Data0. After 21 is the same for all
	levels: [
		{ // 1
			ghostSpeed: 0.75, tunnelSpeed: 0.4,              // Ghost Speeds
			pmSpeed: 0.8, eatingSpeed: 0.71,                 // Pacman Speeds
			ghostFrightSpeed: 0.5, pmFrightSpeed: 0.9,
			eatingFrightSpeed: 0.79,                         // Speeds at Fright Mode
			elroyDotsLeft1: 20, elroySpeed1: 0.8,            // How many dots left before Blinky... 
			elroyDotsLeft2: 10, elroySpeed2: 0.85,           // 0...goes "cruise Elroy" and the speeds
			fruitType: 1, fruitScore: 100,
			frightTime: 6, frightBlinks: 5,
			switchTimes: [ 7, 20, 7, 20, 5, 20, 5, 1 ],      // Scatter, Chase, Scatter... Modes 
			penForceTime: 4,                                 // Time of pac-man not eating dots
			penLeavingLimit: [ 0, 0, 30, 60 ]                // Amount of dots
		},
		{ // 2
			ghostSpeed: 0.85, tunnelSpeed: 0.45,
			pmSpeed: 0.9, eatingSpeed: 0.79,
			ghostFrightSpeed: 0.55, pmFrightSpeed: 0.95, eatingFrightSpeed: 0.83,
			elroyDotsLeft1: 30, elroySpeed1: 0.9,
			elroyDotsLeft2: 15, elroySpeed2: 0.95,
			fruitType: 2, fruitScore: 300,
			frightTime: 5, frightBlinks: 5,
			switchTimes: [ 7, 20, 7, 20, 5, 1033, 1/60, 1 ],
			penForceTime: 4, penLeavingLimit: [ 0, 0, 0, 50 ]
		},
		{ // 3
			ghostSpeed: 0.85, tunnelSpeed: 0.45,
			pmSpeed: 0.9, eatingSpeed: 0.79,
			ghostFrightSpeed: 0.55, pmFrightSpeed: 0.95, eatingFrightSpeed: 0.83,
			elroyDotsLeft1: 40, elroySpeed1: 0.9,
			elroyDotsLeft2: 20, elroySpeed2: 0.95,
			fruitType: 3, fruitScore: 500,
			frightTime: 4, frightBlinks: 5,
			switchTimes: [ 7, 20, 7, 20, 5, 1033, 1/60, 1 ],
			penForceTime: 4, penLeavingLimit: [ 0, 0, 0, 0 ]
		},
		{ // 4
			ghostSpeed: 0.85, tunnelSpeed: 0.45,
			pmSpeed: 0.9, eatingSpeed: 0.79,
			ghostFrightSpeed: 0.55, pmFrightSpeed: 0.95, eatingFrightSpeed: 0.83,
			elroyDotsLeft1: 40, elroySpeed1: 0.9,
			elroyDotsLeft2: 20, elroySpeed2: 0.95,
			fruitType: 3, fruitScore: 500,
			frightTime: 3, frightBlinks: 5,
			switchTimes: [ 7, 20, 7, 20, 5, 1033, 1/60, 1 ],
			penForceTime: 4, penLeavingLimit: [ 0, 0, 0, 0 ]
		},
		{ // 5
			ghostSpeed: 0.95, tunnelSpeed: 0.5,
			pmSpeed: 1, eatingSpeed: 0.87,
			ghostFrightSpeed: 0.6, pmFrightSpeed: 1, eatingFrightSpeed: 0.87,
			elroyDotsLeft1: 40, elroySpeed1: 1,
			elroyDotsLeft2: 20, elroySpeed2: 10.05,
			fruitType: 4, fruitScore: 700,
			frightTime: 2, frightBlinks: 5,
			switchTimes: [ 5, 20, 5, 20, 5, 1037, 1/60, 1 ],
			penForceTime: 3, penLeavingLimit: [ 0, 0, 0, 0 ]
		},
		{ // 6
			ghostSpeed: 0.95, tunnelSpeed: 0.5,
			pmSpeed: 1, eatingSpeed: 0.87,
			ghostFrightSpeed: 0.6, pmFrightSpeed: 1, eatingFrightSpeed: 0.87,
			elroyDotsLeft1: 50, elroySpeed1: 1,
			elroyDotsLeft2: 25, elroySpeed2: 10.05,
			fruitType: 4, fruitScore: 700,
			frightTime: 5, frightBlinks: 5,
			switchTimes: [ 5, 20, 5, 20, 5, 1037, 1/60, 1 ],
			penForceTime: 3, penLeavingLimit: [ 0, 0, 0, 0 ]
		},
		{ // 7
			ghostSpeed: 0.95, tunnelSpeed: 0.5,
			pmSpeed: 1, eatingSpeed: 0.87,
			ghostFrightSpeed: 0.6, pmFrightSpeed: 1, eatingFrightSpeed: 0.87,
			elroyDotsLeft1: 50, elroySpeed1: 1,
			elroyDotsLeft2: 25, elroySpeed2: 1.05,
			fruitType: 5, fruitScore: 1000,
			frightTime: 2, frightBlinks: 5,
			switchTimes: [ 5, 20, 5, 20, 5, 1037, 1/60, 1 ],
			penForceTime: 3, penLeavingLimit: [ 0, 0, 0, 0 ]
		},
		{ // 8
			ghostSpeed: 0.95, tunnelSpeed: 0.5,
			pmSpeed: 1, eatingSpeed: 0.87,
			ghostFrightSpeed: 0.6, pmFrightSpeed: 1, eatingFrightSpeed: 0.87,
			elroyDotsLeft1: 50, elroySpeed1: 1,
			elroyDotsLeft2: 25, elroySpeed2: 1.05,
			fruitType: 5, fruitScore: 1000,
			frightTime: 2, frightBlinks: 5,
			switchTimes: [ 5, 20, 5, 20, 5, 1037, 1/60, 1 ],
			penForceTime: 3, penLeavingLimit: [ 0, 0, 0, 0 ]
		},
		{ // 9
			ghostSpeed: 0.95, tunnelSpeed: 0.5,
			pmSpeed: 1, eatingSpeed: 0.87,
			ghostFrightSpeed: 0.6, pmFrightSpeed: 1, eatingFrightSpeed: 0.87,
			elroyDotsLeft1: 60, elroySpeed1: 1,
			elroyDotsLeft2: 30, elroySpeed2: 1.05,
			fruitType: 6, fruitScore: 2000,
			frightTime: 1, frightBlinks: 3,
			switchTimes: [ 5, 20, 5, 20, 5, 1037, 1/60, 1 ],
			penForceTime: 3, penLeavingLimit: [ 0, 0, 0, 0 ]
		},
		{ // 10
			ghostSpeed: 0.95, tunnelSpeed: 0.5,
			pmSpeed: 1, eatingSpeed: 0.87,
			ghostFrightSpeed: 0.6, pmFrightSpeed: 1, eatingFrightSpeed: 0.87,
			elroyDotsLeft1: 60, elroySpeed1: 1,
			elroyDotsLeft2: 30, elroySpeed2: 1.05,
			fruitType: 6, fruitScore: 2000,
			frightTime: 5, frightBlinks: 5,
			switchTimes: [ 5, 20, 5, 20, 5, 1037, 1/60, 1 ],
			penForceTime: 3, penLeavingLimit: [ 0, 0, 0, 0 ]
		},
		{ // 11
			ghostSpeed: 0.95, tunnelSpeed: 0.5,
			pmSpeed: 1, eatingSpeed: 0.87,
			ghostFrightSpeed: 0.6, pmFrightSpeed: 1, eatingFrightSpeed: 0.87,
			elroyDotsLeft1: 60, elroySpeed1: 1,
			elroyDotsLeft2: 30, elroySpeed2: 1.05,
			fruitType: 7, fruitScore: 3000,
			frightTime: 2, frightBlinks: 5,
			switchTimes: [ 5, 20, 5, 20, 5, 1037, 1/60, 1 ],
			penForceTime: 3, penLeavingLimit: [ 0, 0, 0, 0 ]
		},
		{ // 12
			ghostSpeed: 0.95, tunnelSpeed: 0.5,
			pmSpeed: 1, eatingSpeed: 0.87,
			ghostFrightSpeed: 0.6, pmFrightSpeed: 1, eatingFrightSpeed: 0.87,
			elroyDotsLeft1: 80, elroySpeed1: 1,
			elroyDotsLeft2: 40, elroySpeed2: 1.05,
			fruitType: 7, fruitScore: 3000,
			frightTime: 1, frightBlinks: 3,
			switchTimes: [ 5, 20, 5, 20, 5, 1037, 1/60, 1 ],
			penForceTime: 3, penLeavingLimit: [ 0, 0, 0, 0 ]
		},
		{ // 13
			ghostSpeed: 0.95, tunnelSpeed: 0.5,
			pmSpeed: 1, eatingSpeed: 0.87,
			ghostFrightSpeed: 0.6, pmFrightSpeed: 1, eatingFrightSpeed: 0.87,
			elroyDotsLeft1: 80, elroySpeed1: 1,
			elroyDotsLeft2: 40, elroySpeed2: 1.05,
			fruitType: 8, fruitScore: 5000,
			frightTime: 1, frightBlinks: 3,
			switchTimes: [ 5, 20, 5, 20, 5, 1037, 1/60, 1 ],
			penForceTime: 3, penLeavingLimit: [ 0, 0, 0, 0 ]
		},
		{ // 14
			ghostSpeed: 0.95, tunnelSpeed: 0.5,
			pmSpeed: 1, eatingSpeed: 0.87,
			ghostFrightSpeed: 0.6, pmFrightSpeed: 1, eatingFrightSpeed: 0.87,
			elroyDotsLeft1: 80, elroySpeed1: 1,
			elroyDotsLeft2: 40, elroySpeed2: 1.05,
			fruitType: 8, fruitScore: 5000,
			frightTime: 3, frightBlinks: 5,
			switchTimes: [ 5, 20, 5, 20, 5, 1037, 1/60, 1 ],
			penForceTime: 3, penLeavingLimit: [ 0, 0, 0, 0 ]
		},
		{ // 15
			ghostSpeed: 0.95, tunnelSpeed: 0.5,
			pmSpeed: 1, eatingSpeed: 0.87,
			ghostFrightSpeed: 0.6, pmFrightSpeed: 1, eatingFrightSpeed: 0.87,
			elroyDotsLeft1: 100, elroySpeed1: 1,
			elroyDotsLeft2: 50, elroySpeed2: 1.05,
			fruitType: 8, fruitScore: 5000,
			frightTime: 1, frightBlinks: 3,
			switchTimes: [ 5, 20, 5, 20, 5, 1037, 1/60, 1 ],
			penForceTime: 3, penLeavingLimit: [ 0, 0, 0, 0 ]
		},
		{ // 16
			ghostSpeed: 0.95, tunnelSpeed: 0.5,
			pmSpeed: 1, eatingSpeed: 0.87,
			ghostFrightSpeed: 0.6, pmFrightSpeed: 1, eatingFrightSpeed: 0.87,
			elroyDotsLeft1: 100, elroySpeed1: 1,
			elroyDotsLeft2: 50, elroySpeed2: 1.05,
			fruitType: 8, fruitScore: 5000,
			frightTime: 1, frightBlinks: 3,
			switchTimes: [ 5, 20, 5, 20, 5, 1037, 1/60, 1 ],
			penForceTime: 3, penLeavingLimit: [ 0, 0, 0, 0 ]
		},
		{ // 17
			ghostSpeed: 0.95, tunnelSpeed: 0.5,
			pmSpeed: 1, eatingSpeed: 0.87,
			ghostFrightSpeed: 0.6, pmFrightSpeed: 1, eatingFrightSpeed: 0.87,
			elroyDotsLeft1: 100, elroySpeed1: 1,
			elroyDotsLeft2: 50, elroySpeed2: 1.05,
			fruitType: 8, fruitScore: 5000,
			frightTime: 0, frightBlinks: 0,
			switchTimes: [ 5, 20, 5, 20, 5, 1037, 1/60, 1 ],
			penForceTime: 3, penLeavingLimit: [ 0, 0, 0, 0 ]
		},
		{ // 18
			ghostSpeed: 0.95, tunnelSpeed: 0.5,
			pmSpeed: 1, eatingSpeed: 0.87,
			ghostFrightSpeed: 0.6, pmFrightSpeed: 1, eatingFrightSpeed: 0.87,
			elroyDotsLeft1: 100, elroySpeed1: 1,
			elroyDotsLeft2: 50, elroySpeed2: 1.05,
			fruitType: 8, fruitScore: 5000,
			frightTime: 1, frightBlinks: 3,
			switchTimes: [ 5, 20, 5, 20, 5, 1037, 1/60, 1 ],
			penForceTime: 3, penLeavingLimit: [ 0, 0, 0, 0 ]
		},
		{ // 19
			ghostSpeed: 0.95, tunnelSpeed: 0.5,
			pmSpeed: 1, eatingSpeed: 0.87,
			ghostFrightSpeed: 0.6, pmFrightSpeed: 1, eatingFrightSpeed: 0.87,
			elroyDotsLeft1: 120, elroySpeed1: 1,
			elroyDotsLeft2: 60, elroySpeed2: 1.05,
			fruitType: 8, fruitScore: 5000,
			frightTime: 0, frightBlinks: 0,
			switchTimes: [ 5, 20, 5, 20, 5, 1037, 1/60, 1 ],
			penForceTime: 3, penLeavingLimit: [ 0, 0, 0, 0 ]
		},
		{ // 20
			ghostSpeed: 0.95, tunnelSpeed: 0.5,
			pmSpeed: 1, eatingSpeed: 0.87,
			ghostFrightSpeed: 0.6, pmFrightSpeed: 1, eatingFrightSpeed: 0.87,
			elroyDotsLeft1: 120, elroySpeed1: 1,
			elroyDotsLeft2: 60, elroySpeed2: 1.05,
			fruitType: 8, fruitScore: 5000,
			frightTime: 0, frightBlinks: 0,
			switchTimes: [ 5, 20, 5, 20, 5, 1037, 1/60, 1 ],
			penForceTime: 3, penLeavingLimit: [ 0, 0, 0, 0 ]
		},
		{ // 21+
			ghostSpeed: 0.95, tunnelSpeed: 0.5,
			pmSpeed: 0.9, eatingSpeed: 0.79,
			ghostFrightSpeed: 0.75, pmFrightSpeed: 0.9, eatingFrightSpeed: 0.79,
			elroyDotsLeft1: 120, elroySpeed1: 1,
			elroyDotsLeft2: 60, elroySpeed2: 1.05,
			fruitType: 8, fruitScore: 5000,
			frightTime: 0, frightBlinks: 0,
			switchTimes: [ 5, 20, 5, 20, 5, 1037, 1/60, 1 ],
			penForceTime: 3, penLeavingLimit: [ 0, 0, 0, 0 ]
		}
	],
	
	
	// Demo Animation Data
	demo: [
		{ // [0] Title
			timer: 0, mouth: 5
		},
		{ // [1] Chase
			blob: 0, ghosts: -30, mouth: 5, rad: 1, amount: 4,
			mode: 1, dir: 1, dist: 25, feet: 0, radius: 5, mult: -1
		},
		{ // [2] Frighten
			blob: 310, ghosts: 262, mouth: 0, rad: 0, amount: 4,
			mode: 2, dir: -1, dist: 25, feet: 0, text: 0
		},
		{ // [3] Present
			timer: 0, ghosts: 0, amount: 4, mode: 1, dir: 1,
			dist: 250, feet: 0, name: 0
		}
	]
};