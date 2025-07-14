// Rendering functions
import { game } from './gameState.js';
import { player } from './player.js';
import { opponents } from './opponents.js';
import { segments } from './track.js';
import { powerUps } from './powerups.js';
import { TRACK_WIDTH, SEGMENT_LENGTH, TRACK_LENGTH, POWERUP_TYPES } from './constants.js';

const ctx = () => game.ctx;
const canvas = () => game.canvas;

// Project 3D coordinates to 2D screen
export function project(worldX, worldY, worldZ, cameraX, cameraY, cameraZ) {
    const scale = 300 / Math.max(1, worldZ - cameraZ);
    const screenX = (worldX - cameraX) * scale + canvas().width / 2;
    const screenY = canvas().height / 2 - (worldY - cameraY) * scale;
    const w = Math.max(1, scale * TRACK_WIDTH);
    return { x: screenX, y: screenY, w: w, scale: scale };
}

export function renderSky() {
    const gradient = ctx().createLinearGradient(0, 0, 0, canvas().height / 2);
    const timeOfDay = (game.frame * 0.001) % 1;
    
    if (timeOfDay < 0.3) {
        // Dawn
        gradient.addColorStop(0, '#FF6B6B');
        gradient.addColorStop(0.5, '#FFE66D');
        gradient.addColorStop(1, '#87CEEB');
    } else if (timeOfDay < 0.7) {
        // Day
        gradient.addColorStop(0, '#87CEEB');
        gradient.addColorStop(1, '#98D8E8');
    } else {
        // Dusk
        gradient.addColorStop(0, '#4A5C6A');
        gradient.addColorStop(0.5, '#FF6B6B');
        gradient.addColorStop(1, '#FFB6C1');
    }
    
    ctx().fillStyle = gradient;
    ctx().fillRect(0, 0, canvas().width, canvas().height);
    
    // Sun/Moon
    const celestialY = 80;
    const celestialX = canvas().width * 0.8;
    ctx().fillStyle = timeOfDay < 0.7 ? '#FFD700' : '#F0E68C';
    ctx().beginPath();
    ctx().arc(celestialX, celestialY, 40, 0, Math.PI * 2);
    ctx().fill();
    
    // Clouds
    ctx().fillStyle = 'rgba(255, 255, 255, 0.6)';
    for (let i = 0; i < 5; i++) {
        const cloudX = (i * 200 + game.frame * 0.1) % (canvas().width + 100) - 50;
        const cloudY = 50 + i * 30;
        
        ctx().beginPath();
        ctx().arc(cloudX, cloudY, 30, 0, Math.PI * 2);
        ctx().arc(cloudX + 25, cloudY, 35, 0, Math.PI * 2);
        ctx().arc(cloudX + 50, cloudY, 30, 0, Math.PI * 2);
        ctx().fill();
    }
    
    // Mountains
    ctx().fillStyle = '#4A5C6A';
    ctx().beginPath();
    ctx().moveTo(0, canvas().height / 2);
    for (let x = 0; x <= canvas().width; x += 50) {
        const mountainHeight = Math.sin(x * 0.01) * 50 + Math.cos(x * 0.02) * 30 + canvas().height / 2 - 100;
        ctx().lineTo(x, mountainHeight);
    }
    ctx().lineTo(canvas().width, canvas().height / 2);
    ctx().closePath();
    ctx().fill();
}

