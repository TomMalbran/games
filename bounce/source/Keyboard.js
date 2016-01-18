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
        this.fastKeys   = [ 37, 65, 39, 68 ];
        this.shortcuts  = shortcuts;
        this.keyPressed = null;
        
        this.display    = display;
        this.scores     = scores;
        
        document.addEventListener("keydown", e => this.onKeyDown(e));
        document.addEventListener("keyup",   e => this.onKeyUp(e));
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
     * @param {$.Event} event
     */
    onKeyUp() {
        this.keyPressed = null;
    }
    
    /**
     * When a key is pressed, this is called on each frame for fast key movements
     */
    onKeyHold() {
        if (this.keyPressed !== null && this.display.isPlaying()) {
            this.pressKey(this.keyPressed);
        }
    }
    
    
    /**
     * Key Press Event
     * @param {number} key
     * @param {?Event} event
     */
    pressKey(key, event) {
        if (this.scores.isFocused()) {
            if (key === 13) {
                this.shortcuts.gameOver.O();
            }
        } else {
            if (!this.display.isPlaying()) {
                event.preventDefault();
            }
            
            if ([69, 49, 97].indexOf(key) > -1) {           // E / 1
                key = "E";
            } else if ([82, 50, 98].indexOf(key) > -1) {    // R / 2
                key = "R";
            } else if ([75, 51, 99].indexOf(key) > -1) {    // K / 3
                key = "C";
            } else if ([8, 66, 78].indexOf(key) > -1) {     // Backspace / B / N
                key = "B";
            } else if ([13, 32, 79].indexOf(key) > -1) {    // Enter / Space / O
                key = "O";
            } else if ([80, 67].indexOf(key) > -1) {        // P / C
                key = "P";
            } else if ([37, 65].indexOf(key) > -1) {        // Left  / A
                key = "A";
            } else if ([39, 68].indexOf(key) > -1) {        // Right / D
                key = "D";
            } else {
                key = String.fromCharCode(key);
            }
            
            if (this.shortcuts[this.display.get()][key]) {
                this.shortcuts[this.display.get()][key]();
            }
        }
    }
}
