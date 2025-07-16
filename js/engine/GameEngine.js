/**
 * Retro Racing Game Engine - Enhanced Mode 7 Style
 * A powerful, easy-to-use engine for creating professional retro racing games
 * Inspired by SNES Mode 7 but with modern enhancements
 */

import { Renderer } from './Renderer.js';
import { PhysicsEngine } from './PhysicsEngine.js';
import { TrackManager } from './TrackManager.js';
import { VehicleManager } from './VehicleManager.js';
import { AudioManager } from './AudioManager.js';
import { InputManager } from './InputManager.js';
import { ParticleSystem } from './ParticleSystem.js';
import { GameState } from './GameState.js';

export class GameEngine {
    constructor(config = {}) {
        this.config = {
            canvasId: 'gameCanvas',
            width: 1024,
            height: 576,
            pixelPerfect: true,
            targetFPS: 60,
            ...config
        };
        
        this.canvas = null;
        this.ctx = null;
        this.isRunning = false;
        this.lastFrameTime = 0;
        
        // Core systems
        this.renderer = null;
        this.physics = null;
        this.trackManager = null;
        this.vehicleManager = null;
        this.audio = null;
        this.input = null;
        this.particles = null;
        this.gameState = null;
        
        // Game objects
        this.player = null;
        this.opponents = [];
        this.powerUps = [];
        
        // Performance tracking
        this.fps = 0;
        this.frameCount = 0;
        this.lastFpsUpdate = 0;
    }
    
    /**
     * Initialize the game engine
     */
    async init() {
        console.log('🚗 Initializing Retro Racing Game Engine...');
        
        // Setup canvas
        this.setupCanvas();
        
        // Initialize core systems
        this.gameState = new GameState();
        this.renderer = new Renderer(this.canvas, this.ctx, this.config);
        this.physics = new PhysicsEngine();
        this.trackManager = new TrackManager();
        this.vehicleManager = new VehicleManager();
        this.audio = new AudioManager();
        this.input = new InputManager();
        this.particles = new ParticleSystem(this.canvas, this.ctx);
        
        // Initialize systems
        await this.renderer.init();
        await this.physics.init();
        await this.trackManager.init();
        await this.vehicleManager.init();
        await this.audio.init();
        await this.input.init();
        await this.particles.init();
        
        console.log('✅ Game Engine initialized successfully!');
    }
    
    /**
     * Setup canvas and context
     */
    setupCanvas() {
        this.canvas = document.getElementById(this.config.canvasId);
        if (!this.canvas) {
            throw new Error(`Canvas with id '${this.config.canvasId}' not found`);
        }
        
        this.canvas.width = this.config.width;
        this.canvas.height = this.config.height;
        this.ctx = this.canvas.getContext('2d');
        
        if (this.config.pixelPerfect) {
            this.ctx.imageSmoothingEnabled = false;
        }
    }
    
    /**
     * Load a game configuration
     */
    async loadGame(config) {
        console.log('🎮 Loading game configuration...');
        
        // Load track
        if (config.track) {
            await this.trackManager.loadTrack(config.track);
        }
        
        // Load vehicles
        if (config.vehicles) {
            await this.vehicleManager.loadVehicles(config.vehicles);
        }
        
        // Load audio
        if (config.audio) {
            await this.audio.loadAudio(config.audio);
        }
        
        // Setup game state
        this.gameState.setup(config.gameState || {});
        
        console.log('✅ Game loaded successfully!');
    }
    
    /**
     * Start the game engine
     */
    start() {
        if (this.isRunning) return;
        
        console.log('🏁 Starting game engine...');
        this.isRunning = true;
        this.lastFrameTime = performance.now();
        this.gameLoop();
    }
    
    /**
     * Stop the game engine
     */
    stop() {
        this.isRunning = false;
        console.log('⏹️ Game engine stopped');
    }
    
    /**
     * Main game loop
     */
    gameLoop(currentTime = 0) {
        if (!this.isRunning) return;
        
        const deltaTime = Math.min((currentTime - this.lastFrameTime) / 1000, 1/30);
        this.lastFrameTime = currentTime;
        
        // Update FPS counter
        this.updateFPS(currentTime);
        
        // Update game systems
        this.update(deltaTime);
        
        // Render everything
        this.render();
        
        // Continue loop
        requestAnimationFrame((time) => this.gameLoop(time));
    }
    
    /**
     * Update game logic
     */
    update(deltaTime) {
        // Update input
        this.input.update();
        
        // Update physics
        this.physics.update(deltaTime);
        
        // Update vehicles
        this.vehicleManager.update(deltaTime);
        
        // Update particles
        this.particles.update(deltaTime);
        
        // Update audio
        this.audio.update(deltaTime);
        
        // Update game state
        this.gameState.update(deltaTime);
    }
    
    /**
     * Render the game
     */
    render() {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Render track
        this.renderer.renderTrack(this.trackManager, this.gameState);
        
        // Render vehicles
        this.renderer.renderVehicles(this.vehicleManager);
        
        // Render particles
        this.particles.render();
        
        // Render UI
        this.renderer.renderUI(this.gameState);
    }
    
    /**
     * Update FPS counter
     */
    updateFPS(currentTime) {
        this.frameCount++;
        
        if (currentTime - this.lastFpsUpdate >= 1000) {
            this.fps = this.frameCount;
            this.frameCount = 0;
            this.lastFpsUpdate = currentTime;
        }
    }
    
    /**
     * Get engine statistics
     */
    getStats() {
        return {
            fps: this.fps,
            frameCount: this.frameCount,
            isRunning: this.isRunning,
            vehicleCount: this.vehicleManager.getVehicleCount(),
            particleCount: this.particles.getParticleCount()
        };
    }
    
    /**
     * Easy API for game developers
     */
    
    // Track management
    createTrack(config) {
        return this.trackManager.createTrack(config);
    }
    
    loadTrack(trackData) {
        return this.trackManager.loadTrack(trackData);
    }
    
    // Vehicle management
    addVehicle(config) {
        return this.vehicleManager.addVehicle(config);
    }
    
    removeVehicle(vehicleId) {
        return this.vehicleManager.removeVehicle(vehicleId);
    }
    
    // Audio management
    playSound(soundName, options = {}) {
        return this.audio.play(soundName, options);
    }
    
    playMusic(musicName, options = {}) {
        return this.audio.playMusic(musicName, options);
    }
    
    // Particle effects
    createExplosion(x, y, config = {}) {
        return this.particles.createExplosion(x, y, config);
    }
    
    createTrail(x, y, config = {}) {
        return this.particles.createTrail(x, y, config);
    }
    
    // Game state
    startRace() {
        this.gameState.startRace();
    }
    
    pauseGame() {
        this.gameState.pause();
    }
    
    resumeGame() {
        this.gameState.resume();
    }
    
    // Input handling
    onKeyDown(callback) {
        this.input.onKeyDown(callback);
    }
    
    onKeyUp(callback) {
        this.input.onKeyUp(callback);
    }
    
    // Cleanup
    destroy() {
        this.stop();
        this.audio.destroy();
        this.input.destroy();
        console.log('🗑️ Game engine destroyed');
    }
}