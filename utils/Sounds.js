import Storage from "./Storage.js";



/**
 * Sound Controller
 */
export default class Sounds {
    /**
     * Sound Controller Constructor
     * @constructor
     * @param {String} storageName
     */
    constructor(storageName) {
        this.data    = new Storage(storageName, true);
        this.mute    = !!this.data.get();
        this.old     = this.mute;

        /** @type {HTMLElement} */
        this.audio   = document.querySelector(".audio");

        /** @type {HTMLElement} */
        this.waves   = document.querySelector(".waves");

        /** @type {HTMLElement} */
        this.element = document.querySelector(".mute");

        this.setDisplay();
    }

    /**
     * Plays a Sound
     * @param {String} sound
     * @returns {Void}
     */
    play(sound) {
        if (!this.mute) {
            const audio = new Audio(`audio/${sound}.mp3`);
            audio.play();
        }
    }

    /**
     * Mute/Unmute the sound
     * @param {Boolean} mute
     * @returns {Void}
     */
    toggle(mute) {
        this.mute = mute !== undefined ? mute : !this.mute;
        this.setDisplay();
        this.data.set(this.mute ? 1 : 0);
    }

    /**
     * Used to mute the sound for a short period
     * @returns {Void}
     */
    startMute() {
        this.old = this.mute;
        this.toggle(true);
    }

    /**
     * Resets the Mute to the original value
     * @returns {Void}
     */
    endMute() {
        this.toggle(this.old);
    }

    /**
     * Returns true if the sound is off and false if is on
     * @returns {Boolean}
     */
    isMute() {
        return this.mute;
    }

    /**
     * Sets the display of the sound waves
     * @returns {Void}
     */
    setDisplay() {
        if (this.audio && this.waves) {
            this.waves.style.display = this.mute ? "none" : "block";
        }
        if (this.element) {
            this.element.innerHTML = this.mute ? "Un<u>m</u>ute" : "<u>M</u>ute";
        }
    }
}
