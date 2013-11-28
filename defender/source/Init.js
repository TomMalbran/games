/*jslint browser: true */
/*global Board, Maps, Panel, Score, Towers, Mobs, Sounds, Utils */

(function () {
    "use strict";
    
    var score, maps, board, panel, towers, mobs, sounds,
        container, audio, animation, startTime, actions, shortcuts,
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
        soundStorage = "defender.sound",
        gameDisplay  = "mainScreen",
        gameMap      = "classic",
        gameLevel    = 0;
    
        
    
    /**
     * Request an animation frame
     */
    function requestAnimation() {
        startTime = new Date().getTime();
        animation = Utils.requestAnimationFrame(function () {
            var time  = new Date().getTime() - startTime,
                speed = time / 16,
                dec   = score.decTimer(time);
            
            towers.animate(time, speed);
            mobs.animate(time, speed, dec);
                
            if (gameDisplay === "playing") {
                requestAnimation();
            }
        });
    }
    
    /**
     * Cancel an animation frame
     */
    function cancelAnimation() {
        Utils.cancelAnimationFrame(animation);
    }
    
    
    /**
     * Adds the class to the design to show the Display
     */
    function showDisplay() {
        container.className = gameDisplay;
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
        gameDisplay = "gameOver";
        showDisplay();
        
        destroyGame();
        maps.saveScore(score.getLives(), score.getTotal());
        score.showFinal();
    }
    
    
    /**
     * Starts a new Game
     * @param {number} level
     */
    function newGame(level) {
        gameDisplay = "planning";
        gameLevel   = level;
        showDisplay();
        
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
        gameDisplay = "mainScreen";
        showDisplay();
    }
    
    /**
     * Shows the Maps selection Screen
     */
    function showMapSelection() {
        gameDisplay = "selectMap";
        showDisplay();
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
        gameDisplay = "selectLevel";
        gameMap     = maps.codeToMap(map);
        showDisplay();
    }
    
    /**
     * Show the Controls
     */
    function showControls() {
        gameDisplay = "controls";
        showDisplay();
    }
    
    
    /**
     * Start Playing
     */
    function startPlaying() {
        gameDisplay = "playing";
        showDisplay();
        
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
        if (gameDisplay === "planning") {
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
        gameDisplay = gameDisplay + "Paused";
        showDisplay();
        cancelAnimation();
    }
    
    /**
     * Ends the pause and continues planning
     */
    function continuePlanning() {
        gameDisplay = "planning";
        showDisplay();
    }
    
    /**
     * Ends the pause and continues playing
     */
    function continuePlaying() {
        gameDisplay = "playing";
        showDisplay();
        requestAnimation();
    }
    
    /**
     * Pause the Game
     */
    function pauseGame() {
        switch (gameDisplay) {
        case "planningPaused":
            continuePlanning();
            break;
        case "playingPaused":
            continuePlaying();
            break;
        default:
            startPause();
            towers.drop();
        }
    }
    
    /**
     * Toggles the sound on and off
     */
    function toggleSound() {
        sounds.toggle();
        audio.innerHTML = sounds.isMute() ? "Unmute" : "Mute";
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
            mainScreen  : function () { showMainScreen();       },
            selectMap   : function () { showMapSelection();     },
            lastMap     : function () { showLastMap();          },
            controls    : function () { showControls();         },
            selectLevel : function (d) { showLevelSelection(d); },
            newGame     : function (d) { newGame(d);            },
            pause       : function () { pauseGame();            },
            restart     : function () { restartGame();          },
            endGame     : function () { endGame();              },
            mute        : function () { toggleSound();          },
            next        : function () { nextWave();             },
            upgrade     : function () { towers.upgrade();       },
            fire        : function () { towers.fire();          },
            lock        : function () { towers.lock();          },
            sell        : function () { towers.sell();          },
            sellAll     : function () { towers.sellAll();       }
        };
    }
    
    /**
     * Creates a shortcut object
     */
    function createShortcuts() {
        var paused = {
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
                DN    : function (d) { towers.startBuilding(d);  },
                B     : function () { towers.buildTower();       },
                Left  : function () { towers.moveTower(-1, 0);   },
                Up    : function () { towers.moveTower(0, -1);   },
                Right : function () { towers.moveTower(1,  0);   },
                Down  : function () { towers.moveTower(0,  1);   },
                Home  : function () { towers.selectFirst();      },
                End   : function () { towers.selectLast();       },
                Z     : function () { towers.selectNextPrev(-1); },
                X     : function () { towers.selectNextPrev(+1); },
                PU    : function () { towers.selectNextPrev(-5); },
                PD    : function () { towers.selectNextPrev(+5); },
                Esc   : function () { endSelection();            }
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
                E  : function () { newGame(0); },
                N  : function () { newGame(1); },
                H  : function () { newGame(2); },
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
        container = document.querySelector("#container");
        audio     = document.querySelector(".audioButton");
        
        document.body.addEventListener("click", function (e) {
            var element = e.target;
            while (element.parentElement && !element.dataset.action) {
                element = element.parentElement;
            }
            
            if (actions[element.dataset.action]) {
                actions[element.dataset.action](element.dataset.data || undefined);
            }
        });
        
        document.addEventListener("keydown", function (event) {
            var dec, hexa,
                key  = event.keyCode,
                code = specialKeys[key] || String.fromCharCode(key),
                data = code;
            
            if (key >= 48 && key <= 57) {
                dec  = key - 48;
                hexa = dec;
            } else if (key >= 96 && key <= 105) {
                dec  = key - 96;
                hexa = dec;
            } else if (["A", "B", "C", "D", "E", "F"].indexOf(code) > -1) {
                hexa = code;
            }
            
            if (shortcuts[gameDisplay].HN && hexa !== undefined) {
                code = "HN";
                data = hexa;
            } else if (shortcuts[gameDisplay].DN && dec !== undefined) {
                code = "DN";
                data = dec;
            }
            
            if (shortcuts[gameDisplay][code]) {
                if (typeof shortcuts[gameDisplay][code] === "string") {
                    actions[shortcuts[gameDisplay][code]](data);
                } else {
                    shortcuts[gameDisplay][code](data);
                }
                event.preventDefault();
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
        
        maps   = new Maps.Maps();
        sounds = new Sounds(soundFiles, soundStorage, false);
        
        audio.innerHTML = sounds.isMute() ? "Unmute" : "Mute";
    }
    
    
    // Load the game
    window.addEventListener("load", function () { main(); }, false);

}());