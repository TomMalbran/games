/*jslint es5: true, plusplus: true, sloppy: true, white: false, browser: true */
/*global pmData, pmFood, pmDraw, pmGhosts*/

/* Contents:
  I.	Board Canvas
  II.	Game Canvas
  III.	Screen Canvas
  IV.	Fruit Drawings
*/


/* -----------------
    Board Canvas  */

var pmBoard = {

	ctx: "",
	
	init: function () {
        this.ctx = document.getElementById("board").getContext("2d");
		this.ctx.lineWidth	  = 2;
		this.ctx.strokeStyle  = "rgb(0, 51, 255)";
		this.ctx.font         = "20px 'Whimsy TT'";
		this.ctx.fillStyle    = "rgb(255, 255, 255)";
		this.ctx.textAlign    = "center";
		this.ctx.textBaseline = "middle";
	},
	
	
	// Draw Board
	draw: function (newLevel) {
		this.monsterPen();
		
		this.ctx.save();
		this.ctx.strokeStyle = newLevel ? "rgb(255, 255, 255)" : "rgb(0, 51, 255)";
		this.outerBorder();
		this.innerBorder();
		
		this.square(30, 30, 36, 24);
		this.square(90, 30, 48, 24);
		this.square(198, 30, 48, 24);
		this.square(270, 30, 36, 24);
		this.square(30, 78, 36, 12);
		this.tshape(90, 162, 1.5 * Math.PI, 0, 0);
		this.tshape(126, 78, 0, 0, 0);
		this.tshape(246, 78, 0.5 * Math.PI, 0, 0);
		this.square(270, 78, 36, 12);
		this.square(90, 186, 12, 48);
		this.tshape(126, 222, 0, 0, 0);
		this.square(234, 186, 12, 48);
		this.lshape(30, 258, false);
		this.square(90, 258, 48, 12);
		this.square(198, 258, 48, 12);
		this.lshape(306, 258, true);
		this.tshape(138, 342, Math.PI, 24, 0);
		this.tshape(126, 294, 0, 0, 0);
		this.tshape(306, 342, Math.PI, 0, 24);
		this.ctx.restore();
	},
	
	monsterPen: function () {
		this.ctx.strokeRect(126, 150, 84, 48);
		this.ctx.strokeRect(131, 155, 74, 38);
		this.ctx.strokeRect(155, 150, 26, 5);
		this.ctx.clearRect(156, 149, 24, 7);
		
		this.ctx.save();
		this.ctx.strokeStyle = "rgb(255, 255, 255)";
		this.ctx.strokeRect(157, 152, 22, 1);
		this.ctx.restore();
	},
	
	outerBorder: function () {
		this.ctx.beginPath();
		this.ctx.arc(7, 7, 6, Math.PI, 1.5 * Math.PI, false);			// Top-Left
		this.ctx.arc(329, 7, 6, 1.5 * Math.PI, 2 * Math.PI, false);		// Top-Right
		
		// Right Out-way
		this.ctx.arc(329, 113, 6, 0, 0.5 * Math.PI, false);
		this.ctx.arc(278, 122, 3, 1.5 * Math.PI, Math.PI, true);
		this.ctx.arc(278, 154, 3, Math.PI, 0.5 * Math.PI, true);
		this.ctx.lineTo(336, 157);
		this.ctx.moveTo(336, 191);
		this.ctx.arc(278, 194, 3, 1.5 * Math.PI, Math.PI, true);
		this.ctx.arc(278, 226, 3, Math.PI, 0.5 * Math.PI, true);
		this.ctx.arc(329, 235, 6, 1.5 * Math.PI, 2 * Math.PI, false);
		
		this.ctx.arc(329, 365, 6, 0, 0.5 * Math.PI, false);				// Bottom-Right
		this.ctx.arc(7, 365, 6, 0.5 * Math.PI, Math.PI, false);			// Bottom-Left
	  
		// Left Out-way
		this.ctx.arc(7, 235, 6, Math.PI, 1.5 * Math.PI, false);
		this.ctx.arc(58, 226, 3, 0.5 * Math.PI, 0, true);
		this.ctx.arc(58, 194, 3, 0, 1.5 * Math.PI, true);
		this.ctx.lineTo(0, 191);
		this.ctx.moveTo(0, 157);
		this.ctx.arc(58, 154, 3, 0.5 * Math.PI, 0, true);
		this.ctx.arc(58, 122, 3, 0, 1.5 * Math.PI, true);
		this.ctx.arc(7, 113, 6, 0.5 * Math.PI, Math.PI, false);
		
		this.ctx.lineTo(1, 7);
		this.ctx.stroke();
	},
	
	innerBorder: function () {
		this.ctx.beginPath();
		this.ctx.arc(9, 9, 3, Math.PI, 1.5 * Math.PI, false);			// Top-Left
		this.ctx.arc(159, 9, 3, 1.5 * Math.PI, 2 * Math.PI, false);
		this.ctx.arc(168, 48, 6, Math.PI, 0, true);
		this.ctx.arc(177, 9, 3, Math.PI, 1.5 * Math.PI, false);
		this.ctx.arc(327, 9, 3, 1.5 * Math.PI, 2 * Math.PI, false);		// Top-Right
		
		// Right Out-way
		this.ctx.arc(327, 111, 3, 0, 0.5 * Math.PI, false);
		this.ctx.arc(276, 120, 6, 1.5 * Math.PI, Math.PI, true);
		this.ctx.arc(276, 156, 6, Math.PI, 0.5 * Math.PI, true);
		this.ctx.lineTo(336, 162);
		this.ctx.moveTo(336, 186);
		this.ctx.arc(276, 192, 6, 1.5 * Math.PI, Math.PI, true);
		this.ctx.arc(276, 228, 6, Math.PI, 0.5 * Math.PI, true);
		this.ctx.arc(327, 237, 3, 1.5 * Math.PI, 2 * Math.PI, false);
		
		// Bottom Part
		this.ctx.arc(327, 291, 3, 0, 0.5 * Math.PI, false);
		this.ctx.arc(312, 300, 6, 1.5 * Math.PI, 0.5 * Math.PI, true);
		this.ctx.arc(327, 309, 3, 1.5 * Math.PI, 2 * Math.PI, false);
		this.ctx.arc(327, 363, 3, 0, 0.5 * Math.PI, false);				// Bottom-Right
		this.ctx.arc(9, 363, 3, 0.5 * Math.PI, Math.PI, false);			// Bottom-Left
		this.ctx.arc(9, 309, 3, Math.PI, 1.5 * Math.PI, false);
		this.ctx.arc(24, 300, 6, 0.5 * Math.PI, 1.5 * Math.PI, true);
		this.ctx.arc(9, 291, 3, 0.5 * Math.PI, Math.PI, false);
		
		// Left Out-way
		this.ctx.arc(9, 237, 3, Math.PI, 1.5 * Math.PI, false);
		this.ctx.arc(60, 228, 6, 0.5 * Math.PI, 0, true);
		this.ctx.arc(60, 192, 6, 0, 1.5 * Math.PI, true);
		this.ctx.lineTo(0, 186);
		this.ctx.moveTo(0, 162);
		this.ctx.arc(60, 156, 6, 0.5 * Math.PI, 0, true);
		this.ctx.arc(60, 120, 6, 0, 1.5 * Math.PI, true);
		this.ctx.arc(9, 111, 3, 0.5 * Math.PI, Math.PI, false);
		
		this.ctx.lineTo(6, 9);
		this.ctx.stroke();
	},
	
	
	// Middle Board Shapes
	square: function (x, y, width, height) {
		this.ctx.save();
		this.ctx.translate(x, y);
		
		this.ctx.beginPath();
		this.ctx.arc(6, 6, 6, Math.PI, 1.5 * Math.PI, false);
		this.ctx.arc(width - 6, 6, 6, 1.5 * Math.PI, 2 * Math.PI, false);
		this.ctx.arc(width - 6, height - 6, 6, 0, 0.5 * Math.PI, false);
		this.ctx.arc(6, height - 6, 6, 0.5 * Math.PI, Math.PI, false);
		this.ctx.closePath();
		
		this.ctx.stroke();
		this.ctx.restore();
	},
	tshape: function (x, y, angle, left, right) {
		this.ctx.save();
		this.ctx.translate(x, y);
		this.ctx.rotate(angle);
		
		this.ctx.beginPath();
		this.ctx.arc(6, 6, 6, 0.5 * Math.PI, 1.5 * Math.PI, false);
		this.ctx.arc(78 + left + right, 6, 6, 1.5 * Math.PI, 0.5 * Math.PI, false);
		this.ctx.arc(51 + right, 15, 3, 1.5 * Math.PI, Math.PI, true);
		this.ctx.arc(42 + right, 42, 6, 0, Math.PI, false);
		this.ctx.arc(33 + right, 15, 3, 0, 1.5 * Math.PI, true);
		this.ctx.closePath();
		
		this.ctx.stroke();
		this.ctx.restore();
	},
	lshape: function (x, y, reflect) {
		this.ctx.save();
		this.ctx.translate(x, y);
		if (reflect) {
			this.ctx.transform(-1, 0, 0, 1, 0, 0);
		}
        this.ctx.beginPath();
		this.ctx.arc(6, 6, 6, 0.5 * Math.PI, 1.5 * Math.PI, false);
		this.ctx.arc(30, 6, 6, 1.5 * Math.PI, 2 * Math.PI, false);
		this.ctx.arc(30, 42, 6, 0, Math.PI, false);
		this.ctx.arc(21, 15, 3, 0, 1.5 * Math.PI, true);
		this.ctx.closePath();
		
		this.ctx.stroke();
		this.ctx.restore();
	},
	
	
	// Dots/Fruits Drawings
	dots: function () {
		var i, j;
        
        this.ctx.fillStyle = "rgb(255, 255, 255)";
		for (i = 0; i < pmData.dimensions[1]; i++) {
			for (j = 0; j < pmData.dimensions[0]; j++) {
				if (pmFood.getValue(i, j) === 1) {
					this.ctx.fillRect(pmData.getMiddle(j) - 1, pmData.getMiddle(i) - 1, 2, 2);
                }
            }
        }
	},
	energizers: function (radius) {
		var i, x, y;
        for (i = 0; i < pmData.energizers.length; i++) {
			x = pmData.energizers[i][0];
			y = pmData.energizers[i][1];
			if (pmFood.getValue(y, x) === 5) {
				this.clearDot(x, y);
				this.energizer(this.ctx, pmData.getMiddle(x), pmData.getMiddle(y), radius);
			}
		}
	},
	energizer: function (ctx, x, y, radius) {
		ctx.beginPath();
		ctx.arc(x, y, radius, 0, 2 * Math.PI);
		ctx.fill();
	},
	
	clearDot: function (x, y) {
		this.ctx.clearRect(pmData.getCorner(x), pmData.getCorner(y), pmData.tileSize, pmData.tileSize);
	},
	clearFruit: function () {
		this.ctx.clearRect(pmData.fruitPos[0] - 1, pmData.fruitPos[1] - 1, pmData.fruitSize, pmData.fruitSize);
	},
	
	
	// Score Functions
	texts: function () {
		this.ctx.fillText("Score", 35, 385);
		this.ctx.fillText("Lives", 195, 385);
	},
	score: function (score) {
		this.ctx.save();
		this.ctx.fillStyle = "rgb(255, 255, 51)";
		this.ctx.textAlign = "left";
		this.ctx.clearRect(65, 376, 90, 20);
		this.ctx.fillText(score, 70, 385);
		this.ctx.restore();
	},
	blobs: function (lives) {
		var i;
        this.ctx.clearRect(226, 376, 70, 20);
		for (i = 0; i < lives; i++) {
			pmDraw.blob({
				ctx:    this.ctx,
				x:      235 + 18 * i,
				y:      386,
				angle:  0,
				radius: 8,
				mouth:  1
			});
        }
	},
	
	
	// Sub Functions
	lines: function () {
		var i;
        this.ctx.strokeStyle = "#CCC";
		this.ctx.lineWidth	= 1;
		this.ctx.beginPath();
		for (i = 0; i <= 31; i++) {
			this.ctx.moveTo(0, i * 12);
			this.ctx.lineTo(336, i * 12);
		}
		for (i = 0; i <= 28; i++) {
			this.ctx.moveTo(i * 12, 0);
			this.ctx.lineTo(i * 12, 372);
		}
		this.ctx.stroke();
	},
	clear: function () {
		this.ctx.clearRect(0, 0, pmData.canvasWidth, pmData.canvasHeight + pmData.scoreHeight);
	},
	
	getBoard: function () { return this.ctx; }
};



