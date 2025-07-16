/**
 * Advanced Physics Engine for Retro Racing Games
 * Supports multiple vehicle types with realistic physics
 * Enhanced beyond SNES capabilities with modern physics simulation
 */

export class PhysicsEngine {
    constructor() {
        // Physics constants
        this.gravity = 9.8;
        this.airResistance = 0.02;
        this.roadFriction = 0.85;
        this.grassFriction = 0.6;
        this.sandFriction = 0.4;
        
        // Vehicle physics profiles
        this.vehicleProfiles = {
            kart: {
                maxSpeed: 200,
                acceleration: 15,
                handling: 0.8,
                driftFactor: 1.2,
                weight: 100,
                grip: 0.9,
                boostMultiplier: 1.5
            },
            car: {
                maxSpeed: 300,
                acceleration: 12,
                handling: 0.6,
                driftFactor: 0.8,
                weight: 200,
                grip: 0.95,
                boostMultiplier: 1.3
            },
            bike: {
                maxSpeed: 250,
                acceleration: 18,
                handling: 1.0,
                driftFactor: 1.5,
                weight: 80,
                grip: 0.85,
                boostMultiplier: 1.8
            },
            fzero: {
                maxSpeed: 400,
                acceleration: 20,
                handling: 0.7,
                driftFactor: 0.6,
                weight: 150,
                grip: 0.98,
                boostMultiplier: 2.0
            }
        };
        
        // Collision detection
        this.collisionGrid = [];
        this.gridSize = 100;
        
        // Particle systems for effects
        this.particles = [];
        
        // Track surface types
        this.surfaceTypes = {
            asphalt: { friction: 0.85, grip: 1.0, speedMultiplier: 1.0 },
            dirt: { friction: 0.6, grip: 0.7, speedMultiplier: 0.8 },
            grass: { friction: 0.5, grip: 0.5, speedMultiplier: 0.6 },
            sand: { friction: 0.4, grip: 0.3, speedMultiplier: 0.5 },
            ice: { friction: 0.2, grip: 0.2, speedMultiplier: 0.7 },
            boost: { friction: 0.9, grip: 1.0, speedMultiplier: 1.5 }
        };
    }
    
    async init() {
        console.log('⚡ Initializing physics engine...');
        this.initCollisionGrid();
        console.log('✅ Physics engine initialized');
    }
    
    /**
     * Initialize collision detection grid
     */
    initCollisionGrid() {
        this.collisionGrid = [];
        for (let x = 0; x < 20; x++) {
            this.collisionGrid[x] = [];
            for (let z = 0; z < 20; z++) {
                this.collisionGrid[x][z] = [];
            }
        }
    }
    
    /**
     * Update physics for all vehicles
     */
    update(deltaTime) {
        // Update collision grid
        this.updateCollisionGrid();
        
        // Update particles
        this.updateParticles(deltaTime);
        
        // Check collisions
        this.checkCollisions();
    }
    
    /**
     * Update vehicle physics
     */
    updateVehicle(vehicle, input, deltaTime) {
        const profile = this.vehicleProfiles[vehicle.type] || this.vehicleProfiles.kart;
        const surface = this.getSurfaceType(vehicle.position);
        
        // Apply input forces
        this.applyInput(vehicle, input, profile, deltaTime);
        
        // Apply physics forces
        this.applyPhysics(vehicle, profile, surface, deltaTime);
        
        // Update position and velocity
        this.updatePosition(vehicle, deltaTime);
        
        // Apply constraints
        this.applyConstraints(vehicle);
        
        // Update vehicle state
        this.updateVehicleState(vehicle, deltaTime);
    }
    
    /**
     * Apply input forces to vehicle
     */
    applyInput(vehicle, input, profile, deltaTime) {
        // Acceleration
        if (input.accelerate) {
            const acceleration = profile.acceleration * (1 + vehicle.boostPower * profile.boostMultiplier);
            vehicle.velocity += acceleration * deltaTime;
        } else if (input.brake) {
            vehicle.velocity -= profile.acceleration * 2 * deltaTime;
        } else {
            // Natural deceleration
            vehicle.velocity -= profile.acceleration * 0.5 * deltaTime;
        }
        
        // Steering
        if (input.steer !== 0) {
            const turnRate = profile.handling * (vehicle.velocity / profile.maxSpeed);
            vehicle.angle += input.steer * turnRate * deltaTime;
            
            // Apply lateral force for realistic turning
            const lateralForce = input.steer * turnRate * vehicle.velocity * 0.1;
            vehicle.lateralVelocity += lateralForce * deltaTime;
        }
        
        // Drifting
        if (input.drift && Math.abs(input.steer) > 0.1 && vehicle.velocity > 50) {
            vehicle.drifting = true;
            vehicle.driftAngle = input.steer * profile.driftFactor;
            vehicle.driftPower = Math.min(vehicle.driftPower + deltaTime * 2, 3);
        } else {
            vehicle.drifting = false;
            vehicle.driftPower = Math.max(vehicle.driftPower - deltaTime * 4, 0);
        }
        
        // Boost
        if (input.boost && vehicle.boostPower > 0) {
            vehicle.boostActive = true;
        } else {
            vehicle.boostActive = false;
        }
    }
    
