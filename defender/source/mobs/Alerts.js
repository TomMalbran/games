/**
 * The Mobs Alerts Class
 */
class Alerts {

    /**
     * The Mobs Alerts constructor
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
     */
    life(mob) {
        this.add(mob, "alertRed", "-1");
    }

    /**
     * Adds a plus gold amount alert
     * @param {Mob} mob
     */
    gold(mob) {
        this.add(mob, "alertYellow", "+" + mob.getGold());
    }


    /**
     * Used to add any type of alert to thealert list
     * @param {Mob} mob
     * @param {string} className
     * @param {string} text
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
     * @param {Mob} mob
     * @param {string} className
     * @param {string} text
     */
    create(mob, className, text) {
        let element = document.createElement("DIV");
        element.style.top  = mob.getPos().top  + "px";
        element.style.left = mob.getPos().left + "px";
        element.className  = "alert " + className;
        element.innerHTML  = text;

        this.alerts.appendChild(element);
        return element;
    }

    /**
     * It iterates through the alerts moving them and removing them from the list when done
     * @param {number} time
     */
    move(time) {
        if (!this.list.isEmpty()) {
            let it = this.list.iterate(), data;
            while (it.hasNext()) {
                data = it.getNext();
                data.timer -= time;
                if (data.timer <= 0) {
                    data.top     += this.moveY[data.pointer];
                    data.left    += this.moveX[data.pointer];
                    data.timer    = 100;
                    data.pointer += 1;
                    data.element.style.transform = "translate(" + data.left + "px, " + data.top + "px)";
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