export function renderTrack() {
    const baseSegment = Math.floor(player.position / SEGMENT_LENGTH);
    const currentSegment = segments[baseSegment % TRACK_LENGTH] || segments[0];
    const cameraHeight = currentSegment.y + 300;
    const cameraZ = player.position;
    const drawDistance = 50;
    
    for (let n = drawDistance; n > 0; n--) {
        const segmentIndex = (baseSegment + n) % TRACK_LENGTH;
        const segment = segments[segmentIndex];
        
        if (!segment) continue;
        
        const segmentZ = (baseSegment + n) * SEGMENT_LENGTH;
        
        const p1 = project(
            -TRACK_WIDTH / 2 + segment.curve * 100,
            segment.y,
            segmentZ,
            player.x,
            cameraHeight,
            cameraZ
        );
        
        const p2 = project(
            TRACK_WIDTH / 2 + segment.curve * 100,
            segment.y,
            segmentZ,
            player.x,
            cameraHeight,
            cameraZ
        );
        
        if (p1.w > 0 && p1.scale > 0 && p1.y > 0 && p1.y < canvas().height) {
            // Draw grass
            const grassGradient = ctx().createLinearGradient(0, p1.y, 0, canvas().height);
            const grassColor1 = n % 2 ? '#2d5a1e' : '#2d6a1e';
            const grassColor2 = n % 2 ? '#1d4a0e' : '#1d5a0e';
            grassGradient.addColorStop(0, grassColor1);
            grassGradient.addColorStop(1, grassColor2);
            ctx().fillStyle = grassGradient;
            ctx().fillRect(0, p1.y, canvas().width, canvas().height - p1.y);
            
            // Draw road
            const roadGradient = ctx().createLinearGradient(p1.x, 0, p2.x, 0);
            roadGradient.addColorStop(0, '#303030');
            roadGradient.addColorStop(0.5, segment.color);
            roadGradient.addColorStop(1, '#303030');
            ctx().fillStyle = roadGradient;
            ctx().beginPath();
            ctx().moveTo(p1.x, p1.y);
            ctx().lineTo(p2.x, p2.y);
            
            if (n > 1) {
                const prevSegmentIndex = (baseSegment + n - 1) % TRACK_LENGTH;
                const prevSegment = segments[prevSegmentIndex];
                const prevZ = (baseSegment + n - 1) * SEGMENT_LENGTH;
                
                const p3 = project(
                    TRACK_WIDTH / 2 + prevSegment.curve * 100,
                    prevSegment.y,
                    prevZ,
                    player.x,
                    cameraHeight,
                    cameraZ
                );
                
                const p4 = project(
                    -TRACK_WIDTH / 2 + prevSegment.curve * 100,
                    prevSegment.y,
                    prevZ,
                    player.x,
                    cameraHeight,
                    cameraZ
                );
                
                ctx().lineTo(p3.x, p3.y);
                ctx().lineTo(p4.x, p4.y);
            }
            
            ctx().closePath();
            ctx().fill();
            
            // Draw start/finish line
            if (segment.isFinishLine && p1.scale > 0.5) {
                const checkerSize = 40 * p1.scale;
                const numCheckers = Math.floor(p1.w / checkerSize);
                
                for (let c = 0; c < numCheckers; c++) {
                    ctx().fillStyle = (c % 2) ? '#000' : '#FFF';
                    ctx().fillRect(p1.x + c * checkerSize, p1.y - 10, checkerSize, 20);
                }
                
                if (p1.scale > 2) {
                    ctx().fillStyle = '#FFD700';
                    ctx().font = 'bold 48px Arial';
                    ctx().textAlign = 'center';
                    ctx().fillText('START/FINISH', canvas().width / 2, p1.y - 50);
                }
            }
            
            // Draw rumble strips
            if (n % 2) {
                ctx().strokeStyle = segment.sideColor;
                ctx().lineWidth = p1.w * 0.02;
                ctx().beginPath();
                ctx().moveTo(p1.x - p1.w * 0.05, p1.y);
                ctx().lineTo(p1.x, p1.y);
                ctx().stroke();
                
                ctx().beginPath();
                ctx().moveTo(p2.x, p2.y);
                ctx().lineTo(p2.x + p2.w * 0.05, p2.y);
                ctx().stroke();
            }
            
            // Draw center line
            if (n % 4 < 2) {
                ctx().strokeStyle = '#ffffff';
                ctx().lineWidth = 2;
                ctx().setLineDash([10, 10]);
                ctx().beginPath();
                ctx().moveTo((p1.x + p2.x) / 2, p1.y);
                if (n > 1) {
                    const prevSegmentIndex = (baseSegment + n - 1) % TRACK_LENGTH;
                    const prevSegment = segments[prevSegmentIndex];
                    const prevZ = (baseSegment + n - 1) * SEGMENT_LENGTH;
                    
                    const p3 = project(
                        prevSegment.curve * 100,
                        prevSegment.y,
                        prevZ,
                        player.x,
                        cameraHeight,
                        cameraZ
                    );
                    ctx().lineTo(p3.x, p3.y);
                }
                ctx().stroke();
                ctx().setLineDash([]);
            }
            
            // Draw roadside objects
            renderRoadsideObjects(segment, p1, p2, player.x);
        }
    }
}