/* ----------------
    Game Canvas  */

var pmDraw = {
	
	ctx:  "",
	pos:  [],		// Blob/Ghosts old position
	
	
	init: function () {
		this.ctx = document.getElementById("game").getContext("2d");
		this.ctx.fillStyle    = "rgb(255, 255, 255)";
		this.ctx.font         = "20px 'Whimsy TT'";
		this.ctx.textAlign    = "center";
		this.ctx.textBaseline = "middle";
	},
	
	
	// Clear
	clear: function () {
		var i;
		for (i = 0; i < this.pos.length; i++) {
			this.ctx.clearRect(this.pos[i][0], this.pos[i][1], pmData.eraseSize, pmData.eraseSize);
		}
	},
	save: function (pos, x, y) {
		this.pos[pos] = [x - pmData.eraseSize / 2, y - pmData.eraseSize / 2];
	},
	
	clearAll: function () {
		this.ctx.clearRect(0, 0, pmData.canvasWidth, pmData.canvasHeight);
	},
	
	
	// Pacman Drawings
	blob: function (data) {
		var values = [ 0, 0.2, 0.4, 0.2 ],
            delta  = values[data.mouth];
		
		this.save(0, data.x, data.y);
		data.ctx.save();
		data.ctx.fillStyle = "rgb(255, 255, 51)";
		data.ctx.translate(data.x, data.y);
		data.ctx.rotate(data.angle);
		data.ctx.beginPath();
		data.ctx.arc(0, 0, data.radius, (1 + delta) * Math.PI, (3 - delta) * Math.PI);
		data.ctx.lineTo(4, 0);
		data.ctx.fill();
		data.ctx.restore();
	},
    
	startDeath: function (x, y) {
		this.ctx.save();
		this.ctx.translate(x, y);
	},
	blobDeath: function (count) {
		var delta = count / 50;
		
		this.ctx.fillStyle = "rgb(255, 255, 51)";
		this.ctx.beginPath();
		this.ctx.arc(0, 0, 8, (1.5 - delta) * Math.PI, (1.5 + delta) * Math.PI, true);
		this.ctx.lineTo(0, 0);
		this.ctx.fill();
	},
	blobCircle: function (count) {
		var radius = count / 2;
		
		this.ctx.strokeStyle = "rgb(159, 159, 31)";
		this.ctx.lineWidth   = 3;
		this.ctx.beginPath();
		this.ctx.arc(0, 0, radius, 0, 2 * Math.PI, true);
		this.ctx.stroke();
	},
	endDeath: function () {
		this.ctx.restore();
	},
	
	
	// Ghosts Drawings
	ghost: function (data) {
		this.save(data.id + 1, data.x, data.y);
		data.ctx.save();
		data.ctx.translate(data.x - 9, data.y - 9);
		
		this.ghostBody(data);
		if (data.fright) {
			this.ghostFrightenFace(data);
		} else {
			this.ghostNormalFace(data);
		}
        data.ctx.restore();
	},
	
	ghostBody: function (data) {
		data.ctx.fillStyle = pmData.getBodyColor(data.id, data.mode);
		data.ctx.beginPath();
		data.ctx.arc(8, 8, 8, Math.PI, 1.5 * Math.PI, false);
		data.ctx.arc(10, 8, 8, 1.5 * Math.PI, 2 * Math.PI, false);
		
		if (!data.feet) {
			this.ghostFeet0(data.ctx);
		} else {
			this.ghostFeet1(data.ctx);
		}
		data.ctx.fill();
	},
	ghostFeet0: function (ctx) {
		ctx.lineTo(18, 16);
		ctx.lineTo(16, 18);
		ctx.lineTo(15, 18);
		ctx.lineTo(12, 15);
		ctx.lineTo(9, 18);
		ctx.lineTo(6, 15);
		ctx.lineTo(3, 18);
		ctx.lineTo(2, 18);
		ctx.lineTo(0, 16);
		ctx.lineTo(0, 8);
	},
	ghostFeet1: function (ctx) {
		ctx.lineTo(18, 18);
		ctx.lineTo(15, 15);
		ctx.lineTo(12, 18);
		ctx.lineTo(11, 18);
		ctx.lineTo(9, 15);
		ctx.lineTo(7, 18);
		ctx.lineTo(6, 18);
		ctx.lineTo(3, 15);
		ctx.lineTo(0, 18);
		ctx.lineTo(0, 8);
	},
	
	ghostNormalFace: function (data) {
		data.ctx.fillStyle = "rgb(255, 255, 255)";
		data.ctx.beginPath();
		data.ctx.arc(6 + data.add[0] * 2, 7 + data.add[1] * 2, 3, 0, 2 * Math.PI);
		data.ctx.arc(12.5 + data.add[0] * 2, 7 + data.add[1] * 2, 3, 0, 2 * Math.PI);
		data.ctx.fill();
		
		data.ctx.fillStyle = "rgb(0, 51, 255)";
		data.ctx.beginPath();
		data.ctx.arc(6 + data.add[0] * 4, 7 + data.add[1] * 4, 1.5, 0, 2 * Math.PI);
		data.ctx.arc(12.5 + data.add[0] * 4, 7 + data.add[1] * 4, 1.5, 0, 2 * Math.PI);
		data.ctx.fill();
	},
	ghostFrightenFace: function (data) {
		data.ctx.fillStyle = pmData.getFaceColor(data.mode);
		data.ctx.beginPath();
		data.ctx.arc(6, 7, 1.5, 0, 2 * Math.PI);
		data.ctx.arc(12.5, 7, 1.5, 0, 2 * Math.PI);
		data.ctx.fill();
		
		data.ctx.strokeStyle = pmData.getFaceColor(data.mode);
		data.ctx.beginPath();
		data.ctx.moveTo(3, 14);
		data.ctx.lineTo(5, 11);
		data.ctx.lineTo(7, 14);
		data.ctx.lineTo(9, 11);
		data.ctx.lineTo(11, 14);
		data.ctx.lineTo(13, 11);
		data.ctx.lineTo(15, 14);
		data.ctx.stroke();
	},
		

	// Other Drawings
	bg: function () {
		this.ctx.save();
		this.ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
		this.ctx.fillRect(0, 0, pmData.canvasWidth, pmData.canvasHeight);
		this.ctx.restore();
	},
	text: function (data) {
		this.ctx.save();
		if (data.size) {
            this.ctx.font = data.size + "px 'Whimsy TT'";
		}
        if (data.align) {
            this.ctx.textAlign = data.align;
		}
        this.ctx.fillStyle = data.color;
		this.ctx.fillText(data.text, data.pos[0], data.pos[1]);
		this.ctx.restore();
	},
	
	targets: function () {
		var i, ghost, x, y;
        
        this.ctx.save();
		for (i = 0; i < pmData.ghosts.length; i++) {
			ghost = pmData.ghosts[i];
			this.ctx.fillStyle   = pmData[ghost].color;
			this.ctx.strokeStyle = pmData[ghost].color;
			
			x = pmData.getMiddle(pmGhosts[ghost].target[0]);
			y = pmData.getMiddle(pmGhosts[ghost].target[1]);
			this.ctx.beginPath();
			this.ctx.moveTo(pmGhosts[ghost].x, pmGhosts[ghost].y);
			this.ctx.lineTo(x, y);
			this.ctx.fillRect(x - 4, y - 4, 8, 8);
			this.ctx.stroke();
		}
		this.ctx.restore();
	},
	
	
	// Sub Functions
	getGame: function () { return this.ctx; }
};



