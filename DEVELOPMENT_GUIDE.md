# 🛠️ Development Guide - Retro Racing Engine

This guide will help you understand how to extend and customize the Retro Racing Engine for your own games.

## 🏗️ Architecture Overview

The engine is built with a modular architecture where each system handles a specific aspect of the game:

```
GameEngine (Main Controller)
├── Renderer (Visual rendering)
├── PhysicsEngine (Game physics)
├── TrackManager (Track creation/management)
├── VehicleManager (Vehicle/character management)
├── InputManager (User input)
├── AudioManager (Sound/music)
├── ParticleSystem (Visual effects)
└── GameState (Game flow)
```

## 🎨 Customizing the Renderer

### Adding New Visual Effects

```javascript
// Extend the Renderer class
class CustomRenderer extends Renderer {
    renderCustomEffect(x, y, config) {
        const ctx = this.ctx;
        
        // Create custom visual effect
        ctx.save();
        ctx.globalAlpha = config.alpha || 1.0;
        ctx.fillStyle = config.color || '#FF0000';
        
        // Draw custom shape
        ctx.beginPath();
        ctx.arc(x, y, config.radius || 10, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
    }
    
    // Override existing methods
    renderVehicle(vehicle, projection) {
        // Call parent method
        super.renderVehicle(vehicle, projection);
        
        // Add custom rendering
        if (vehicle.customEffect) {
            this.renderCustomEffect(projection.x, projection.y, vehicle.customEffect);
        }
    }
}
```

### Adding New Vehicle Shapes

```javascript
// In the Renderer class, add new vehicle rendering methods
renderCustomVehicle(size) {
    const ctx = this.ctx;
    
    // Draw custom vehicle shape
    ctx.beginPath();
    ctx.moveTo(-size/2, size/2);
    ctx.lineTo(size/2, size/2);
    ctx.lineTo(size/2, -size/2);
    ctx.lineTo(-size/2, -size/2);
    ctx.closePath();
    ctx.fill();
    
    // Add details
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
    ctx.stroke();
}
```

## ⚡ Extending the Physics Engine

### Adding New Vehicle Physics

```javascript
// Add new vehicle physics profile
this.vehicleProfiles.supercar = {
    maxSpeed: 500,
    acceleration: 25,
    handling: 0.9,
    driftFactor: 0.3,
    weight: 200,
    grip: 0.99,
    boostMultiplier: 3.0
};

// Add custom physics behavior
updateCustomVehicle(vehicle, input, deltaTime) {
    // Custom physics logic
    if (vehicle.type === 'supercar') {
        // Supercar-specific physics
        vehicle.velocity *= 1.1; // Always accelerating
        vehicle.boostPower = Math.min(vehicle.boostPower + deltaTime, 5);
    }
}
```

### Adding New Surface Types

```javascript
// Add new surface type
this.surfaceTypes.magnetic = {
    friction: 0.95,
    grip: 1.2,
    speedMultiplier: 1.3,
    customEffect: 'magnetic_boost'
};
```

## 🏁 Customizing Track Generation

### Creating Custom Track Types

```javascript
// Add new track template
this.trackTemplates.spiral = this.createSpiralTrack.bind(this);

createSpiralTrack(config) {
    const segments = [];
    const length = config.length || 100;
    
    for (let i = 0; i < length; i++) {
        const segment = {
            index: i,
            curve: Math.sin(i * 0.2) * 3, // Spiral pattern
            y: Math.sin(i * 0.1) * 200,   // Elevation changes
            color: '#404040',
            sideColor: '#ff0000',
            objects: [],
            isFinishLine: i === 0,
            checkpoint: i % 25 === 0
        };
        
        segments.push(segment);
    }
    
    return segments;
}
```

### Adding Custom Roadside Objects

```javascript
// Add custom object types
this.objectTypes = {
    ...this.objectTypes,
    windmill: {
        width: 80,
        height: 120,
        sprite: 'windmill',
        animation: 'rotate'
    },
    castle: {
        width: 200,
        height: 300,
        sprite: 'castle',
        animation: 'none'
    }
};
```

## 🚗 Extending Vehicle Management

### Adding New Character Types

```javascript
// Add custom character theme
this.characterThemes.customHero = {
    name: 'Custom Hero',
    vehicle: 'supercar',
    color: '#FF00FF',
    sprite: 'custom_hero_sprite',
    personality: 'aggressive',
    aiDifficulty: 'expert',
    specialAbility: 'timeWarp'
};
```

### Custom AI Behavior

```javascript
// Override AI update method
updateCustomAI(vehicle, deltaTime) {
    const character = this.characterThemes[vehicle.aiCharacter];
    
    if (character.specialAbility === 'timeWarp') {
        // Custom AI behavior
        vehicle.velocity *= 1.2; // Time warp effect
        vehicle.boostPower = Math.min(vehicle.boostPower + deltaTime * 2, 5);
    }
    
    // Call parent method
    super.updateAI(vehicle, deltaTime);
}
```

## 🎵 Audio Customization

### Adding Custom Sound Effects

```javascript
// Load custom audio files
await this.audio.loadSound('custom_boost', 'assets/sounds/custom_boost.wav');
await this.audio.loadSound('custom_explosion', 'assets/sounds/custom_explosion.wav');

// Create custom audio manager
class CustomAudioManager extends AudioManager {
    playCustomSound(name, options = {}) {
        // Custom sound logic
        if (name === 'custom_boost') {
            return this.play(name, { ...options, rate: 1.5 });
        }
        
        return this.play(name, options);
    }
}
```

