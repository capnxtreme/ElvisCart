// AI opponent management
import { OPPONENT_NAMES, OPPONENT_COLORS } from './constants.js';

export const opponents = [];

export function initOpponents() {
    opponents.length = 0; // Clear existing
    
    for (let i = 0; i < 4; i++) {
        opponents.push({
            name: OPPONENT_NAMES[i],
            color: OPPONENT_COLORS[i],
            x: (i - 1.5) * 300,  // Spread across starting line
            position: -i * 100,    // Behind starting line
            speed: 0,
            maxSpeed: 500 + Math.random() * 100,  // Varying skill levels
            steering: 0,
            targetX: 0,
            personality: Math.random(),  // Affects driving style
            boostPower: 0,
            lap: 0,
            checkpoint: 0,
            finished: false,
            finishTime: 0,
            powerUp: null,
            powerUpActive: null,
            powerUpTimer: 0,
            shielded: false,
            slipping: false,
            lateralVelocity: 0,
            collisionTimer: 0
        });
    }
}