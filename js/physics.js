// Physics and movement updates
import { player } from './player.js';
import { opponents } from './opponents.js';
import { segments, getSegment } from './track.js';
import { game } from './gameState.js';
import { keys } from './input.js';
import { TRACK_LENGTH, SEGMENT_LENGTH } from './constants.js';

export function updatePlayer(dt) {
    if (game.state !== 'racing' || !game.raceStarted || player.finished) return;
    
    // Handle acceleration
    if (keys['ArrowUp']) {
        player.speed += player.acceleration + player.boostPower * 5;
        if (player.speed > player.maxSpeed + player.boostPower * 200) {
            player.speed = player.maxSpeed + player.boostPower * 200;
        }
    } else {
        player.speed -= player.acceleration * 2;
        if (player.speed < 0) player.speed = 0;
    }
    
    // Handle steering with drift mechanics
    const turnSpeed = 4 * (player.speed / player.maxSpeed);
    const wasDrifting = player.drifting;
    
    if (keys['ArrowLeft'] && player.speed > 50) {
        player.steering = Math.max(player.steering - 0.08, -0.5);
        player.lateralVelocity -= turnSpeed;
    } else if (keys['ArrowRight'] && player.speed > 50) {
        player.steering = Math.min(player.steering + 0.08, 0.5);
        player.lateralVelocity += turnSpeed;
    } else {
        player.steering *= 0.85;
    }
    
    // Drift mechanics
    player.drifting = keys[' '] && player.speed > player.maxSpeed * 0.4 && Math.abs(player.steering) > 0.1;
    
    if (player.drifting) {
        // Increase drift angle and power while drifting
        player.driftAngle = player.steering * 1.5;
        player.driftPower = Math.min(player.driftPower + dt * 2, 3);
        player.lateralVelocity += player.driftAngle * turnSpeed * 0.7;
        
        // Add some opposite lock for realism
        if (Math.abs(player.lateralVelocity) > 5) {
            player.lateralVelocity *= 0.95;
        }
    } else {
        // Release drift boost when stopping drift
        if (wasDrifting && player.driftPower > 1) {
            player.boostPower = player.driftPower * 0.5;
        }
        player.driftAngle *= 0.9;
        player.driftPower = Math.max(player.driftPower - dt * 4, 0);
    }
    
    // Apply boost decay
    player.boostPower = Math.max(player.boostPower - dt * 2, 0);
    
    // Apply lateral movement with grip
    if (!player.drifting) {
        player.x += player.lateralVelocity;
        player.lateralVelocity *= 0.85; // Grip when not drifting
    } else {
        player.x += player.lateralVelocity * 1.2; // Slide more when drifting
        player.lateralVelocity *= 0.92;
    }
    
    // Update position
    player.position += (player.speed + player.boostPower * 200) * dt;
    
    // Track boundaries with smooth collision
    const limit = 900;
    if (player.x < -limit || player.x > limit) {
        player.x = Math.max(-limit, Math.min(limit, player.x));
        player.lateralVelocity *= -0.5; // Bounce off walls
        player.speed *= 0.8; // Slow down on wall hit
    }
    
    // Check for checkpoint and lap completion
    const currentSegment = getSegment(player.position);
    
    // Checkpoint tracking
    if (currentSegment && currentSegment.checkpoint && player.checkpoint === 0) {
        player.checkpoint = 1;
    }
    
    // Lap completion
    if (currentSegment && currentSegment.isFinishLine && player.checkpoint === 1) {
        player.lap++;
        player.checkpoint = 0;
        
        // Check for race completion
        if (player.lap >= game.totalLaps && !player.finished) {
            player.finished = true;
            player.finishTime = game.frame / 60; // Time in seconds
            game.finishOrder.push({ name: 'You', time: player.finishTime });
        }
    }
    
    // Loop track position (but keep counting total distance)
    while (player.position >= TRACK_LENGTH * SEGMENT_LENGTH) {
        player.position -= TRACK_LENGTH * SEGMENT_LENGTH;
    }
}

export function updateOpponents(dt) {
    opponents.forEach((opp, index) => {
        // Get track segment info for AI
        const oppSegment = getSegment(opp.position);
        const nextSegmentIndex = (Math.floor(opp.position / SEGMENT_LENGTH) + 5) % TRACK_LENGTH;
        const nextSegment = segments[nextSegmentIndex] || segments[0];
        
        // Don't move if finished
        if (opp.finished) {
            opp.speed = 0;
            return;
        }
        
        // AI acceleration - rubber band effect
        const distanceToPlayer = player.position + (player.lap * TRACK_LENGTH * SEGMENT_LENGTH) 
                               - (opp.position + (opp.lap * TRACK_LENGTH * SEGMENT_LENGTH));
        const rubberBand = distanceToPlayer > 2000 ? 1.3 : (distanceToPlayer < -2000 ? 0.8 : 1);
        
        opp.speed += 20 * rubberBand;
        if (opp.speed > opp.maxSpeed * rubberBand) {
            opp.speed = opp.maxSpeed * rubberBand;
        }
        
        // AI steering - follow racing line with personality
        const racingLine = -oppSegment.curve * 100 - nextSegment.curve * 50;
        opp.targetX = racingLine + (Math.sin(opp.position * 0.01 + index) * 200 * opp.personality);
        
        // Smooth steering
        const steerDirection = Math.sign(opp.targetX - opp.x);
        opp.steering = steerDirection * 0.3;
        
        // Apply lateral velocity from collisions
        opp.x += (opp.targetX - opp.x) * 0.1 + opp.lateralVelocity * dt;
        opp.lateralVelocity *= 0.9; // Friction
        
        // Random boost for more dynamic racing
        if (Math.random() < 0.01 && oppSegment.curve < 1) {
            opp.boostPower = 2;
        }
        opp.boostPower = Math.max(0, opp.boostPower - dt * 2);
        
        // Update position
        opp.position += (opp.speed + opp.boostPower * 100) * dt;
        
        // Keep on track
        opp.x = Math.max(-800, Math.min(800, opp.x));
        
        // Update collision timer
        if (opp.collisionTimer > 0) {
            opp.collisionTimer -= dt;
        }
        
        // Check for checkpoint and lap completion
        if (oppSegment.checkpoint && opp.checkpoint === 0) {
            opp.checkpoint = 1;
        }
        
        if (oppSegment.isFinishLine && opp.checkpoint === 1) {
            opp.lap++;
            opp.checkpoint = 0;
            
            // Check for race completion
            if (opp.lap >= game.totalLaps && !opp.finished) {
                opp.finished = true;
                opp.finishTime = game.frame / 60;
                game.finishOrder.push({ name: opp.name, time: opp.finishTime });
            }
        }
        
        // Loop track
        while (opp.position >= TRACK_LENGTH * SEGMENT_LENGTH) {
            opp.position -= TRACK_LENGTH * SEGMENT_LENGTH;
        }
    });
}