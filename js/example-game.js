/**
 * Example Game - Retro Racing Engine Demo
 * Demonstrates how easy it is to create professional-quality racing games
 */

import { GameEngine } from './engine/GameEngine.js';

class RetroRacingGame {
    constructor() {
        this.engine = null;
        this.gameConfig = {
            canvasId: 'gameCanvas',
            width: 1024,
            height: 576,
            pixelPerfect: true
        };
    }
    
    async init() {
        console.log('🎮 Starting Retro Racing Engine Demo...');
        
        // Create and initialize the game engine
        this.engine = new GameEngine(this.gameConfig);
        await this.engine.init();
        
        // Load game configuration
        await this.loadGame();
        
        // Set up input handlers
        this.setupInputHandlers();
        
        // Start the engine
        this.engine.start();
        
        console.log('✅ Game started successfully!');
    }
    
    async loadGame() {
        // Load a simple game configuration
        const gameConfig = {
            track: {
                id: 'demo_track',
                name: 'Demo Circuit',
                type: 'circuit',
                theme: 'forest',
                length: 120,
                difficulty: 'medium'
            },
            vehicles: [
                {
                    id: 'player',
                    type: 'kart',
                    name: 'Player',
                    color: '#FF0000',
                    isPlayer: true
                },
                {
                    id: 'mario',
                    type: 'kart',
                    name: 'Mario',
                    color: '#FF0000',
                    isPlayer: false,
                    aiCharacter: 'mario'
                },
                {
                    id: 'luigi',
                    type: 'kart',
                    name: 'Luigi',
                    color: '#00FF00',
                    isPlayer: false,
                    aiCharacter: 'luigi'
                },
                {
                    id: 'peach',
                    type: 'kart',
                    name: 'Peach',
                    color: '#FFB6C1',
                    isPlayer: false,
                    aiCharacter: 'peach'
                }
            ],
            gameState: {
                totalLaps: 3,
                countdownTime: 3,
                difficulty: 'medium'
            }
        };
        
        await this.engine.loadGame(gameConfig);
        
        // Set the current track
        this.engine.trackManager.setCurrentTrack('demo_track');
    }
    
    setupInputHandlers() {
        // Handle pause
        this.engine.onKeyDown((event) => {
            if (event.code === 'Escape') {
                if (this.engine.gameState.state === 'racing') {
                    this.engine.pauseGame();
                } else if (this.engine.gameState.state === 'paused') {
                    this.engine.resumeGame();
                }
            }
        });
        
        // Handle race start
        this.engine.onKeyDown((event) => {
            if (event.code === 'Enter' && this.engine.gameState.state === 'menu') {
                this.startRace();
            }
        });
    }
    
    startRace() {
        console.log('🏁 Starting race...');
        this.engine.gameState.state = 'racing';
        this.engine.gameState.reset();
    }
    
    // Easy API examples for game developers
    
    createCustomTrack() {
        // Create a custom track with just a few lines of code
        const customTrack = this.engine.createTrack('custom', {
            name: 'My Custom Track',
            type: 'custom',
            theme: 'desert',
            length: 150,
            difficulty: 'hard'
        });
        
        console.log('Created custom track:', customTrack.name);
        return customTrack;
    }
    
    addCustomVehicle() {
        // Add a custom vehicle with unique properties
        const customVehicle = this.engine.addVehicle({
            type: 'fzero',
            name: 'My Custom Car',
            color: '#FFD700',
            maxSpeed: 350,
            acceleration: 18,
            handling: 0.8,
            isPlayer: false,
            aiCharacter: 'captain'
        });
        
        console.log('Added custom vehicle:', customVehicle.name);
        return customVehicle;
    }
    
    createExplosionEffect(x, y) {
        // Create a particle explosion effect
        this.engine.createExplosion(x, y, {
            count: 30,
            type: 'spark'
        });
    }
    
    playSoundEffect() {
        // Play a sound effect (if audio files are loaded)
        this.engine.playSound('engine', { volume: 0.8 });
    }
    
    // Advanced features examples
    
