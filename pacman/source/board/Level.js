// Level Data
const levelsData = [
    { // 1
        ghostSpeed        : 0.75,                           // Normal Ghost speed
        tunnelSpeed       : 0.4,                            // Ghost speed in the tunel
        pmSpeed           : 0.8,                            // Normal Pacman speed
        eatingSpeed       : 0.71,                           // Pacman speed while eating
        ghostFrightSpeed  : 0.5,                            // Ghost speed in Fright mode
        pmFrightSpeed     : 0.9,                            // Pacman speed in Fright mode
        eatingFrightSpeed : 0.79,                           // Pacman speed in Fright mode while eating
        elroyDotsLeft1    : 20,                             // How many dots left before Blinky "Cruise Elroy" mode 1
        elroySpeed1       : 0.8,                            // The speed of Blinky "Cruise Elroy" mode 1
        elroyDotsLeft2    : 10,                             // How many dots left before Blinky "Cruise Elroy" mode 2
        elroySpeed2       : 0.85,                           // The speed of Blinky "Cruise Elroy" mode 2
        fruitType         : 1,                              // The type of fruit for this level
        fruitScore        : 100,                            // The score when catching a fruit
        frightTime        : 6,                              // The fright mode time
        frightBlinks      : 5,                              // The amount of blinks before turning back
        switchTimes       : [ 7, 20, 7, 20, 5, 20, 5, 1 ],  // The times between scatter, chase, scatter... modes
        penForceTime      : 4,                              // The time after a ghost leaves the pen while the pacman is not eating dots
        penLeavingLimit   : [ 0, 0, 30, 60 ]                // Amount of dots before each ghost leaves the pen
    },
    { // 2
        ghostSpeed        : 0.85,
        tunnelSpeed       : 0.45,
        pmSpeed           : 0.9,
        eatingSpeed       : 0.79,
        ghostFrightSpeed  : 0.55,
        pmFrightSpeed     : 0.95,
        eatingFrightSpeed : 0.83,
        elroyDotsLeft1    : 30,
        elroySpeed1       : 0.9,
        elroyDotsLeft2    : 15,
        elroySpeed2       : 0.95,
        fruitType         : 2,
        fruitScore        : 300,
        frightTime        : 5,
        frightBlinks      : 5,
        switchTimes       : [ 7, 20, 7, 20, 5, 1033, 1 / 60, 1 ],
        penForceTime      : 4,
        penLeavingLimit   : [ 0, 0, 0, 50 ]
    },
    { // 3
        ghostSpeed        : 0.85,
        tunnelSpeed       : 0.45,
        pmSpeed           : 0.9,
        eatingSpeed       : 0.79,
        ghostFrightSpeed  : 0.55,
        pmFrightSpeed     : 0.95,
        eatingFrightSpeed : 0.83,
        elroyDotsLeft1    : 40,
        elroySpeed1       : 0.9,
        elroyDotsLeft2    : 20,
        elroySpeed2       : 0.95,
        fruitType         : 3,
        fruitScore        : 500,
        frightTime        : 4,
        frightBlinks      : 5,
        switchTimes       : [ 7, 20, 7, 20, 5, 1033, 1 / 60, 1 ],
        penForceTime      : 4,
        penLeavingLimit   : [ 0, 0, 0, 0 ]
    },
    { // 4
        ghostSpeed        : 0.85,
        tunnelSpeed       : 0.45,
        pmSpeed           : 0.9,
        eatingSpeed       : 0.79,
        ghostFrightSpeed  : 0.55,
        pmFrightSpeed     : 0.95,
        eatingFrightSpeed : 0.83,
        elroyDotsLeft1    : 40,
        elroySpeed1       : 0.9,
        elroyDotsLeft2    : 20,
        elroySpeed2       : 0.95,
        fruitType         : 3,
        fruitScore        : 500,
        frightTime        : 3,
        frightBlinks      : 5,
        switchTimes       : [ 7, 20, 7, 20, 5, 1033, 1 / 60, 1 ],
        penForceTime      : 4,
        penLeavingLimit   : [ 0, 0, 0, 0 ]
    },
    { // 5
        ghostSpeed        : 0.95,
        tunnelSpeed       : 0.5,
        pmSpeed           : 1,
        eatingSpeed       : 0.87,
        ghostFrightSpeed  : 0.6,
        pmFrightSpeed     : 1,
        eatingFrightSpeed : 0.87,
        elroyDotsLeft1    : 40,
        elroySpeed1       : 1,
        elroyDotsLeft2    : 20,
        elroySpeed2       : 10.05,
        fruitType         : 4,
        fruitScore        : 700,
        frightTime        : 2,
        frightBlinks      : 5,
        switchTimes       : [ 5, 20, 5, 20, 5, 1037, 1 / 60, 1 ],
        penForceTime      : 3,
        penLeavingLimit   : [ 0, 0, 0, 0 ]
    },
    { // 6
        ghostSpeed        : 0.95,
        tunnelSpeed       : 0.5,
        pmSpeed           : 1,
        eatingSpeed       : 0.87,
        ghostFrightSpeed  : 0.6,
        pmFrightSpeed     : 1,
        eatingFrightSpeed : 0.87,
        elroyDotsLeft1    : 50,
        elroySpeed1       : 1,
        elroyDotsLeft2    : 25,
        elroySpeed2       : 10.05,
        fruitType         : 4,
        fruitScore        : 700,
        frightTime        : 5,
        frightBlinks      : 5,
        switchTimes       : [ 5, 20, 5, 20, 5, 1037, 1 / 60, 1 ],
        penForceTime      : 3,
        penLeavingLimit   : [ 0, 0, 0, 0 ]
    },
    { // 7
        ghostSpeed        : 0.95,
        tunnelSpeed       : 0.5,
        pmSpeed           : 1,
        eatingSpeed       : 0.87,
        ghostFrightSpeed  : 0.6,
        pmFrightSpeed     : 1,
        eatingFrightSpeed : 0.87,
        elroyDotsLeft1    : 50,
        elroySpeed1       : 1,
        elroyDotsLeft2    : 25,
        elroySpeed2       : 1.05,
        fruitType         : 5,
        fruitScore        : 1000,
        frightTime        : 2,
        frightBlinks      : 5,
        switchTimes       : [ 5, 20, 5, 20, 5, 1037, 1 / 60, 1 ],
        penForceTime      : 3,
        penLeavingLimit   : [ 0, 0, 0, 0 ]
    },
    { // 8
        ghostSpeed        : 0.95,
        tunnelSpeed       : 0.5,
        pmSpeed           : 1,
        eatingSpeed       : 0.87,
        ghostFrightSpeed  : 0.6,
        pmFrightSpeed     : 1,
        eatingFrightSpeed : 0.87,
        elroyDotsLeft1    : 50,
        elroySpeed1       : 1,
        elroyDotsLeft2    : 25,
        elroySpeed2       : 1.05,
        fruitType         : 5,
        fruitScore        : 1000,
        frightTime        : 2,
        frightBlinks      : 5,
        switchTimes       : [ 5, 20, 5, 20, 5, 1037, 1 / 60, 1 ],
        penForceTime      : 3,
        penLeavingLimit   : [ 0, 0, 0, 0 ]
    },
    { // 9
        ghostSpeed        : 0.95,
        tunnelSpeed       : 0.5,
        pmSpeed           : 1,
        eatingSpeed       : 0.87,
        ghostFrightSpeed  : 0.6,
        pmFrightSpeed     : 1,
        eatingFrightSpeed : 0.87,
        elroyDotsLeft1    : 60,
        elroySpeed1       : 1,
        elroyDotsLeft2    : 30,
        elroySpeed2       : 1.05,
        fruitType         : 6,
        fruitScore        : 2000,
        frightTime        : 1,
        frightBlinks      : 3,
        switchTimes       : [ 5, 20, 5, 20, 5, 1037, 1 / 60, 1 ],
        penForceTime      : 3,
        penLeavingLimit   : [ 0, 0, 0, 0 ]
    },
    { // 10
        ghostSpeed        : 0.95,
        tunnelSpeed       : 0.5,
        pmSpeed           : 1,
        eatingSpeed       : 0.87,
        ghostFrightSpeed  : 0.6,
        pmFrightSpeed     : 1,
        eatingFrightSpeed : 0.87,
        elroyDotsLeft1    : 60,
        elroySpeed1       : 1,
        elroyDotsLeft2    : 30,
        elroySpeed2       : 1.05,
        fruitType         : 6,
        fruitScore        : 2000,
        frightTime        : 5,
        frightBlinks      : 5,
        switchTimes       : [ 5, 20, 5, 20, 5, 1037, 1 / 60, 1 ],
        penForceTime      : 3,
        penLeavingLimit   : [ 0, 0, 0, 0 ]
    },
    { // 11
        ghostSpeed        : 0.95,
        tunnelSpeed       : 0.5,
        pmSpeed           : 1,
        eatingSpeed       : 0.87,
        ghostFrightSpeed  : 0.6,
        pmFrightSpeed     : 1,
        eatingFrightSpeed : 0.87,
        elroyDotsLeft1    : 60,
        elroySpeed1       : 1,
        elroyDotsLeft2    : 30,
        elroySpeed2       : 1.05,
        fruitType         : 7,
        fruitScore        : 3000,
        frightTime        : 2,
        frightBlinks      : 5,
        switchTimes       : [ 5, 20, 5, 20, 5, 1037, 1 / 60, 1 ],
        penForceTime      : 3,
        penLeavingLimit   : [ 0, 0, 0, 0 ]
    },
    { // 12
        ghostSpeed        : 0.95,
        tunnelSpeed       : 0.5,
        pmSpeed           : 1,
        eatingSpeed       : 0.87,
        ghostFrightSpeed  : 0.6,
        pmFrightSpeed     : 1,
        eatingFrightSpeed : 0.87,
        elroyDotsLeft1    : 80,
        elroySpeed1       : 1,
        elroyDotsLeft2    : 40,
        elroySpeed2       : 1.05,
        fruitType         : 7,
        fruitScore        : 3000,
        frightTime        : 1,
        frightBlinks      : 3,
        switchTimes       : [ 5, 20, 5, 20, 5, 1037, 1 / 60, 1 ],
        penForceTime      : 3,
        penLeavingLimit   : [ 0, 0, 0, 0 ]
    },
    { // 13
        ghostSpeed        : 0.95,
        tunnelSpeed       : 0.5,
        pmSpeed           : 1,
        eatingSpeed       : 0.87,
        ghostFrightSpeed  : 0.6,
        pmFrightSpeed     : 1,
        eatingFrightSpeed : 0.87,
        elroyDotsLeft1    : 80,
        elroySpeed1       : 1,
        elroyDotsLeft2    : 40,
        elroySpeed2       : 1.05,
        fruitType         : 8,
        fruitScore        : 5000,
        frightTime        : 1,
        frightBlinks      : 3,
        switchTimes       : [ 5, 20, 5, 20, 5, 1037, 1 / 60, 1 ],
        penForceTime      : 3,
        penLeavingLimit   : [ 0, 0, 0, 0 ]
    },
    { // 14
        ghostSpeed        : 0.95,
        tunnelSpeed       : 0.5,
        pmSpeed           : 1,
        eatingSpeed       : 0.87,
        ghostFrightSpeed  : 0.6,
        pmFrightSpeed     : 1,
        eatingFrightSpeed : 0.87,
        elroyDotsLeft1    : 80,
        elroySpeed1       : 1,
        elroyDotsLeft2    : 40,
        elroySpeed2       : 1.05,
        fruitType         : 8,
        fruitScore        : 5000,
        frightTime        : 3,
        frightBlinks      : 5,
        switchTimes       : [ 5, 20, 5, 20, 5, 1037, 1 / 60, 1 ],
        penForceTime      : 3,
        penLeavingLimit   : [ 0, 0, 0, 0 ]
    },
    { // 15
        ghostSpeed        : 0.95,
        tunnelSpeed       : 0.5,
        pmSpeed           : 1,
        eatingSpeed       : 0.87,
        ghostFrightSpeed  : 0.6,
        pmFrightSpeed     : 1,
        eatingFrightSpeed : 0.87,
        elroyDotsLeft1    : 100,
        elroySpeed1       : 1,
        elroyDotsLeft2    : 50,
        elroySpeed2       : 1.05,
        fruitType         : 8,
        fruitScore        : 5000,
        frightTime        : 1,
        frightBlinks      : 3,
        switchTimes       : [ 5, 20, 5, 20, 5, 1037, 1 / 60, 1 ],
        penForceTime      : 3,
        penLeavingLimit   : [ 0, 0, 0, 0 ]
    },
    { // 16
        ghostSpeed        : 0.95,
        tunnelSpeed       : 0.5,
        pmSpeed           : 1,
        eatingSpeed       : 0.87,
        ghostFrightSpeed  : 0.6,
        pmFrightSpeed     : 1,
        eatingFrightSpeed : 0.87,
        elroyDotsLeft1    : 100,
        elroySpeed1       : 1,
        elroyDotsLeft2    : 50,
        elroySpeed2       : 1.05,
        fruitType         : 8,
        fruitScore        : 5000,
        frightTime        : 1,
        frightBlinks      : 3,
        switchTimes       : [ 5, 20, 5, 20, 5, 1037, 1 / 60, 1 ],
        penForceTime      : 3,
        penLeavingLimit   : [ 0, 0, 0, 0 ]
    },
    { // 17
        ghostSpeed        : 0.95,
        tunnelSpeed       : 0.5,
        pmSpeed           : 1,
        eatingSpeed       : 0.87,
        ghostFrightSpeed  : 0.6,
        pmFrightSpeed     : 1,
        eatingFrightSpeed : 0.87,
        elroyDotsLeft1    : 100,
        elroySpeed1       : 1,
        elroyDotsLeft2    : 50,
        elroySpeed2       : 1.05,
        fruitType         : 8,
        fruitScore        : 5000,
        frightTime        : 0,
        frightBlinks      : 0,
        switchTimes       : [ 5, 20, 5, 20, 5, 1037, 1 / 60, 1 ],
        penForceTime      : 3,
        penLeavingLimit   : [ 0, 0, 0, 0 ]
    },
    { // 18
        ghostSpeed        : 0.95,
        tunnelSpeed       : 0.5,
        pmSpeed           : 1,
        eatingSpeed       : 0.87,
        ghostFrightSpeed  : 0.6,
        pmFrightSpeed     : 1,
        eatingFrightSpeed : 0.87,
        elroyDotsLeft1    : 100,
        elroySpeed1       : 1,
        elroyDotsLeft2    : 50,
        elroySpeed2       : 1.05,
        fruitType         : 8,
        fruitScore        : 5000,
        frightTime        : 1,
        frightBlinks      : 3,
        switchTimes       : [ 5, 20, 5, 20, 5, 1037, 1 / 60, 1 ],
        penForceTime      : 3,
        penLeavingLimit   : [ 0, 0, 0, 0 ]
    },
    { // 19
        ghostSpeed        : 0.95,
        tunnelSpeed       : 0.5,
        pmSpeed           : 1,
        eatingSpeed       : 0.87,
        ghostFrightSpeed  : 0.6,
        pmFrightSpeed     : 1,
        eatingFrightSpeed : 0.87,
        elroyDotsLeft1    : 120,
        elroySpeed1       : 1,
        elroyDotsLeft2    : 60,
        elroySpeed2       : 1.05,
        fruitType         : 8,
        fruitScore        : 5000,
        frightTime        : 0,
        frightBlinks      : 0,
        switchTimes       : [ 5, 20, 5, 20, 5, 1037, 1 / 60, 1 ],
        penForceTime      : 3,
        penLeavingLimit   : [ 0, 0, 0, 0 ]
    },
    { // 20
        ghostSpeed        : 0.95,
        tunnelSpeed       : 0.5,
        pmSpeed           : 1,
        eatingSpeed       : 0.87,
        ghostFrightSpeed  : 0.6,
        pmFrightSpeed     : 1,
        eatingFrightSpeed : 0.87,
        elroyDotsLeft1    : 120,
        elroySpeed1       : 1,
        elroyDotsLeft2    : 60,
        elroySpeed2       : 1.05,
        fruitType         : 8,
        fruitScore        : 5000,
        frightTime        : 0,
        frightBlinks      : 0,
        switchTimes       : [ 5, 20, 5, 20, 5, 1037, 1 / 60, 1 ],
        penForceTime      : 3,
        penLeavingLimit   : [ 0, 0, 0, 0 ]
    },
    { // 21+
        ghostSpeed        : 0.95,
        tunnelSpeed       : 0.5,
        pmSpeed           : 0.9,
        eatingSpeed       : 0.79,
        ghostFrightSpeed  : 0.75,
        pmFrightSpeed     : 0.9,
        eatingFrightSpeed : 0.79,
        elroyDotsLeft1    : 120,
        elroySpeed1       : 1,
        elroyDotsLeft2    : 60,
        elroySpeed2       : 1.05,
        fruitType         : 8,
        fruitScore        : 5000,
        frightTime        : 0,
        frightBlinks      : 0,
        switchTimes       : [ 5, 20, 5, 20, 5, 1037, 1 / 60, 1 ],
        penForceTime      : 3,
        penLeavingLimit   : [ 0, 0, 0, 0 ]
    },
];