    /**
     * Apply physics forces
     */
    applyPhysics(vehicle, profile, surface, deltaTime) {
        // Apply surface friction
        const friction = surface.friction * (vehicle.drifting ? 0.7 : 1.0);
        vehicle.velocity *= Math.pow(friction, deltaTime);
        
        // Apply air resistance
        vehicle.velocity *= Math.pow(1 - this.airResistance, deltaTime);
        
        // Apply gravity (for jumps/hills)
        vehicle.verticalVelocity -= this.gravity * deltaTime;
        vehicle.y += vehicle.verticalVelocity * deltaTime;
        
        // Ground collision
        if (vehicle.y <= 0) {
            vehicle.y = 0;
            vehicle.verticalVelocity = 0;
        }
        
        // Apply grip to lateral movement
        const grip = surface.grip * profile.grip;
        if (!vehicle.drifting) {
            vehicle.lateralVelocity *= Math.pow(grip, deltaTime);
        } else {
            vehicle.lateralVelocity *= Math.pow(grip * 0.8, deltaTime);
        }
        
        // Apply drift forces
        if (vehicle.drifting) {
            const driftForce = vehicle.driftAngle * vehicle.velocity * 0.1;
            vehicle.lateralVelocity += driftForce * deltaTime;
        }
        
        // Apply boost
        if (vehicle.boostActive) {
            vehicle.velocity += profile.acceleration * profile.boostMultiplier * deltaTime;
            vehicle.boostPower = Math.max(vehicle.boostPower - deltaTime * 3, 0);
        }
        
        // Speed limits
        const maxSpeed = profile.maxSpeed * surface.speedMultiplier * (1 + vehicle.boostPower * 0.5);
        vehicle.velocity = Math.max(0, Math.min(vehicle.velocity, maxSpeed));
    }
    
    /**
     * Update vehicle position
     */
    updatePosition(vehicle, deltaTime) {
        // Calculate forward movement
        const forwardX = Math.cos(vehicle.angle) * vehicle.velocity * deltaTime;
        const forwardZ = Math.sin(vehicle.angle) * vehicle.velocity * deltaTime;
        
        // Calculate lateral movement
        const lateralX = Math.cos(vehicle.angle + Math.PI/2) * vehicle.lateralVelocity * deltaTime;
        const lateralZ = Math.sin(vehicle.angle + Math.PI/2) * vehicle.lateralVelocity * deltaTime;
        
        // Update position
        vehicle.x += forwardX + lateralX;
        vehicle.z += forwardZ + lateralZ;
        vehicle.position += vehicle.velocity * deltaTime;
    }
    
    /**
     * Apply physical constraints
     */
    applyConstraints(vehicle) {
        // Track boundaries
        const trackLimit = 1000;
        if (Math.abs(vehicle.x) > trackLimit) {
            vehicle.x = Math.sign(vehicle.x) * trackLimit;
            vehicle.lateralVelocity *= -0.5; // Bounce off walls
            vehicle.velocity *= 0.8; // Slow down on collision
        }
        
        // Angle normalization
        while (vehicle.angle > Math.PI * 2) vehicle.angle -= Math.PI * 2;
        while (vehicle.angle < 0) vehicle.angle += Math.PI * 2;
    }
    
    /**
     * Update vehicle state
     */
    updateVehicleState(vehicle, deltaTime) {
        // Update speed for UI
        vehicle.speed = vehicle.velocity;
        
        // Update drift state
        if (vehicle.drifting) {
            vehicle.driftTimer += deltaTime;
        } else {
            vehicle.driftTimer = 0;
        }
        
        // Update boost decay
        if (!vehicle.boostActive) {
            vehicle.boostPower = Math.max(vehicle.boostPower - deltaTime * 1, 0);
        }
        
        // Update collision timer
        if (vehicle.collisionTimer > 0) {
            vehicle.collisionTimer -= deltaTime;
        }
    }
    
    /**
     * Get surface type at position
     */
    getSurfaceType(position) {
        // This would be determined by the track data
        // For now, return asphalt as default
        return this.surfaceTypes.asphalt;
    }
    
    /**
     * Update collision detection grid
     */
    updateCollisionGrid() {
        // Clear grid
        for (let x = 0; x < 20; x++) {
            for (let z = 0; z < 20; z++) {
                this.collisionGrid[x][z] = [];
            }
        }
        
        // Add vehicles to grid
        // This would be populated by the vehicle manager
    }
    
    /**
     * Check for collisions between vehicles
     */
    checkCollisions() {
        // This would implement collision detection between vehicles
        // For now, it's a placeholder
    }
    
