/**
 * The Ghost Base Class
 */
class Ghost {

    /**
     * Initializes the Ghost
     * @param {Canvas}  canvas
     * @param {?Number} dots
     * @returns {Void}
     */
    init(canvas, dots) {
        this.canvas     = canvas;
        this.ctx        = canvas.context;

        this.mode       = "scatter";
        this.tile       = Board.getGhostStartTile(this.inPen);
        this.tileCenter = Board.getTileXYCenter(this.tile);
        this.turn       = Board.getGhostStartTurn(this.inPen);
        this.x          = this.start.x * Board.tileSize;
        this.y          = this.start.y * Board.tileSize;
        this.center     = false;
        this.dotsCount  = dots || 0;
        this.target     = this.scatter;
        this.speed      = Data.getGhostSpeed(this.inPen);
        this.feet       = 0;
        this.path       = null;
        this.pathName   = null;
        this.pathStep   = 0;

    }

    /**
     * Switches the Ghost mode
     * @param {Number} oldMode
     * @param {Number} newMode
     * @param {Blob}   blob
     * @returns {Void}
     */
    switchMode(oldMode, newMode, blob) {
        if (!this.dontSwitch(oldMode)) {
            this.mode   = newMode;
            this.target = this.getTarget(blob);
            this.speed  = this.calcSpeed();

            if (!this.dontHalfTurn(oldMode)) {
                if (this.path === null) {
                    this.turn = {
                        x : this.dir.x * -1,
                        y : this.dir.y * -1
                    };
                } else {
                    this.turn = { x: 1, y: 0 };
                }
            }
        }
    }

    /**
     * Moves the Ghost
     * @param {Number} speed
     * @param {Blob}   blob
     * @param {Number} switchMode
     * @returns {Boolean}
     */
    move(speed, blob, switchMode) {
        let addToPen = false;
        this.x += this.dir.x * this.speed * speed;
        this.y += this.dir.y * this.speed * speed;

        if (this.path !== null) {
            addToPen = this.pathMove(blob, switchMode);
        } else {
            this.normalMove(blob);
        }

        this.moveFeet();
        this.draw();
        return addToPen;
    }

    /**
     * Moves the Ghost in a predefined path
     * @param {Blob}   blob
     * @param {Number} switchMode
     * @returns {Boolean}
     */
    pathMove(blob, switchMode) {
        const step = this.path[this.pathStep];
        if (this.passedDist) {
            if (this.dir.x) {
                this.x = step.targetX * Board.tileSize;
            }
            if (this.dir.y) {
                this.y = step.targetY * Board.tileSize;
            }

            if (step.next !== null) {
                this.pathStep = step.next;
                this.dir      = this.path[this.pathStep].dir;

            } else if (this.pathName === "exitPen") {
                this.path  = null;
                this.dir   = this.turn;
                this.turn  = null;
                this.speed = Data.getGhostSpeed(false);

            } else if (this.pathName === "enterPen") {
                this.mode       = switchMode;
                this.target     = this.getTarget(blob);
                this.tile       = Board.getGhostStartTile(false);
                this.tileCenter = Board.getTileXYCenter(this.tile);
                this.turn       = Board.getGhostStartTurn(true);
                return true;
            }
        }
        return false;
    }

    /**
     * Moves the Ghost around the board
     * @param {Blob} blob
     * @returns {Void}
     */
    normalMove(blob) {
        this.newTile(blob);
        this.x = Board.tunnelEnds(this.x);

        if (!this.center && this.passedCenter) {
            if (this.turn) {
                this.makeTurn();
            }
            if (this.isNextIntersection) {
                this.decideTurn();
            }
            this.speed  = this.calcSpeed();
            this.center = true;
        }
    }

    /**
     * The Ghost moved to a new Tile
     * @param {Blob} blob
     * @returns {Void}
     */
    newTile(blob) {
        const tile = Board.getTilePos(this.x, this.y);
        if (!Board.equalTiles(this.tile, tile)) {
            this.tile       = tile;
            this.tileCenter = Board.getTileXYCenter(this.tile);
            this.center     = false;

            if (this.isEnteringPen()) {
                this.setPath("enterPen");
            }
        }
    }