function renderRoadsideObjects(segment, p1, p2, cameraX) {
    if (segment.roadside && p1.scale > 0.4 && p1.scale < 15) {
        segment.roadside.forEach(obj => {
            const objX = p1.x + (obj.x - cameraX) * p1.scale;
            const objY = p1.y;
            const objW = obj.sprite.width * p1.scale;
            const objH = obj.sprite.height * p1.scale;
            
            ctx().fillStyle = obj.sprite.color;
            
            switch(obj.type) {
                case 'palmTree':
                    // Trunk
                    ctx().fillStyle = '#8B4513';
                    ctx().fillRect(objX - objW/6, objY - objH, objW/3, objH);
                    // Leaves
                    ctx().fillStyle = '#228B22';
                    ctx().beginPath();
                    ctx().arc(objX, objY - objH, objW/2, 0, Math.PI * 2);
                    ctx().fill();
                    break;
                    
                case 'cactus':
                    ctx().fillStyle = '#2F4F2F';
                    ctx().fillRect(objX - objW/2, objY - objH, objW, objH);
                    ctx().fillRect(objX - objW, objY - objH/2, objW/3, objH/3);
                    ctx().fillRect(objX + objW*0.7, objY - objH*0.7, objW/3, objH/3);
                    break;
                    
                case 'billboard':
                    ctx().fillStyle = '#654321';
                    ctx().fillRect(objX - 5, objY - objH, 10, objH);
                    ctx().fillStyle = '#FFD700';
                    ctx().fillRect(objX - objW/2, objY - objH, objW, objH/2);
                    ctx().fillStyle = '#000';
                    ctx().font = Math.floor(objH/8) + 'px Arial';
                    ctx().fillText('ELVIS', objX - objW/3, objY - objH*0.7);
                    break;
                    
                case 'diner':
                    ctx().fillStyle = '#FF69B4';
                    ctx().fillRect(objX - objW/2, objY - objH, objW, objH);
                    ctx().fillStyle = '#8B0000';
                    ctx().beginPath();
                    ctx().moveTo(objX - objW/2 - 20, objY - objH);
                    ctx().lineTo(objX + objW/2 + 20, objY - objH);
                    ctx().lineTo(objX, objY - objH - 40);
                    ctx().closePath();
                    ctx().fill();
                    ctx().fillStyle = '#FFF';
                    ctx().font = Math.floor(objH/6) + 'px Arial';
                    ctx().fillText('DINER', objX - objW/4, objY - objH/2);
                    break;
                    
                case 'gasStation':
                    ctx().fillStyle = '#DC143C';
                    ctx().fillRect(objX - objW/2, objY - objH, objW, 20);
                    ctx().fillStyle = '#B22222';
                    ctx().fillRect(objX - objW/3, objY - objH + 20, 30, objH - 20);
                    ctx().fillRect(objX + objW/4, objY - objH + 20, 30, objH - 20);
                    break;
            }
        });
    }
}