// Constant Data
const fruitNames     = [ "Cherries", "Strawberry", "Peach", "Apple", "Grapes", "Galaxian", "Bell", "Key" ];
const fruitDots1     = 174;
const fruitDots2     = 74;
const energizerValue = 5;
const pillValue      = 1;
const extraLife      = 10000;
const pillMult       = 10;
const eyesBonus      = 12000;
const totalSwitches  = 7;
const blinksTimer    = 200;
const penDotsCount   = [ 0, 7, 17, 32 ];
const inPenSpeed     = 0.6;
const eyesSpeed      = 2;
const exitPenSpeed   = 0.4;
const pathSpeeds     = {
    inPen    : inPenSpeed,
    exitPen  : exitPenSpeed,
    enterPen : eyesSpeed,
};



/**
 * Pacman Level
 */
export default class Level {

    /**
     * Pacman Level constructor
     */
    constructor() {
        this.gameLevel = 1;
    }

    /**
     * Starts the Game
     * @returns {Void}
     */
    start() {
        this.gameLevel = 1;
    }

    /**
     * Returns the game level
     * @returns {Number}
     */
    get() {
        return this.gameLevel;
    }

    /**
     * Increases the game level
     * @returns {Void}
     */
    inc() {
        this.gameLevel += 1;
    }



