// Player kart management
import { PLAYER_MAX_SPEED, PLAYER_ACCELERATION } from './constants.js';

export const player = {
    x: 0,
    y: 0,
    position: 0,
    speed: 0,
    maxSpeed: PLAYER_MAX_SPEED,
    acceleration: PLAYER_ACCELERATION,
    steering: 0,
    drifting: false,
    driftAngle: 0,
    driftPower: 0,
    boostPower: 0,
    lateralVelocity: 0,
    lap: 0,
    checkpoint: 0,
    finished: false,
    finishTime: 0,
    powerUp: null,
    powerUpActive: null,
    powerUpTimer: 0,
    shielded: false,
    slipping: false,
    collisionTimer: 0
};

export function resetPlayer() {
    player.x = 0;
    player.position = 0;
    player.speed = 0;
    player.steering = 0;
    player.drifting = false;
    player.driftAngle = 0;
    player.driftPower = 0;
    player.boostPower = 0;
    player.lateralVelocity = 0;
    player.lap = 0;
    player.checkpoint = 0;
    player.finished = false;
    player.finishTime = 0;
    player.powerUp = null;
    player.powerUpActive = null;
    player.powerUpTimer = 0;
    player.shielded = false;
    player.slipping = false;
    player.collisionTimer = 0;
}