export function renderPowerUps() {
    const baseSegment = Math.floor(player.position / SEGMENT_LENGTH);
    const currentSegment = segments[baseSegment % TRACK_LENGTH] || segments[0];
    const cameraHeight = currentSegment.y + 300;
    const cameraZ = player.position;
    const drawDistance = 50;
    
    powerUps.forEach(powerUp => {
        if (powerUp.collected) return;
        
        const segmentZ = powerUp.segmentIndex * SEGMENT_LENGTH;
        const powerUpZ = segmentZ - player.position;
        
        if (powerUpZ > -200 && powerUpZ < drawDistance * SEGMENT_LENGTH) {
            const segment = segments[powerUp.segmentIndex];
            if (!segment) return;
            
            const projected = project(
                powerUp.x,
                segment.y - 50,
                segmentZ,
                player.x,
                cameraHeight,
                cameraZ
            );
            
            if (projected.scale > 0.2 && projected.scale < 5) {
                const size = 60 * projected.scale;
                const powerUpData = POWERUP_TYPES[powerUp.type];
                
                ctx().save();
                ctx().translate(projected.x, projected.y);
                
                const gradient = ctx().createRadialGradient(0, 0, 0, 0, 0, size);
                gradient.addColorStop(0, powerUpData.color);
                gradient.addColorStop(1, 'rgba(255,255,255,0)');
                ctx().fillStyle = gradient;
                ctx().fillRect(-size, -size, size * 2, size * 2);
                
                ctx().fillStyle = powerUpData.color;
                ctx().fillRect(-size/2, -size/2, size, size);
                
                ctx().fillStyle = '#FFF';
                ctx().font = Math.floor(size * 0.8) + 'px Arial';
                ctx().textAlign = 'center';
                ctx().textBaseline = 'middle';
                ctx().fillText(powerUpData.icon, 0, 0);
                
                ctx().restore();
            }
        }
    });
}

export function renderKart(kart, isPlayer = false) {
    const kartSize = isPlayer ? 80 : 80;
    
    if (!isPlayer) {
        // For opponents, calculate their screen position
        const oppZ = kart.position - player.position;
        if (oppZ <= -500 || oppZ >= 50 * SEGMENT_LENGTH) return;
        
        const baseSegment = Math.floor(player.position / SEGMENT_LENGTH);
        const currentSegment = segments[baseSegment % TRACK_LENGTH] || segments[0];
        const cameraHeight = currentSegment.y + 300;
        const cameraZ = player.position;
        
        const oppSegmentIndex = Math.floor(kart.position / SEGMENT_LENGTH) % TRACK_LENGTH;
        const oppSegment = segments[oppSegmentIndex] || segments[0];
        
        const oppProjected = project(
            kart.x,
            oppSegment.y,
            kart.position,
            player.x,
            cameraHeight,
            cameraZ
        );
        
        if (oppProjected.scale <= 0.1 || oppProjected.scale >= 10 || oppProjected.y >= canvas().height - 50) return;
        
        const oppKartSize = kartSize * oppProjected.scale;
        
        ctx().save();
        ctx().translate(oppProjected.x, oppProjected.y);
        renderKartSprite(kart, oppKartSize, opponents.indexOf(kart) + 2);
        ctx().restore();
    } else {
        // Player kart at fixed position
        ctx().save();
        ctx().translate(canvas().width / 2, canvas().height - 100);
        renderKartSprite(kart, kartSize, 1);
        ctx().restore();
    }
}

