/*jslint browser: true */
/*global Storage, Audio */

var Sounds = (function () {
    "use strict";
    
    /**
     * Returns true if the browser supports Audio
     * @return {boolean}
     */
    function supportsAudio() {
        return !!document.createElement("audio").canPlayType;
    }
    
    /**
     * Returns true if the browser supports MP3 Audio
     * @return {boolean}
     */
    function supportsMP3() {
        var a = document.createElement("audio");
        return !!(a.canPlayType && a.canPlayType("audio/mpeg;").replace(/no/, ""));
    }
    
    /**
     * Returns true if the browser supports OGG Audio
     * @return {boolean}
     */
    function supportsOGG() {
        var a = document.createElement("audio");
        return !!(a.canPlayType && a.canPlayType("audio/ogg; codecs='vorbis'").replace(/no/, ""));
    }
    
    
    
    /**
     * @constructor
     * Sound Controller
     * @param {Array.<string>} soundFiles - An array of sound names to use
     * @param {string} storageName - The name of the storage
     * @param {boolean} usesElement - True if it uses elements
     */
    function Sounds(soundFiles, storageName, usesElement) {
        this.data   = new Storage(storageName, true);
        this.format = supportsOGG() ? ".ogg" : (supportsMP3() ? ".mp3" : null);
        this.mute   = this.data.get();
        
        if (usesElement) {
            this.audio = document.querySelector(".audio");
            this.waves = document.querySelector(".waves");
        }
        
        if (this.format) {
            this.setSounds(soundFiles);
            this.setDisplay();
        } else if (this.audio) {
            this.audio.style.display = "none";
        }
    }
    
    /**
     * Create all the Sound Functions
     */
    Sounds.prototype.setSounds = function (soundFiles) {
        var audio, self = this;
        
        soundFiles.forEach(function (sound) {
            self[sound] = function () {
                audio = new Audio("audio/" + sound + self.format);
                if (self.format && !self.mute) {
                    audio.play();
                }
            };
        });
    };
    
    /**
     * Mute/Unmute the sound
     */
    Sounds.prototype.toggle = function () {
        this.mute = !this.mute;
        this.setDisplay();
        this.data.set(this.mute);
    };
    
    /**
     * Sets the display of the sound waves
     */
    Sounds.prototype.setDisplay = function () {
        if (this.waves) {
            this.waves.style.display = this.mute ? "none" : "block";
        }
    };
    
    
    return Sounds;
}());