    /**
     * Sets the Path of the Ghost
     * @param {String} path
     * @returns {Void}
     */
    setPath(name) {
        this.pathName = name;
        this.pathStep = 0;
        this.path     = this.paths[this.pathName];
        this.dir      = this.path[this.pathStep].dir;
        this.speed    = Data.getPathSpeed(name);
    }

    /**
     * Returns true if the Ghost is entering the Pen
     * @returns {Boolean}
     */
    isEnteringPen() {
        return this.mode === "eyes" && Board.equalTiles(this.tile, Board.eyesTarget);
    }



    /**
     * The Ghost turns used the previously stored turn direction
     * @returns {Void}
     */
    makeTurn() {
        this.x    = this.tileCenter.x;
        this.y    = this.tileCenter.y;
        this.dir  = this.turn;
        this.turn = null;
    }

    /**
     * The Ghost decided which direction to do next depending on different factors
     * @returns {Void}
     */
    decideTurn() {
        const turns = this.getTurns();
        if (turns.length === 1) {
            this.turn = turns[0];
        } else if (Data.isFrighten(this.mode)) {
            this.turn = turns[Utils.rand(0, turns.length - 1)];
        } else {
            this.turn = this.getTargetTurn(turns);
        }
    }

    /**
     * Returns a list with all the possible turns a Ghost can do at an intersection
     * @returns {Array.<{x: Number, y: Number}>}
     */
    getTurns() {
        const tile   = this.nextTile;
        const pos    = Board.tileToString(tile);
        const turns  = Board.getTurns(pos);
        const result = [];

        turns.forEach((turn) => {
            if ((turn + 2) % 4 !== Board.dirToNumber(this.dir)) {
                result.push(Board.numberToDir(turn));
            }
        });
        return result;
    }

    /**
     * Decides the best turn depending on which cell after the intersection is closes to the target
     * @param {Array.<{x: Number, y: Number}>} turns
     * @returns {{x: Number, y: Number}}
     */
    getTargetTurn(turns) {
        const tile   = this.nextTile;
        let   best   = 999999;
        let   result = {};

        turns.forEach((turn) => {
            const ntile = Board.sumTiles(tile, turn);
            const distx = Math.pow(this.target.x - ntile.x, 2);
            const disty = Math.pow(this.target.y - ntile.y, 2);
            const dist  = Math.sqrt(distx + disty);

            if (dist < best) {
                best   = dist;
                result = turn;
            }
        });
        return result;
    }

    /**
     * Checks if the Ghost and the Blob are in the same tile and when those
     * are the same depending on the Ghost's mode, it can kill the blob or die
     * @param {{x: Number, y: Number}} blobTile
     * @returns {String}
     */
    killOrDie(blobTile) {
        if (Board.equalTiles(this.tile, blobTile) && !this.path) {
            if (Data.isFrighten(this.mode)) {
                this.mode   = "eyes";
                this.target = Board.eyesTarget;
                this.speed  = Data.eyesSpeed;
                return "kill";

            } else if (this.mode !== "eyes") {
                return "die";
            }
        }
    }

    /**
     * Returns true if the Ghost should change it's target
     * @param {Number} globalMode
     * @returns {Boolean}
     */
    shouldChangeTarget(globalMode) {
        return this.mode !== "eyes" && (globalMode === "chase" || this.isElroy());
    }

    /**
     * Don't let the Ghost change mode on certain cases
     * @param {Number} mode
     * @returns {Boolean}
     */
    dontSwitch(mode) {
        return (Data.isFrighten(mode) && !Data.isFrighten(this.mode)) || this.mode === "eyes";
    }

    /**
     * Don't let the Ghost half turn when switching from Blue to White mode
     * @param {Number} mode
     * @returns {Boolean}
     */
    dontHalfTurn(mode) {
        return mode === "blue" || mode === "white";
    }

