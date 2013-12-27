/*jslint browser: true */
/*global Utils */

var Animations = (function () {
    "use strict";
    
    
    /**
     * @constructor
     * @private
     * The Animation Base Class
     */
    function Animation() {
        return undefined;
    }
    
    /**
     * Returns true if the animation hasn't ended
     * @param {number} time
     * @return {boolean}
     */
    Animation.prototype.isAnimating = function (time) {
        return this.endTime > time;
    };
    
    /**
     * Returns true if the game loop stops while the animation is running
     * @return {boolean}
     */
    Animation.prototype.blocksGameLoop = function () {
        return this.blocksGame;
    };
    
    /**
     * Does the Animation
     * @param {number} time
     */
    Animation.prototype.animate = function (time) {
        return undefined;
    };
    
    /**
     * Called when the animation ends
     */
    Animation.prototype.onEnd = function () {
        this.canvas.clearSavedRects();
        if (this.callback) {
            this.callback();
        }
    };
    
    
    
    /**
     * @constructor
     * @private
     * @extends {Animation}
     * The Ready Animation
     * @param {Canvas} canvas
     * @param {function} callback
     */
    function ReadyAnimation(canvas, callback) {
        this.canvas     = canvas;
        this.callback   = callback;
        this.blocksGame = true;
        this.endTime    = 3000;
        
        canvas.drawText({
            color: "rgb(255, 255, 51)",
            text:  "Ready!",
            pos:   { x: 14, y: 17.3 }
        });
    }
    
    ReadyAnimation.prototype = Object.create(Animation.prototype);
    ReadyAnimation.prototype.constructor = ReadyAnimation;
    ReadyAnimation.prototype.parentClass = Animation.prototype;
    
    
    
    /**
     * @constructor
     * @private
     * @extends {Animation}
     * The Paused Animation
     * @param {Canvas} canvas
     */
    function PausedAnimation(canvas) {
        this.canvas     = canvas;
        this.blocksGame = true;
        this.timePart   = 500;
        this.partDiv    = 5;
        this.maxSize    = 2.2;
        this.minSize    = 1.5;
    }
    
    PausedAnimation.prototype = Object.create(Animation.prototype);
    PausedAnimation.prototype.constructor = PausedAnimation;
    PausedAnimation.prototype.parentClass = Animation.prototype;
    
    /**
     * Returns true if the animation hasn't ended
     * @param {number} time
     * @return {boolean}
     */
    PausedAnimation.prototype.isAnimating = function (time) {
        return true;
    };
    
    /**
     * Animates the Paused text alternating sizes increases and decreases
     * @param {number} timer
     */
    PausedAnimation.prototype.animate = function (timer) {
        var time = timer % this.timePart,
            anim = Math.floor(timer / this.timePart) % 2,
            part = time * (this.maxSize - this.minSize) / this.timePart,
            size = anim ? this.maxSize - part : this.minSize + part;
        
        this.canvas.clear();
        this.canvas.fill(0.8);
        
        this.canvas.drawText({
            size  : size,
            color : "rgb(255, 255, 51)",
            text  : "Paused!",
            pos   : { x: 14, y: 17.3 },
            alpha : 0.8
        });
    };
    
    /**
     * Called when the animation ends
     */
    PausedAnimation.prototype.onEnd = function () {
        this.canvas.clear();
    };
    
    
    
    /**
     * @constructor
     * @private
     * @extends {Animation}
     * The Paused Animation
     * @param {Canvas}   canvas
     * @param {Blob}     blob
     * @param {function} callback
     */
    function DeathAnimation(canvas, blob, callback) {
        this.canvas     = canvas;
        this.ctx        = canvas.getContext();
        this.blob       = blob;
        this.callback   = callback;
        this.blocksGame = true;
        this.endTime    = 1350;
        this.x          = blob.getX();
        this.y          = blob.getY();
    }
    
    DeathAnimation.prototype = Object.create(Animation.prototype);
    DeathAnimation.prototype.constructor = DeathAnimation;
    DeathAnimation.prototype.parentClass = Animation.prototype;
    
    /**
     * Does the Death animation
     * @param {number} timer
     */
    DeathAnimation.prototype.animate = function (timer) {
        var count = Math.round(timer / 15);
        
        this.canvas.clearSavedRects();
        this.ctx.save();
        this.ctx.translate(this.x, this.y);
        
        if (timer < 750) {
            this.blob.drawDeath(this.ctx, count);
        } else if (timer < 1050) {
            this.blob.drawCircle(this.ctx, count - 50);
        } else {
            this.blob.drawCircle(this.ctx, count - 70);
        }
        
        this.ctx.restore();
        this.canvas.savePos(this.x, this.y);
    };
    
    
    
    /**
     * @constructor
     * @private
     * @extends {Animation}
     * The Game Over Animation
     * @param {Canvas}   canvas
     * @param {function} callback
     */
    function GameOverAnimation(canvas, callback) {
        this.canvas     = canvas;
        this.callback   = callback;
        this.blocksGame = true;
        this.endTime    = 2000;
    }
    
    GameOverAnimation.prototype = Object.create(Animation.prototype);
    GameOverAnimation.prototype.constructor = GameOverAnimation;
    GameOverAnimation.prototype.parentClass = Animation.prototype;
    
    /**
     * Does the Game Over animation
     * @param {number} timer
     */
    GameOverAnimation.prototype.animate = function (timer) {
        var size  = Math.round(this.endTime - timer) / 700,
            alpha = Math.round(this.endTime - timer) / 2000;
        
        this.canvas.clear();
        this.canvas.fill(0.8);
        
        this.canvas.drawText({
            size  : Math.max(2, size),
            color : "rgba(255, 0, 0, " + Math.max(0, alpha) + ")",
            text  : "Game Over",
            pos   : { x: 14, y: 17.3 },
            alpha : 0.8
        });
    };
    
    
    
    /**
     * @constructor
     * @private
     * @extends {Animation}
     * The Ghost Score Animation
     * @param {Canvas} canvas
     * @param {string} text
     * @param {{x: number, y: number}} pos
     */
    function GhostScoreAnimation(canvas, text, pos) {
        this.canvas     = canvas;
        this.text       = text;
        this.pos        = pos;
        this.blocksGame = true;
        this.endTime    = 1000;
    }
    
    GhostScoreAnimation.prototype = Object.create(Animation.prototype);
    GhostScoreAnimation.prototype.constructor = GhostScoreAnimation;
    GhostScoreAnimation.prototype.parentClass = Animation.prototype;
    
    /**
     * Does the Ghost Score animation
     * @param {number} timer
     */
    GhostScoreAnimation.prototype.animate = function (timer) {
        var size = Math.min(0.2 + Math.round(timer * 100 / 500) / 100, 1);
        
        this.canvas.clearSavedRects();
        this.canvas.drawText({
            size:  size,
            color: "rgb(51, 255, 255)",
            text:  this.text,
            pos:   this.pos
        });
        
        if (timer > 200) {
            this.blocksGame = false;
        }
    };
    
    
    
    
    /**
     * @constructor
     * The Animations Manager Class
     * @param {Board} board
     */
    function Animations(board) {
        this.board     = board;
        this.canvas    = board.getScreenCanvas();
        
        this.timer     = 0;
        this.animation = null;
    }
    
    /**
     * Returns true if there is an animation
     */
    Animations.prototype.isAnimating = function () {
        return this.animation !== null && this.animation.blocksGameLoop();
    };
    
    /**
     * Animates the current animation, if possible
     * @param {number} time
     */
    Animations.prototype.animate = function (time) {
        if (this.animation) {
            this.timer += time;
            
            if (this.animation.isAnimating(this.timer)) {
                this.animation.animate(this.timer);
            } else {
                this.endAnimation();
            }
        }
    };
    
    /**
     * Ends the current Animation
     */
    Animations.prototype.endAnimation = function () {
        var animation  = this.animation;
        this.timer     = 0;
        this.animation = null;
        animation.onEnd();
    };
    
    
    /**
     * Creates the Ready Animation
     * @param {function} callback
     */
    Animations.prototype.ready = function (callback) {
        this.animation = new ReadyAnimation(this.canvas, callback);
    };
    
    /**
     * Creates the Paused Animation
     */
    Animations.prototype.paused = function () {
        this.animation = new PausedAnimation(this.canvas);
    };
    
    /**
     * Creates the Blob's Death Animation
     * @param {Blob}     blob
     * @param {function} callback
     */
    Animations.prototype.death = function (blob, callback) {
        this.animation = new DeathAnimation(this.canvas, blob, callback);
    };
    
    /**
     * Creates the Game Over Animation
     * @param {function} callback
     */
    Animations.prototype.gameOver = function (callback) {
        this.animation = new GameOverAnimation(this.canvas, callback);
    };
    
    /**
     * Creates the Ghost Score Animation
     * @param {string} text
     * @param {{x: number, y: number}} pos
     */
    Animations.prototype.ghostScore = function (score, pos) {
        this.animation = new GhostScoreAnimation(this.canvas, score, pos);
    };
    
    
    /*
    // Start Animations
    Sequences.protptype.newLevel = function () {
        this.start("endLevel", "animation", { blinks: 0 });
    };
    
    Sequences.protptype.fruit = function () {
        this.start("fruit", "animation");
    };
    
    // Do Animations
    Sequences.protptype.endLevelAnim = function () {
        if (this.data.blinks < 10) {
            if (this.timer > 150) {
                this.board.getBoardCanvas().clear();
                this.board.drawBoard(this.data.blinks % 2 === 0);
                this.data.blinks += 1;
                this.timer = 0;
            }
        } else {
            pmFood.init();
            this.start("startLevel", 1);
        }
    };
    
    Sequences.protptype.startLevelAnim = function () {
        if (this.timer < 2000) {
            var pos = (Math.round(this.timer * 0.4) < 210 ? Math.round(this.timer * 0.4) - 30 : 180),
                lvl = (pmScore.getLevel() < 10 ? "0" : "") + pmScore.getLevel();
            
            this.canvas.drawText({
                color: "rgb(255,255,255)",
                align: "right",
                text:  "Level",
                pos:   { x: pos, y: 208 }
            });
            this.canvas.drawText({
                color: "rgb(255,255,51)",
                align: "left",
                text:  lvl,
                pos:   { x: this.board.getWidth() - pos + 30, y: 208 }
            });
        } else {
            this.end();
            pacman.animate();
        }
    };
    
    Sequences.protptype.fruitAnim = function () {
        if (this.timer < 200) {
            this.canvas.drawText({
                size:  12,
                color: "rgb(255, 184, 255)",
                text:  pmData.getLevel().fruitScore,
                pos:   pmData.fruitText
            });
        } else {
            this.start("fruit", "display");
        }
    };
    
    
    // Do Displays
    Sequences.protptype.fruitDisp = function () {
        if (this.timer < 2200) {
            var alpha = this.timer < 1000 ? 1 : 1 - Math.round((this.timer - 1000) * 1.25) / 2000;
            this.canvas.drawText({
                size:  12,
                color: "rgba(255, 184, 255, " + alpha + ")",
                text:  pmData.getLevel().fruitScore,
                pos:   pmData.fruitText
            });
        } else {
            this.canvas.clear();
            this.end();
        }
    };
    */
    
    
    
    // The public API
    return Animations;
}());