## ✨ Particle System Extensions

### Adding Custom Particle Types

```javascript
// Add new particle type
this.particleTypes.magic = {
    color: '#FF00FF',
    size: { min: 8, max: 20 },
    life: { min: 2.0, max: 4.0 },
    speed: { min: 150, max: 400 },
    gravity: 100,
    fade: true,
    glow: true,
    trail: true
};

// Add custom particle effect
createMagicEffect(x, y, config = {}) {
    for (let i = 0; i < 15; i++) {
        this.createParticle(x, y, 'magic', {
            vx: (Math.random() - 0.5) * 300,
            vy: -Math.random() * 200,
            glow: true,
            ...config
        });
    }
}
```

## 🎮 Input Customization

### Adding Custom Controls

```javascript
// Add custom key mappings
this.keyMappings.customAction = ['KeyQ', 'KeyE'];
this.keyMappings.specialMove = ['KeyF'];

// Handle custom input
updateCustomInput() {
    this.input.customAction = this.isKeyPressed(this.keyMappings.customAction);
    this.input.specialMove = this.isKeyPressed(this.keyMappings.specialMove);
}
```

### Custom Gamepad Support

```javascript
// Add custom gamepad mappings
this.gamepadMappings.customAction = 2; // X button
this.gamepadMappings.specialMove = 3;  // Y button

// Handle custom gamepad input
updateCustomGamepadInput() {
    if (this.gamepad && this.gamepad.buttons[this.gamepadMappings.customAction]?.pressed) {
        this.input.customAction = true;
    }
}
```

## 🔧 Performance Optimization

### Optimizing Rendering

```javascript
// Implement object pooling for particles
class ParticlePool {
    constructor(maxSize) {
        this.pool = [];
        this.maxSize = maxSize;
    }
    
    get() {
        return this.pool.pop() || this.createNew();
    }
    
    release(particle) {
        if (this.pool.length < this.maxSize) {
            this.pool.push(particle);
        }
    }
}

// Use in particle system
this.particlePool = new ParticlePool(1000);
```

### Memory Management

```javascript
// Implement cleanup methods
cleanup() {
    // Clear unused resources
    this.particles.clear();
    this.vehicles.clear();
    
    // Reset state
    this.gameState.reset();
    
    // Clear caches
    this.renderer.clearCaches();
}
```

## 🧪 Testing and Debugging

### Debug Rendering

```javascript
// Add debug information
renderDebugInfo() {
    const ctx = this.ctx;
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '12px Arial';
    
    const debugInfo = [
        `FPS: ${this.fps}`,
        `Vehicles: ${this.vehicleCount}`,
        `Particles: ${this.particleCount}`,
        `Track Segments: ${this.trackSegments}`,
        `Memory: ${this.memoryUsage}MB`
    ];
    
    debugInfo.forEach((info, index) => {
        ctx.fillText(info, 10, 20 + index * 15);
    });
}
```

### Performance Monitoring

```javascript
// Add performance monitoring
class PerformanceMonitor {
    constructor() {
        this.metrics = {
            fps: [],
            memory: [],
            renderTime: [],
            updateTime: []
        };
    }
    
    recordMetric(type, value) {
        this.metrics[type].push(value);
        
        // Keep only last 100 values
        if (this.metrics[type].length > 100) {
            this.metrics[type].shift();
        }
    }
    
    getAverage(type) {
        const values = this.metrics[type];
        return values.reduce((a, b) => a + b, 0) / values.length;
    }
}
```

## 📦 Building Custom Games

### Creating a Complete Game

```javascript
class MyRacingGame extends GameEngine {
    constructor() {
        super({
            canvasId: 'myGameCanvas',
            width: 1280,
            height: 720
        });
        
        this.customFeatures = {
            powerUps: true,
            multiplayer: false,
            customTracks: true
        };
    }
    
    async init() {
        await super.init();
        
        // Add custom features
        this.initPowerUps();
        this.initCustomTracks();
        this.initCustomVehicles();
    }
    
    initPowerUps() {
        this.powerUps = new PowerUpSystem();
        this.powerUps.addType('speedBoost', {
            duration: 5,
            effect: (vehicle) => vehicle.maxSpeed *= 1.5
        });
    }
    
    initCustomTracks() {
        // Add your custom tracks
        this.trackManager.createTrack('my_track', {
            name: 'My Custom Track',
            type: 'custom',
            theme: 'space',
            length: 200
        });
    }
    
    initCustomVehicles() {
        // Add your custom vehicles
        this.vehicleManager.addVehicleTemplate('myVehicle', {
            type: 'myVehicle',
            maxSpeed: 300,
            acceleration: 20,
            handling: 0.9
        });
    }
}
```

## 🚀 Deployment

### Building for Production

```javascript
// Minify and bundle for production
// Use tools like Webpack, Rollup, or Vite

// Example webpack config
module.exports = {
    entry: './js/example-game.js',
    output: {
        filename: 'game.bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    mode: 'production',
    optimization: {
        minimize: true
    }
};
```

### Asset Optimization

```javascript
// Optimize assets for web
// - Compress images (WebP, AVIF)
// - Optimize audio (MP3, OGG)
// - Use sprite sheets for graphics
// - Implement lazy loading for large assets
```

This development guide provides the foundation for extending the Retro Racing Engine. The modular architecture makes it easy to add new features while maintaining the core functionality. Happy coding! 🎮