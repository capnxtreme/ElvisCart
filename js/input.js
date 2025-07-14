// Input handling system
export const keys = {};

export function initInput() {
    window.addEventListener('keydown', e => keys[e.key] = true);
    window.addEventListener('keyup', e => keys[e.key] = false);
}

export function isKeyPressed(key) {
    return keys[key] || false;
}