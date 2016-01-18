(function () {
    "use strict";
    
    let display, score, maps, board, panel, towers, mobs, sounds,
        audio, animation, startTime, actions, shortcuts,
        soundFiles = [
            "build", "upgrade", "sell", "blocking", "enter", "exit", "death", "shoot", "hit",
            "fast", "missile", "antiair", "frost", "earth", "ink", "snap", "laser"
        ],
        specialKeys = {
            "8"  : "BS",
            "27" : "Esc",
            "33" : "PD",
            "34" : "PU",
            "35" : "End",
            "36" : "Home",
            "37" : "Left",
            "38" : "Up",
            "39" : "Right",
            "40" : "Down"
        },
        gameMap   = "classic",
        gameLevel = 0;
    
        
    
    /**
     * Request an animation frame
     */
    function requestAnimation() {
        startTime = new Date().getTime();
        animation = window.requestAnimationFrame(() => {
            let time  = new Date().getTime() - startTime,
                speed = time / 16,
                dec   = score.decTimer(time);
            
            towers.animate(time, speed);
            mobs.animate(time, speed, dec);
                
            if (display.isPlaying()) {
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
     * Destroys the Game
     */
    function destroyGame() {
        cancelAnimation();
        board.destroy();
        towers.destroy();
    }
    
    /**
     * Shows the Game Over Screen
     */
    function showGameOver() {
        display.set("gameOver");
        destroyGame();
        maps.saveScore(score.getLives(), score.getTotal());
        score.showFinal();
    }
    
    
    /**
     * Starts a new Game
     * @param {number} level
     */
    function newGame(level) {
        display.set("planning");
        gameLevel = level;
        
        maps.saveMap(gameMap, gameLevel);
        
        score  = new Score(gameLevel, showGameOver);
        board  = new Board(gameMap);
        panel  = new Panel();
        mobs   = new Mobs(score, board, panel, sounds, gameLevel);
        towers = new Towers(score, board, panel, mobs, sounds);
    }
    
    /**
     * Show the Main Screen
     */
    function showMainScreen() {
        display.set("mainScreen");
    }
    
    /**
     * Shows the Maps selection Screen
     */
    function showMapSelection() {
        display.set("selectMap");
        maps.display();
    }
    
    /**
     * Play the last played Map
     */
    function showLastMap() {
        gameMap = maps.getMap() || gameMap;
        newGame(maps.getLevel() || gameLevel);
    }
    
    /**
     * Shows the Level Selection Screen
     * @param {string} map
     */
    function showLevelSelection(map) {
        display.set("selectLevel");
        gameMap = maps.codeToMap(map);
    }
    
    /**
     * Show the Controls
     */
    function showControls() {
        display.set("controls");
    }
    
    
    /**
     * Start Playing
     */
    function startPlaying() {
        display.set("playing");
        panel.gameStarted();
        board.gameStarted();
        towers.gameStarted();
        mobs.gameStarted();
        
        requestAnimation();
    }
    
    /**
     * Starts the Game and or sends the next wave
     */
    function nextWave() {
        if (display.isPlanning()) {
            startPlaying();
        } else {
            mobs.sendNextWave();
        }
    }
     
    
    /**
     * Start the Game Again
     */
    function restartGame() {
        destroyGame();
        newGame(gameLevel);
    }
    
    /**
     * Ends the current Game
     */
    function endGame() {
        destroyGame();
        showMainScreen();
    }
    
    
    /**
     * Starts the pause
     */
    function startPause() {
        display.setPause();
        cancelAnimation();
    }
    
    /**
     * Pause the Game
     */
    function pauseGame() {
        if (display.isPlanningPaused()) {
            display.set("planning");
        } else if (display.isPlayingPaused()) {
            display.set("playing");
            requestAnimation();
        } else {
            display.setPause();
            towers.drop();
            cancelAnimation();
        }
    }
    
    
    /**
     * Sets the text of the Audio button
     */
    function setAudioText() {
        audio.innerHTML = sounds.isMute() ? "Unmute" : "Mute";
    }
    
    /**
     * Toggles the sound on and off
     */
    function toggleSound() {
        sounds.toggle();
        setAudioText();
    }
    
    /**
     * Ends the tower selections and hides the descriptions
     */
    function endSelection() {
        towers.drop();
        panel.hide();
    }
    
    
    /**
     * Creates an actions object
     */
    function createActions() {
        actions = {
            mainScreen  : ()  => showMainScreen(),
            selectMap   : ()  => showMapSelection(),
            lastMap     : ()  => showLastMap(),
            controls    : ()  => showControls(),
            selectLevel : (d) => showLevelSelection(d),
            newGame     : (d) => newGame(d),
            pause       : ()  => pauseGame(),
            restart     : ()  => restartGame(),
            endGame     : ()  => endGame(),
            mute        : ()  => toggleSound(),
            next        : ()  => nextWave(),
            upgrade     : ()  => towers.upgrade(),
            fire        : ()  => towers.fire(),
            lock        : ()  => towers.lock(),
            sell        : ()  => towers.sell(),
            sellAll     : ()  => towers.sellAll()
        };
    }
    
    /**
     * Creates a shortcut object
     */
    function createShortcuts() {
        let paused = {
                P     : "pause",
                C     : "pause",
                R     : "restart",
                Q     : "endGame"
            },
            game = {
                P     : "pause",
                M     : "mute",
                N     : "next",
                U     : "upgrade",
                F     : "fire",
                L     : "lock",
                S     : "sell",
                A     : "sellAll",
                DN    : (d) => towers.startBuilding(d),
                B     : ()  => towers.buildTower(),
                Left  : ()  => towers.moveTower(-1, 0),
                Up    : ()  => towers.moveTower(0, -1),
                Right : ()  => towers.moveTower(1,  0),
                Down  : ()  => towers.moveTower(0,  1),
                Home  : ()  => towers.selectFirst(),
                End   : ()  => towers.selectLast(),
                Z     : ()  => towers.selectNextPrev(-1),
                X     : ()  => towers.selectNextPrev(+1),
                PU    : ()  => towers.selectNextPrev(-5),
                PD    : ()  => towers.selectNextPrev(+5),
                Esc   : ()  => endSelection()
            };
        
        shortcuts = {
            mainScreen : {
                N  : "selectMap",
                L  : "lastMap",
                C  : "controls"
            },
            selectMap : {
                HN : "selectLevel",
                BS : "mainScreen"
            },
            selectLevel : {
                E  : () => newGame(0),
                N  : () => newGame(1),
                H  : () => newGame(2),
                BS : "selectMap"
            },
            controls : {
                BS : "mainScreen"
            },
            gameOver : {
                N  : "mainScreen",
                BS : "mainScreen"
            },
            planning       : game,
            playing        : game,
            planningPaused : paused,
            playingPaused  : paused
        };
    }
    
    /**
     * Stores the used DOM elements and initializes the Event Handlers
     */
    function initDomListeners() {
        audio = document.querySelector(".audioButton");
        
        document.body.addEventListener("click", (e) => {
            let element = Utils.getTarget(e);
            if (actions[element.dataset.action]) {
                actions[element.dataset.action](element.dataset.data || undefined);
                e.preventDefault();
            }
        });
        
        document.addEventListener("keydown", (e) => {
            let dec, hexa,
                key  = e.keyCode,
                code = specialKeys[key] || String.fromCharCode(key),
                data = code;
            
            if (key >= 48 && key <= 57) {
                dec  = key - 48;
                hexa = dec;
            } else if (key >= 96 && key <= 105) {
                dec  = key - 96;
                hexa = dec;
            } else if ([ "A", "B", "C", "D", "E", "F" ].indexOf(code) > -1) {
                hexa = code;
            }
            
            if (shortcuts[display.get()].HN && hexa !== undefined) {
                code = "HN";
                data = hexa;
            } else if (shortcuts[display.get()].DN && dec !== undefined) {
                code = "DN";
                data = dec;
            }
            
            if (shortcuts[display.get()][code]) {
                if (typeof shortcuts[display.get()][code] === "string") {
                    actions[shortcuts[display.get()][code]](data);
                } else {
                    shortcuts[display.get()][code](data);
                }
                e.preventDefault();
            }
        });
    }
    
    /**
     * The main Function
     */
    function main() {
        createActions();
        createShortcuts();
        initDomListeners();
        
        display = new Display();
        maps    = new Maps();
        sounds  = new Sounds(soundFiles, "defender.sound", false);
        
        setAudioText();
    }
    
    
    // Load the game
    window.addEventListener("load", main, false);

}());
