// AI opponent management
import { OPPONENT_NAMES, OPPONENT_COLORS } from './constants.js';
import { getAllCharacters, calculateStats } from './characters.js';
import { getCharacterSpriteSheet } from './characterSprites.js';

export const opponents = [];

export function initOpponents() {
    opponents.length = 0; // Clear existing
    const characters = getAllCharacters();
    
    for (let i = 0; i < 4; i++) {
        const character = characters[i % characters.length];
        const stats = calculateStats(character);
        
        opponents.push({
            name: character.name,
            color: character.color,
            character: character,
            spriteSheet: getCharacterSpriteSheet(character.id),
            x: (i - 1.5) * 300,  // Spread across starting line
            position: -i * 100,    // Behind starting line
            speed: 0,
            maxSpeed: stats.maxSpeed,
            acceleration: stats.acceleration,
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