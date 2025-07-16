# 🏁 Retro Racing Engine - Enhanced Mode 7 Style

A powerful, easy-to-use game engine for creating professional-quality retro racing games inspired by SNES Mode 7 but with modern enhancements. Create games like Mario Kart, F-Zero, and more with just a few lines of code!

## ✨ Features

### 🎮 **Easy-to-Use API**
- Simple, intuitive API for game developers
- Create complete racing games in minutes
- Modular design for easy customization

### 🚗 **Multiple Vehicle Types**
- **Kart**: Perfect for Mario Kart-style games
- **Car**: Realistic racing simulation
- **Bike**: High-speed motorcycle racing
- **F-Zero**: Futuristic anti-gravity racing

### 🏁 **Advanced Track System**
- **Pre-built templates**: Oval, Circuit, Rally, Figure-8, Drag
- **Custom track creation**: Easy procedural generation
- **Multiple themes**: Desert, Forest, City, Snow, Space
- **Track editor**: Import/export track data

### ✨ **Enhanced Visual Effects**
- **Advanced Mode 7 rendering**: Better than SNES capabilities
- **Dynamic lighting**: Time of day, shadows, fog
- **Particle systems**: Exhaust, drift, boost, explosions
- **Post-processing effects**: Bloom, motion blur, scanlines

### 🎵 **Audio System**
- **Web Audio API integration**
- **Music and sound effects**
- **Volume control and mixing**
- **Easy audio asset loading**

### 🎯 **Advanced AI System**
- **Personality-based opponents**: Aggressive, Cautious, Balanced
- **Difficulty levels**: Easy, Medium, Hard, Expert
- **Rubber-banding**: Dynamic difficulty adjustment
- **Racing line optimization**

### 📱 **Multi-Platform Support**
- **Keyboard controls**: WASD, Arrow keys, customizable
- **Gamepad support**: Xbox, PlayStation, generic controllers
- **Touch controls**: Mobile-friendly interface
- **Responsive design**: Works on all screen sizes

## 🚀 Quick Start

### 1. Basic Setup

```javascript
import { GameEngine } from './js/engine/GameEngine.js';

// Create engine instance
const engine = new GameEngine({
    canvasId: 'gameCanvas',
    width: 1024,
    height: 576,
    pixelPerfect: true
});

// Initialize and start
await engine.init();
engine.start();
```

### 2. Create a Simple Game

```javascript
// Load game configuration
await engine.loadGame({
    track: {
        id: 'my_track',
        name: 'My Awesome Track',
        type: 'circuit',
        theme: 'forest',
        length: 120
    },
    vehicles: [
        {
            type: 'kart',
            name: 'Player',
            color: '#FF0000',
            isPlayer: true
        },
        {
            type: 'kart',
            name: 'Mario',
            color: '#FF0000',
            isPlayer: false,
            aiCharacter: 'mario'
        }
    ],
    gameState: {
        totalLaps: 3,
        countdownTime: 3
    }
});

// Set current track
engine.trackManager.setCurrentTrack('my_track');
```

### 3. Start Racing

```javascript
// Start the race
engine.startRace();
```

## 🎮 Creating Different Game Styles

### Mario Kart Style Game

```javascript
// Create Mario Kart style game
engine.createMarioKartStyleGame();

// Or manually:
const tracks = [
    { id: 'mushroom_cup', name: 'Mushroom Cup', type: 'circuit', theme: 'forest' },
    { id: 'flower_cup', name: 'Flower Cup', type: 'oval', theme: 'desert' },
    { id: 'star_cup', name: 'Star Cup', type: 'rally', theme: 'snow' }
];

tracks.forEach(track => engine.createTrack(track.id, track));

// Add Mario characters
const characters = ['mario', 'luigi', 'peach', 'bowser', 'yoshi'];
characters.forEach((character, index) => {
    engine.addVehicle({
        type: 'kart',
        name: engine.vehicleManager.getCharacterTheme(character).name,
        color: engine.vehicleManager.getCharacterTheme(character).color,
        isPlayer: index === 0,
        aiCharacter: character
    });
});
```

### F-Zero Style Game

```javascript
// Create F-Zero style game
engine.createFZeroStyleGame();

// Or manually:
const vehicles = [
    { name: 'Blue Falcon', type: 'fzero', color: '#0066FF' },
    { name: 'Golden Fox', type: 'fzero', color: '#FFD700' },
    { name: 'Wild Goose', type: 'fzero', color: '#FF6600' }
];

vehicles.forEach((vehicle, index) => {
    engine.addVehicle({
        ...vehicle,
        isPlayer: index === 0,
        maxSpeed: 400 + Math.random() * 100,
        acceleration: 20 + Math.random() * 10
    });
});
```

## 🛠️ Advanced Features

### Custom Track Creation

```javascript
// Create custom track
const customTrack = engine.createTrack('custom', {
    name: 'My Custom Track',
    type: 'custom',
    theme: 'desert',
    length: 150,
    difficulty: 'hard'
});

// Modify track segments
engine.trackManager.modifySegment('custom', 10, {
    curve: 2.5,
    y: 100,
    color: '#FF0000'
});

// Add checkpoints
engine.trackManager.addCheckpoint('custom', 50);
```

