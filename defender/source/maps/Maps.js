import Data         from "../Data.js";

// Utils
import Storage      from "../../../utils/Storage.js";



/**
 * Defender Maps
 */
export default class Maps {

    /**
     * Defender Maps constructor
     */
    constructor() {
        this.maps    = document.querySelector(".maps");
        this.total   = document.querySelector(".total-score");
        this.storage = new Storage("defender.maps");
        this.mapData = null;
        this.gameMap = null;
    }



    /**
     * Transforms a map index to a map name
     * @param {String} code
     * @returns {String}
     */
    codeToMap(code) {
        let map = "classic";
        if (Data.maps[code]) {
            return code;
        }

        Object.keys(Data.maps).some((name) => {
            if (Data.maps[name].index === String(code)) {
                map = name;
                return true;
            }
            return false;
        });
        return map;
    }

    /**
     * Saves the Map and Level when starting a new game
     * @param {String} gameMap
     * @param {Number} gameLevel
     * @returns {Void}
     */
    saveMap(gameMap, gameLevel) {
        this.gameMap = gameMap;
        this.storage.set("map", gameMap);
        this.storage.set("level", gameLevel);
    }

    /**
     * Returns the currently saved map
     * @returns {String}
     */
    get map() {
        return this.storage.get("map");
    }

    /**
     * Returns the currently saved level
     * @returns {Number}
     */
    get level() {
        return this.storage.get("level");
    }



    /**
     * Shows the list of maps to select one
     * @returns {Void}
     */
    display() {
        let total = 0;
        this.maps.innerHTML = "";

        Object.keys(Data.maps).forEach((id) => {
            const score   = this.storage.get(`${id}.score`) || 0;
            const won     = this.storage.get(`${id}.won`);
            const element = document.createElement("button");

            element.dataset.action = "selectLevel";
            element.dataset.data   = id;
            element.dataset.name   = Data.maps[id].name;
            element.dataset.score  = score;
            element.className      = won ? "nav-button" : "menu-button";
            element.innerHTML      = Data.maps[id].index;

            this.maps.appendChild(element);
            total += score;
        });

        this.total.innerHTML = `Total: ${total}`;
    }

    /**
     * Saves the new Score and Lives for the given map, if is greater than the old one
     * @param {Number} lives
     * @param {Number} score
     * @returns {Void}
     */
    saveScore(lives, score) {
        const old = this.storage.get(`${this.gameMap}.score`);
        const won = lives > 0;

        if (!old || old < score) {
            this.storage.set(`${this.gameMap}.score`, score);
        }
        if (won) {
            this.storage.set(`${this.gameMap}.won`, 1);
        }
    }
}
