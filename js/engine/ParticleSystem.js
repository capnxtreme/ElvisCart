/**
 * Particle System for Retro Racing Games
 * Handles visual effects like exhaust, drift, boost, and explosions
 */

export class ParticleSystem {
    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.particles = [];
        this.maxParticles = 1000;
        
        // Particle types
        this.particleTypes = {
            exhaust: {
                color: '#666666',
                size: { min: 2, max: 6 },
                life: { min: 0.5, max: 1.5 },
                speed: { min: 50, max: 150 },
                gravity: 200,
                fade: true
            },
            smoke: {
                color: '#CCCCCC',
                size: { min: 3, max: 8 },
                life: { min: 1.0, max: 2.5 },
                speed: { min: 30, max: 80 },
                gravity: 100,
                fade: true
            },
            fire: {
                color: '#FF4400',
                size: { min: 4, max: 10 },
                life: { min: 0.3, max: 0.8 },
                speed: { min: 100, max: 300 },
                gravity: 300,
                fade: true
            },
            spark: {
                color: '#FFFF00',
                size: { min: 1, max: 3 },
                life: { min: 0.2, max: 0.6 },
                speed: { min: 200, max: 500 },
                gravity: 500,
                fade: true
            },
            boost: {
                color: '#00FFFF',
                size: { min: 5, max: 15 },
                life: { min: 0.4, max: 1.0 },
                speed: { min: 150, max: 400 },
                gravity: 200,
                fade: true
            }
        };
    }
    
    async init() {
        console.log('✨ Initializing particle system...');
        console.log('✅ Particle system initialized');
    }
    
    update(deltaTime) {
        // Update all particles
        this.particles = this.particles.filter(particle => {
            particle.life -= deltaTime;
            
            if (particle.life <= 0) {
                return false; // Remove dead particles
            }
            
            // Update position
            particle.x += particle.vx * deltaTime;
            particle.y += particle.vy * deltaTime;
            particle.vy += particle.gravity * deltaTime;
            
            // Update size (for growing/shrinking effects)
            if (particle.grow) {
                particle.size += particle.growRate * deltaTime;
            }
            
            // Update alpha for fade effects
            if (particle.fade) {
                particle.alpha = particle.life / particle.maxLife;
            }
            
            return true;
        });
    }
    
    render() {
        this.particles.forEach(particle => {
            this.renderParticle(particle);
        });
    }
    
    renderParticle(particle) {
        const ctx = this.ctx;
        
        ctx.save();
        
        // Set alpha
        ctx.globalAlpha = particle.alpha || 1.0;
        
        // Set color
        ctx.fillStyle = particle.color;
        
        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
        
        // Add glow effect for certain particles
        if (particle.glow) {
            ctx.shadowColor = particle.color;
            ctx.shadowBlur = particle.size * 2;
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size * 0.5, 0, Math.PI * 2);
            ctx.fill();
        }
        
        ctx.restore();
    }
    
    createParticle(x, y, type, config = {}) {
        if (this.particles.length >= this.maxParticles) {
            return; // Don't create more particles if at limit
        }
        
        const particleType = this.particleTypes[type] || this.particleTypes.exhaust;
        
        const particle = {
            x: x + (Math.random() - 0.5) * 20,
            y: y + (Math.random() - 0.5) * 20,
            vx: (Math.random() - 0.5) * particleType.speed.max,
            vy: -Math.random() * particleType.speed.max,
            size: this.randomRange(particleType.size.min, particleType.size.max),
            life: this.randomRange(particleType.life.min, particleType.life.max),
            maxLife: this.randomRange(particleType.life.min, particleType.life.max),
            gravity: particleType.gravity,
            color: particleType.color,
            fade: particleType.fade,
            alpha: 1.0,
            glow: type === 'fire' || type === 'boost',
            grow: false,
            growRate: 0,
            ...config
        };
        
        this.particles.push(particle);
    }
    
    createExplosion(x, y, config = {}) {
        const particleCount = config.count || 20;
        const type = config.type || 'spark';
        
        for (let i = 0; i < particleCount; i++) {
            this.createParticle(x, y, type, {
                vx: (Math.random() - 0.5) * 400,
                vy: (Math.random() - 0.5) * 400,
                ...config
            });
        }
    }
    
    createTrail(x, y, config = {}) {
        const type = config.type || 'smoke';
        this.createParticle(x, y, type, {
            vx: (Math.random() - 0.5) * 50,
            vy: -Math.random() * 100,
            ...config
        });
    }
    
    createExhaust(x, y, config = {}) {
        this.createParticle(x, y, 'exhaust', {
            vx: (Math.random() - 0.5) * 30,
            vy: -Math.random() * 80,
            ...config
        });
    }
    
    createDrift(x, y, config = {}) {
        this.createParticle(x, y, 'smoke', {
            vx: (Math.random() - 0.5) * 20,
            vy: -Math.random() * 40,
            ...config
        });
    }
    
    createBoost(x, y, config = {}) {
        this.createParticle(x, y, 'boost', {
            vx: -Math.random() * 200 + (Math.random() - 0.5) * 100,
            vy: -Math.random() * 150,
            glow: true,
            ...config
        });
    }
    
    createFire(x, y, config = {}) {
        this.createParticle(x, y, 'fire', {
            vx: (Math.random() - 0.5) * 100,
            vy: -Math.random() * 200,
            glow: true,
            ...config
        });
    }
    
    randomRange(min, max) {
        return Math.random() * (max - min) + min;
    }
    
    getParticleCount() {
        return this.particles.length;
    }
    
    clear() {
        this.particles = [];
    }
    
    setMaxParticles(max) {
        this.maxParticles = max;
    }
    
    addParticleType(name, config) {
        this.particleTypes[name] = config;
    }
}