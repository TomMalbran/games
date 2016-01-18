/**
 * The Game Keyboard
 */
class Keyboard {
    
    /**
     * The Game Keyboard constructor
     * @param {Display} display
     * @param {Scores}  scores
     * @param {Object}  shortcuts
     */
    constructor(display, scores, shortcuts) {
        this.fastKeys   = [ 37, 65, 40, 83, 39, 68 ];
        this.shortcuts  = shortcuts;
        this.keyPressed = null;
        this.count      = 0;
        
        this.display    = display;
        this.scores     = scores;
        
        document.addEventListener("keydown", (e) => this.onKeyDown(e));
        document.addEventListener("keyup",   (e) => this.onKeyUp(e));
    }
    
    
    /**
     * Called when holding a key
     */
    holdingKey() {
        if (this.keyPressed) {
            this.count += 1;
            if (this.count > 8) {
                this.onKeyHold();
                this.count -= 3;
            }
        }
    }
    
    /**
     * Resets the counter
     */
    reset() {
        this.count = 0;
    }
    
    
    /**
     * Key Press Event
     * @param {number} key
     * @param {?Event} event
     */
    pressKey(key, event) {
        let number = null;
        if (this.scores.isFocused()) {
            if (key === 13) {
                this.shortcuts.gameOver.O();
            }
        } else {
            if (!this.display.isPlaying()) {
                event.preventDefault();
            }
            
            if ([8, 66, 78].indexOf(key) > -1) {            // Backspace / B / N
                key = "B";
            } else if ([13, 79, 84].indexOf(key) > -1) {    // Enter / O / T
                key = "O";
            } else if ([80, 67].indexOf(key) > -1) {        // P / C
                key = "P";
            } else if ([17, 32].indexOf(key) > -1) {        // Ctrl / Space
                key = "C";
            } else if ([38, 87].indexOf(key) > -1) {        // Up    / W
                key = "W";
            } else if ([37, 65].indexOf(key) > -1) {        // Left  / A
                key = "A";
            } else if ([40, 83].indexOf(key) > -1) {        // Down  / S
                key = "S";
            } else if ([39, 68].indexOf(key) > -1) {        // Right / D
                key = "D";
            } else {
                if (key === 48 || key === 96) {
                    number = 10;
                } else if (key > 48 && key < 58) {
                    number = key - 48;
                } else if (key > 96 && key < 106) {
                    number = key - 96;
                }
                key = String.fromCharCode(key);
            }
            
            if (number !== null) {
                this.shortcuts.number(number);
            }
            if (this.shortcuts[this.display.get()][key]) {
                this.shortcuts[this.display.get()][key]();
            }
        }
    }
    
    /**
     * Key handler for the on key down event
     * @param {Event} event
     */
    onKeyDown(event) {
        if (this.display.isPlaying() && this.fastKeys.indexOf(event.keyCode) > -1) {
            if (this.keyPressed === null) {
                this.keyPressed = event.keyCode;
            } else {
                return;
            }
        }
        this.pressKey(event.keyCode, event);
    }
    
    /**
     * Key handler for the on key up event
     * @param {Event} event
     */
    onKeyUp() {
        this.keyPressed = null;
        this.count      = 0;
    }
    
    /**
     * When a key is pressed, this is called on each frame for fast key movements
     */
    onKeyHold() {
        if (this.keyPressed !== null && this.display.isPlaying()) {
            this.pressKey(this.keyPressed);
        }
    }
}
