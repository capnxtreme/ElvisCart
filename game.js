// ElvisCart - Simple but fun rockabilly kart racer
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game state
const game = {
    state: 'menu', // menu, racing, results
    frame: 0
};

// Player kart
const player = {
    x: 0,
    y: 0,
    position: 0,
    speed: 0,
    maxSpeed: 300,
    acceleration: 10,
    steering: 0,
    drifting: false,
    driftAngle: 0,
    driftPower: 0,
    boostPower: 0,
    lateralVelocity: 0
};

// Input handling
const keys = {};
window.addEventListener('keydown', e => keys[e.key] = true);
window.addEventListener('keyup', e => keys[e.key] = false);

// Track segments
const segments = [];
const segmentLength = 200;
const trackLength = 100;
const trackWidth = 2000;

// Initialize track with curves and hills
function initTrack() {
    console.log('Initializing track with', trackLength, 'segments');
    for (let i = 0; i < trackLength; i++) {
        segments.push({
            index: i,
            curve: Math.sin(i * 0.05) * 3, // Curves
            y: Math.sin(i * 0.05) * 100 + Math.cos(i * 0.03) * 100, // Hills
            color: i % 2 === 0 ? '#555' : '#666', // Alternating road colors
            sideColor: i % 2 === 0 ? '#ff0000' : '#ffffff' // Rumble strips
        });
    }
    console.log('Track initialized with', segments.length, 'segments');
}

// Project 3D coordinates to 2D screen
function project(worldX, worldY, worldZ, cameraX, cameraY, cameraZ) {
    const scale = 300 / Math.max(1, worldZ - cameraZ);
    const screenX = (worldX - cameraX) * scale + canvas.width / 2;
    const screenY = canvas.height / 2 - (worldY - cameraY) * scale;
    const w = Math.max(1, scale * trackWidth);
    return { x: screenX, y: screenY, w: w, scale: scale };
}

// Start game
function startGame() {
    document.getElementById('startScreen').style.display = 'none';
    game.state = 'racing';
    initTrack();
    gameLoop();
}

