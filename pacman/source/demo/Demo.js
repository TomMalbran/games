import BigBlob      from "./BigBlob.js";
import DemoBlob     from "./DemoBlob.js";
import DemoFood     from "./DemoFood.js";
import DemoGhost    from "./DemoGhost.js";
import Board        from "../board/Board.js";
import Blinky       from "../ghosts/Blinky.js";
import Pinky        from "../ghosts/Pinky.js";
import Inky         from "../ghosts/Inky.js";
import Clyde        from "../ghosts/Clyde.js";
import DemoData     from "./DemoData.js";



/**
 * Pacman Demo
 */
export default class Demo {

    /**
     * Pacman Demo constructor
     * @param {Board} board
     */
    constructor(board) {
        this.board   = board;
        this.level   = board.level;
        this.canvas  = board.screenCanvas;
        this.ctx     = this.canvas.ctx;

        this.step    = -1;
        this.name    = "";
        this.bigBlob = new BigBlob(this.board);
        this.food    = new DemoFood(this.board);

        this.nextAnimation();
    }



    /**
     * Destroys the current Demo and leaves it ready for the next start
     * @returns {Void}
     */
    destroy() {
        this.step    = -1;
        this.bigBlob = new BigBlob(this.board);

        this.canvas.clear();
        this.nextAnimation();
    }

    /**
     * Calls the animation the demo is at
     * @param {Number} time
     * @param {Number} speed
     * @returns {Void}
     */
    animate(time, speed) {
        switch (this.name) {
        case "title":
            this.titleAnimation(time);
            break;
        case "chase":
            this.chaseAnimation(speed);
            break;
        case "frighten":
            this.frightenAnimation(time, speed);
            break;
        case "present":
            this.presentAnimation(time, speed);
            break;
        }
    }

    /**
     * Jumps to the next animation in the demo
     * @returns {Void}
     */
    nextAnimation() {
        this.step  = this.step === DemoData.animations.length - 1 ? 1 : this.step + 1;
        this.name  = DemoData.animations[this.step];
        this.timer = 0;

        switch (this.name) {
        case "chase":
            this.initChase();
            break;
        case "frighten":
            this.initFrighten();
            break;
        case "present":
            this.initPresent();
            break;
        }
    }



    /**
     * The Title Animation
     * @param {Number} time
     * @returns {Void}
     */
    titleAnimation(time) {
        this.timer += time;
        const alpha = 1 - Math.round(10 * this.timer / DemoData.title.endTime) / 10;

        this.canvas.clear();
        this.bigBlob.animate(time);
        this.canvas.fill(alpha);

        if (this.timer > DemoData.title.endTime) {
            this.canvas.clear();
            this.drawTitle();
            this.bigBlob.endAnimation();
            this.nextAnimation();
        }
    }

    /**
     * Draws the Pacman title
     * @returns {Void}
     */
    drawTitle() {
        const left  = this.board.tileToPos(DemoData.title.leftText);
        const right = this.board.tileToPos(DemoData.title.rightText);

        this.ctx.save();
        this.ctx.font      = `6em "Whimsy TT"`;
        this.ctx.textAlign = "right";
        this.ctx.fillText("Pa", left.x, left.y);
        this.ctx.textAlign = "left";
        this.ctx.fillText("man", right.x, right.y);
        this.ctx.restore();
    }



    /**
     * Initializes the Players for the Chase animation
     * @returns {Void}
     */
    initChase() {
        const size = this.board.tileSize;
        const yPos = DemoData.chase.playersY * size;
        const dir  = DemoData.chase.playersDir;

        this.createPlayers();
        this.blob.chaseDemo(dir,       -size, yPos);
        this.blinky.chaseDemo(dir, -4 * size, yPos);
        this.pinky.chaseDemo(dir,  -6 * size, yPos);
        this.inky.chaseDemo(dir,   -8 * size, yPos);
        this.clyde.chaseDemo(dir, -10 * size, yPos);

        this.endPos = DemoData.chase.endTile * this.board.tileSize;
    }

    /**
     * Creates the Blob and the Ghosts
     * @returns {Void}
     */
    createPlayers() {
        this.blob   = new DemoBlob(this.board);
        this.blinky = new DemoGhost(this.board, Blinky.text, Blinky.color);
        this.pinky  = new DemoGhost(this.board, Pinky.text, Pinky.color);
        this.inky   = new DemoGhost(this.board, Inky.text, Inky.color);
        this.clyde  = new DemoGhost(this.board, Clyde.text, Clyde.color);

        this.ghosts = [ this.blinky, this.pinky, this.inky, this.clyde ];
    }

