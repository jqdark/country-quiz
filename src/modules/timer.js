import _ from "lodash-core";

/** Class representing a timer. */
export default class Timer {

    /**
     * 
     * @param {HTMLElement} element             - Element to write elapsed time into.
     * @param {Object} options                  - Configuration options.
     * @param {number} [options.interval=35]    - Intervals (in milliseconds) between timer updates.
     * @param {Function} [options.format]       - Function mapping time elapsed (in milliseconds) to string representation.
     */
    constructor(element, options={}) {
        this.element = element;
        this.elapsed = 0;
        this.running = false;
        this.repeater = null;
        this.startTime = null;
        this.interval = _.get(options, "interval", 35);
        this.format = _.get(options, "format", time => {
            const minutes = Math.floor(time / 60000);
            const seconds = Math.floor((time % 60000) / 1000).toString().padStart(2, "0");
            const centiseconds = Math.floor((time % 1000) / 10).toString().padStart(2, "0");
            return `${minutes}:${seconds}.${centiseconds}`;
        });

    }

    /**
     * Write the 
     * @param {number} time 
     */
    display(time) {
        this.element.innerText = this.format(time);
    }

    /**
     * If the time is not running, start it.
     */
    start() {
        if (!this.running) {
            this.startTime = Date.now();
            this.repeater = setInterval(() => {
                this.display(this.elapsed + Date.now() - this.startTime);
            }, this.interval);
            this.running = true;
        }
    }

    /**
     * If the timer is running, stop it.
     */
    stop() {
        if (this.running) {
            this.elapsed += (Date.now() - this.startTime);
            clearInterval(this.repeater);
            this.display(this.elapsed);
            this.repeater = null;
            this.startTime = null;
            this.running = false;
        }
    }

    /**
     * Stop the timer if running, and reset elapsed time to zero.
     */
    reset() {
        if (this.running) {
            this.stop();
        }
        this.elapsed = 0;
        this.display(this.elapsed);
    }
}