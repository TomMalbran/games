(function () {
    "use strict";
    
    let display, level, sound, scores, keyboard,
        board, score, tetriminos,
        animation, startTime,
        soundFiles      = [ "pause", "crash", "drop", "line", "rotate", "end" ],
        tetriminoSize   = 2,
        maxInitialLevel = 10;
    
    
    
    /**
     * Destroys the game elements
     */
    function destroyGame() {
        board.clearElements();
        tetriminos.clearElements();
    }
    
    
    /**
     * Request an animation frame
     */
    function requestAnimation() {
        startTime = new Date().getTime();
        animation = window.requestAnimationFrame(() => {
            let time = new Date().getTime() - startTime;
            
            score.decTime(time);
            if (score.time < 0) {
                tetriminos.softDrop();
                score.resetTime();
            }
            keyboard.holdingKey();
            
            if (display.isPlaying() && !board.isWinking()) {
                requestAnimation();
            }
        });
    }
    
    /**
     * Cancel an animation frame
     */
    function cancelAnimation() {
        window.cancelAnimationFrame(animation);
    }
    
    
        
    /**
     * Show the Main Screen
     */
    function showMainScreen() {
        display.set("mainScreen").show();
    }
    
    /**
     * Pause the Game
     */
    function startPause() {
        display.set("paused").show();
        sound.pause();
        cancelAnimation();
    }
    
    /**
     * Unpause the Game
     */
    function endPause() {
        display.set("playing").hide();
        sound.pause();
        requestAnimation();
    }
    
    /**
     * Toggles the pause
     */
    function showPause() {
        if (display.isPaused()) {
            endPause();
        } else {
            startPause();
        }
    }
    
    /**
     * Finish the Game
     */
    function finishGame() {
        destroyGame();
        showMainScreen();
    }
    
    /**
     * Game Over
     */
    function showGameOver() {
        display.set("gameOver").show();
        sound.end();
        scores.setInput();
        destroyGame();
    }
    
    /**
     * Show the High Scores
     */
    function showHighScores() {
        display.set("highScores").show();
        scores.show();
    }
    
    /**
     * Saves the High Score
     */
    function saveHighScore() {
        if (scores.save(score.level, score.score)) {
            showHighScores();
        }
    }
    
    /**
     * Show the Help
     */
    function showHelp() {
        display.set("help").show();
    }
    
    
    
    /**
     * Called when a wink ends
     */
    function onWindEnd() {
        tetriminos.setHardDrop();
        requestAnimation();
    }
    
    /**
     * Starts a new game
     */
    function newGame() {
        display.set("playing").hide();
        keyboard.reset();
        
        board      = new Board(tetriminoSize, onWindEnd);
        score      = new Score(level.get(), maxInitialLevel);
        tetriminos = new Tetriminos(board, sound, score, tetriminoSize, showGameOver);
        
        requestAnimation();
    }
    
    
    /**
     * Creates the shortcuts functions
     * @return {Object}
     */
    function getShortcuts() {
        return {
            mainScreen : {
                O : () => newGame(),
                A : () => level.dec(),
                I : () => showHighScores(),
                D : () => level.inc(),
                H : () => showHelp(),
                M : () => sound.toggle()
            },
            paused : {
                P : () => endPause(),
                B : () => finishGame()
            },
            gameOver : {
                O : () => saveHighScore(),
                B : () => showMainScreen()
            },
            highScores : {
                B : () => showMainScreen(),
                R : () => scores.restore()
            },
            help : {
                B : () => showMainScreen()
            },
            playing : {
                C : () => tetriminos.hardDrop(),
                W : () => tetriminos.rotateRight(),
                A : () => tetriminos.moveLeft(),
                S : () => tetriminos.softDrop(),
                D : () => tetriminos.moveRight(),
                X : () => tetriminos.rotateRight(),
                Z : () => tetriminos.rotateLeft(),
                P : () => startPause(),
                M : () => sound.toggle()
            },
            number : (number) => {
                if (display.inMainScreen()) {
                    level.choose(number);
                }
            }
        };
    }
    
    /**
     * Stores the used DOM elements and initializes the Event Handlers
     */
    function initDomListeners() {
        document.body.addEventListener("click", (e) => {
            let element = Utils.getTarget(e),
                actions = {
                    decrease   : () => level.dec(),
                    increase   : () => level.inc(),
                    start      : () => newGame(),
                    mainScreen : () => showMainScreen(),
                    endPause   : () => endPause(),
                    pause      : () => showPause(),
                    finishGame : () => finishGame(),
                    highScores : () => showHighScores(),
                    help       : () => showHelp(),
                    save       : () => saveHighScore(),
                    restore    : () => scores.restore(),
                    sound      : () => sound.toggle()
                };
            
            if (actions[element.dataset.action]) {
                actions[element.dataset.action]();
            }
        });
    }
    
    /**
     * The main Function
     */
    function main() {
        initDomListeners();
        
        display  = new Display();
        level    = new Level(maxInitialLevel);
        sound    = new Sounds(soundFiles, "tetris.sound", true);
        scores   = new HighScores();
        keyboard = new Keyboard(display, scores, getShortcuts());
    }
    
    
    // Load the game
    window.addEventListener("load", main, false);
    
}());