    createMarioKartStyleGame() {
        console.log('Creating Mario Kart style game...');
        
        // Create multiple tracks
        const tracks = [
            { id: 'mushroom_cup', name: 'Mushroom Cup', type: 'circuit', theme: 'forest' },
            { id: 'flower_cup', name: 'Flower Cup', type: 'oval', theme: 'desert' },
            { id: 'star_cup', name: 'Star Cup', type: 'rally', theme: 'snow' },
            { id: 'special_cup', name: 'Special Cup', type: 'figure8', theme: 'space' }
        ];
        
        tracks.forEach(track => {
            this.engine.createTrack(track.id, track);
        });
        
        // Add Mario characters
        const characters = ['mario', 'luigi', 'peach', 'bowser', 'yoshi'];
        characters.forEach((character, index) => {
            this.engine.addVehicle({
                type: 'kart',
                name: this.engine.vehicleManager.getCharacterTheme(character).name,
                color: this.engine.vehicleManager.getCharacterTheme(character).color,
                isPlayer: index === 0,
                aiCharacter: character
            });
        });
        
        console.log('Mario Kart style game created!');
    }
    
    createFZeroStyleGame() {
        console.log('Creating F-Zero style game...');
        
        // Create high-speed tracks
        const tracks = [
            { id: 'mute_city', name: 'Mute City', type: 'circuit', theme: 'city' },
            { id: 'big_blue', name: 'Big Blue', type: 'rally', theme: 'space' }
        ];
        
        tracks.forEach(track => {
            this.engine.createTrack(track.id, track);
        });
        
        // Add F-Zero vehicles
        const vehicles = [
            { name: 'Blue Falcon', type: 'fzero', color: '#0066FF' },
            { name: 'Golden Fox', type: 'fzero', color: '#FFD700' },
            { name: 'Wild Goose', type: 'fzero', color: '#FF6600' },
            { name: 'Fire Stingray', type: 'fzero', color: '#FF0066' }
        ];
        
        vehicles.forEach((vehicle, index) => {
            this.engine.addVehicle({
                ...vehicle,
                isPlayer: index === 0,
                maxSpeed: 400 + Math.random() * 100,
                acceleration: 20 + Math.random() * 10
            });
        });
        
        console.log('F-Zero style game created!');
    }
    
    // Utility methods for game development
    
    getGameStats() {
        return this.engine.getStats();
    }
    
    exportTrack(trackId) {
        return this.engine.trackManager.exportTrack(trackId);
    }
    
    importTrack(trackJson) {
        return this.engine.trackManager.importTrack(trackJson);
    }
    
    // Performance monitoring
    startPerformanceMonitoring() {
        setInterval(() => {
            const stats = this.getGameStats();
            console.log('Game Stats:', {
                FPS: stats.fps,
                Vehicles: stats.vehicleCount,
                Particles: stats.particleCount,
                Running: stats.isRunning
            });
        }, 1000);
    }
}

// Initialize the game when the page loads
window.addEventListener('DOMContentLoaded', async () => {
    const game = new RetroRacingGame();
    await game.init();
    
    // Make game available globally for debugging
    window.game = game;
    
    // Start performance monitoring
    game.startPerformanceMonitoring();
    
    // Add some example buttons to the page
    addExampleControls(game);
});

function addExampleControls(game) {
    const controlsDiv = document.createElement('div');
    controlsDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 20px;
        border-radius: 10px;
        font-family: Arial, sans-serif;
        z-index: 1000;
    `;
    
    controlsDiv.innerHTML = `
        <h3>🎮 Engine Controls</h3>
        <button onclick="game.startRace()">Start Race</button><br><br>
        <button onclick="game.createCustomTrack()">Create Custom Track</button><br><br>
        <button onclick="game.addCustomVehicle()">Add Custom Vehicle</button><br><br>
        <button onclick="game.createMarioKartStyleGame()">Mario Kart Style</button><br><br>
        <button onclick="game.createFZeroStyleGame()">F-Zero Style</button><br><br>
        <button onclick="game.createExplosionEffect(512, 288)">Create Explosion</button><br><br>
        <button onclick="game.engine.pauseGame()">Pause</button>
        <button onclick="game.engine.resumeGame()">Resume</button><br><br>
        <div id="stats"></div>
    `;
    
    document.body.appendChild(controlsDiv);
    
    // Update stats
    setInterval(() => {
        const stats = game.getGameStats();
        document.getElementById('stats').innerHTML = `
            <small>
                FPS: ${stats.fps}<br>
                Vehicles: ${stats.vehicleCount}<br>
                Particles: ${stats.particleCount}
            </small>
        `;
    }, 100);
}