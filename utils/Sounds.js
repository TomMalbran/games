const Sounds = (function () {
    "use strict";


    /**
     * Returns true if the browser supports Audio
     * @returns {Boolean}
     */
    function supportsAudio() {
        return !!document.createElement("audio").canPlayType;
    }

    /**
     * Returns true if the browser supports MP3 Audio
     * @returns {Boolean}
     */
    function supportsMP3() {
        const a = document.createElement("audio");
        return !!(a.canPlayType && a.canPlayType("audio/mpeg;").replace(/no/, ""));
    }

    /**
     * Returns true if the browser supports OGG Audio
     * @returns {Boolean}
     */
    function supportsOGG() {
        const a = document.createElement("audio");
        return !!(a.canPlayType && a.canPlayType(`audio/ogg; codecs="vorbis"`).replace(/no/, ""));
    }



    /**
     * Sound Controller
     */
    class Sounds {
        /**
         * Sound Controller Constructor
         * @constructor
         * @param {Array.<String>} soundFiles  - An array of sound names to use
         * @param {String}         storageName - The name of the storage
         * @param {String=}        format      - Format of the files
         */
        constructor(soundFiles, storageName, format) {
            this.data   = new Storage(storageName, true);
            this.format = format || (supportsOGG() ? ".ogg" : (supportsMP3() ? ".mp3" : null));
            this.mute   = !!this.data.get();
            this.old    = this.mute;

            this.audio   = document.querySelector(".audio");
            this.waves   = document.querySelector(".waves");
            this.element = document.querySelector(".mute");

            if (this.format) {
                this.setSounds(soundFiles);
                this.setDisplay();
            } else {
                if (this.audio) {
                    this.audio.style.display = "none";
                }
                if (this.element) {
                    this.element.style.display = "none";
                }
            }
        }

        /**
         * Create all the Sound Functions
         * @returns {Void}
         */
        setSounds(soundFiles) {
            soundFiles.forEach((sound) => {
                this[sound] = () => {
                    const audio = new Audio(`audio/${sound}${this.format}`);
                    if (this.format && !this.mute) {
                        audio.play();
                    }
                };
            });
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
                this.element.innerText = this.mute ? "Unmute" : "Mute";
            }
        }
    }



    return Sounds;
}());
