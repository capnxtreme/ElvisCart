// Collision detection system
import { player } from './player.js';
import { opponents } from './opponents.js';

const COLLISION_DISTANCE = 200;
const COLLISION_WIDTH = 150;

export function checkCollisions() {
    // Check player vs opponents
    opponents.forEach(opp => {
        const distZ = Math.abs(player.position - opp.position);
        const distX = Math.abs(player.x - opp.x);
        
        if (distZ < COLLISION_DISTANCE && distX < COLLISION_WIDTH) {
            handleCollision(player, opp);
        }
    });
    
    // Check opponent vs opponent
    for (let i = 0; i < opponents.length; i++) {
        for (let j = i + 1; j < opponents.length; j++) {
            const opp1 = opponents[i];
            const opp2 = opponents[j];
            
            const distZ = Math.abs(opp1.position - opp2.position);
            const distX = Math.abs(opp1.x - opp2.x);
            
            if (distZ < COLLISION_DISTANCE && distX < COLLISION_WIDTH) {
                handleCollision(opp1, opp2);
            }
        }
    }
}

function handleCollision(kart1, kart2) {
    // Skip if either kart is shielded
    if (kart1.shielded || kart2.shielded) {
        // Bouncy shield effect
        if (kart1.shielded && !kart2.shielded) {
            kart2.speed *= 0.5;
            kart2.lateralVelocity += (kart2.x - kart1.x) * 0.5;
        } else if (kart2.shielded && !kart1.shielded) {
            kart1.speed *= 0.5;
            kart1.lateralVelocity += (kart1.x - kart2.x) * 0.5;
        }
        return;
    }
    
    // Calculate collision physics
    const speedDiff = kart1.speed - kart2.speed;
    const xDiff = kart1.x - kart2.x;
    
    // Transfer momentum
    const impactForce = Math.abs(speedDiff) * 0.1;
    
    // Apply collision effects
    if (speedDiff > 0) {
        // Kart1 hitting kart2 from behind
        kart1.speed *= 0.8;
        kart2.speed = Math.min(kart2.speed + impactForce * 20, kart2.maxSpeed);
        
        // Lateral push
        kart1.lateralVelocity -= xDiff * 0.1;
        kart2.lateralVelocity += xDiff * 0.2;
    } else {
        // Kart2 hitting kart1 from behind
        kart2.speed *= 0.8;
        kart1.speed = Math.min(kart1.speed + impactForce * 20, kart1.maxSpeed);
        
        // Lateral push
        kart2.lateralVelocity += xDiff * 0.1;
        kart1.lateralVelocity -= xDiff * 0.2;
    }
    
    // Add some randomness for more dynamic collisions
    kart1.lateralVelocity += (Math.random() - 0.5) * 5;
    kart2.lateralVelocity += (Math.random() - 0.5) * 5;
    
    // Set collision timer for visual feedback
    kart1.collisionTimer = 0.5;
    kart2.collisionTimer = 0.5;
    
    // Separate karts to prevent overlap
    const separation = COLLISION_WIDTH - Math.abs(xDiff);
    if (separation > 0) {
        if (xDiff > 0) {
            kart1.x += separation / 2;
            kart2.x -= separation / 2;
        } else {
            kart1.x -= separation / 2;
            kart2.x += separation / 2;
        }
    }
}