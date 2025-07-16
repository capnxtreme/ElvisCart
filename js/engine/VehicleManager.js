/**
 * Vehicle Manager for Retro Racing Games
 * Easy vehicle creation, customization, and management
 * Supports multiple vehicle types and character themes
 */

export class VehicleManager {
    constructor() {
        this.vehicles = new Map();
        this.player = null;
        this.opponents = [];
        this.nextVehicleId = 1;
        
        // Camera settings
        this.cameraX = 0;
        this.cameraY = 1000;
        this.cameraZ = 0;
        this.cameraAngle = 0;
        
        // Vehicle templates
        this.vehicleTemplates = {
            kart: {
                type: 'kart',
                width: 80,
                height: 40,
                maxSpeed: 200,
                acceleration: 15,
                handling: 0.8,
                driftFactor: 1.2,
                weight: 100,
                grip: 0.9,
                boostMultiplier: 1.5,
                color: '#FF0000',
                sprite: 'kart_red'
            },
            car: {
                type: 'car',
                width: 100,
                height: 50,
                maxSpeed: 300,
                acceleration: 12,
                handling: 0.6,
                driftFactor: 0.8,
                weight: 200,
                grip: 0.95,
                boostMultiplier: 1.3,
                color: '#0000FF',
                sprite: 'car_blue'
            },
            bike: {
                type: 'bike',
                width: 60,
                height: 30,
                maxSpeed: 250,
                acceleration: 18,
                handling: 1.0,
                driftFactor: 1.5,
                weight: 80,
                grip: 0.85,
                boostMultiplier: 1.8,
                color: '#00FF00',
                sprite: 'bike_green'
            },
            fzero: {
                type: 'fzero',
                width: 120,
                height: 60,
                maxSpeed: 400,
                acceleration: 20,
                handling: 0.7,
                driftFactor: 0.6,
                weight: 150,
                grip: 0.98,
                boostMultiplier: 2.0,
                color: '#FFFF00',
                sprite: 'fzero_yellow'
            }
        };
        
        // Character themes
        this.characterThemes = {
            mario: {
                name: 'Mario',
                vehicle: 'kart',
                color: '#FF0000',
                sprite: 'mario_kart',
                personality: 'balanced',
                aiDifficulty: 'medium'
            },
            luigi: {
                name: 'Luigi',
                vehicle: 'kart',
                color: '#00FF00',
                sprite: 'luigi_kart',
                personality: 'cautious',
                aiDifficulty: 'medium'
            },
            peach: {
                name: 'Peach',
                vehicle: 'kart',
                color: '#FFB6C1',
                sprite: 'peach_kart',
                personality: 'aggressive',
                aiDifficulty: 'hard'
            },
            bowser: {
                name: 'Bowser',
                vehicle: 'car',
                color: '#8B4513',
                sprite: 'bowser_car',
                personality: 'aggressive',
                aiDifficulty: 'hard'
            },
            yoshi: {
                name: 'Yoshi',
                vehicle: 'bike',
                color: '#90EE90',
                sprite: 'yoshi_bike',
                personality: 'balanced',
                aiDifficulty: 'medium'
            },
            captain: {
                name: 'Captain Falcon',
                vehicle: 'fzero',
                color: '#FFD700',
                sprite: 'captain_fzero',
                personality: 'aggressive',
                aiDifficulty: 'expert'
            }
        };
    }
    
    async init() {
        console.log('🚗 Initializing vehicle manager...');
        
        // Create default vehicles
        this.createDefaultVehicles();
        
        console.log('✅ Vehicle manager initialized');
    }
    
    /**
     * Create default vehicles
     */
    createDefaultVehicles() {
        // Create player vehicle
        this.player = this.createVehicle('player', {
            type: 'kart',
            name: 'Player',
            color: '#FF0000',
            isPlayer: true
        });
        
        // Create AI opponents
        const opponents = ['mario', 'luigi', 'peach', 'bowser'];
        opponents.forEach((character, index) => {
            const opponent = this.createVehicle(`opponent_${index}`, {
                type: 'kart',
                name: this.characterThemes[character].name,
                color: this.characterThemes[character].color,
                isPlayer: false,
                aiCharacter: character
            });
            this.opponents.push(opponent);
        });
    }
    
