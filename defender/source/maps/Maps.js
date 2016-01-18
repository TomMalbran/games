/**
 * The Maps Class
 */
class Maps {
    
    /**
     * The Maps constructor
     */
    constructor() {
        this.maps    = document.querySelector(".maps");
        this.total   = document.querySelector(".totalScore");
        this.storage = new Storage("defender.maps");
        this.mapData = null;
        this.gameMap = null;
    }
    
    
    /**
     * Transforms a map index to a map name
     * @param {string} code
     * @return {string}
     */
    codeToMap(code) {
        let map = "classic";
        if (MapsData.maps[code]) {
            return code;
        }
        
        Object.keys(MapsData.maps).some((name) => {
            if (MapsData.maps[name].index === String(code)) {
                map = name;
                return true;
            }
            return false;
        });
        return map;
    }
        
    /**
     * Saves the Map and Level when starting a new game
     * @param {string} gameMap
     * @param {number} gameLevel
     */
    saveMap(gameMap, gameLevel) {
        this.gameMap = gameMap;
        this.storage.set("map", gameMap);
        this.storage.set("level", gameLevel);
    }
    
    /**
     * Returns the currently saved map
     * @return {string}
     */
    getMap() {
        return this.storage.get("map");
    }
    
    /**
     * Returns the currently saved level
     * @return {number}
     */
    getLevel() {
        return this.storage.get("level");
    }
    
    
    /**
     * Shows the list of maps to select one
     */
    display() {
        let total = 0;
        this.maps.innerHTML = "";
        
        Object.keys(MapsData.maps).forEach((id) => {
            let score   = this.storage.get(id + ".score") || 0,
                won     = this.storage.get(id + ".won"),
                element = document.createElement("button");
            
            element.dataset.action = "selectLevel";
            element.dataset.data   = id;
            element.dataset.name   = MapsData.maps[id].name;
            element.dataset.score  = score;
            element.className      = won ? "navButton" : "menuButton";
            element.innerHTML      = MapsData.maps[id].index;
            
            this.maps.appendChild(element);
            total += score;
        });
        
        this.total.innerHTML = "Total: " + total;
    }
    
    /**
     * Saves the new Score and Lives for the given map, if is greater than the old one
     * @param {number} lives
     * @param {number} score
     */
    saveScore(lives, score) {
        let old = this.storage.get(this.gameMap + ".score"),
            won = lives > 0;
        
        if (!old || old < score) {
            this.storage.set(this.gameMap + ".score", score);
        }
        if (won) {
            this.storage.set(this.gameMap + ".won", 1);
        }
    }
}
