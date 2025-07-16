/**
 * Input Manager for Retro Racing Games
 * Handles keyboard, gamepad, and touch input
 */

export class InputManager {
    constructor() {
        this.keys = new Map();
        this.gamepad = null;
        this.touchControls = false;
        this.inputCallbacks = {
            keyDown: [],
            keyUp: [],
            gamepadConnected: [],
            gamepadDisconnected: []
        };
        
        // Default key mappings
        this.keyMappings = {
            accelerate: ['ArrowUp', 'KeyW', 'Space'],
            brake: ['ArrowDown', 'KeyS'],
            steerLeft: ['ArrowLeft', 'KeyA'],
            steerRight: ['ArrowRight', 'KeyD'],
            drift: ['Space', 'ShiftLeft'],
            boost: ['Enter', 'KeyB'],
            pause: ['Escape', 'KeyP'],
            reset: ['KeyR']
        };
        
        // Gamepad mappings
        this.gamepadMappings = {
            accelerate: 7, // Right trigger
            brake: 6, // Left trigger
            steerLeft: 14, // D-pad left
            steerRight: 15, // D-pad right
            drift: 0, // A button
            boost: 1, // B button
            pause: 9, // Start button
            reset: 8 // Select button
        };
        
        // Input state
        this.input = {
            accelerate: false,
            brake: false,
            steer: 0, // -1 to 1
            drift: false,
            boost: false,
            pause: false,
            reset: false
        };
    }
    
    async init() {
        console.log('🎮 Initializing input manager...');
        
        this.setupKeyboardInput();
        this.setupGamepadInput();
        this.setupTouchInput();
        
        console.log('✅ Input manager initialized');
    }
    
    setupKeyboardInput() {
        document.addEventListener('keydown', (event) => {
            this.handleKeyDown(event);
        });
        
        document.addEventListener('keyup', (event) => {
            this.handleKeyUp(event);
        });
    }
    
    setupGamepadInput() {
        window.addEventListener('gamepadconnected', (event) => {
            this.gamepad = event.gamepad;
            this.inputCallbacks.gamepadConnected.forEach(callback => callback(event.gamepad));
        });
        
        window.addEventListener('gamepaddisconnected', (event) => {
            this.gamepad = null;
            this.inputCallbacks.gamepadDisconnected.forEach(callback => callback(event.gamepad));
        });
    }
    
    setupTouchInput() {
        // Touch controls for mobile devices
        if ('ontouchstart' in window) {
            this.touchControls = true;
            this.setupTouchControls();
        }
    }
    