    /**
     * The Chase Animation
     * @param {Number} speed
     * @returns {Void}
     */
    chaseAnimation(speed) {
        this.animatePlayers(speed, true);

        if (this.blob.x >= this.endPos) {
            this.nextAnimation();
        }
    }



    /**
     * Initializes the Players for the Frighten animation
     * @returns {Void}
     */
    initFrighten() {
        const speed = this.level.getNumber("ghostFrightSpeed") * DemoData.frighten.speedMult;
        const dir   = DemoData.frighten.playersDir;

        this.blob.frightenDemo(dir);
        this.blinky.frightenDemo(dir, speed);
        this.pinky.frightenDemo(dir, speed);
        this.inky.frightenDemo(dir, speed);
        this.clyde.frightenDemo(dir, speed);

        this.scores = [];
        this.endPos = DemoData.frighten.endTile * this.board.tileSize;
    }

    /**
     * The Frighten Animation
     * @param {Number} time
     * @param {Number} speed
     * @returns {Void}
     */
    frightenAnimation(time, speed) {
        this.animatePlayers(speed);
        this.drawScores(time);

        if (this.ghosts.length > 0 && this.blob.x <= this.ghosts[0].x) {
            this.ghosts.shift();
            this.text = this.blob.x;
            this.scores.push({
                timer : 0,
                size  : 1,
                color : "rgb(51, 255, 255)",
                text  : this.level.getGhostScore(4 - this.ghosts.length),
                pos   : {
                    x : this.blob.x / this.board.tileSize,
                    y : DemoData.frighten.textTile,
                },
            });
        }
        if (this.blob.x < this.endPos) {
            this.nextAnimation();
        }
    }

    /**
     * Draws the Scores in the Canvas
     * @param {Number} time
     * @returns {Void}
     */
    drawScores(time) {
        this.scores.forEach((score, index) => {
            score.timer += time;
            score.size   = Math.min(0.2 + Math.round(score.timer * 100 / DemoData.chase.scoreInc) / 100, 1);

            if (score.timer < DemoData.chase.scoreTime) {
                this.canvas.drawText(score);
            } else {
                this.scores.splice(index, 1);
            }
        });
    }



    /**
     * Initializes the Players for the Present animation
     * @returns {Void}
     */
    initPresent() {
        this.blob = null;
        this.blinky.presentDemo(DemoData.present.dir);
        this.pinky.presentDemo(DemoData.present.dir);
        this.inky.presentDemo(DemoData.present.dir);
        this.clyde.presentDemo(DemoData.present.dir);

        this.ghosts   = [ this.blinky ];
        this.others   = [ this.pinky, this.inky, this.clyde ];
        this.count    = 4;
        this.presentX = DemoData.present.tile * this.board.tileSize;
        this.exitX    = this.board.width + this.board.tileSize;
    }

    /**
     * The Present Animation
     * @param {Number} time
     * @param {Number} speed
     * @returns {Void}
     */
    presentAnimation(time, speed) {
        if (this.timer <= 0) {
            this.animatePlayers(speed);

            if (this.count > 0 && this.ghosts[0].x > this.presentX) {
                this.drawName(this.ghosts[0]);
                if (this.others.length) {
                    this.ghosts.unshift(this.others[0]);
                    this.others.shift();
                }
                this.timer  = DemoData.present.timer;
                this.count -= 1;

            } else if (this.ghosts[this.ghosts.length - 1].x > this.exitX) {
                this.ghosts.pop();
                if (!this.ghosts.length) {
                    this.nextAnimation();
                }
            }

        } else {
            this.timer -= time;
        }
    }

    /**
     * Draws the Name of the given Ghost
     * @param {DemoGhost} ghost
     * @returns {Void}
     */
    drawName(ghost) {
        this.canvas.drawText({
            size  : 2,
            color : ghost.bodyColor,
            text  : `‘${ghost.name}’`,
            pos   : DemoData.present.namePos,
            align : null,
            alpha : null,
        });
    }



    /**
     * Animates all the players
     * @param {Number}   speed
     * @param {Boolean=} food
     * @returns {Void}
     */
    animatePlayers(speed, food) {
        this.canvas.clearSavedRects();

        if (food) {
            this.food.wink();
        }
        this.ghosts.forEach((ghost) => {
            ghost.demoAnimate(speed);
        });

        if (this.blob) {
            this.blob.animate(speed);
        }
    }
}
