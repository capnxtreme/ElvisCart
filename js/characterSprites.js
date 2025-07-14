// Pre-load and cache character sprites
import { SpriteGenerator } from './spriteGenerator.js';
import { getAllCharacters } from './characters.js';

const spriteCache = {};
const spriteSheetCache = {};
let generator = null;

export function initSprites() {
    generator = new SpriteGenerator();
    
    // Pre-generate all character sprites
    getAllCharacters().forEach(character => {
        // Single sprite for UI
        spriteCache[character.id] = generator.generateCharacterSprite(character, 0);
        
        // Sprite sheet for gameplay
        spriteSheetCache[character.id] = createSpriteSheetImage(character);
    });
}

function createSpriteSheetImage(character) {
    // Use the new kart sprite sheet generator
    const spriteSheetData = generator.generateKartSpriteSheet(character);
    const img = new Image();
    img.src = spriteSheetData;
    return img;
}

export function getCharacterSprite(characterId) {
    return spriteCache[characterId];
}

export function getCharacterSpriteSheet(characterId) {
    return spriteSheetCache[characterId];
}