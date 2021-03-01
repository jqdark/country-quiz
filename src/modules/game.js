import _ from "lodash-core";

/** Class representing a click-and-name game. */
export default class Game {

    /**
     * 
     * @param {HTMLElement} map                     - Container for all the game elements.
     * @param {HTMLInputElement} input              - Text input field for player guesses.
     * @param {Function} validator                  - Function mapping 
     * @param {number} maxScore                     - The total number of things to name.
     * 
     * @param {Object} options                      - Configuration options.
     * @param {Timer} [options.timer]               -
     * @param {} [options.showScore]
     * @param {boolean} [options.catchAllKeys=true] - If true, automatically focus input element on keydown.
     * @param {boolean} [options.cleanInputs=true]  - If true, apply this.clean to inputs before validating.
     */
    constructor(map, input, validator, maxScore, options={}) {
        this.map = map;
        this.input = input;
        this.validator = validator;
        this.focused = null;
        this.started = false;
        this.score = 0;
        this.maxScore = maxScore;

        // Read options
        this.timer = _.get(options, "timer", null);
        this.showScore = _.get(options, "showScore", () => {});
        this.catchAllKeys = _.get(options, "catchAllKeys", true);
        this.cleanInputs = _.get(options, "cleanInputs", true);

        // Add event handlers
        this.map.addEventListener("click", event => this.handleClick(event.target));
        this.input.addEventListener("change", () => this.validate());
        if (this.catchAllKeys) {
            this.map.addEventListener("keydown", () => {
                this.input.focus();
            });
        }

        // Initialise score display
        this.showScore(this.score);
    }

    /**
     * Finds the closest <g> ancestor of the input element.
     * @param {SVGElement} target
     */
    handleClick(target) {
        let element = target;
        while (element.tagName) {
            if (
                (element.tagName == "g") &&
                (this.focused !== element) &&
                (!element.classList.contains("solved"))
            ) {
                if (this.focused) {
                    this.focused.classList.remove("focused");
                }
                element.classList.add("focused");
                this.focused = element;
                this.input.value = "";
                if (!this.started) {
                    this.timer.start()
                    this.input.style.textTransform = "uppercase";
                    this.started = true;
                }
                this.input.focus();
                break;
            }
            element = element.parentNode;
        }
    }

    /**
     * 
     * @param {string} raw 
     */
    clean(raw) {
        return raw.toLowerCase()
            .replace(/^(the )/, "")             // Remove leading "the "
            .replace(/-/g, " ")                 // Replace hyphens with spaces
            .replace(/\s\s+/g, " ")             // Remove excess whitespace
            .trim()                             // Remove trailing whitespace
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "");   // Remove accents
    }

    /**
     * 
     */
    validate() {
        let name = this.input.value
        if (this.cleanInputs) {
            name = this.clean(name);
        }
        if (this.validator(this.focused.id, name)) {
            this.focused.classList.remove("focused");
            this.focused.classList.add("solved");
            this.focused = null;
            this.input.value = "";
            this.showScore(++this.score);
        }
    }
}