    /**
     * Create a new vehicle
     */
    createVehicle(id, config) {
        const template = this.vehicleTemplates[config.type] || this.vehicleTemplates.kart;
        
        const vehicle = {
            id: id || `vehicle_${this.nextVehicleId++}`,
            name: config.name || 'Vehicle',
            type: config.type || 'kart',
            isPlayer: config.isPlayer || false,
            aiCharacter: config.aiCharacter || null,
            
            // Physics properties
            width: config.width || template.width,
            height: config.height || template.height,
            maxSpeed: config.maxSpeed || template.maxSpeed,
            acceleration: config.acceleration || template.acceleration,
            handling: config.handling || template.handling,
            driftFactor: config.driftFactor || template.driftFactor,
            weight: config.weight || template.weight,
            grip: config.grip || template.grip,
            boostMultiplier: config.boostMultiplier || template.boostMultiplier,
            
            // Visual properties
            color: config.color || template.color,
            sprite: config.sprite || template.sprite,
            
            // State
            x: config.x || 0,
            y: config.y || 0,
            z: config.z || 0,
            position: config.position || 0,
            angle: config.angle || 0,
            velocity: config.velocity || 0,
            lateralVelocity: config.lateralVelocity || 0,
            verticalVelocity: config.verticalVelocity || 0,
            speed: 0,
            
            // Racing state
            lap: config.lap || 0,
            checkpoint: config.checkpoint || 0,
            finished: false,
            finishTime: 0,
            position: config.racePosition || 0,
            
            // Effects
            drifting: false,
            driftAngle: 0,
            driftPower: 0,
            driftTimer: 0,
            boostPower: config.boostPower || 0,
            boostActive: false,
            collisionTimer: 0,
            
            // AI properties
            aiTargetX: 0,
            aiPersonality: config.aiPersonality || 'balanced',
            aiDifficulty: config.aiDifficulty || 'medium',
            
            // Custom properties
            ...config.custom
        };
        
        this.vehicles.set(vehicle.id, vehicle);
        
        if (vehicle.isPlayer) {
            this.player = vehicle;
        }
        
        return vehicle;
    }
    
    /**
     * Add vehicle to the game
     */
    addVehicle(config) {
        const vehicle = this.createVehicle(null, config);
        
        if (!vehicle.isPlayer) {
            this.opponents.push(vehicle);
        }
        
        return vehicle;
    }
    
    /**
     * Remove vehicle from the game
     */
    removeVehicle(vehicleId) {
        const vehicle = this.vehicles.get(vehicleId);
        if (!vehicle) return false;
        
        this.vehicles.delete(vehicleId);
        
        if (vehicle.isPlayer) {
            this.player = null;
        } else {
            const index = this.opponents.findIndex(v => v.id === vehicleId);
            if (index > -1) {
                this.opponents.splice(index, 1);
            }
        }
        
        return true;
    }
    
    /**
     * Update all vehicles
     */
    update(deltaTime) {
        // Update player
        if (this.player) {
            this.updateVehicle(this.player, deltaTime);
        }
        
        // Update opponents
        this.opponents.forEach(opponent => {
            this.updateVehicle(opponent, deltaTime);
        });
        
        // Update camera to follow player
        this.updateCamera();
    }
    
    /**
     * Update individual vehicle
     */
    updateVehicle(vehicle, deltaTime) {
        // Update AI if not player
        if (!vehicle.isPlayer) {
            this.updateAI(vehicle, deltaTime);
        }
        
        // Update vehicle state
        vehicle.speed = vehicle.velocity;
        
        // Update timers
        if (vehicle.collisionTimer > 0) {
            vehicle.collisionTimer -= deltaTime;
        }
        
        if (vehicle.driftTimer > 0) {
            vehicle.driftTimer -= deltaTime;
        }
        
        // Update boost
        if (!vehicle.boostActive) {
            vehicle.boostPower = Math.max(vehicle.boostPower - deltaTime * 1, 0);
        }
    }
    
    /**
     * Update AI for opponent vehicles
     */
    updateAI(vehicle, deltaTime) {
        const character = this.characterThemes[vehicle.aiCharacter];
        if (!character) return;
        
        // Get track information
        const trackSegment = this.getTrackSegment(vehicle.position);
        if (!trackSegment) return;
        
        // Calculate racing line
        const racingLine = -trackSegment.curve * 100;
        
        // Apply personality-based modifications
        let targetX = racingLine;
        switch (character.personality) {
            case 'aggressive':
                targetX += Math.sin(vehicle.position * 0.01) * 100;
                break;
            case 'cautious':
                targetX += Math.cos(vehicle.position * 0.01) * 50;
                break;
            case 'balanced':
            default:
                targetX += (Math.random() - 0.5) * 30;
                break;
        }
        
        // Apply difficulty-based AI
        const difficulty = character.aiDifficulty;
        let aiSpeed = vehicle.maxSpeed;
        let aiHandling = vehicle.handling;
        
        switch (difficulty) {
            case 'easy':
                aiSpeed *= 0.7;
                aiHandling *= 0.8;
                break;
            case 'medium':
                aiSpeed *= 0.85;
                aiHandling *= 0.9;
                break;
            case 'hard':
                aiSpeed *= 0.95;
                aiHandling *= 1.0;
                break;
            case 'expert':
                aiSpeed *= 1.1;
                aiHandling *= 1.1;
                break;
        }
        
        // Update AI target
        vehicle.aiTargetX = targetX;
        
        // Apply AI steering
        const steerDirection = Math.sign(targetX - vehicle.x);
        vehicle.angle += steerDirection * aiHandling * deltaTime;
        
        // Apply AI acceleration
        if (vehicle.velocity < aiSpeed) {
            vehicle.velocity += vehicle.acceleration * deltaTime;
        }
        
        // Apply lateral movement
        vehicle.x += (targetX - vehicle.x) * 0.1 * deltaTime;
    }
    