function renderKartSprite(kart, size, number) {
    const rotation = kart.steering * 0.5 + (kart.driftAngle || 0) * 0.3;
    
    // Draw shadow first (always)
    ctx().fillStyle = 'rgba(0,0,0,0.3)';
    ctx().beginPath();
    ctx().ellipse(0, size * 0.4, size * 0.6, size * 0.2, 0, 0, Math.PI * 2);
    ctx().fill();
    
    // If kart has a sprite sheet, use it
    if (kart.spriteSheet && kart.spriteSheet.complete) {
        // Calculate which frame to use based on rotation
        const frames = 16;
        let frameIndex = Math.round(((rotation + Math.PI) / (Math.PI * 2)) * frames) % frames;
        
        // Draw the sprite
        const spriteSize = 64;
        ctx().save();
        ctx().imageSmoothingEnabled = false;
        
        // Draw effects behind sprite
        renderKartEffects(kart, size);
        
        // Draw collision flash
        if (kart.collisionTimer && kart.collisionTimer > 0) {
            ctx().fillStyle = '#FFF';
            ctx().globalAlpha = kart.collisionTimer * 2;
            ctx().fillRect(-size/2 - 10, -size/2 - 10, size + 20, size + 20);
            ctx().globalAlpha = 1;
        }
        
        // Draw sprite
        try {
            ctx().drawImage(
                kart.spriteSheet,
                frameIndex * spriteSize, 0,  // Source x, y
                spriteSize, spriteSize,       // Source width, height
                -size/2, -size/2,            // Dest x, y
                size, size                    // Dest width, height
            );
            
            // Draw name tag for sprites
            if (kart.name) {
                ctx().fillStyle = '#FFF';
                ctx().font = '14px Arial';
                ctx().textAlign = 'center';
                ctx().fillText(kart.name, 0, -size);
                ctx().textAlign = 'left';
            }
        } catch (e) {
            // Fallback if sprite fails
            ctx().restore();
            ctx().save();
            ctx().rotate(rotation);
            renderKartEffects(kart, size);
            renderBasicKart(kart, size, number);
        }
        
        ctx().restore();
        return;
    }
    
    // Fallback to basic kart rendering
    ctx().save();
    ctx().rotate(rotation);
    renderKartEffects(kart, size);
    renderBasicKart(kart, size, number);
    ctx().restore();
}

function renderKartEffects(kart, size) {
    
    // Enhanced drift smoke
    if (kart.drifting || (kart.driftPower && kart.driftPower > 0.5)) {
        const smokeIntensity = kart.drifting ? 0.5 : 0.3;
        ctx().globalAlpha = smokeIntensity * ((kart.driftPower || 0) / 3);
        
        for (let i = 0; i < 5; i++) {
            ctx().fillStyle = '#ffffff';
            ctx().beginPath();
            const offsetX = -40 + Math.random() * 80;
            const offsetY = 30 + Math.random() * 30;
            const smokeSize = 15 + Math.random() * 25 + (kart.driftPower || 0) * 5;
            ctx().arc(offsetX, offsetY, smokeSize, 0, Math.PI * 2);
            ctx().fill();
        }
        
        ctx().globalAlpha = 0.2;
        ctx().fillStyle = '#000000';
        ctx().fillRect(-size/2 - 10, size/4, 20, 40);
        ctx().fillRect(size/2 - 10, size/4, 20, 40);
        
        ctx().globalAlpha = 1;
    }
    
    // Boost flames
    if (kart.boostPower && kart.boostPower > 0) {
        ctx().save();
        ctx().globalAlpha = kart.boostPower / 3;
        
        const flameColors = ['#FFD700', '#FF6347', '#FF1493'];
        for (let i = 0; i < 3; i++) {
            ctx().fillStyle = flameColors[i];
            ctx().beginPath();
            const flameSize = 20 + i * 10;
            const flameOffset = size/2 + i * 15;
            ctx().moveTo(-20, flameOffset);
            ctx().lineTo(20, flameOffset);
            ctx().lineTo(0, flameOffset + flameSize + Math.random() * 10);
            ctx().closePath();
            ctx().fill();
        }
        ctx().restore();
    }
}

