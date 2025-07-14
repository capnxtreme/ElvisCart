// Sprite generator for rockabilly characters
export class SpriteGenerator {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.pixelSize = 4;
    }
    
    // Generate a character sprite
    generateCharacterSprite(character, angle = 0) {
        const size = 64; // Base sprite size
        this.canvas.width = size;
        this.canvas.height = size;
        
        // Clear canvas
        this.ctx.clearRect(0, 0, size, size);
        
        // Enable pixelated rendering
        this.ctx.imageSmoothingEnabled = false;
        
        switch(character.id) {
            case 'elvis':
                this.drawElvis(size, angle);
                break;
            case 'betty':
                this.drawBetty(size, angle);
                break;
            case 'johnny':
                this.drawJohnny(size, angle);
                break;
            case 'buddy':
                this.drawBuddy(size, angle);
                break;
        }
        
        return this.canvas.toDataURL();
    }
    
    // Draw Elvis "The King" Presley
    drawElvis(size, angle) {
        const ctx = this.ctx;
        const cx = size / 2;
        const cy = size / 2;
        
        // Kart body (pink Cadillac)
        ctx.fillStyle = '#FF1493';
        this.drawKartBody(cx, cy + 8, 24, 16, angle);
        
        // Elvis's pompadour hair
        ctx.fillStyle = '#000000';
        this.drawPixel(cx - 4, cy - 12, 8, 6);
        this.drawPixel(cx - 6, cy - 10, 12, 4);
        
        // Face
        ctx.fillStyle = '#FDBCB4';
        this.drawPixel(cx - 4, cy - 8, 8, 8);
        
        // Sunglasses
        ctx.fillStyle = '#000000';
        this.drawPixel(cx - 4, cy - 6, 3, 2);
        this.drawPixel(cx + 1, cy - 6, 3, 2);
        
        // White jumpsuit collar
        ctx.fillStyle = '#FFFFFF';
        this.drawPixel(cx - 5, cy - 2, 10, 3);
        
        // Gold trim
        ctx.fillStyle = '#FFD700';
        this.drawPixel(cx - 6, cy - 1, 12, 1);
    }
    
    // Draw Betty "Bombshell" Page
    drawBetty(size, angle) {
        const ctx = this.ctx;
        const cx = size / 2;
        const cy = size / 2;
        
        // Kart body (hot pink)
        ctx.fillStyle = '#FF69B4';
        this.drawKartBody(cx, cy + 8, 24, 16, angle);
        
        // Black hair with bangs
        ctx.fillStyle = '#000000';
        this.drawPixel(cx - 5, cy - 12, 10, 4);
        this.drawPixel(cx - 6, cy - 10, 12, 2);
        
        // Face
        ctx.fillStyle = '#FDBCB4';
        this.drawPixel(cx - 4, cy - 8, 8, 8);
        
        // Red lips
        ctx.fillStyle = '#DC143C';
        this.drawPixel(cx - 2, cy - 4, 4, 1);
        
        // Eyes
        ctx.fillStyle = '#000000';
        this.drawPixel(cx - 3, cy - 6, 2, 1);
        this.drawPixel(cx + 1, cy - 6, 2, 1);
        
        // Polka dot dress
        ctx.fillStyle = '#FF0000';
        this.drawPixel(cx - 5, cy - 2, 10, 4);
        ctx.fillStyle = '#FFFFFF';
        this.drawPixel(cx - 3, cy - 1, 2, 2);
        this.drawPixel(cx + 1, cy - 1, 2, 2);
    }
    
    // Draw Johnny "Hot Rod" Cash
    drawJohnny(size, angle) {
        const ctx = this.ctx;
        const cx = size / 2;
        const cy = size / 2;
        
        // Kart body (black)
        ctx.fillStyle = '#1C1C1C';
        this.drawKartBody(cx, cy + 8, 24, 16, angle);
        
        // Slicked back dark hair
        ctx.fillStyle = '#1C1C1C';
        this.drawPixel(cx - 4, cy - 12, 8, 6);
        
        // Face
        ctx.fillStyle = '#FDBCB4';
        this.drawPixel(cx - 4, cy - 8, 8, 8);
        
        // Eyes
        ctx.fillStyle = '#000000';
        this.drawPixel(cx - 3, cy - 6, 2, 1);
        this.drawPixel(cx + 1, cy - 6, 2, 1);
        
        // Black shirt
        ctx.fillStyle = '#000000';
        this.drawPixel(cx - 5, cy - 2, 10, 4);
        
        // Guitar outline
        ctx.fillStyle = '#8B4513';
        this.drawPixel(cx + 6, cy - 4, 3, 8);
    }
    
    // Draw Buddy "The Bopper" Holly
    drawBuddy(size, angle) {
        const ctx = this.ctx;
        const cx = size / 2;
        const cy = size / 2;
        
        // Kart body (blue)
        ctx.fillStyle = '#4169E1';
        this.drawKartBody(cx, cy + 8, 24, 16, angle);
        
        // Brown hair
        ctx.fillStyle = '#8B4513';
        this.drawPixel(cx - 4, cy - 12, 8, 4);
        
        // Face
        ctx.fillStyle = '#FDBCB4';
        this.drawPixel(cx - 4, cy - 8, 8, 8);
        
        // Iconic black glasses
        ctx.fillStyle = '#000000';
        this.drawPixel(cx - 5, cy - 6, 4, 3);
        this.drawPixel(cx + 1, cy - 6, 4, 3);
        this.drawPixel(cx - 1, cy - 6, 2, 1); // Bridge
        
        // Bow tie
        ctx.fillStyle = '#FF0000';
        this.drawPixel(cx - 3, cy - 2, 6, 2);
        
        // White shirt
        ctx.fillStyle = '#FFFFFF';
        this.drawPixel(cx - 4, cy, 8, 2);
    }
    
    // Helper to draw kart body with rotation
    drawKartBody(x, y, width, height, angle) {
        const ctx = this.ctx;
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle);
        
        // Main body
        this.drawPixel(-width/2, -height/2, width, height);
        
        // Wheels
        ctx.fillStyle = '#000000';
        this.drawPixel(-width/2 - 2, -height/2 + 2, 4, 4);
        this.drawPixel(width/2 - 2, -height/2 + 2, 4, 4);
        this.drawPixel(-width/2 - 2, height/2 - 6, 4, 4);
        this.drawPixel(width/2 - 2, height/2 - 6, 4, 4);
        
        // Chrome details
        ctx.fillStyle = '#C0C0C0';
        this.drawPixel(-width/2 + 4, -height/2 + 1, width - 8, 2);
        
        ctx.restore();
    }
    
    // Draw pixelated rectangle
    drawPixel(x, y, width, height) {
        this.ctx.fillRect(
            Math.floor(x), 
            Math.floor(y), 
            Math.floor(width), 
            Math.floor(height)
        );
    }
    
    // Generate sprite sheet with multiple angles
    generateSpriteSheet(character) {
        const angles = 16; // Number of rotation frames
        const spriteSize = 64;
        const sheetWidth = spriteSize * angles;
        
        this.canvas.width = sheetWidth;
        this.canvas.height = spriteSize;
        
        for (let i = 0; i < angles; i++) {
            const angle = (i / angles) * Math.PI * 2;
            
            // Draw sprite at this angle
            const tempCanvas = document.createElement('canvas');
            tempCanvas.width = spriteSize;
            tempCanvas.height = spriteSize;
            const tempCtx = tempCanvas.getContext('2d');
            tempCtx.imageSmoothingEnabled = false;
            
            // Save current canvas
            const originalCanvas = this.canvas;
            const originalCtx = this.ctx;
            
            // Use temp canvas
            this.canvas = tempCanvas;
            this.ctx = tempCtx;
            
            // Generate sprite
            this.generateCharacterSprite(character, angle);
            
            // Copy to sprite sheet
            originalCtx.drawImage(tempCanvas, i * spriteSize, 0);
            
            // Restore
            this.canvas = originalCanvas;
            this.ctx = originalCtx;
        }
        
        return this.canvas.toDataURL();
    }
}