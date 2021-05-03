import _ from "lodash-core";

/** Class representing a click-and-name game. */
export default class Game {

    /**
     * Callback function to validate names.
     * @callback validateCallback
     * 
     * @param {string} id                           - ID of currently selected element.
     * @param {string} name                         - Input name to validate.
     * @returns {boolean}                           - Is the name valid for that ID?
     */

    /**
     * Interface for a simple stopwatch.
     * @typedef Timer
     * 
     * @property {Function} start                   - Start or continue the timer.
     * @property {Function} stop                    - Pause the timer.
     * @property {Function} reset                   - Stop the timer and reset elapsed time to zero.
     */

    /**
     * Callback function to update a score display.
     * @callback scoreCallback
     * 
     * @param {number} score                        - The new score value.
     * @returns {void}
     */

    /**
     * @param {HTMLElement} map                     - Container for all the game elements.
     * @param {HTMLInputElement} input              - Text input field for player guesses.
     * @param {validateCallback} validate          - Callback to validate input names.
     * @param {number} maxScore                     - The total number of things to name.
     * @param {Object} [options]                     - Configuration options.
     * 
     * @param {Timer} [options.timer]               - Optional {@link Timer} will be started on first click.
     * @param {scoreCallback} [options.showScore]   - Optional callback, called each time score changes.
     * @param {boolean} [options.catchAllKeys=true] - If true, automatically focus input element on keydown.
     * @param {boolean} [options.cleanInputs=true]  - If true, apply this.clean to inputs before validating.
     */
    constructor(map, input, validate, maxScore, options={}) {
        this.map = map;
        this.input = input;
        this.validate = validate;
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
        this.input.addEventListener("change", () => this.checkName());
        if (this.catchAllKeys) {
            this.map.addEventListener("keydown", () => {
                this.input.focus();
            });
        }

        // Initialise score display
        this.showScore(this.score);
    }

    /**
     * Finds the closest <g> element ancestor of target.
     * 
     * @param {SVGElement} target                   - The element to begin search from.
     * @returns {SVGElement|null}                   - The closest ancestor <g> element (if any).
     */
    findGroup(target) {
        let element = target;
        while (element.tagName) {
            if (element.tagName == "g") {
                return element;
            }
            element = element.parentNode;
        }
        return null;
    }

    /**
     * Click handler for map element.
     * 
     * If target is child of an unsolved <g> element, make that the focused element.
     * 
     * @param {SVGElement} target                   - Target of click event.
     * @returns {void}
     */
    handleClick(target) {
        const group = this.findGroup(target);
        if (
            (group !== null) &&
            (group !== this.focused) &&
            (!group.classList.contains("solved"))
        ) {
            if (this.focused) {
                this.focused.classList.remove("focused");
            }
            group.classList.add("focused");
            this.focused = group;
            this.input.value = "";
            if (!this.started) {
                this.timer.start()
                this.input.style.textTransform = "uppercase";
                this.started = true;
            }
            this.input.focus();
        }
    }

    /**
     * Clean input string according to the following steps:
     * - Remove leading "the " if present
     * - Replace hyphens with spaces
     * - Remove excess whitespace
     * - Remove any accents
     * 
     * @param {string} raw                          - Input text to be cleaned.
     * @returns {string}                            - Cleaned output.
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
     * Check if current text input is an acceptable name for the focused element.
     * 
     * @returns {void}
     */
    checkName() {
        let name = this.input.value
        if (this.cleanInputs) {
            name = this.clean(name);
        }
        if (this.validate(this.focused.id, name)) {
            this.focused.classList.remove("focused");
            this.focused.classList.add("solved");
            this.focused = null;
            this.input.value = "";
            this.showScore(++this.score);
            if (this.score == this.maxScore) {
                this.timer?.stop?.();
            }
        }
    }
}