    /**
     * Update camera to follow player
     */
    updateCamera() {
        if (!this.player) return;
        
        // Follow player position
        this.cameraX = this.player.x;
        this.cameraY = this.player.y + 1000;
        this.cameraZ = this.player.position;
        this.cameraAngle = this.player.angle;
    }
    
    /**
     * Get all vehicles
     */
    getVehicles() {
        return Array.from(this.vehicles.values());
    }
    
    /**
     * Get vehicle by ID
     */
    getVehicle(vehicleId) {
        return this.vehicles.get(vehicleId);
    }
    
    /**
     * Get player vehicle
     */
    getPlayer() {
        return this.player;
    }
    
    /**
     * Get opponent vehicles
     */
    getOpponents() {
        return this.opponents;
    }
    
    /**
     * Get vehicle count
     */
    getVehicleCount() {
        return this.vehicles.size;
    }
    
    /**
     * Get camera position
     */
    getCameraX() {
        return this.cameraX;
    }
    
    getCameraY() {
        return this.cameraY;
    }
    
    getCameraZ() {
        return this.cameraZ;
    }
    
    getCameraAngle() {
        return this.cameraAngle;
    }
    
    /**
     * Set vehicle position
     */
    setVehiclePosition(vehicleId, x, y, z, position) {
        const vehicle = this.vehicles.get(vehicleId);
        if (!vehicle) return;
        
        vehicle.x = x;
        vehicle.y = y;
        vehicle.z = z;
        vehicle.position = position;
    }
    
    /**
     * Set vehicle properties
     */
    setVehicleProperties(vehicleId, properties) {
        const vehicle = this.vehicles.get(vehicleId);
        if (!vehicle) return;
        
        Object.assign(vehicle, properties);
    }
    
    /**
     * Reset vehicle to start position
     */
    resetVehicle(vehicleId) {
        const vehicle = this.vehicles.get(vehicleId);
        if (!vehicle) return;
        
        vehicle.x = 0;
        vehicle.y = 0;
        vehicle.z = 0;
        vehicle.position = 0;
        vehicle.angle = 0;
        vehicle.velocity = 0;
        vehicle.lateralVelocity = 0;
        vehicle.verticalVelocity = 0;
        vehicle.speed = 0;
        vehicle.lap = 0;
        vehicle.checkpoint = 0;
        vehicle.finished = false;
        vehicle.finishTime = 0;
        vehicle.drifting = false;
        vehicle.driftAngle = 0;
        vehicle.driftPower = 0;
        vehicle.driftTimer = 0;
        vehicle.boostPower = 0;
        vehicle.boostActive = false;
        vehicle.collisionTimer = 0;
    }
    
    /**
     * Reset all vehicles
     */
    resetAllVehicles() {
        this.vehicles.forEach(vehicle => {
            this.resetVehicle(vehicle.id);
        });
    }
    
    /**
     * Get track segment (placeholder - would be provided by track manager)
     */
    getTrackSegment(position) {
        // This would be implemented to get track data
        return {
            curve: 0,
            y: 0,
            color: '#404040'
        };
    }
    
    /**
     * Create character vehicle
     */
    createCharacterVehicle(characterName, config = {}) {
        const character = this.characterThemes[characterName];
        if (!character) {
            throw new Error(`Character '${characterName}' not found`);
        }
        
        return this.createVehicle(null, {
            type: character.vehicle,
            name: character.name,
            color: character.color,
            sprite: character.sprite,
            aiCharacter: characterName,
            aiPersonality: character.personality,
            aiDifficulty: character.aiDifficulty,
            ...config
        });
    }
    
    /**
     * Get available characters
     */
    getAvailableCharacters() {
        return Object.keys(this.characterThemes);
    }
    
    /**
     * Get character theme
     */
    getCharacterTheme(characterName) {
        return this.characterThemes[characterName];
    }
    
    /**
     * Add custom character
     */
    addCustomCharacter(name, theme) {
        this.characterThemes[name] = theme;
    }
    
    /**
     * Get vehicle template
     */
    getVehicleTemplate(type) {
        return this.vehicleTemplates[type];
    }
    
    /**
     * Add custom vehicle template
     */
    addVehicleTemplate(type, template) {
        this.vehicleTemplates[type] = template;
    }
    
    /**
     * Sort vehicles by race position
     */
    sortVehiclesByPosition() {
        const vehicles = this.getVehicles();
        return vehicles.sort((a, b) => {
            // Finished vehicles first
            if (a.finished && !b.finished) return -1;
            if (!a.finished && b.finished) return 1;
            
            // Then by lap
            if (a.lap !== b.lap) return b.lap - a.lap;
            
            // Then by position
            return b.position - a.position;
        });
    }
    
    /**
     * Get race positions
     */
    getRacePositions() {
        const sortedVehicles = this.sortVehiclesByPosition();
        return sortedVehicles.map((vehicle, index) => ({
            position: index + 1,
            vehicle: vehicle
        }));
    }
}