// Update game logic
function update(dt) {
    if (game.state !== 'racing') return;
    
    // Handle acceleration
    if (keys['ArrowUp']) {
        player.speed += player.acceleration + player.boostPower;
        if (player.speed > player.maxSpeed + player.boostPower * 50) {
            player.speed = player.maxSpeed + player.boostPower * 50;
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
    player.position += (player.speed + player.boostPower * 50) * dt;
    
    // Track boundaries with smooth collision
    const limit = 900;
    if (player.x < -limit || player.x > limit) {
        player.x = Math.max(-limit, Math.min(limit, player.x));
        player.lateralVelocity *= -0.5; // Bounce off walls
        player.speed *= 0.8; // Slow down on wall hit
    }
    
    // Loop track
    while (player.position >= trackLength * segmentLength) {
        player.position -= trackLength * segmentLength;
    }
    
    game.frame++;
}

// Render everything
function render() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Sky gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height / 2);
    gradient.addColorStop(0, '#87CEEB');
    gradient.addColorStop(1, '#FFB6C1');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Calculate camera position
    const baseSegment = Math.floor(player.position / segmentLength);
    const currentSegment = segments[baseSegment % trackLength] || segments[0];
    const cameraHeight = currentSegment.y + 300;
    const cameraZ = player.position;
    
    // Draw track segments from back to front
    const drawDistance = 30;
    
    for (let n = drawDistance; n > 0; n--) {
        const segmentIndex = (baseSegment + n) % trackLength;
        const segment = segments[segmentIndex];
        
        // Calculate segment position
        const segmentZ = (baseSegment + n) * segmentLength;
        
        // Get current and next segment projections
        const p1 = project(
            -trackWidth / 2 + segment.curve * 100,
            segment.y,
            segmentZ,
            player.x,
            cameraHeight,
            cameraZ
        );
        
        const p2 = project(
            trackWidth / 2 + segment.curve * 100,
            segment.y,
            segmentZ,
            player.x,
            cameraHeight,
            cameraZ
        );
        
        // Only draw if segment is visible and in front of camera
        if (p1.w > 0 && p1.scale > 0 && p1.y > 0 && p1.y < canvas.height) {
            // Draw grass
            ctx.fillStyle = n % 2 ? '#2d5a1e' : '#2d6a1e';
            ctx.fillRect(0, p1.y, canvas.width, canvas.height - p1.y);
            
            // Draw road
            ctx.fillStyle = segment.color;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            
            if (n > 1) {
                const prevSegmentIndex = (baseSegment + n - 1) % trackLength;
                const prevSegment = segments[prevSegmentIndex];
                const prevZ = (baseSegment + n - 1) * segmentLength;
                
                const p3 = project(
                    trackWidth / 2 + prevSegment.curve * 100,
                    prevSegment.y,
                    prevZ,
                    player.x,
                    cameraHeight,
                    cameraZ
                );
                
                const p4 = project(
                    -trackWidth / 2 + prevSegment.curve * 100,
                    prevSegment.y,
                    prevZ,
                    player.x,
                    cameraHeight,
                    cameraZ
                );
                
                ctx.lineTo(p3.x, p3.y);
                ctx.lineTo(p4.x, p4.y);
            }
            
            ctx.closePath();
            ctx.fill();
            
            // Draw rumble strips
            if (n % 2) {
                ctx.strokeStyle = segment.sideColor;
                ctx.lineWidth = p1.w * 0.05;
                ctx.beginPath();
                ctx.moveTo(p1.x - p1.w * 0.05, p1.y);
                ctx.lineTo(p2.x + p2.w * 0.05, p2.y);
                ctx.stroke();
            }
            
            // Draw center line
            if (n % 4 < 2) {
                ctx.strokeStyle = '#ffffff';
                ctx.lineWidth = 2;
                ctx.setLineDash([10, 10]);
                ctx.beginPath();
                ctx.moveTo((p1.x + p2.x) / 2, p1.y);
                if (n > 1) {
                    const prevSegmentIndex = (baseSegment + n - 1) % trackLength;
                    const prevSegment = segments[prevSegmentIndex];
                    const prevZ = (baseSegment + n - 1) * segmentLength;
                    
                    const p3 = project(
                        prevSegment.curve * 100,
                        prevSegment.y,
                        prevZ,
                        player.x,
                        cameraHeight,
                        cameraZ
                    );
                    ctx.lineTo(p3.x, p3.y);
                }
                ctx.stroke();
                ctx.setLineDash([]);
            }
        }
    }
    
    // Draw player kart
    const kartSize = 80;
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height - 100);
    ctx.rotate(player.steering * 0.5 + player.driftAngle * 0.3);
    
    // Enhanced drift smoke
    if (player.drifting || player.driftPower > 0.5) {
        const smokeIntensity = player.drifting ? 0.5 : 0.3;
        ctx.globalAlpha = smokeIntensity * (player.driftPower / 3);
        
        // Multiple smoke clouds
        for (let i = 0; i < 5; i++) {
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            const offsetX = -40 + Math.random() * 80;
            const offsetY = 30 + Math.random() * 30;
            const size = 15 + Math.random() * 25 + player.driftPower * 5;
            ctx.arc(offsetX, offsetY, size, 0, Math.PI * 2);
            ctx.fill();
        }
        
        // Tire marks effect
        ctx.globalAlpha = 0.2;
        ctx.fillStyle = '#000000';
        ctx.fillRect(-kartSize/2 - 10, kartSize/4, 20, 40);
        ctx.fillRect(kartSize/2 - 10, kartSize/4, 20, 40);
        
        ctx.globalAlpha = 1;
    }
    
    // Boost flames
    if (player.boostPower > 0) {
        ctx.save();
        ctx.globalAlpha = player.boostPower / 3;
        
        // Exhaust flames
        const flameColors = ['#FFD700', '#FF6347', '#FF1493'];
        for (let i = 0; i < 3; i++) {
            ctx.fillStyle = flameColors[i];
            ctx.beginPath();
            const flameSize = 20 + i * 10;
            const flameOffset = kartSize/2 + i * 15;
            ctx.moveTo(-20, flameOffset);
            ctx.lineTo(20, flameOffset);
            ctx.lineTo(0, flameOffset + flameSize + Math.random() * 10);
            ctx.closePath();
            ctx.fill();
        }
        ctx.restore();
    }
    
    // Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.beginPath();
    ctx.ellipse(0, kartSize * 0.4, kartSize * 0.6, kartSize * 0.2, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Kart body
    ctx.fillStyle = '#ff1493';
    ctx.fillRect(-kartSize / 2, -kartSize / 2, kartSize, kartSize * 0.7);
    
    // Windshield
    ctx.fillStyle = '#4169E1';
    ctx.fillRect(-kartSize / 3, -kartSize / 3, kartSize * 0.66, kartSize * 0.3);
    
    // Wheels
    ctx.fillStyle = '#000';
    ctx.fillRect(-kartSize / 2 - 10, -kartSize / 2 + 5, 20, 30);
    ctx.fillRect(kartSize / 2 - 10, -kartSize / 2 + 5, 20, 30);
    ctx.fillRect(-kartSize / 2 - 10, kartSize / 4, 20, 30);
    ctx.fillRect(kartSize / 2 - 10, kartSize / 4, 20, 30);
    
    ctx.restore();
    
    // Draw HUD
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 48px Courier New';
    ctx.fillText(Math.floor(player.speed) + ' MPH', 50, 80);
    
    // Debug info
    ctx.font = '16px Courier New';
    ctx.fillStyle = '#FFD700';
    ctx.fillText(`Position: ${Math.floor(player.position)}`, 50, 120);
    ctx.fillText(`X: ${Math.floor(player.x)}`, 50, 140);
    ctx.fillText(`Segment: ${Math.floor(player.position / segmentLength) % trackLength}`, 50, 160);
    
    // Drift indicator with power meter
    if (player.drifting || player.driftPower > 0) {
        // Drift text
        ctx.fillStyle = '#FFD700';
        ctx.font = 'bold 36px Courier New';
        ctx.fillText('DRIFT!', canvas.width / 2 - 80, 100);
        
        // Drift power meter
        const meterWidth = 200;
        const meterHeight = 20;
        const meterX = canvas.width / 2 - meterWidth / 2;
        const meterY = 120;
        
        // Background
        ctx.fillStyle = 'rgba(0,0,0,0.5)';
        ctx.fillRect(meterX, meterY, meterWidth, meterHeight);
        
        // Power fill
        const powerColor = player.driftPower > 2 ? '#FF1493' : '#FFD700';
        ctx.fillStyle = powerColor;
        ctx.fillRect(meterX, meterY, meterWidth * (player.driftPower / 3), meterHeight);
        
        // Border
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.strokeRect(meterX, meterY, meterWidth, meterHeight);
    }
    
    // Boost indicator
    if (player.boostPower > 0) {
        ctx.save();
        ctx.globalAlpha = 0.8;
        ctx.fillStyle = '#00FFFF';
        ctx.font = 'bold 48px Courier New';
        ctx.fillText('BOOST!', canvas.width / 2 - 100, 200);
        
        // Speed lines effect
        ctx.strokeStyle = '#00FFFF';
        ctx.lineWidth = 3;
        ctx.globalAlpha = player.boostPower / 3;
        for (let i = 0; i < 10; i++) {
            ctx.beginPath();
            const y = Math.random() * canvas.height;
            ctx.moveTo(0, y);
            ctx.lineTo(100, y);
            ctx.moveTo(canvas.width - 100, y);
            ctx.lineTo(canvas.width, y);
            ctx.stroke();
        }
        ctx.restore();
    }
}

// Game loop
let lastTime = 0;
function gameLoop(currentTime) {
    const dt = (currentTime - lastTime) / 1000;
    lastTime = currentTime;
    
    if (dt < 0.1) { // Prevent huge time steps
        update(dt);
    }
    
    render();
    requestAnimationFrame(gameLoop);
}

// Initialize
window.startGame = startGame;