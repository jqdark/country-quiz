import _ from "lodash-core";

/** Class representing a timer. */
export default class Timer {

    /**
     * Callback function to format timestamps.
     * @callback formatCallback
     * 
     * @param {number} elapsedTime              - Elapsed time in milliseconds.
     * @returns {string}                        - Formatted timestamp.
     */

    /**
     * @param {HTMLElement} element             - Element to write elapsed time into.
     * @param {Object} options                  - Configuration options.
     * 
     * @param {number} [options.interval=35]    - Intervals (in milliseconds) between timer updates.
     * @param {formatCallback} [options.format] - Optional function mapping time elapsed (in milliseconds) to string representation.
     */
    constructor(element, options={}) {
        this.element = element;
        this.elapsed = 0;
        this.running = false;
        this.repeater = null;
        this.startTime = null;

        // Read options
        this.interval = _.get(options, "interval", 35);
        this.format = _.get(options, "format", time => {
            const minutes = Math.floor(time / 60000);
            const seconds = Math.floor((time % 60000) / 1000).toString().padStart(2, "0");
            const centiSeconds = Math.floor((time % 1000) / 10).toString().padStart(2, "0");
            return `${minutes}:${seconds}.${centiSeconds}`;
        });
    }

    /**
     * Display the provided time.
     * 
     * @param {number} time                     - Time to display (in milliseconds).
     * @returns {void} 
     */
    display(time) {
        this.element.innerText = this.format(time);
    }

    /**
     * If the Timer is not running, start it.
     * 
     * @returns {void}
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
     * 
     * @returns {void}
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
     * 
     * @returns {void}
     */
    reset() {
        this.stop();
        this.elapsed = 0;
        this.display(this.elapsed);
    }
}