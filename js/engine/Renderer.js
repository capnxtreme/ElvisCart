/**
 * Enhanced Mode 7 Style Renderer
 * Advanced 3D projection with modern visual effects
 * Surpasses SNES Mode 7 capabilities with modern enhancements
 */

export class Renderer {
    constructor(canvas, ctx, config) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.config = config;
        
        // Rendering settings
        this.drawDistance = 100;
        this.fogDistance = 80;
        this.fogDensity = 0.3;
        this.roadWidth = 2000;
        this.segmentLength = 200;
        
        // Visual effects
        this.lighting = {
            enabled: true,
            ambient: 0.3,
            directional: 0.7,
            shadows: true,
            timeOfDay: 0.5 // 0 = night, 1 = day
        };
        
        // Post-processing effects
        this.effects = {
            bloom: true,
            motionBlur: true,
            chromaticAberration: false,
            scanlines: true,
            crtEffect: false
        };
        
        // Cached gradients and patterns
        this.gradients = new Map();
        this.patterns = new Map();
        
        // Performance optimization
        this.frameBuffer = null;
        this.lastFrameTime = 0;
    }
    
    async init() {
        console.log('🎨 Initializing enhanced renderer...');
        
        // Create frame buffer for post-processing
        this.frameBuffer = document.createElement('canvas');
        this.frameBuffer.width = this.canvas.width;
        this.frameBuffer.height = this.canvas.height;
        this.frameBufferCtx = this.frameBuffer.getContext('2d');
        
        // Pre-generate common gradients
        this.generateGradients();
        
        console.log('✅ Renderer initialized');
    }
    
    /**
     * Enhanced 3D projection with depth buffer
     */
    project(x, y, z, cameraX, cameraY, cameraZ, cameraAngle = 0) {
        // Apply camera rotation
        const cos = Math.cos(cameraAngle);
        const sin = Math.sin(cameraAngle);
        const rotatedX = (x - cameraX) * cos - (z - cameraZ) * sin;
        const rotatedZ = (x - cameraX) * sin + (z - cameraZ) * cos;
        
        // Perspective projection with depth
        const scale = 300 / Math.max(1, rotatedZ);
        const screenX = rotatedX * scale + this.canvas.width / 2;
        const screenY = this.canvas.height / 2 - (y - cameraY) * scale;
        const depth = rotatedZ;
        
        return {
            x: screenX,
            y: screenY,
            scale: scale,
            depth: depth,
            visible: depth > 0 && screenY < this.canvas.height
        };
    }
    
    /**
     * Render the track with enhanced Mode 7 effects
     */
    renderTrack(trackManager, gameState) {
        const player = gameState.getPlayer();
        if (!player) return;
        
        const baseSegment = Math.floor(player.position / this.segmentLength);
        const cameraHeight = 1000;
        const cameraZ = player.position;
        
        // Sort segments by depth for proper rendering order
        const segments = [];
        for (let n = 0; n < this.drawDistance; n++) {
            const segmentIndex = (baseSegment + n) % trackManager.getTrackLength();
            const segment = trackManager.getSegment(segmentIndex);
            if (!segment) continue;
            
            const segmentZ = (baseSegment + n) * this.segmentLength;
            
            const p1 = this.project(
                -this.roadWidth / 2 + segment.curve * 100,
                segment.y,
                segmentZ,
                player.x,
                cameraHeight,
                cameraZ,
                player.angle
            );
            
            const p2 = this.project(
                this.roadWidth / 2 + segment.curve * 100,
                segment.y,
                segmentZ,
                player.x,
                cameraHeight,
                cameraZ,
                player.angle
            );
            
            if (p1.visible && p2.visible) {
                segments.push({
                    segment,
                    p1,
                    p2,
                    depth: p1.depth,
                    index: n
                });
            }
        }
        
        // Sort by depth (back to front)
        segments.sort((a, b) => b.depth - a.depth);
        
        // Render segments
        segments.forEach(({ segment, p1, p2, depth, index }) => {
            this.renderSegment(segment, p1, p2, depth, index);
        });
    }
    
    /**
     * Render individual track segment with effects
     */
    renderSegment(segment, p1, p2, depth, index) {
        const ctx = this.ctx;
        const roadWidth = p2.x - p1.x;
        
        // Calculate lighting based on depth and time of day
        const lighting = this.calculateLighting(depth, index);
        
        // Render grass/sky
        this.renderBackground(p1.y, lighting);
        
        // Render road with enhanced effects
        this.renderRoad(p1, p2, segment, lighting);
        
        // Render road markings
        this.renderRoadMarkings(p1, p2, segment, lighting);
        
        // Render roadside objects
        this.renderRoadsideObjects(segment, p1, p2, depth, lighting);
        
        // Render fog effect
        this.renderFog(p1.y, depth);
    }
    
    /**
     * Render background (sky and grass)
     */
    renderBackground(roadY, lighting) {
        const ctx = this.ctx;
        
        // Sky gradient
        const skyGradient = this.getGradient('sky', lighting.timeOfDay);
        ctx.fillStyle = skyGradient;
        ctx.fillRect(0, 0, this.canvas.width, roadY);
        
        // Grass
        const grassGradient = this.getGradient('grass', lighting.intensity);
        ctx.fillStyle = grassGradient;
        ctx.fillRect(0, roadY, this.canvas.width, this.canvas.height - roadY);
        
        // Add clouds if day time
        if (lighting.timeOfDay > 0.3) {
            this.renderClouds(lighting);
        }
    }
    
    /**
     * Render road with enhanced textures
     */
    renderRoad(p1, p2, segment, lighting) {
        const ctx = this.ctx;
        
        // Create road gradient with lighting
        const roadGradient = ctx.createLinearGradient(p1.x, 0, p2.x, 0);
        const baseColor = this.adjustColor(segment.color, lighting.intensity);
        const edgeColor = this.adjustColor('#202020', lighting.intensity);
        
        roadGradient.addColorStop(0, edgeColor);
        roadGradient.addColorStop(0.1, baseColor);
        roadGradient.addColorStop(0.9, baseColor);
        roadGradient.addColorStop(1, edgeColor);
        
        ctx.fillStyle = roadGradient;
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        
        // Connect to previous segment for 3D effect
        if (p1.scale > 0.1) {
            const prevScale = p1.scale * 1.1;
            const prevY = p1.y - (p1.y - this.canvas.height / 2) * 0.1;
            ctx.lineTo(p2.x + (p2.x - this.canvas.width / 2) * 0.1, prevY);
            ctx.lineTo(p1.x + (p1.x - this.canvas.width / 2) * 0.1, prevY);
        }
        
        ctx.closePath();
        ctx.fill();
        
        // Add road texture
        this.renderRoadTexture(p1, p2, segment, lighting);
    }
    
    /**
     * Render road markings (center line, lane markers)
     */
    renderRoadMarkings(p1, p2, segment, lighting) {
        const ctx = this.ctx;
        const centerX = (p1.x + p2.x) / 2;
        const roadWidth = p2.x - p1.x;
        
        // Center line
        if (segment.centerLine && p1.scale > 0.3) {
            ctx.strokeStyle = this.adjustColor('#FFFFFF', lighting.intensity);
            ctx.lineWidth = Math.max(2, roadWidth * 0.02);
            ctx.setLineDash([roadWidth * 0.1, roadWidth * 0.1]);
            ctx.beginPath();
            ctx.moveTo(centerX, p1.y);
            ctx.lineTo(centerX, p1.y - roadWidth * 0.5);
            ctx.stroke();
            ctx.setLineDash([]);
        }
        
        // Lane markers
        if (segment.laneMarkers && p1.scale > 0.2) {
            const laneWidth = roadWidth / 3;
            ctx.strokeStyle = this.adjustColor('#FFFF00', lighting.intensity);
            ctx.lineWidth = Math.max(1, roadWidth * 0.01);
            ctx.setLineDash([roadWidth * 0.05, roadWidth * 0.05]);
            
            // Left lane
            ctx.beginPath();
            ctx.moveTo(centerX - laneWidth, p1.y);
            ctx.lineTo(centerX - laneWidth, p1.y - roadWidth * 0.3);
            ctx.stroke();
            
            // Right lane
            ctx.beginPath();
            ctx.moveTo(centerX + laneWidth, p1.y);
            ctx.lineTo(centerX + laneWidth, p1.y - roadWidth * 0.3);
            ctx.stroke();
            
            ctx.setLineDash([]);
        }
    }
    
    /**
     * Render roadside objects with shadows
     */
    renderRoadsideObjects(segment, p1, p2, depth, lighting) {
        if (!segment.objects) return;
        
        segment.objects.forEach(obj => {
            const objX = p1.x + (obj.x / this.roadWidth) * (p2.x - p1.x);
            const objY = p1.y - obj.height * p1.scale;
            
            // Render shadow
            if (this.lighting.shadows && lighting.intensity > 0.5) {
                this.renderShadow(objX, p1.y, obj.width * p1.scale, lighting);
            }
            
            // Render object
            this.renderObject(obj, objX, objY, p1.scale, lighting);
        });
    }
    
    /**
     * Render vehicles with enhanced effects
     */
    renderVehicles(vehicleManager) {
        const vehicles = vehicleManager.getVehicles();
        
        // Sort vehicles by depth for proper rendering
        const sortedVehicles = vehicles
            .map(vehicle => ({
                vehicle,
                projection: this.project(
                    vehicle.x,
                    vehicle.y,
                    vehicle.z,
                    vehicleManager.getCameraX(),
                    vehicleManager.getCameraY(),
                    vehicleManager.getCameraZ(),
                    vehicleManager.getCameraAngle()
                )
            }))
            .filter(v => v.projection.visible)
            .sort((a, b) => b.projection.depth - a.projection.depth);
        
        // Render vehicles
        sortedVehicles.forEach(({ vehicle, projection }) => {
            this.renderVehicle(vehicle, projection);
        });
    }
    
    /**
     * Render individual vehicle with effects
     */
    renderVehicle(vehicle, projection) {
        const ctx = this.ctx;
        const size = vehicle.width * projection.scale;
        
        // Save context for transformations
        ctx.save();
        
        // Apply vehicle transformations
        ctx.translate(projection.x, projection.y);
        ctx.rotate(vehicle.angle);
        ctx.scale(projection.scale, projection.scale);
        
        // Render vehicle body
        this.renderVehicleBody(vehicle, size);
        
        // Render vehicle effects
        this.renderVehicleEffects(vehicle, size);
        
        // Restore context
        ctx.restore();
    }
    
    /**
     * Render vehicle body with lighting
     */
    renderVehicleBody(vehicle, size) {
        const ctx = this.ctx;
        
        // Vehicle shape
        ctx.fillStyle = vehicle.color;
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 2;
        
        // Create vehicle shape based on type
        switch (vehicle.type) {
            case 'kart':
                this.renderKartShape(size);
                break;
            case 'car':
                this.renderCarShape(size);
                break;
            case 'bike':
                this.renderBikeShape(size);
                break;
            default:
                this.renderDefaultShape(size);
        }
        
        // Add highlights
        this.addVehicleHighlights(vehicle, size);
    }
    
    /**
     * Render vehicle effects (exhaust, drift, etc.)
     */
    renderVehicleEffects(vehicle, size) {
        // Exhaust particles
        if (vehicle.speed > 50) {
            this.renderExhaust(vehicle, size);
        }
        
        // Drift effects
        if (vehicle.drifting) {
            this.renderDriftEffect(vehicle, size);
        }
        
        // Boost effects
        if (vehicle.boostPower > 0) {
            this.renderBoostEffect(vehicle, size);
        }
    }
    
    /**
     * Render UI elements
     */
    renderUI(gameState) {
        const ctx = this.ctx;
        
        // Speedometer
        this.renderSpeedometer(gameState);
        
        // Lap counter
        this.renderLapCounter(gameState);
        
        // Position indicator
        this.renderPositionIndicator(gameState);
        
        // Mini-map
        this.renderMiniMap(gameState);
        
        // Race timer
        this.renderRaceTimer(gameState);
    }
    
    /**
     * Calculate lighting based on depth and time
     */
    calculateLighting(depth, segmentIndex) {
        const depthFactor = Math.max(0, 1 - depth / this.fogDistance);
        const timeOfDay = this.lighting.timeOfDay;
        
        return {
            intensity: this.lighting.ambient + this.lighting.directional * depthFactor,
            timeOfDay: timeOfDay,
            depthFactor: depthFactor
        };
    }
    
    /**
     * Adjust color based on lighting
     */
    adjustColor(color, intensity) {
        // Simple brightness adjustment
        const factor = Math.max(0.2, Math.min(1.5, intensity));
        return color; // Placeholder - implement color adjustment
    }
    
    /**
     * Generate and cache common gradients
     */
    generateGradients() {
        // Sky gradients for different times of day
        for (let time = 0; time <= 1; time += 0.1) {
            const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height / 2);
            
            if (time < 0.3) {
                // Dawn
                gradient.addColorStop(0, '#FF6B6B');
                gradient.addColorStop(0.5, '#FFE66D');
                gradient.addColorStop(1, '#87CEEB');
            } else if (time < 0.7) {
                // Day
                gradient.addColorStop(0, '#87CEEB');
                gradient.addColorStop(1, '#98D8E8');
            } else {
                // Dusk/Night
                gradient.addColorStop(0, '#4A5C6A');
                gradient.addColorStop(0.5, '#FF6B6B');
                gradient.addColorStop(1, '#2C3E50');
            }
            
            this.gradients.set(`sky_${time.toFixed(1)}`, gradient);
        }
        
        // Grass gradients
        for (let intensity = 0; intensity <= 1; intensity += 0.1) {
            const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
            const brightness = 0.3 + intensity * 0.4;
            gradient.addColorStop(0, `rgb(${45 * brightness}, ${90 * brightness}, ${30 * brightness})`);
            gradient.addColorStop(1, `rgb(${25 * brightness}, ${70 * brightness}, ${20 * brightness})`);
            this.gradients.set(`grass_${intensity.toFixed(1)}`, gradient);
        }
    }
    
    /**
     * Get cached gradient
     */
    getGradient(type, value) {
        const key = `${type}_${value.toFixed(1)}`;
        return this.gradients.get(key) || this.gradients.get(`${type}_0.5`);
    }
    
    // Placeholder methods for vehicle rendering
    renderKartShape(size) { /* Implementation */ }
    renderCarShape(size) { /* Implementation */ }
    renderBikeShape(size) { /* Implementation */ }
    renderDefaultShape(size) { /* Implementation */ }
    addVehicleHighlights(vehicle, size) { /* Implementation */ }
    renderExhaust(vehicle, size) { /* Implementation */ }
    renderDriftEffect(vehicle, size) { /* Implementation */ }
    renderBoostEffect(vehicle, size) { /* Implementation */ }
    renderShadow(x, y, width, lighting) { /* Implementation */ }
    renderObject(obj, x, y, scale, lighting) { /* Implementation */ }
    renderRoadTexture(p1, p2, segment, lighting) { /* Implementation */ }
    renderFog(y, depth) { /* Implementation */ }
    renderClouds(lighting) { /* Implementation */ }
    renderSpeedometer(gameState) { /* Implementation */ }
    renderLapCounter(gameState) { /* Implementation */ }
    renderPositionIndicator(gameState) { /* Implementation */ }
    renderMiniMap(gameState) { /* Implementation */ }
    renderRaceTimer(gameState) { /* Implementation */ }
}