/* ------------------
    Screen Canvas  */

var pmScreen = {

	ctx: "",
	
	init: function () {
		this.ctx = document.getElementById("screen").getContext("2d");
		
		this.ctx.font         = "20px 'Whimsy TT'";
		this.ctx.fillStyle    = "rgb(255, 255, 255)";
		this.ctx.textAlign    = "center";
		this.ctx.textBaseline = "middle";
	},
	clear: function () {
		this.ctx.clearRect(0, 0, pmData.canvasWidth, pmData.canvasHeight + pmData.scoreHeight);
	},
	fill: function (alpha) {
		this.ctx.save();
		this.ctx.fillStyle = "rgba(0, 0, 0, " + alpha + ")";
		this.ctx.fillRect(0, 0, pmData.canvasWidth, pmData.canvasHeight + pmData.scoreHeight);
		this.ctx.restore();
	},
	
	
	// Show Title
	title: function () {
		this.ctx.save();
		this.ctx.font = "70px 'Whimsy TT'";
		this.ctx.textAlign = "right";
		this.ctx.fillText("Pa", 106, 50);
		this.ctx.textAlign = "left";
		this.ctx.fillText("man", 160, 50);
		this.ctx.restore();
		this.blob(133, 1);
	},
	blob: function (x, mouth) {
		pmDraw.blob({
			ctx:    this.ctx,
			x:      x,
			y:      55,
			angle:  Math.PI,
			radius: pmData.bigBlobRadius,
			mouth:  mouth
		});
	}
};



