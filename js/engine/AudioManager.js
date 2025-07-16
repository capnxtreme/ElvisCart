/**
 * Audio Manager for Retro Racing Games
 * Handles sound effects and music playback
 */

export class AudioManager {
    constructor() {
        this.sounds = new Map();
        this.music = new Map();
        this.currentMusic = null;
        this.masterVolume = 1.0;
        this.soundVolume = 0.8;
        this.musicVolume = 0.6;
        this.enabled = true;
        
        // Audio context for Web Audio API
        this.audioContext = null;
        this.masterGain = null;
        this.soundGain = null;
        this.musicGain = null;
    }
    
    async init() {
        console.log('🎵 Initializing audio manager...');
        
        try {
            // Initialize Web Audio API
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.masterGain = this.audioContext.createGain();
            this.soundGain = this.audioContext.createGain();
            this.musicGain = this.audioContext.createGain();
            
            // Connect audio nodes
            this.soundGain.connect(this.masterGain);
            this.musicGain.connect(this.masterGain);
            this.masterGain.connect(this.audioContext.destination);
            
            // Set initial volumes
            this.updateVolumes();
            
            console.log('✅ Audio manager initialized');
        } catch (error) {
            console.warn('⚠️ Web Audio API not supported, using fallback');
            this.enabled = false;
        }
    }
    
    updateVolumes() {
        if (!this.enabled) return;
        
        this.masterGain.gain.value = this.masterVolume;
        this.soundGain.gain.value = this.soundVolume;
        this.musicGain.gain.value = this.musicVolume;
    }
    
    async loadSound(name, url) {
        if (!this.enabled) return;
        
        try {
            const response = await fetch(url);
            const arrayBuffer = await response.arrayBuffer();
            const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
            
            this.sounds.set(name, audioBuffer);
            console.log(`Loaded sound: ${name}`);
        } catch (error) {
            console.error(`Failed to load sound ${name}:`, error);
        }
    }
    
    async loadMusic(name, url) {
        if (!this.enabled) return;
        
        try {
            const response = await fetch(url);
            const arrayBuffer = await response.arrayBuffer();
            const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
            
            this.music.set(name, audioBuffer);
            console.log(`Loaded music: ${name}`);
        } catch (error) {
            console.error(`Failed to load music ${name}:`, error);
        }
    }
    
    play(name, options = {}) {
        if (!this.enabled || !this.sounds.has(name)) return null;
        
        const source = this.audioContext.createBufferSource();
        const gainNode = this.audioContext.createGain();
        
        source.buffer = this.sounds.get(name);
        source.connect(gainNode);
        gainNode.connect(this.soundGain);
        
        // Apply options
        if (options.volume !== undefined) {
            gainNode.gain.value = options.volume * this.soundVolume;
        } else {
            gainNode.gain.value = this.soundVolume;
        }
        
        if (options.loop) {
            source.loop = true;
        }
        
        if (options.rate !== undefined) {
            source.playbackRate.value = options.rate;
        }
        
        source.start();
        return source;
    }
    
    playMusic(name, options = {}) {
        if (!this.enabled || !this.music.has(name)) return null;
        
        // Stop current music
        this.stopMusic();
        
        const source = this.audioContext.createBufferSource();
        const gainNode = this.audioContext.createGain();
        
        source.buffer = this.music.get(name);
        source.connect(gainNode);
        gainNode.connect(this.musicGain);
        
        // Apply options
        if (options.volume !== undefined) {
            gainNode.gain.value = options.volume * this.musicVolume;
        } else {
            gainNode.gain.value = this.musicVolume;
        }
        
        source.loop = options.loop !== false; // Default to looping
        
        source.start();
        this.currentMusic = source;
        
        return source;
    }
    
    stopMusic() {
        if (this.currentMusic) {
            this.currentMusic.stop();
            this.currentMusic = null;
        }
    }
    
    pauseMusic() {
        if (this.currentMusic && this.audioContext.state === 'running') {
            this.audioContext.suspend();
        }
    }
    
    resumeMusic() {
        if (this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }
    }
    
    setMasterVolume(volume) {
        this.masterVolume = Math.max(0, Math.min(1, volume));
        this.updateVolumes();
    }
    
    setSoundVolume(volume) {
        this.soundVolume = Math.max(0, Math.min(1, volume));
        this.updateVolumes();
    }
    
    setMusicVolume(volume) {
        this.musicVolume = Math.max(0, Math.min(1, volume));
        this.updateVolumes();
    }
    
    update(deltaTime) {
        // Audio manager doesn't need regular updates
    }
    
    destroy() {
        this.stopMusic();
        
        if (this.audioContext) {
            this.audioContext.close();
        }
        
        this.sounds.clear();
        this.music.clear();
    }
}