    /**
     * The amount of time a fruit stays in the board
     * @returns {Number}
     */
    get fruitTime() {
        return Math.round(Math.random() * 1000) + 9000;
    }

    /**
     * The amount of dots left before showing the fruit
     * @returns {Number}
     */
    get fruitDots1() {
        return fruitDots1;
    }

    /**
     * The amount of dots left before showing the fruit
     * @returns {Number}
     */
    get fruitDots2() {
        return fruitDots2;
    }

    /**
     * The value for the energizer
     * @returns {Number}
     */
    get energizerValue() {
        return energizerValue;
    }

    /**
     * The value for the pill
     * @returns {Number}
     */
    get pillValue() {
        return pillValue;
    }


    /**
     * The score required for each extra life
     * @returns {Number}
     */
    get extraLife() {
        return extraLife;
    }

    /**
     * Returns the pills multiplier
     * @returns {Number}
     */
    get pillMult() {
        return pillMult;
    }

    /**
     * Returns the eves bonus score
     * @returns {Number}
     */
    get eyesBonus() {
        return eyesBonus;
    }

    /**
     * Returns the total amount of Ghost's mode switches
     * @returns {Number}
     */
    get totalSwitches() {
        return totalSwitches;
    }

    /**
     * Returns the Ghost's blink time
     * @returns {Number}
     */
    get blinksTimer() {
        return blinksTimer;
    }