    /**
     * Update particle effects
     */
    updateParticles(deltaTime) {
        this.particles = this.particles.filter(particle => {
            particle.life -= deltaTime;
            particle.x += particle.vx * deltaTime;
            particle.y += particle.vy * deltaTime;
            particle.vy += particle.gravity * deltaTime;
            
            return particle.life > 0;
        });
    }
    
    /**
     * Create particle effect
     */
    createParticle(x, y, type, config = {}) {
        const particle = {
            x, y,
            vx: (Math.random() - 0.5) * 100,
            vy: -Math.random() * 200,
            gravity: 500,
            life: 1.0,
            type,
            ...config
        };
        
        this.particles.push(particle);
    }
    
    /**
     * Create exhaust particles for vehicle
     */
    createExhaustParticles(vehicle) {
        if (vehicle.velocity < 10) return;
        
        const exhaustX = vehicle.x - Math.cos(vehicle.angle) * vehicle.width * 0.5;
        const exhaustY = vehicle.y;
        const exhaustZ = vehicle.z - Math.sin(vehicle.angle) * vehicle.width * 0.5;
        
        for (let i = 0; i < 3; i++) {
            this.createParticle(exhaustX, exhaustY, 'exhaust', {
                vx: (Math.random() - 0.5) * 50,
                vy: -Math.random() * 100,
                life: 0.5 + Math.random() * 0.5
            });
        }
    }
    
    /**
     * Create drift particles
     */
    createDriftParticles(vehicle) {
        if (!vehicle.drifting || vehicle.velocity < 30) return;
        
        const driftX = vehicle.x + Math.cos(vehicle.angle + Math.PI/2) * vehicle.width * 0.6;
        const driftY = vehicle.y;
        const driftZ = vehicle.z + Math.sin(vehicle.angle + Math.PI/2) * vehicle.width * 0.6;
        
        this.createParticle(driftX, driftY, 'smoke', {
            vx: (Math.random() - 0.5) * 30,
            vy: -Math.random() * 50,
            life: 1.0 + Math.random() * 1.0
        });
    }
    
    /**
     * Create boost particles
     */
    createBoostParticles(vehicle) {
        if (!vehicle.boostActive) return;
        
        const boostX = vehicle.x - Math.cos(vehicle.angle) * vehicle.width * 0.8;
        const boostY = vehicle.y;
        const boostZ = vehicle.z - Math.sin(vehicle.angle) * vehicle.width * 0.8;
        
        for (let i = 0; i < 5; i++) {
            this.createParticle(boostX, boostY, 'fire', {
                vx: -Math.cos(vehicle.angle) * 200 + (Math.random() - 0.5) * 100,
                vy: -Math.random() * 150,
                life: 0.3 + Math.random() * 0.3
            });
        }
    }
    
    /**
     * Get particles for rendering
     */
    getParticles() {
        return this.particles;
    }
    
    /**
     * Calculate distance between two points
     */
    distance(x1, y1, x2, y2) {
        const dx = x2 - x1;
        const dy = y2 - y1;
        return Math.sqrt(dx * dx + dy * dy);
    }
    
    /**
     * Check if two vehicles are colliding
     */
    checkVehicleCollision(vehicle1, vehicle2) {
        const distance = this.distance(vehicle1.x, vehicle1.z, vehicle2.x, vehicle2.z);
        const collisionDistance = (vehicle1.width + vehicle2.width) * 0.5;
        
        return distance < collisionDistance;
    }
    
    /**
     * Handle collision between vehicles
     */
    handleVehicleCollision(vehicle1, vehicle2) {
        // Calculate collision response
        const dx = vehicle2.x - vehicle1.x;
        const dz = vehicle2.z - vehicle1.z;
        const distance = Math.sqrt(dx * dx + dz * dz);
        
        if (distance === 0) return;
        
        // Normalize collision vector
        const nx = dx / distance;
        const nz = dz / distance;
        
        // Calculate relative velocity
        const relativeVx = vehicle2.velocity * Math.cos(vehicle2.angle) - vehicle1.velocity * Math.cos(vehicle1.angle);
        const relativeVz = vehicle2.velocity * Math.sin(vehicle2.angle) - vehicle1.velocity * Math.sin(vehicle1.angle);
        
        // Calculate impulse
        const impulse = -(relativeVx * nx + relativeVz * nz) * 0.5;
        
        // Apply impulse
        vehicle1.velocity *= 0.8;
        vehicle2.velocity *= 0.8;
        
        // Set collision timers
        vehicle1.collisionTimer = 0.5;
        vehicle2.collisionTimer = 0.5;
        
        // Create collision particles
        const collisionX = (vehicle1.x + vehicle2.x) * 0.5;
        const collisionY = (vehicle1.y + vehicle2.y) * 0.5;
        
        for (let i = 0; i < 10; i++) {
            this.createParticle(collisionX, collisionY, 'spark', {
                vx: (Math.random() - 0.5) * 200,
                vy: -Math.random() * 300,
                life: 0.5 + Math.random() * 0.5
            });
        }
    }
}