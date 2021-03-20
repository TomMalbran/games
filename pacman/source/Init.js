(function () {
    "use strict";

    let display, demo, animations, sounds, scores,
        score, food, fruit, ghosts, blob,
        animation, startTime, actions, shortcuts;



    /**
     * Calls the Game Over animation and then deletes the game data
     * @returns {Void}
     */
    function gameOver() {
        display.set("ready");
        animations.gameOver(() => {
            food   = null;
            fruit  = null;
            ghosts = null;
            blob   = null;

            Board.clearAll();
            display.set("gameOver").show();
            scores.setInput();
        });
    }

    /**
     * Creates the Blob and the Ghosts, and starts the Ready animation
     * @param {Boolean} newLife
     * @returns {Void}
     */
    function createPlayers(newLife) {
        ghosts = new Ghosts(newLife ? ghosts : null);
        blob   = new Blob();

        blob.draw();
        ghosts.draw();
        animations.ready(() => display.set("playing"));
    }


    /**
     * Called when the Blob enters a new tile
     * @returns {Void}
     */
    function blobEating() {
        const tile   = blob.getTile();
        const atPill = food.isAtPill(tile);

        if (atPill) {
            const value = food.eatPill(tile);
            const total = food.getLeftPills();

            fruit.add(total);
            score.pill(value);
            ghosts.resetPenTimer();
            ghosts.checkElroyDots(total);

            if (value === Data.energizerValue) {
                ghosts.frighten(blob);
            }
            sounds[blob.getSound()]();

        } else if (fruit.isAtPos(tile)) {
            const text = score.fruit();
            fruit.eat();
            animations.fruitScore(text, Board.fruitTile);
        }
        blob.onEat(atPill, ghosts.areFrighten());
    }

    /**
     * Called to do the crash etween a ghost and th blob
     * @returns {Void}
     */
    function ghostCrash() {
        ghosts.crash(blob.getTile(), (eyesCounter, tile) => {
            const text = score.kill(eyesCounter);
            animations.ghostScore(text, tile);
            sounds.kill();
        }, () => {
            Board.clearGame();
            animations.death(blob, newLife);
            sounds.death();
        });
    }


    /**
     * Called after the Blob dies
     * @returns {Void}
     */
    function newLife() {
        if (!score.died()) {
            gameOver();
        } else {
            display.set("ready");
            createPlayers(true);
        }
    }

    /**
     * Called after we get to a new level
     * @returns {Void}
     */
    function newLevel() {
        animations.newLevel(score.getLevel(), () => {
            food  = new Food();
            fruit = new Fruit();

            Board.clearGame();
            food.draw();
            score.draw();
            createPlayers(false);
        });
    }


    /**
     * Request an animation frame
     * @returns {Void}
     */
    function requestAnimation() {
        startTime = new Date().getTime();
        animation = window.requestAnimationFrame(() => {
            const time  = new Date().getTime() - startTime;
            const speed = time / 16;

            if (speed > 5) {
                return requestAnimation();
            }

            if (display.isMainScreen()) {
                demo.animate(time, speed);
            } else if (animations.isAnimating()) {
                animations.animate(time);
            } else if (display.isPlaying()) {
                Board.clearGame();
                food.wink();
                fruit.reduceTimer(time);
                ghosts.animate(time, speed, blob);
                const newTile = blob.animate(speed);
                animations.animate(time);

                if (newTile) {
                    ghosts.setTargets(blob);
                    blobEating();
                }
                if (food.getLeftPills() === 0) {
                    score.newLevel();
                    animations.endLevel(newLevel);
                }
                ghostCrash();
            }
            requestAnimation();
        });
    }

    /**
     * Cancel an animation frame
     * @returns {Void}
     */
    function cancelAnimation() {
        window.cancelAnimationFrame(animation);
    }


    /**
     * Starts a new Game
     * @returns {Void}
     */
    function newGame() {
        display.set("ready").show();
        cancelAnimation();

        score = new Score();
        food  = new Food();
        fruit = new Fruit();

        demo.destroy();
        Board.drawBoard();
        food.draw();
        score.draw();

        createPlayers(false);
        requestAnimation();
        sounds.start();
    }

    /**
     * Toggles the Game Pause
     * @returns {Void}
     */
    function togglePause() {
        if (display.isPaused()) {
            display.set("playing");
            animations.endAll();
        } else {
            display.set("paused");
            animations.paused();
        }
    }

    /**
     * Show the High Scores
     * @returns {Void}
     */
    function showHighScores() {
        display.set("highScores").show();
        scores.show();
    }

    /**
     * Saves the High Score
     * @returns {Void}
     */
    function saveHighScore() {
        if (scores.save(score.getLevel(), score.getScore())) {
            showHighScores();
        }
    }



    /**
     * Creates a shortcut object
     * @returns {Void}
     */
    function createActionsShortcuts() {
        actions = {
            play       : () => newGame(),
            highScores : () => showHighScores(),
            help       : () => display.set("help").show(),
            sound      : () => sounds.toggle(),
            save       : () => saveHighScore(),
            retore     : () => scores.restore(),
            mainScreen : () => display.set("mainScreen").show()
        };

        shortcuts = {
            mainScreen : {
                Enter : "play",
                Down  : "play",
                H     : "highScores",
                C     : "help",
                M     : "sound"
            },
            playing : {
                P     : () => togglePause(),
                M     : () => sounds.toggle(),
                Left  : () => blob.makeTurn({ x: -1, y:  0 }),
                Up    : () => blob.makeTurn({ x:  0, y: -1 }),
                Right : () => blob.makeTurn({ x:  1, y:  0 }),
                Down  : () => blob.makeTurn({ x:  0, y:  1 })
            },
            paused : {
                P     : () => togglePause()
            },
            gameOver : {
                Enter : () => saveHighScore(),
                B     : () => display.set("mainScreen").show()
            },
            highScores : {
                B     : () => display.set("mainScreen").show(),
                R     : () => scores.restore()
            },
            help : {
                B     : () => display.set("mainScreen").show()
            }
        };
    }

    /**
     * Stores the used DOM elements and initializes the Event Handlers
     * @returns {Void}
     */
    function initDomListeners() {
        const specialKeys = {
            "8"  : "BS",
            "13" : "Enter",
            "37" : "Left",
            "65" : "Left",
            "38" : "Up",
            "87" : "Up",
            "39" : "Right",
            "68" : "Right",
            "40" : "Down",
            "83" : "Down"
        };

        document.body.addEventListener("click", (e) => {
            const element = Utils.getTarget(e);
            if (actions[element.dataset.action]) {
                actions[element.dataset.action](element.dataset.data || undefined);
                e.preventDefault();
            }
        });

        document.addEventListener("keydown", (e) => {
            const key  = e.keyCode;
            const code = specialKeys[key] || String.fromCharCode(key);

            if (shortcuts[display.get()] && shortcuts[display.get()][code]) {
                if (typeof shortcuts[display.get()][code] === "string") {
                    actions[shortcuts[display.get()][code]]();
                } else {
                    shortcuts[display.get()][code]();
                }
                e.preventDefault();
            }
        });
    }

    /**
     * Destroys the demo when the display changes
     * @returns {Void}
     */
    function onShow() {
        if (!display.isMainScreen()) {
            demo.destroy();
        }
    }

    /**
     * The main Function
     * @returns {Void}
     */
    function main() {
        Board.create();
        display    = new Display(onShow);
        demo       = new Demo();
        animations = new Animations();
        sounds     = new Sounds([ "start", "death", "eat1", "eat2", "kill" ], "pacman.sound", true);
        scores     = new HighScores();

        createActionsShortcuts();
        initDomListeners();
        requestAnimation();
    }


    // Load the game
    window.addEventListener("load", main, false);

}());
