// Character selection screen
import { CHARACTERS, getAllCharacters, calculateStats } from './characters.js';
import { player } from './player.js';
import { game } from './gameState.js';
import { getCharacterSprite, getCharacterSpriteSheet } from './characterSprites.js';

let selectedCharacter = 'elvis';

export function initCharacterSelect() {
    // Sprites are now pre-loaded in characterSprites.js
}

export function createCharacterSelectScreen() {
    const container = document.createElement('div');
    container.id = 'characterSelect';
    container.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(45deg, #FF1493, #00CED1);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        color: white;
        font-family: 'Courier New', monospace;
    `;
    
    // Title
    const title = document.createElement('h1');
    title.textContent = '🎸 CHOOSE YOUR RACER 🎸';
    title.style.cssText = `
        font-size: 48px;
        text-shadow: 4px 4px 8px rgba(0,0,0,0.5);
        margin-bottom: 30px;
    `;
    container.appendChild(title);
    
    // Character grid
    const grid = document.createElement('div');
    grid.style.cssText = `
        display: grid;
        grid-template-columns: repeat(2, 300px);
        gap: 20px;
        margin-bottom: 30px;
    `;
    
    getAllCharacters().forEach(char => {
        const charDiv = createCharacterCard(char);
        grid.appendChild(charDiv);
    });
    
    container.appendChild(grid);
    
    // Start button
    const startButton = document.createElement('button');
    startButton.textContent = 'START RACE!';
    startButton.style.cssText = `
        padding: 20px 40px;
        font-size: 24px;
        background: #FFD700;
        color: #1a1a1a;
        border: none;
        border-radius: 50px;
        cursor: pointer;
        font-weight: bold;
        transition: transform 0.2s;
    `;
    startButton.onmouseover = () => startButton.style.transform = 'scale(1.1)';
    startButton.onmouseout = () => startButton.style.transform = 'scale(1)';
    startButton.onclick = () => selectCharacter(selectedCharacter);
    
    container.appendChild(startButton);
    
    return container;
}

function createCharacterCard(character) {
    const card = document.createElement('div');
    card.style.cssText = `
        background: rgba(0,0,0,0.5);
        border-radius: 10px;
        padding: 20px;
        cursor: pointer;
        transition: all 0.3s;
        border: 3px solid ${character.id === selectedCharacter ? '#FFD700' : 'transparent'};
    `;
    
    card.onclick = () => {
        selectedCharacter = character.id;
        updateCharacterSelection();
    };
    
    // Character sprite (portrait)
    const sprite = document.createElement('img');
    sprite.src = getCharacterSprite(character.id);
    sprite.style.cssText = `
        width: 64px;
        height: 64px;
        image-rendering: pixelated;
        float: left;
        margin-right: 15px;
    `;
    card.appendChild(sprite);
    
    // Character info
    const info = document.createElement('div');
    info.innerHTML = `
        <h3 style="margin: 0; color: ${character.color};">${character.name}</h3>
        <p style="margin: 5px 0; font-size: 12px; font-style: italic;">"${character.catchphrase}"</p>
        <div style="margin-top: 10px;">
            ${createStatBar('Speed', character.stats.speed)}
            ${createStatBar('Accel', character.stats.acceleration)}
            ${createStatBar('Handle', character.stats.handling)}
            ${createStatBar('Drift', character.stats.drift)}
        </div>
    `;
    card.appendChild(info);
    
    card.dataset.characterId = character.id;
    
    return card;
}

function createStatBar(label, value) {
    return `
        <div style="margin: 2px 0;">
            <span style="display: inline-block; width: 60px; font-size: 12px;">${label}:</span>
            <div style="display: inline-block; width: 100px; height: 10px; background: #333; border-radius: 5px;">
                <div style="width: ${value * 10}%; height: 100%; background: #FFD700; border-radius: 5px;"></div>
            </div>
        </div>
    `;
}

function updateCharacterSelection() {
    const cards = document.querySelectorAll('#characterSelect > div > div');
    cards.forEach(card => {
        if (card.dataset && card.dataset.characterId) {
            card.style.border = card.dataset.characterId === selectedCharacter 
                ? '3px solid #FFD700' 
                : '3px solid transparent';
        }
    });
}

export function selectCharacter(characterId) {
    const character = CHARACTERS[characterId];
    if (!character) return;
    
    // Apply character stats to player
    const stats = calculateStats(character);
    player.maxSpeed = stats.maxSpeed;
    player.acceleration = stats.acceleration;
    player.character = character;
    player.color = character.color;
    
    // Get sprite sheet for selected character
    player.spriteSheet = getCharacterSpriteSheet(character.id);
    
    // Hide character select and start game
    const selectScreen = document.getElementById('characterSelect');
    if (selectScreen) {
        selectScreen.style.display = 'none';
    }
    
    // Start the game
    window.startGame();
}