/* -------------------
    Fruit Drawings  */

var pmFruit = {

	// Fruits Drawings
	draw: function (ctx, x, y) {
		ctx.save();
		ctx.translate(x, y);
		this["fruit" + pmData.getLevel().fruitType](ctx);
		ctx.restore();
	},
	
	// Cherries
	fruit1: function (ctx) {
		ctx.fillStyle = "rgb(255, 0, 0)";
		ctx.beginPath();
		ctx.arc(10, 14, 4, 0, 2 * Math.PI);
		ctx.arc(4, 10, 4, 0, 2 * Math.PI);
		ctx.fill();
		
		ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
		ctx.beginPath();
		ctx.arc(8, 15.5, 1.5, 0, 2 * Math.PI);
		ctx.arc(1.5, 11, 1.5, 0, 2 * Math.PI);
		ctx.fill();
		
		ctx.strokeStyle = "rgb(0, 153, 0)";
		ctx.lineWidth = 2;
		ctx.beginPath();
		ctx.moveTo(17, 1);
		ctx.quadraticCurveTo(9, 1, 5, 9);
		ctx.moveTo(17, 1);
		ctx.quadraticCurveTo(12, 3, 10, 12);
		ctx.stroke();
		
		ctx.strokeStyle = "rgb(222, 151, 81)";
		ctx.lineWidth = 3;
		ctx.lineCap = "round";
		ctx.beginPath();
		ctx.moveTo(17, 1);
		ctx.lineTo(16, 2);
		ctx.stroke();
	},
	
	// Strawberry
	fruit2: function (ctx) {
		var i, dots = [ 3, 7, 5, 6, 4, 10, 7, 8, 6, 11, 7, 13, 9, 10,
                        9, 14, 10, 12, 11, 8, 12, 11, 14, 6, 14, 9 ];
        
        ctx.fillStyle = "rgb(222, 0, 0)";
		ctx.beginPath();
		ctx.moveTo(9, 3);
		ctx.quadraticCurveTo(17, 3, 17, 7);
		ctx.quadraticCurveTo(17, 14, 9, 17);
		ctx.quadraticCurveTo(1, 14, 1, 7);
		ctx.quadraticCurveTo(1, 3, 9, 3);
		ctx.fill();
		
		ctx.fillStyle = "rgb(0, 222, 0)";
		ctx.beginPath();
		ctx.moveTo(5, 3);
		ctx.lineTo(13, 3);
		ctx.lineTo(14, 4);
		ctx.lineTo(9, 7);
		ctx.lineTo(4, 4);
		ctx.fill();
				
		ctx.fillStyle = "rgb(255, 255, 255)";
		ctx.fillRect(8, 0, 2, 4);
		
		for (i = 0; i < dots.length; i += 2) {
			ctx.fillRect(dots[i], dots[i + 1], 1, 1);
        }
	},
	
	// Peach
	fruit3: function (ctx) {
		ctx.fillStyle = "rgb(255, 181, 33)";
		ctx.beginPath();
		ctx.arc(6, 10, 5, Math.PI, 1.5 * Math.PI, false);
		ctx.arc(12, 10, 5, 1.5 * Math.PI, 2 * Math.PI, false);
		ctx.arc(10, 11, 7, 0, 0.5 * Math.PI, false);
		ctx.arc(8, 11, 7, 0.5 * Math.PI, Math.PI, false);
		ctx.fill();
		
		ctx.strokeStyle = "rgb(0, 222, 0)";
		ctx.lineCap = "round";
		ctx.beginPath();
		ctx.moveTo(6, 5);
		ctx.lineTo(14, 4);
		ctx.moveTo(14, 0);
		ctx.quadraticCurveTo(11, 0, 10, 7);
		ctx.stroke();
	},
	
	// Apple
	fruit4: function (ctx) {
		ctx.fillStyle = "rgb(222, 0, 0)";
		ctx.beginPath();
		ctx.arc(6, 8, 5, Math.PI, 1.5 * Math.PI, false);
		ctx.arc(12, 8, 5, 1.5 * Math.PI, 2 * Math.PI, false);
		ctx.arc(10, 11, 7, 0, 0.5 * Math.PI, false);
		ctx.arc(13, 15, 3, 0.5 * Math.PI, Math.PI, false);
		ctx.arc(6, 15, 3, 0, 0.5 * Math.PI, false);
		ctx.arc(8, 11, 7, 0.5 * Math.PI, Math.PI, false);
		ctx.fill();
		
		ctx.strokeStyle = "rgb(0, 222, 0)";
		ctx.lineCap = "round";
		ctx.beginPath();
		ctx.arc(3, 7, 7, 1.5 * Math.PI, 2 * Math.PI, false);
		ctx.arc(13, 4, 4, Math.PI, 1.5 * Math.PI, false);
		ctx.stroke();
		
		ctx.strokeStyle = "rgba(255, 255, 255, 0.8)";
		ctx.beginPath();
		ctx.arc(7, 9, 4, Math.PI, 1.5 * Math.PI, false);
		ctx.stroke();
	},
	
	// Grapes
	fruit5: function (ctx) {
		ctx.fillStyle = "rgb(0, 222, 0)";
		ctx.beginPath();
		ctx.arc(9, 11, 8, 0, 2 * Math.PI);
		ctx.fill();
		
		ctx.strokeStyle = "rgb(74, 74, 0)";
		ctx.beginPath();
		ctx.moveTo(9, 4);
		ctx.lineTo(2, 11);
		ctx.lineTo(7, 16);
		ctx.moveTo(14, 6);
		ctx.lineTo(8, 12);
		ctx.lineTo(14, 18);
		ctx.moveTo(9, 6);
		ctx.lineTo(15, 12);
		ctx.lineTo(10, 17);
		ctx.moveTo(10, 14);
		ctx.lineTo(4, 18);
		ctx.stroke();
		
		ctx.strokeStyle = "rgb(222, 148, 74)";
		ctx.beginPath();
		ctx.moveTo(4, 0);
		ctx.lineTo(5, 1);
		ctx.lineTo(12, 1);
		ctx.moveTo(9, 1);
		ctx.lineTo(9, 4);
		ctx.stroke();
	},
	
	// Galaxian
	fruit6: function (ctx) {
		ctx.fillStyle   = "rgb(255, 250, 55)";
		ctx.strokeStyle = "rgb(255, 250, 55)";
		ctx.beginPath();
		ctx.moveTo(1, 4);
		ctx.lineTo(17, 4);
		ctx.lineTo(9, 11);
		ctx.fill();
		ctx.beginPath();
		ctx.moveTo(9, 11);
		ctx.lineTo(9, 18);
		ctx.stroke();
		
		ctx.strokeStyle = "rgb(0, 51, 255)";
		ctx.beginPath();
		ctx.moveTo(1, 1);
		ctx.lineTo(1, 6);
		ctx.lineTo(8, 12);
		ctx.moveTo(17, 1);
		ctx.lineTo(17, 6);
		ctx.lineTo(10, 12);
		ctx.stroke();
		
		ctx.fillStyle   = "rgb(255, 0, 0)";
		ctx.strokeStyle = "rgb(255, 0, 0)";
		ctx.beginPath();
		ctx.moveTo(3, 5);
		ctx.lineTo(9, 0);
		ctx.lineTo(15, 5);
		ctx.fill();
		ctx.beginPath();
		ctx.moveTo(9, 3);
		ctx.lineTo(9, 6);
		ctx.stroke();
	},
	
	// Bell
	fruit7: function (ctx) {
		ctx.fillStyle = "rgb(255, 255, 33)";
		ctx.beginPath();
		ctx.moveTo(1, 15);
		ctx.quadraticCurveTo(1, 1, 9, 1);
		ctx.quadraticCurveTo(17, 1, 17, 15);
		ctx.fill();
		
		ctx.fillStyle = "rgb(0, 222, 222)";
		ctx.fillRect(3, 14, 12, 3);
		ctx.fillStyle = "rgb(255, 255, 255)";
		ctx.fillRect(9, 14, 3, 3);
		
		ctx.strokeStyle = "rgb(255, 255, 255)";
		ctx.beginPath();
		ctx.moveTo(8, 4);
		ctx.quadraticCurveTo(4, 4, 4, 13);
		ctx.stroke();
	},
	
	// Key
	fruit8: function (ctx) {
		ctx.fillStyle = "rgb(0, 222, 222)";
		ctx.beginPath();
		ctx.arc(6, 3, 3, Math.PI, 1.5 * Math.PI, false);
		ctx.arc(12, 3, 3, 1.5 * Math.PI, 2 * Math.PI, false);
		ctx.arc(12, 5, 3, 0, 0.5 * Math.PI, false);
		ctx.arc(6, 5, 3, 0.5 * Math.PI, Math.PI, false);
		ctx.fill();
		ctx.clearRect(6, 2, 6, 2);
		
		ctx.strokeStyle = "rgb(255, 255, 255)";
		ctx.beginPath();
		ctx.moveTo(8, 8);
		ctx.lineTo(8, 15);
		ctx.arc(9.5, 13.5, 1.5, Math.PI, 0, true);
		ctx.lineTo(11, 8);
		ctx.moveTo(11, 10);
		ctx.lineTo(14, 10);
		ctx.moveTo(11, 13);
		ctx.lineTo(14, 13);
		ctx.stroke();
	}
};