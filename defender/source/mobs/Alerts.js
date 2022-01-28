import Mob          from "../mob/Mob.js";

// Utils
import List         from "../../../utils/List.js";
import Utils        from "../../../utils/Utils.js";



/**
 * Defender Mobs Alerts
 */
export default class Alerts {

    /**
     * Defender Mobs Alerts constructor
     */
    constructor() {
        this.moveX  = [  0, -1, -1, -1, -1,  0,  0,  0 ];
        this.moveY  = [ -1, -1,  0,  0,  1,  1,  1,  0 ];

        this.list   = new List();
        this.alerts = document.querySelector(".alerts");
        this.alerts.innerHTML = "";
    }



    /**
     * Adds a minus 1 life alert
     * @param {Mob} mob
     * @returns {Void}
     */
    life(mob) {
        this.add(mob, "alert-red", "-1");
    }

    /**
     * Adds a plus gold amount alert
     * @param {Mob} mob
     * @returns {Void}
     */
    gold(mob) {
        this.add(mob, "alert-yellow", `+${mob.gold}`);
    }



    /**
     * Used to add any type of alert to thealert list
     * @param {Mob}    mob
     * @param {String} className
     * @param {String} text
     * @returns {Void}
     */
    add(mob, className, text) {
        this.list.addLast({
            element: this.create(mob, className, text),
            top:     0,
            left:    0,
            timer:   100,
            pointer: 0
        });
    }

    /**
     * Creates, appends and returns the element for the alert
     * @param {Mob}    mob
     * @param {String} className
     * @param {String} text
     * @returns {HTMLElement}
     */
    create(mob, className, text) {
        const element = document.createElement("DIV");
        element.style.top  = Utils.toPX(mob.pos.top);
        element.style.left = Utils.toPX(mob.pos.left);
        element.className  = `alert ${className}`;
        element.innerHTML  = text;

        this.alerts.appendChild(element);
        return element;
    }

    /**
     * It iterates through the alerts moving them and removing them from the list when done
     * @param {Number} time
     * @returns {Void}
     */
    move(time) {
        if (!this.list.isEmpty) {
            const it = this.list.iterate();
            while (it.hasNext()) {
                const data = it.getNext();
                data.timer -= time;
                if (data.timer <= 0) {
                    data.top     += this.moveY[data.pointer];
                    data.left    += this.moveX[data.pointer];
                    data.timer    = 100;
                    data.pointer += 1;
                    data.element.style.transform = Utils.translate(data.left, data.top);
                }
                if (data.pointer >= this.moveX.length) {
                    Utils.removeElement(data.element);
                    it.removeNext();
                } else {
                    it.next();
                }
            }
        }
    }
}
