// Main game entry point
import { game, setCanvas, startRace } from './gameState.js';
import { initInput, keys } from './input.js';
import { initTrack } from './track.js';
import { initOpponents } from './opponents.js';
import { initPowerUps, updatePowerUps, activatePowerUp, updateActivePowerUps } from './powerups.js';
import { updatePlayer, updateOpponents as updateOpponentsPhysics } from './physics.js';
import { checkCollisions } from './collision.js';
import { player } from './player.js';
import { opponents } from './opponents.js';
import * as render from './render.js';

// Initialize game
export function init() {
    const canvas = document.getElementById('gameCanvas');
    setCanvas(canvas);
    initInput();
}

// Start game
export function startGame() {
    document.getElementById('startScreen').style.display = 'none';
    startRace();
    initTrack();
    initOpponents();
    initPowerUps();
    gameLoop();
}

// Update game logic
function update(dt) {
    if (game.state !== 'racing') return;
    
    // Handle countdown
    if (!game.raceStarted) {
        game.countdown -= dt;
        if (game.countdown <= 0) {
            game.raceStarted = true;
        }
        return;
    }
    
    // Update player
    updatePlayer(dt);
    
    // Update power-ups
    updatePowerUps(dt);
    
    // Handle power-up activation
    if (keys['Enter'] && player.powerUp && !player.powerUpActive) {
        activatePowerUp(player);
    }
    
    // Update active power-ups
    updateActivePowerUps(dt);
    
    // Update AI opponents
    updateOpponentsPhysics(dt);
    
    // Check collisions
    checkCollisions();
    
    // Check if race is finished
    if (game.finishOrder.length === 5) {
        game.raceFinished = true;
    }
    
    game.frame++;
}

// Render everything
function renderGame() {
    const ctx = game.ctx;
    
    // Clear canvas
    ctx.clearRect(0, 0, game.canvas.width, game.canvas.height);
    
    // Render layers
    render.renderSky();
    render.renderTrack();
    render.renderPowerUps();
    
    // Render opponents
    opponents.forEach(opp => {
        render.renderKart(opp, false);
    });
    
    // Render player
    render.renderKart(player, true);
    
    // Render HUD
    render.renderHUD();
}

// Game loop
let lastTime = 0;
function gameLoop(currentTime = 0) {
    const dt = Math.min((currentTime - lastTime) / 1000, 0.1); // Cap delta time
    lastTime = currentTime;
    
    if (dt > 0) {
        update(dt);
    }
    
    renderGame();
    requestAnimationFrame(gameLoop);
}

// Make startGame available globally
window.startGame = startGame;

// Initialize on load
window.addEventListener('DOMContentLoaded', init);