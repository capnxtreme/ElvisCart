# ElvisCart JavaScript Modules

The game is now organized into clean, maintainable modules:

## Core Modules

- **main.js** - Entry point, game loop, initialization
- **gameState.js** - Global game state management
- **constants.js** - Game configuration and constants

## Game Systems

- **input.js** - Keyboard/controller input handling
- **physics.js** - Player and AI movement physics
- **collision.js** - Collision detection between karts
- **powerups.js** - Power-up system and effects

## Game Objects

- **player.js** - Player kart state
- **opponents.js** - AI opponent management
- **track.js** - Track generation and data

## Rendering

- **render.js** - All drawing functions
  - Sky and environment
  - Track rendering
  - Kart sprites
  - UI/HUD
  - Visual effects

## Adding New Features

1. Create new module in appropriate category
2. Export functions/data needed by other modules
3. Import in main.js or relevant system
4. Update game loop if needed

## Module Dependencies

```
main.js
├── gameState.js
├── input.js
├── track.js
├── opponents.js
├── powerups.js
├── physics.js (uses player, opponents, track)
├── collision.js (uses player, opponents)
└── render.js (uses all game objects)
```