/**
 * Game State Manager for Retro Racing Games
 * Handles race progression, scoring, and game flow
 */

export class GameState {
    constructor() {
        this.state = 'menu'; // menu, racing, paused, finished
        this.raceStarted = false;
        this.raceFinished = false;
        this.countdown = 3;
        this.totalLaps = 3;
        this.currentLap = 0;
        this.raceTime = 0;
        this.bestTime = 0;
        this.finishOrder = [];
        this.frame = 0;
        this.paused = false;
        
        // Race settings
        this.settings = {
            totalLaps: 3,
            countdownTime: 3,
            difficulty: 'medium',
            trackId: null,
            playerVehicle: 'kart',
            opponentCount: 4
        };
    }
    
    setup(config) {
        this.settings = { ...this.settings, ...config };
        this.totalLaps = this.settings.totalLaps;
        this.countdown = this.settings.countdownTime;
    }
    
    update(deltaTime) {
        if (this.paused) return;
        
        this.frame++;
        
        if (this.state === 'racing') {
            this.updateRace(deltaTime);
        }
    }
    
    updateRace(deltaTime) {
        if (!this.raceStarted) {
            this.countdown -= deltaTime;
            if (this.countdown <= 0) {
                this.startRace();
            }
            return;
        }
        
        this.raceTime += deltaTime;
    }
    
    startRace() {
        this.raceStarted = true;
        this.countdown = 0;
        console.log('🏁 Race started!');
    }
    
    pause() {
        this.paused = true;
        this.state = 'paused';
    }
    
    resume() {
        this.paused = false;
        this.state = 'racing';
    }
    
    finishRace() {
        this.raceFinished = true;
        this.state = 'finished';
        
        // Update best time
        if (this.bestTime === 0 || this.raceTime < this.bestTime) {
            this.bestTime = this.raceTime;
        }
    }
    
    getPlayer() {
        // This would be provided by the vehicle manager
        return null;
    }
    
    getRaceTime() {
        return this.raceTime;
    }
    
    getBestTime() {
        return this.bestTime;
    }
    
    getFinishOrder() {
        return this.finishOrder;
    }
    
    addToFinishOrder(vehicle) {
        if (!this.finishOrder.find(v => v.id === vehicle.id)) {
            this.finishOrder.push({
                id: vehicle.id,
                name: vehicle.name,
                time: this.raceTime,
                lap: vehicle.lap
            });
        }
    }
    
    reset() {
        this.raceStarted = false;
        this.raceFinished = false;
        this.countdown = this.settings.countdownTime;
        this.raceTime = 0;
        this.currentLap = 0;
        this.finishOrder = [];
        this.frame = 0;
        this.paused = false;
        this.state = 'menu';
    }
}