function renderBasicKart(kart, size, number) {
    // Shadow
    ctx().fillStyle = 'rgba(0,0,0,0.3)';
    ctx().beginPath();
    ctx().ellipse(0, size * 0.4, size * 0.6, size * 0.2, 0, 0, Math.PI * 2);
    ctx().fill();
    
    // Collision flash
    if (kart.collisionTimer && kart.collisionTimer > 0) {
        ctx().fillStyle = '#FFF';
        ctx().globalAlpha = kart.collisionTimer * 2;
        ctx().fillRect(-size/2 - 10, -size/2 - 10, size + 20, size * 0.7 + 20);
        ctx().globalAlpha = 1;
    }
    
    // Kart body
    ctx().fillStyle = kart.color || '#ff1493';
    ctx().fillRect(-size/2, -size/2, size, size * 0.7);
    
    // Number
    if (number > 1) {
        ctx().fillStyle = '#FFF';
        ctx().font = Math.floor(size * 0.4) + 'px Arial';
        ctx().textAlign = 'center';
        ctx().fillText(number.toString(), 0, -size * 0.1);
    }
    
    // Windshield
    ctx().fillStyle = 'rgba(65, 105, 225, 0.7)';
    ctx().fillRect(-size/3, -size/3, size * 0.66, size * 0.3);
    
    // Wheels
    ctx().fillStyle = '#000';
    ctx().fillRect(-size/2 - 10, -size/2 + 5, 20, 30);
    ctx().fillRect(size/2 - 10, -size/2 + 5, 20, 30);
    ctx().fillRect(-size/2 - 10, size/4, 20, 30);
    ctx().fillRect(size/2 - 10, size/4, 20, 30);
    
    // Name tag
    if (kart.name) {
        ctx().fillStyle = '#FFF';
        ctx().font = '14px Arial';
        ctx().textAlign = 'center';
        ctx().fillText(kart.name, 0, -size);
    }
}