    /**
     * Returns the Ghost's eyes mode speed
     * @returns {Number}
     */
    get eyesSpeed() {
        return eyesSpeed;
    }



    /**
     * Returns the value asociated with the given key for the current level
     * @param {String} variable
     * @returns {(Number|String|Number[])}
     */
    getData(variable) {
        const level = Math.min(this.gameLevel - 1, levelsData.length - 1);
        const data  = levelsData[level];
        const value = data[variable];

        if (Array.isArray(value)) {
            return Object.create(value);
        }
        return value;
    }

    /**
     * Returns the value asociated with the given key for the current level
     * @param {String} variable
     * @returns {Number}
     */
    getNumber(variable) {
        return Number(this.getData(variable));
    }

    /**
     * Returns the fruit name for the current level
     * @returns {String}
     */
    get fruitName() {
        const fruitType = this.getNumber("fruitType");
        return fruitNames[fruitType - 1];
    }

    /**
     * Returns the Pen Force time in miliseconds
     * @returns {Number}
     */
    get penForceTime() {
        return this.getNumber("penForceTime") * 1000;
    }

    /**
     * Returns the switch time at the given mode in miliseconds
     * @param {Number} mode
     * @returns {Number}
     */
    getSwitchTime(mode) {
        return this.getData("switchTimes")[mode] * 1000;
    }

