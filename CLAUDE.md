# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

ElvisCart is a pseudo-3D kart racing game with a rockabilly aesthetic. The game features sprite-based karts on 3D tracks, inspired by classic arcade racers like Super Mario Kart and Out Run, with a distinctive 1950s American rock 'n' roll theme.

## Architecture Philosophy

This project follows a minimalistic indie game development approach:
- **Keep It Simple**: Favor straightforward solutions over complex architectures
- **Sprite-Based Racing**: Karts are 2D sprites, tracks create 3D illusion through Mode 7-style rendering
- **Modular Design**: Separate concerns between rendering, game logic, and UI

## Core Systems

### Rendering System
- Pseudo-3D track rendering (Mode 7 or similar technique)
- Sprite-based kart rendering with rotation frames
- Particle effects for dust, exhaust, and power-ups

### Game Logic
- Physics: Simplified arcade physics with drift mechanics
- AI: Basic racing AI with rubber-band difficulty
- Power-ups: Classic kart racing items (speed boost, oil slick, etc.)

### Audio System
- Rockabilly soundtrack (surf rock, doo-wop, early rock 'n' roll)
- Engine sounds with retro filter effects
- Character voice clips (Elvis-style exclamations)

## Development Commands

### Building and Running
```bash
# Development server with hot reload
npm run dev

# Production build
npm run build

# Run tests
npm test

# Lint code
npm run lint
```

### Testing
```bash
# Run all tests
npm test

# Run specific test file
npm test -- path/to/test.js

# Run tests in watch mode
npm test -- --watch
```

## Key Technical Decisions

1. **Rendering**: Use canvas-based rendering for maximum control over the pseudo-3D effect
2. **State Management**: Simple state machine for game screens (menu, race, results)
3. **Input Handling**: Support keyboard and gamepad with configurable controls
4. **Asset Pipeline**: Sprites stored as sprite sheets, audio as compressed formats

## Character and Style Guidelines

### Rockabilly Theme Elements
- Characters: Elvis, Johnny Cash, Buddy Holly inspired drivers
- Tracks: Route 66, drive-in theaters, diners, jukeboxes
- Visual Style: Chrome details, checkerboard patterns, neon signs
- Color Palette: Pastels, chrome, black leather, hot rod flames

### Sprite Requirements
- Kart sprites: 8 rotation angles minimum
- Character sprites: Idle, steering, victory animations
- Track elements: Modular pieces for easy track creation

## Performance Considerations

- Target 60 FPS on mid-range hardware
- Optimize sprite rendering with batching
- Pre-calculate track geometry where possible
- Limit particle effects on lower-end devices

## Code Style

- Use descriptive names reflecting rockabilly theme (e.g., `CadillacBoost`, `GreaseLightning`)
- Keep functions small and focused
- Comment complex pseudo-3D math
- Prefer readability over micro-optimizations