/*jslint browser: true */
/*global Board, Demo, Animations, Score, Food, Ghosts, Blob, Sounds, Utils */

(function () {
    "use strict";
    
    var board, demo, animations, sounds, score, food, ghosts, blob,
        container, audio, animation, startTime, actions, shortcuts,
        soundFiles  = [ "start", "death", "eat1", "eat2", "kill" ],
        specialKeys = {
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
        },
        soundStorage = "pacman.sound",
        gameDisplay  = "mainScreen";
    
    
    
    /**
     * Returns true if the game is in a playing mode
     * @return {boolean}
     */
    function isPlaying() {
		return ["ready", "playing", "paused"].indexOf(gameDisplay) > -1;
	}
    
    /**
     * Returns true if the game is paused
     * @return {boolean}
     */
    function isPaused() {
		return gameDisplay === "paused";
	}
    
    /**
     * Adds the class to the design to show the Display
     */
    function showDisplay() {
        container.className = gameDisplay;
    }
    
    
    
    function gameOver() {
        gameDisplay = "ready";
        animations.gameOver(function () {
            gameDisplay = "mainScreen";
            score       = null;
            food        = null;
            ghosts      = null;
            blob        = null;
            board.clearAll();
            showDisplay();
        });
    }
    
    /**
     * Creates the Blob and the Ghosts, and starts the Ready animation
     * @param {boolean} newLife
     */
    function createPlayers(newLife) {
        ghosts = new Ghosts.Manager(board, score, newLife ? ghosts : null);
        blob   = new Blob(board, score, food, ghosts, sounds);
        
        blob.draw();
        ghosts.drawGhosts();
        
        animations.ready(function () {
            gameDisplay = "playing";
        });
    }
    
    function newLife() {
        if (!score.died()) {
            gameOver();
        } else {
            gameDisplay = "ready";
            createPlayers(true);
        }
    }
    
    
    /**
     * Request an animation frame
     */
    function requestAnimation() {
        startTime = new Date().getTime();
        animation = Utils.requestAnimationFrame(function () {
            var time  = new Date().getTime() - startTime,
                speed = time / 16;
            
            if (speed > 5) {
                return requestAnimation();
            }
            
            if (!isPlaying()) {
                demo.animate(time, speed);
            } else if (animations.isAnimating()) {
                animations.animate(time);
            } else {
                board.clearGame();
                food.wink();
                ghosts.animate(time, speed, blob);
                blob.animate(speed);
                animations.animate(time);
                
                if (ghosts.crash(blob)) {
                    board.clearGame();
                    sounds.death();
                    animations.death(blob, function () {
                        newLife();
                    });
                }
            }
            
            requestAnimation();
        });
    }
    
    /**
     * Cancel an animation frame
     */
    function cancelAnimation() {
        Utils.cancelAnimationFrame(animation);
    }
   
    
    /**
     * Starts a new Game
     */
    function newGame() {
        gameDisplay = "ready";
        cancelAnimation();
        
        score  = new Score(board, sounds, animations);
        food   = new Food(board);
        
        demo.destroy();
        board.drawBoard();
        food.draw();
        score.draw();
        
        createPlayers(false);
        showDisplay();
        requestAnimation();
        sounds.start();
    }
    
    /**
     * Toggles the Game Pause
     */
    function togglePause() {
        if (isPaused()) {
			gameDisplay = "playing";
			animations.endAnimation();
        } else {
			gameDisplay = "paused";
			animations.paused();
        }
    }
    
    
    
    /**
     * Creates a shortcut object
     */
    function createActionsShortcuts() {
        actions = {
            play  : function () { newGame();       },
            sound : function () { sounds.toggle(); }
        };
        
        shortcuts = {
            mainScreen : {
                Enter : "play",
                S     : "highScores",
                Help  : "controls",
                M     : "sound"
            },
            playing : {
                P     : function () { togglePause();   },
                M     : function () { sounds.toggle(); },
                Left  : function () { blob.makeTurn({ x: -1, y:  0 }); },
                Up    : function () { blob.makeTurn({ x:  0, y: -1 }); },
                Right : function () { blob.makeTurn({ x:  1, y:  0 }); },
                Down  : function () { blob.makeTurn({ x:  0, y:  1 }); }
            },
            paused : {
                P : function () { togglePause(); }
            }
        };
    }
    
    /**
     * Stores the used DOM elements and initializes the Event Handlers
     */
    function initDomListeners() {
        container = document.querySelector("#container");
        
        document.body.addEventListener("click", function (e) {
            var element = e.target;
            while (element.parentElement && !element.dataset.action) {
                element = element.parentElement;
            }
            
            if (actions[element.dataset.action]) {
                actions[element.dataset.action](element.dataset.data || undefined);
                event.preventDefault();
            }
        });
        
        document.addEventListener("keydown", function (event) {
            var key  = event.keyCode,
                code = specialKeys[key] || String.fromCharCode(key);
            
            if (shortcuts[gameDisplay] && shortcuts[gameDisplay][code]) {
                if (typeof shortcuts[gameDisplay][code] === "string") {
                    actions[shortcuts[gameDisplay][code]]();
                } else {
                    shortcuts[gameDisplay][code]();
                }
                event.preventDefault();
            }
        });
    }
    
    /**
     * The main Function
     */
    function main() {
        board      = new Board();
        demo       = new Demo(board);
        animations = new Animations(board);
        sounds     = new Sounds(soundFiles, soundStorage);
        
        createActionsShortcuts();
        initDomListeners();
        requestAnimation();
    }
    
    
    // Load the game
    window.addEventListener("load", function () { main(); }, false);
    
}());