// Power-up system
import { POWERUP_TYPES, TRACK_LENGTH, TRACK_WIDTH, SEGMENT_LENGTH } from './constants.js';
import { player } from './player.js';
import { opponents } from './opponents.js';

export const powerUps = [];

export function initPowerUps() {
    powerUps.length = 0; // Clear existing
    
    // Place power-ups at regular intervals
    for (let i = 0; i < 20; i++) {
        const segmentIndex = (i * 10 + 5) % TRACK_LENGTH;
        const types = Object.keys(POWERUP_TYPES);
        const type = types[Math.floor(Math.random() * types.length)];
        
        powerUps.push({
            type: type,
            segmentIndex: segmentIndex,
            x: (Math.random() - 0.5) * TRACK_WIDTH * 0.6,
            collected: false,
            respawnTimer: 0
        });
    }
}

export function updatePowerUps(dt) {
    powerUps.forEach(powerUp => {
        // Respawn timer
        if (powerUp.collected && powerUp.respawnTimer > 0) {
            powerUp.respawnTimer -= dt;
            if (powerUp.respawnTimer <= 0) {
                powerUp.collected = false;
            }
        }
        
        // Check collision with player
        if (!powerUp.collected && !player.powerUp) {
            const powerUpPos = powerUp.segmentIndex * SEGMENT_LENGTH;
            const distance = Math.abs(player.position - powerUpPos);
            const xDistance = Math.abs(player.x - powerUp.x);
            
            if (distance < 100 && xDistance < 150) {
                powerUp.collected = true;
                powerUp.respawnTimer = 10; // 10 seconds to respawn
                player.powerUp = powerUp.type;
            }
        }
    });
}

export function activatePowerUp(kart) {
    const type = kart.powerUp;
    const powerUpData = POWERUP_TYPES[type];
    
    switch(type) {
        case 'chromeLightning':
            kart.boostPower = powerUpData.boost;
            break;
            
        case 'blueSuedeShield':
            kart.shielded = true;
            kart.powerUpTimer = powerUpData.duration;
            kart.powerUpActive = type;
            break;
            
        case 'duckTailDraft':
            kart.maxSpeed *= 1.3;
            kart.powerUpTimer = powerUpData.duration;
            kart.powerUpActive = type;
            break;
            
        case 'pomadeSlick':
            // Drop oil slick behind
            // For now, just affect nearby opponents
            opponents.forEach(opp => {
                if (Math.abs(opp.position - kart.position) < 500) {
                    opp.slipping = true;
                    opp.lateralVelocity += (Math.random() - 0.5) * 20;
                }
            });
            break;
            
        case 'jukeboxBlast':
            // Blast nearby opponents
            opponents.forEach(opp => {
                const dist = Math.abs(opp.position - kart.position);
                if (dist < powerUpData.radius) {
                    opp.speed *= 0.5;
                    opp.lateralVelocity += (Math.random() - 0.5) * 30;
                }
            });
            break;
    }
    
    kart.powerUp = null; // Consume power-up
}

export function updateActivePowerUps(dt) {
    // Player power-ups
    if (player.powerUpActive) {
        player.powerUpTimer -= dt;
        if (player.powerUpTimer <= 0) {
            // Deactivate power-up
            if (player.powerUpActive === 'blueSuedeShield') {
                player.shielded = false;
            } else if (player.powerUpActive === 'duckTailDraft') {
                player.maxSpeed /= 1.3;
            }
            player.powerUpActive = null;
        }
    }
    
    // Clear slipping effect
    if (player.slipping) {
        player.lateralVelocity *= 0.9;
        if (Math.abs(player.lateralVelocity) < 1) {
            player.slipping = false;
        }
    }
    
    // Update collision timer
    if (player.collisionTimer > 0) {
        player.collisionTimer -= dt;
    }
}