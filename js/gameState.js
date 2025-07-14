// Game state management
import { TOTAL_LAPS } from './constants.js';

export const game = {
    state: 'menu', // menu, racing, results
    frame: 0,
    totalLaps: TOTAL_LAPS,
    raceStarted: false,
    countdown: 3,
    raceFinished: false,
    finishOrder: [],
    canvas: null,
    ctx: null
};

export function setCanvas(canvas) {
    game.canvas = canvas;
    game.ctx = canvas.getContext('2d');
}

export function startRace() {
    game.state = 'racing';
    game.raceStarted = false;
    game.countdown = 3;
    game.raceFinished = false;
    game.finishOrder = [];
}

export function finishRace() {
    game.raceFinished = true;
}