    /**
     * Returns the Ghost's Speed based on diferent factors
     * @returns {Number}
     */
    calcSpeed() {
        let speed = Data.getGhostSpeed(false);
        if (this.mode === "eyes") {
            speed = Data.eyesSpeed;
        } else if (Data.isFrighten(this.mode)) {
            speed = Data.getLevelData("ghostFrightSpeed");
        } else if (Board.isTunnel(this.tile.x, this.tile.y)) {
            speed = Data.getLevelData("tunnelSpeed");
        } else if (this.isElroy()) {
            speed = Data.getLevelData(`elroySpeed${this.elroyMode}`);
        }
        return speed;
    }

    /**
     * Returns true if the Ghost moved past certain distance stored in the Path
     * @returns {Boolean}
     */
    get passedDist() {
        const path = this.path[this.pathStep];
        return (
            (this.dir.x ===  1 && this.x >= path.targetX * Board.tileSize) ||
            (this.dir.x === -1 && this.x <= path.targetX * Board.tileSize) ||
            (this.dir.y ===  1 && this.y >= path.targetY * Board.tileSize) ||
            (this.dir.y === -1 && this.y <= path.targetY * Board.tileSize)
        );
    }

    /**
     * Returns true if the Ghost passed the center of the tile
     * @returns {Boolean}
     */
    get passedCenter() {
        return (
            (this.dir.x ===  1 && this.x >= this.tileCenter.x) ||
            (this.dir.x === -1 && this.x <= this.tileCenter.x) ||
            (this.dir.y ===  1 && this.y >= this.tileCenter.y) ||
            (this.dir.y === -1 && this.y <= this.tileCenter.y)
        );
    }

    /**
     * Returns the next tile
     * @returns {{x: Number, y: Number}}
     */
    get nextTile() {
        return Board.sumTiles(this.tile, this.dir);
    }

    /**
     * Returns true if the next tile is an intersection
     * @returns {Boolean}
     */
    get isNextIntersection() {
        const tile = this.nextTile;
        return Board.isIntersection(tile.x, tile.y);
    }

    /**
     * Returns the Ghost's target depending on the current mode
     * @param {Blob} blob
     * @returns {{x: Number, y: Number}}
     */
    getTarget(blob) {
        if (this.mode === "chase" || this.isElroy()) {
            return this.chase(blob);
        }
        return this.scatter;
    }



    /**
     * Returns true if the Ghost is in "Cruise Elroy" Mode. Only used for Blinky
     * @returns {Boolean}
     */
    isElroy() {
        return false;
    }

    /**
     * Makes it possible for a Ghost to switch to "Cruise Elroy" Mode. Only used for Blinky
     * @returns {Void}
     */
    activateElroy() {
        return undefined;
    }

    /**
     * Increases the internal pills count of a Ghost
     * @returns {Void}
     */
    increaseDots() {
        this.dotsCount += 1;
    }

    /**
     * Sets the Chase target of the Ghost
     * @param {Blob} blob
     * @returns {Void}
     */
    setChaseTarget(blob) {
        this.target = this.chase(blob);
    }

    /**
     * Changes the Drawing for the Ghosts feet
     * @returns {Void}
     */
    moveFeet() {
        this.feet = (this.feet + 0.3) % 2;
    }



    /**
     * Draws the Ghost
     * @returns {Void}
     */
    draw() {
        const center = Board.ghostSize / 2;
        this.canvas.savePos(this.x, this.y);
        this.ctx.save();
        this.ctx.translate(Math.round(this.x) - center, Math.round(this.y) - center);

        this.ghostBody();
        if (Data.isFrighten(this.mode)) {
            this.ghostFrightenFace();
        } else {
            this.ghostNormalFace();
        }
        this.ctx.restore();
    }

    /**
     * Draws the Ghost's Body
     * @returns {Void}
     */
    ghostBody() {
        const nums = Board.numbers;

        this.ctx.fillStyle = this.bodyColor;
        this.ctx.beginPath();
        this.ctx.arc(nums.n8, nums.n8, nums.n8, Math.PI, 1.5 * Math.PI, false);
        this.ctx.arc(nums.n10, nums.n8, nums.n8, 1.5 * Math.PI, 2 * Math.PI, false);

        if (!Math.floor(this.feet)) {
            this.ghostFeet(true);
        } else {
            this.ghostFeet(false);
        }
        this.ctx.fill();
    }

