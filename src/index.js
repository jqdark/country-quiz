import panzoom from "panzoom";

import Timer from "./modules/timer.js";
import Game from "./modules/game.js";
import COUNTRIES from "./data/countries.json";

// Add styles
import "./styles.sass";

// UI
const map = document.getElementById("map");
const inputBox = document.getElementById("nameBox");
const scoreBox = document.getElementById("scoreBox");
const timer = new Timer(document.getElementById("timerBox"));
panzoom(map, {
    minZoom: 1,
    maxZoom: 8,
    bounds: true,
    boundsPadding: 1,
    initialX: 0,
    initialY: 0,
    initialZoom: 1
});

// Setup game
const inputTest = (id, input) => COUNTRIES[id].accept.includes(input);
const maxScore = Object.keys(COUNTRIES).length;
new Game(map, inputBox, inputTest, maxScore, {
    timer: timer,
    showScore: score => {
        scoreBox.innerText = `${score} / ${maxScore}`
    }
});