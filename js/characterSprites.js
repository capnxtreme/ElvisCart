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
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const spriteSize = 64;
    const angles = 16;
    
    canvas.width = spriteSize * angles;
    canvas.height = spriteSize;
    ctx.imageSmoothingEnabled = false;
    
    // Generate each rotation frame
    for (let i = 0; i < angles; i++) {
        const angle = (i / angles) * Math.PI * 2;
        
        // Create temp canvas for this frame
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = spriteSize;
        tempCanvas.height = spriteSize;
        const tempCtx = tempCanvas.getContext('2d');
        tempCtx.imageSmoothingEnabled = false;
        
        // Use generator to draw character at this angle
        const tempGenerator = new SpriteGenerator();
        tempGenerator.canvas = tempCanvas;
        tempGenerator.ctx = tempCtx;
        
        switch(character.id) {
            case 'elvis':
                tempGenerator.drawElvis(spriteSize, angle);
                break;
            case 'betty':
                tempGenerator.drawBetty(spriteSize, angle);
                break;
            case 'johnny':
                tempGenerator.drawJohnny(spriteSize, angle);
                break;
            case 'buddy':
                tempGenerator.drawBuddy(spriteSize, angle);
                break;
        }
        
        // Copy to sprite sheet
        ctx.drawImage(tempCanvas, i * spriteSize, 0);
    }
    
    // Create and return image
    const img = new Image();
    img.src = canvas.toDataURL();
    return img;
}

export function getCharacterSprite(characterId) {
    return spriteCache[characterId];
}

export function getCharacterSpriteSheet(characterId) {
    return spriteSheetCache[characterId];
}