    setupTouchControls() {
        // Create touch control overlay
        const touchOverlay = document.createElement('div');
        touchOverlay.id = 'touchControls';
        touchOverlay.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 20px;
            right: 20px;
            height: 120px;
            pointer-events: none;
            z-index: 1000;
        `;
        
        // Create control buttons
        const controls = [
            { id: 'accelerate', text: '⏫', x: '80%', y: '50%' },
            { id: 'brake', text: '⏬', x: '20%', y: '50%' },
            { id: 'steerLeft', text: '⬅️', x: '10%', y: '50%' },
            { id: 'steerRight', text: '➡️', x: '90%', y: '50%' },
            { id: 'drift', text: '🔄', x: '50%', y: '20%' },
            { id: 'boost', text: '🚀', x: '50%', y: '80%' }
        ];
        
        controls.forEach(control => {
            const button = document.createElement('div');
            button.id = `touch_${control.id}`;
            button.textContent = control.text;
            button.style.cssText = `
                position: absolute;
                left: ${control.x};
                top: ${control.y};
                transform: translate(-50%, -50%);
                width: 60px;
                height: 60px;
                background: rgba(255, 255, 255, 0.3);
                border: 2px solid rgba(255, 255, 255, 0.5);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 24px;
                pointer-events: auto;
                user-select: none;
                touch-action: manipulation;
            `;
            
            // Add touch events
            button.addEventListener('touchstart', (e) => {
                e.preventDefault();
                this.handleTouchStart(control.id);
            });
            
            button.addEventListener('touchend', (e) => {
                e.preventDefault();
                this.handleTouchEnd(control.id);
            });
            
            touchOverlay.appendChild(button);
        });
        
        document.body.appendChild(touchOverlay);
    }
    
    handleKeyDown(event) {
        this.keys.set(event.code, true);
        this.updateInputState();
        this.inputCallbacks.keyDown.forEach(callback => callback(event));
    }
    
    handleKeyUp(event) {
        this.keys.set(event.code, false);
        this.updateInputState();
        this.inputCallbacks.keyUp.forEach(callback => callback(event));
    }
    
    handleTouchStart(action) {
        this.keys.set(`Touch_${action}`, true);
        this.updateInputState();
    }
    
    handleTouchEnd(action) {
        this.keys.set(`Touch_${action}`, false);
        this.updateInputState();
    }
    
    updateInputState() {
        // Reset input state
        this.input.accelerate = false;
        this.input.brake = false;
        this.input.steer = 0;
        this.input.drift = false;
        this.input.boost = false;
        this.input.pause = false;
        this.input.reset = false;
        
        // Check keyboard input
        this.input.accelerate = this.isKeyPressed(this.keyMappings.accelerate);
        this.input.brake = this.isKeyPressed(this.keyMappings.brake);
        this.input.drift = this.isKeyPressed(this.keyMappings.drift);
        this.input.boost = this.isKeyPressed(this.keyMappings.boost);
        this.input.pause = this.isKeyPressed(this.keyMappings.pause);
        this.input.reset = this.isKeyPressed(this.keyMappings.reset);
        
        // Handle steering
        if (this.isKeyPressed(this.keyMappings.steerLeft)) {
            this.input.steer -= 1;
        }
        if (this.isKeyPressed(this.keyMappings.steerRight)) {
            this.input.steer += 1;
        }
        
        // Clamp steering to -1 to 1
        this.input.steer = Math.max(-1, Math.min(1, this.input.steer));
        
        // Check gamepad input
        if (this.gamepad) {
            this.updateGamepadInput();
        }
    }
    
    updateGamepadInput() {
        const gamepad = navigator.getGamepads()[this.gamepad.index];
        if (!gamepad) return;
        
        // Check buttons
        if (gamepad.buttons[this.gamepadMappings.accelerate]?.pressed) {
            this.input.accelerate = true;
        }
        if (gamepad.buttons[this.gamepadMappings.brake]?.pressed) {
            this.input.brake = true;
        }
        if (gamepad.buttons[this.gamepadMappings.drift]?.pressed) {
            this.input.drift = true;
        }
        if (gamepad.buttons[this.gamepadMappings.boost]?.pressed) {
            this.input.boost = true;
        }
        if (gamepad.buttons[this.gamepadMappings.pause]?.pressed) {
            this.input.pause = true;
        }
        if (gamepad.buttons[this.gamepadMappings.reset]?.pressed) {
            this.input.reset = true;
        }
        
        // Check D-pad for steering
        if (gamepad.buttons[this.gamepadMappings.steerLeft]?.pressed) {
            this.input.steer -= 1;
        }
        if (gamepad.buttons[this.gamepadMappings.steerRight]?.pressed) {
            this.input.steer += 1;
        }
        
        // Check analog stick for steering
        if (gamepad.axes[0]) {
            this.input.steer = gamepad.axes[0];
        }
        
        // Check triggers for acceleration/braking
        if (gamepad.axes[2] > 0.1) {
            this.input.accelerate = true;
        }
        if (gamepad.axes[5] > 0.1) {
            this.input.brake = true;
        }
        
        // Clamp steering
        this.input.steer = Math.max(-1, Math.min(1, this.input.steer));
    }
    
    isKeyPressed(keyCodes) {
        if (Array.isArray(keyCodes)) {
            return keyCodes.some(code => this.keys.get(code));
        }
        return this.keys.get(keyCodes);
    }
    
    update() {
        this.updateInputState();
    }
    
    getInput() {
        return { ...this.input };
    }
    
    isPressed(action) {
        return this.input[action];
    }
    
    getSteering() {
        return this.input.steer;
    }
    
    onKeyDown(callback) {
        this.inputCallbacks.keyDown.push(callback);
    }
    
    onKeyUp(callback) {
        this.inputCallbacks.keyUp.push(callback);
    }
    
    onGamepadConnected(callback) {
        this.inputCallbacks.gamepadConnected.push(callback);
    }
    
    onGamepadDisconnected(callback) {
        this.inputCallbacks.gamepadDisconnected.push(callback);
    }
    
    setKeyMapping(action, keys) {
        this.keyMappings[action] = Array.isArray(keys) ? keys : [keys];
    }
    
    setGamepadMapping(action, button) {
        this.gamepadMappings[action] = button;
    }
    
    getKeyMappings() {
        return { ...this.keyMappings };
    }
    
    getGamepadMappings() {
        return { ...this.gamepadMappings };
    }
    
    destroy() {
        // Remove touch controls
        const touchOverlay = document.getElementById('touchControls');
        if (touchOverlay) {
            touchOverlay.remove();
        }
        
        // Clear callbacks
        this.inputCallbacks = {
            keyDown: [],
            keyUp: [],
            gamepadConnected: [],
            gamepadDisconnected: []
        };
    }
}