### Custom Vehicle Creation

```javascript
// Add custom vehicle
const customVehicle = engine.addVehicle({
    type: 'fzero',
    name: 'My Custom Car',
    color: '#FFD700',
    maxSpeed: 350,
    acceleration: 18,
    handling: 0.8,
    isPlayer: false,
    aiCharacter: 'captain'
});
```

### Particle Effects

```javascript
// Create explosion effect
engine.createExplosion(x, y, {
    count: 30,
    type: 'spark'
});

// Create boost effect
engine.createTrail(x, y, {
    type: 'fire'
});
```

### Audio Integration

```javascript
// Play sound effects
engine.playSound('engine', { volume: 0.8 });

// Play background music
engine.playMusic('race_theme', { loop: true });
```

## 🎨 Customization

### Adding Custom Characters

```javascript
// Add custom character
engine.vehicleManager.addCustomCharacter('my_character', {
    name: 'My Character',
    vehicle: 'kart',
    color: '#FF00FF',
    sprite: 'my_character_sprite',
    personality: 'aggressive',
    aiDifficulty: 'hard'
});
```

### Adding Custom Vehicle Types

```javascript
// Add custom vehicle template
engine.vehicleManager.addVehicleTemplate('supercar', {
    type: 'supercar',
    width: 120,
    height: 60,
    maxSpeed: 500,
    acceleration: 25,
    handling: 0.9,
    driftFactor: 0.5,
    weight: 180,
    grip: 0.99,
    boostMultiplier: 2.5,
    color: '#FF0000',
    sprite: 'supercar_red'
});
```

### Custom Particle Effects

```javascript
// Add custom particle type
engine.particles.addParticleType('magic', {
    color: '#FF00FF',
    size: { min: 5, max: 15 },
    life: { min: 1.0, max: 3.0 },
    speed: { min: 100, max: 300 },
    gravity: 150,
    fade: true
});
```

## 📁 Project Structure

```
retro-racing-engine/
├── index.html                 # Main HTML file
├── js/
│   ├── engine/               # Core engine files
│   │   ├── GameEngine.js     # Main engine class
│   │   ├── Renderer.js       # Enhanced Mode 7 renderer
│   │   ├── PhysicsEngine.js  # Advanced physics system
│   │   ├── TrackManager.js   # Track creation and management
│   │   ├── VehicleManager.js # Vehicle and character management
│   │   ├── InputManager.js   # Input handling (keyboard, gamepad, touch)
│   │   ├── AudioManager.js   # Audio system
│   │   ├── ParticleSystem.js # Visual effects
│   │   └── GameState.js      # Game state management
│   └── example-game.js       # Example game implementation
├── assets/                   # Game assets (images, sounds, etc.)
└── README.md                # This file
```

## 🎯 Performance

The engine is optimized for smooth 60 FPS gameplay with:
- **Efficient rendering**: Optimized Mode 7 projection
- **Smart culling**: Only render visible objects
- **Particle limits**: Configurable particle system
- **Memory management**: Automatic cleanup and garbage collection

## 🔧 Configuration Options

### Engine Configuration

```javascript
const config = {
    canvasId: 'gameCanvas',    // Canvas element ID
    width: 1024,              // Canvas width
    height: 576,              // Canvas height
    pixelPerfect: true,       // Enable pixel-perfect rendering
    targetFPS: 60,           // Target frame rate
    drawDistance: 100,        // 3D rendering distance
    fogDistance: 80,         // Fog effect distance
    maxParticles: 1000       // Maximum particle count
};
```

### Track Configuration

```javascript
const trackConfig = {
    name: 'Track Name',
    type: 'circuit',          // oval, circuit, rally, figure8, drag, custom
    theme: 'forest',          // desert, forest, city, snow, space
    length: 120,             // Number of track segments
    difficulty: 'medium',     // easy, medium, hard
    checkpoints: [25, 50, 75] // Custom checkpoint positions
};
```

### Vehicle Configuration

```javascript
const vehicleConfig = {
    type: 'kart',            // kart, car, bike, fzero
    name: 'Vehicle Name',
    color: '#FF0000',
    maxSpeed: 200,
    acceleration: 15,
    handling: 0.8,
    driftFactor: 1.2,
    weight: 100,
    grip: 0.9,
    boostMultiplier: 1.5,
    isPlayer: false,
    aiCharacter: 'mario'
};
```

## 🚀 Getting Started

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd retro-racing-engine
   ```

2. **Start a local server**
   ```bash
   python3 -m http.server 8080
   # or
   npm start
   ```

3. **Open in browser**
   ```
   http://localhost:8080
   ```

4. **Start creating your game!**

## 🎮 Controls

- **Arrow Keys / WASD**: Steer and accelerate
- **Space**: Drift
- **Enter**: Boost
- **Escape**: Pause/Resume
- **R**: Reset
- **Gamepad**: Full controller support
- **Touch**: Mobile touch controls

## 🤝 Contributing

Contributions are welcome! Please feel free to submit pull requests or open issues for bugs and feature requests.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Inspired by SNES Mode 7 racing games
- Built with modern web technologies
- Designed for easy game development

---

**Ready to create the next great racing game? Start your engines! 🏁**