    /**
     * Draws one of the variations of the Ghost's Feet
     * @param {Boolean} firstVariant
     * @returns {Void}
     */
    ghostFeet(firstVariant) {
        const nums   = Board.numbers;
        const first  = firstVariant ? nums.n16 : nums.n18;
        const second = firstVariant ? nums.n18 : nums.n16;

        this.ctx.lineTo(nums.n18, first);
        this.ctx.lineTo(nums.n15, second);
        this.ctx.lineTo(nums.n13, first);
        this.ctx.lineTo(nums.n11, second);
        this.ctx.lineTo(nums.n9, first);
        this.ctx.lineTo(nums.n7, second);
        this.ctx.lineTo(nums.n5, first);
        this.ctx.lineTo(nums.n3, second);
        this.ctx.lineTo(0, first);
        this.ctx.lineTo(0, nums.n8);
    }

    /**
     * Draws the Ghost's Face for the Chase/Scatter/Eyes modes
     * @returns {Void}
     */
    ghostNormalFace() {
        const nums = Board.numbers;

        this.ctx.fillStyle = "rgb(255, 255, 255)";
        this.ctx.beginPath();
        this.ctx.arc(nums.n6  + this.dir.x * nums.n2, nums.n7 + this.dir.y * nums.n2, nums.r1, 0, 2 * Math.PI);
        this.ctx.arc(nums.n12 + this.dir.x * nums.n2, nums.n7 + this.dir.y * nums.n2, nums.r1, 0, 2 * Math.PI);
        this.ctx.fill();

        this.ctx.fillStyle = "rgb(0, 51, 255)";
        this.ctx.beginPath();
        this.ctx.arc(nums.n6  + this.dir.x * nums.n4, nums.n7 + this.dir.y * nums.n4, nums.r2, 0, 2 * Math.PI);
        this.ctx.arc(nums.n12 + this.dir.x * nums.n4, nums.n7 + this.dir.y * nums.n4, nums.r2, 0, 2 * Math.PI);
        this.ctx.fill();
    }

    /**
     * Draws the Ghost's Face for the Frighten (Blue/White) modes
     * @returns {Void}
     */
    ghostFrightenFace() {
        const nums = Board.numbers;

        this.ctx.fillStyle = this.faceColor;
        this.ctx.beginPath();
        this.ctx.arc(nums.n6,  nums.n7, nums.r2, 0, 2 * Math.PI);
        this.ctx.arc(nums.n12, nums.n7, nums.r2, 0, 2 * Math.PI);
        this.ctx.fill();

        this.ctx.strokeStyle = this.faceColor;
        this.ctx.beginPath();
        this.ctx.moveTo(nums.n3, nums.n13);
        this.ctx.lineTo(nums.n5, nums.n11);
        this.ctx.lineTo(nums.n7, nums.n13);
        this.ctx.lineTo(nums.n9, nums.n11);
        this.ctx.lineTo(nums.n11, nums.n13);
        this.ctx.lineTo(nums.n13, nums.n11);
        this.ctx.lineTo(nums.n15, nums.n13);
        this.ctx.stroke();
    }

    /**
     * Returns the color for the Ghosts body depending on the mode
     * @returns {String}
     */
    get bodyColor() {
        switch (this.mode) {
        case "blue":
            return "rgb(0, 51, 255)";
        case "white":
            return "rgb(255, 255, 255)";
        case "eyes":
            return "rgb(0, 0, 0)";
        default:
            return this.color;
        }
    }

    /**
     * Returns the color used for the Ghosts face depending on the mode
     * @returns {String}
     */
    get faceColor() {
        return this.mode === "blue" ? "rgb(255, 255, 255)" : "rgb(255, 0, 0)";
    }
}