export function renderHUD() {
    // Speed
    ctx().fillStyle = '#ffffff';
    ctx().font = 'bold 48px Courier New';
    ctx().fillText(Math.floor(player.speed) + ' MPH', 50, 80);
    
    // Lap counter
    ctx().font = 'bold 36px Courier New';
    ctx().fillStyle = '#FFD700';
    ctx().fillText(`LAP ${Math.min(player.lap + 1, game.totalLaps)}/${game.totalLaps}`, 50, 130);
    
    // Power-up display
    if (player.powerUp) {
        const powerUpData = POWERUP_TYPES[player.powerUp];
        ctx().fillStyle = powerUpData.color;
        ctx().fillRect(50, 160, 150, 80);
        
        ctx().fillStyle = '#000';
        ctx().fillRect(55, 165, 140, 70);
        
        ctx().fillStyle = '#FFF';
        ctx().font = '40px Arial';
        ctx().textAlign = 'center';
        ctx().fillText(powerUpData.icon, 125, 210);
        
        ctx().font = '14px Arial';
        ctx().fillText('ENTER to use', 125, 225);
        ctx().textAlign = 'left';
    }
    
    // Active power-up indicator
    if (player.powerUpActive) {
        const powerUpData = POWERUP_TYPES[player.powerUpActive];
        ctx().fillStyle = powerUpData.color;
        ctx().globalAlpha = 0.3 + Math.sin(game.frame * 0.1) * 0.2;
        ctx().fillRect(0, 0, canvas().width, 10);
        ctx().fillRect(0, canvas().height - 10, canvas().width, 10);
        ctx().globalAlpha = 1;
    }
    
    // Shield effect
    if (player.shielded) {
        ctx().strokeStyle = '#4169E1';
        ctx().lineWidth = 3;
        ctx().globalAlpha = 0.5 + Math.sin(game.frame * 0.1) * 0.2;
        ctx().beginPath();
        ctx().arc(canvas().width / 2, canvas().height - 100, 100, 0, Math.PI * 2);
        ctx().stroke();
        ctx().globalAlpha = 1;
    }
    
    // Countdown
    if (!game.raceStarted) {
        ctx().font = 'bold 120px Arial';
        ctx().fillStyle = game.countdown > 1 ? '#FFD700' : '#FF0000';
        ctx().textAlign = 'center';
        ctx().fillText(Math.ceil(game.countdown).toString(), canvas().width / 2, canvas().height / 2);
        ctx().textAlign = 'left';
    } else if (game.frame < 120) {
        ctx().font = 'bold 120px Arial';
        ctx().fillStyle = '#00FF00';
        ctx().textAlign = 'center';
        ctx().fillText('GO!', canvas().width / 2, canvas().height / 2);
        ctx().textAlign = 'left';
    }
    
    // Race standings
    const racers = [
        { name: 'You', position: player.position + player.lap * TRACK_LENGTH * SEGMENT_LENGTH, 
          lap: player.lap, color: '#FF1493' },
        ...opponents.map(opp => ({ 
            name: opp.name, 
            position: opp.position + opp.lap * TRACK_LENGTH * SEGMENT_LENGTH,
            lap: opp.lap,
            color: opp.color 
        }))
    ].sort((a, b) => b.position - a.position);
    
    ctx().font = 'bold 20px Courier New';
    ctx().fillStyle = '#FFF';
    ctx().fillText('RACE STANDINGS', canvas().width - 250, 30);
    
    racers.forEach((racer, index) => {
        const isPlayer = racer.name === 'You';
        ctx().font = (isPlayer ? 'bold ' : '') + '18px Courier New';
        ctx().fillStyle = isPlayer ? '#FFD700' : racer.color;
        const lapText = racer.lap >= game.totalLaps ? 'FIN' : `L${racer.lap + 1}`;
        ctx().fillText(`${index + 1}. ${racer.name} ${lapText}`, canvas().width - 250, 60 + index * 25);
    });
    
    // Drift indicator
    if (player.drifting || player.driftPower > 0) {
        ctx().fillStyle = '#FFD700';
        ctx().font = 'bold 36px Courier New';
        ctx().fillText('DRIFT!', canvas().width / 2 - 80, 100);
        
        const meterWidth = 200;
        const meterHeight = 20;
        const meterX = canvas().width / 2 - meterWidth / 2;
        const meterY = 120;
        
        ctx().fillStyle = 'rgba(0,0,0,0.5)';
        ctx().fillRect(meterX, meterY, meterWidth, meterHeight);
        
        const powerColor = player.driftPower > 2 ? '#FF1493' : '#FFD700';
        ctx().fillStyle = powerColor;
        ctx().fillRect(meterX, meterY, meterWidth * (player.driftPower / 3), meterHeight);
        
        ctx().strokeStyle = '#ffffff';
        ctx().lineWidth = 2;
        ctx().strokeRect(meterX, meterY, meterWidth, meterHeight);
    }
    
    // Boost indicator
    if (player.boostPower > 0) {
        ctx().save();
        ctx().globalAlpha = 0.8;
        ctx().fillStyle = '#00FFFF';
        ctx().font = 'bold 48px Courier New';
        ctx().fillText('BOOST!', canvas().width / 2 - 100, 200);
        
        ctx().strokeStyle = '#00FFFF';
        ctx().lineWidth = 3;
        ctx().globalAlpha = player.boostPower / 3;
        for (let i = 0; i < 10; i++) {
            ctx().beginPath();
            const y = Math.random() * canvas().height;
            ctx().moveTo(0, y);
            ctx().lineTo(100, y);
            ctx().moveTo(canvas().width - 100, y);
            ctx().lineTo(canvas().width, y);
            ctx().stroke();
        }
        ctx().restore();
    }
    
    // Race finished
    if (game.raceFinished) {
        ctx().fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx().fillRect(0, 0, canvas().width, canvas().height);
        
        ctx().fillStyle = '#FFD700';
        ctx().font = 'bold 60px Arial';
        ctx().textAlign = 'center';
        ctx().fillText('RACE FINISHED!', canvas().width / 2, 150);
        
        ctx().font = '30px Arial';
        game.finishOrder.forEach((racer, index) => {
            ctx().fillStyle = index === 0 ? '#FFD700' : '#FFF';
            const minutes = Math.floor(racer.time / 60);
            const seconds = (racer.time % 60).toFixed(2);
            ctx().fillText(`${index + 1}. ${racer.name} - ${minutes}:${seconds.padStart(5, '0')}`, 
                        canvas().width / 2, 220 + index * 40);
        });
        ctx().textAlign = 'left';
    }
}