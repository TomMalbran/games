/**
 * The Animations Manager Class
 */
class Animations {

    /**
     * The Animations Manager constructor
     */
    constructor() {
        this.canvas     = Board.screenCanvas;
        this.animations = [];
    }



    /**
     * Returns true if there is an animation
     * @returns {Boolean}
     */
    get isAnimating() {
        return this.animations.length &&
            this.animations.some((anim) => anim.blocksGame);
    }

    /**
     * Animates the current animation, if possible
     * @param {Number} time
     * @returns {Void}
     */
    animate(time) {
        if (this.animations.length) {
            this.animations.forEach((animation, index, object) => {
                animation.incTimer(time);
                if (animation.isAnimating) {
                    animation.animate();
                } else {
                    animation.onEnd();
                    object.splice(index, 1);
                }
            });
        }
    }

    /**
     * Ends all the Animations
     * @returns {Void}
     */
    endAll() {
        this.animations.forEach((anim) => anim.onEnd());
        this.animations = [];
    }

    /**
     * Adds a new animation
     * @param {Animation} animation
     * @returns {Void}
     */
    add(animation) {
        this.animations.push(animation);
    }



    /**
     * Creates the Ready Animation
     * @param {Function} callback
     * @returns {Void}
     */
    ready(callback) {
        this.add(new ReadyAnimation(this.canvas, callback));
    }

    /**
     * Creates the Paused Animation
     * @returns {Void}
     */
    paused() {
        this.add(new PausedAnimation(this.canvas));
    }

    /**
     * Creates the Blob's Death Animation
     * @param {Blob}     blob
     * @param {Function} callback
     * @returns {Void}
     */
    death(blob, callback) {
        this.add(new DeathAnimation(this.canvas, blob, callback));
    }

    /**
     * Creates the Game Over Animation
     * @param {Function} callback
     * @returns {Void}
     */
    gameOver(callback) {
        this.add(new GameOverAnimation(this.canvas, callback));
    }

    /**
     * Creates the Ghost Score Animation
     * @param {String} text
     * @param {{x: Number, y: Number}} pos
     * @returns {Void}
     */
    ghostScore(score, pos) {
        this.add(new GhostScoreAnimation(this.canvas, score, pos));
    }

    /**
     * Creates the Fruit Score Animation
     * @param {String} text
     * @param {{x: Number, y: Number}} pos
     * @returns {Void}
     */
    fruitScore(score, pos) {
        this.add(new FruitScoreAnimation(this.canvas, score, pos));
    }

    /**
     * Creates the End Level Animation
     * @param {Function} callback
     * @returns {Void}
     */
    endLevel(callback) {
        this.add(new EndLevelAnimation(callback));
    }

    /**
     * Creates the New Level Animation
     * @param {Number}   level
     * @param {Function} callback
     * @returns {Void}
     */
    newLevel(level, callback) {
        this.add(new NewLevelAnimation(this.canvas, level, callback));
    }
}