    /**
     * Returns the Fright time in miliseconds
     * @returns {Number}
     */
    get frightTime() {
        return this.getNumber("frightTime") * 1000;
    }

    /**
     * Returns the amount of switchs when blinking in fright mode
     * @returns {Number}
     */
    get blinks() {
        return this.getNumber("frightBlinks") * 2;
    }

    /**
     * Returns the ghost speed
     * @param {Boolean} inPen
     * @returns {Number}
     */
    getGhostSpeed(inPen) {
        return inPen ? inPenSpeed : this.getNumber("ghostSpeed");
    }

    /**
     * Returns the ghost speed inside a path
     * @param {String} path
     * @returns {Number}
     */
    getPathSpeed(path) {
        return pathSpeeds[path];
    }

    /**
     * Returns the Score for a dead Ghost
     * @param {Number} amount
     * @returns {Number}
     */
    getGhostScore(amount) {
        return Math.pow(2, amount) * 100;
    }

    /**
     * Returns the amount of dots required before exiting the Pen for the given ghost
     * @param {Number} ghost
     * @returns {Number}
     */
    getPenDotsCount(ghost) {
        return penDotsCount[ghost];
    }

    /**
     * Returns true if the given mode is Frighten
     * @param {String} mode
     * @returns {Boolean}
     */
    isFrighten(mode) {
        return mode === "blue" || mode === "white";
    }
};
