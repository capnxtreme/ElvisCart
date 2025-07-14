// Sprite generator for rockabilly characters
export class SpriteGenerator {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.pixelSize = 12; // Triple size for bigger pixels
    }
    
    // Generate a character sprite (for UI/selection screen)
    generateCharacterSprite(character, angle = 0) {
        const size = 192; // Triple size! Was 64
        this.canvas.width = size;
        this.canvas.height = size;
        
        // Clear canvas
        this.ctx.clearRect(0, 0, size, size);
        
        // Enable pixelated rendering
        this.ctx.imageSmoothingEnabled = false;
        
        switch(character.id) {
            case 'elvis':
                this.drawElvisPortrait(size);
                break;
            case 'betty':
                this.drawBettyPortrait(size);
                break;
            case 'johnny':
                this.drawJohnnyPortrait(size);
                break;
            case 'buddy':
                this.drawBuddyPortrait(size);
                break;
        }
        
        return this.canvas.toDataURL();
    }
    
    // Generate a kart sprite (rear view for racing)
    generateKartSprite(character, angle = 0) {
        const size = 288; // Triple size! Was 96
        this.canvas.width = size;
        this.canvas.height = size;
        
        // Clear canvas
        this.ctx.clearRect(0, 0, size, size);
        
        // Enable pixelated rendering
        this.ctx.imageSmoothingEnabled = false;
        
        switch(character.id) {
            case 'elvis':
                this.drawElvisKart(size, angle);
                break;
            case 'betty':
                this.drawBettyKart(size, angle);
                break;
            case 'johnny':
                this.drawJohnnyKart(size, angle);
                break;
            case 'buddy':
                this.drawBuddyKart(size, angle);
                break;
        }
        
        return this.canvas.toDataURL();
    }
    
    // Draw Elvis portrait for UI
    drawElvisPortrait(size) {
        const ctx = this.ctx;
        const cx = size / 2;
        const cy = size / 2;
        const scale = size / 64; // Scale factor from original 64px design
        
        // Just draw the character portrait
        
        // Elvis's pompadour hair
        ctx.fillStyle = '#000000';
        this.drawPixel(cx - 4*scale, cy - 12*scale, 8*scale, 6*scale);
        this.drawPixel(cx - 6*scale, cy - 10*scale, 12*scale, 4*scale);
        
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
    
    // Draw Betty portrait for UI
    drawBettyPortrait(size) {
        const ctx = this.ctx;
        const cx = size / 2;
        const cy = size / 2;
        
        // Just draw the character portrait
        
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
    
    // Draw Johnny portrait for UI
    drawJohnnyPortrait(size) {
        const ctx = this.ctx;
        const cx = size / 2;
        const cy = size / 2;
        
        // Just draw the character portrait
        
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
        
        ctx.restore();
    }
    
    // Draw Buddy "The Bopper" Holly
    // Draw Buddy portrait for UI
    drawBuddyPortrait(size) {
        const ctx = this.ctx;
        const cx = size / 2;
        const cy = size / 2;
        
        // Just draw the character portrait
        
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
    
    // KART SPRITES (REAR VIEW) - Bigger and more fun!
    
    // Draw Elvis kart - Pink Cadillac with fins!
    drawElvisKart(size, angle) {
        const ctx = this.ctx;
        const scale = size / 96; // Scale from original 96px design
        
        ctx.save();
        ctx.translate(size / 2, size / 2);
        ctx.scale(scale, scale);
        ctx.rotate(angle);
        
        // Huge pink Cadillac body
        ctx.fillStyle = '#FF1493';
        this.drawPixel(-30, -20, 60, 40);
        
        // Tail fins!
        ctx.fillStyle = '#FF69B4';
        this.drawPixel(-35, -15, 10, 12);
        this.drawPixel(25, -15, 10, 12);
        
        // Chrome bumper
        ctx.fillStyle = '#C0C0C0';
        this.drawPixel(-32, 18, 64, 4);
        
        // Exhaust pipes with flames!
        ctx.fillStyle = '#696969';
        this.drawPixel(-25, 22, 6, 8);
        this.drawPixel(19, 22, 6, 8);
        
        // Flame effect
        if (Math.random() > 0.5) {
            ctx.fillStyle = '#FF4500';
            this.drawPixel(-23, 30, 4, 6);
            this.drawPixel(21, 30, 4, 6);
        }
        
        // Big rear wheels
        ctx.fillStyle = '#000000';
        this.drawPixel(-38, 5, 12, 20);
        this.drawPixel(26, 5, 12, 20);
        
        // Wheel details
        ctx.fillStyle = '#FFFFFF';
        this.drawPixel(-35, 10, 6, 10);
        this.drawPixel(29, 10, 6, 10);
        
        // Elvis's huge pompadour visible from behind
        ctx.fillStyle = '#000000';
        this.drawPixel(-8, -30, 16, 12);
        this.drawPixel(-10, -28, 20, 8);
        
        // License plate
        ctx.fillStyle = '#FFFF00';
        this.drawPixel(-15, 10, 30, 8);
        ctx.fillStyle = '#000000';
        ctx.font = 'bold 6px monospace';
        ctx.fillText('KING', -12, 16);
        
        ctx.restore();
    }
    
    // Draw Betty kart - Hot rod with dice!
    drawBettyKart(size, angle) {
        const ctx = this.ctx;
        const scale = size / 96;
        
        ctx.save();
        ctx.translate(size / 2, size / 2);
        ctx.scale(scale, scale);
        ctx.rotate(angle);
        
        // Hot pink hot rod body
        ctx.fillStyle = '#FF69B4';
        this.drawPixel(-28, -18, 56, 36);
        
        // Black racing stripes
        ctx.fillStyle = '#000000';
        this.drawPixel(-5, -20, 3, 40);
        this.drawPixel(2, -20, 3, 40);
        
        // Chrome pipes on sides
        ctx.fillStyle = '#C0C0C0';
        this.drawPixel(-35, -10, 8, 4);
        this.drawPixel(27, -10, 8, 4);
        
        // Fuzzy dice hanging (visible from rear window area)
        ctx.fillStyle = '#FF0000';
        this.drawPixel(-6, -15, 5, 5);
        this.drawPixel(1, -15, 5, 5);
        ctx.fillStyle = '#FFFFFF';
        this.drawPixel(-5, -14, 1, 1);
        this.drawPixel(2, -14, 1, 1);
        
        // Wide rear wheels
        ctx.fillStyle = '#000000';
        this.drawPixel(-40, 8, 14, 18);
        this.drawPixel(26, 8, 14, 18);
        
        // Chrome rims
        ctx.fillStyle = '#C0C0C0';
        this.drawPixel(-37, 12, 8, 10);
        this.drawPixel(29, 12, 8, 10);
        
        // Betty's victory rolls hairstyle
        ctx.fillStyle = '#000000';
        this.drawPixel(-12, -28, 8, 10);
        this.drawPixel(4, -28, 8, 10);
        
        // Polka dot detail on kart
        ctx.fillStyle = '#FFFFFF';
        this.drawPixel(-20, -5, 4, 4);
        this.drawPixel(16, -5, 4, 4);
        this.drawPixel(-10, 5, 4, 4);
        this.drawPixel(6, 5, 4, 4);
        
        ctx.restore();
    }
    
    // Draw Johnny kart - Black hot rod with flames!
    drawJohnnyKart(size, angle) {
        const ctx = this.ctx;
        const scale = size / 96;
        
        ctx.save();
        ctx.translate(size / 2, size / 2);
        ctx.scale(scale, scale);
        ctx.rotate(angle);
        
        // Sleek black body
        ctx.fillStyle = '#1C1C1C';
        this.drawPixel(-30, -16, 60, 35);
        
        // Red flame decals
        ctx.fillStyle = '#FF0000';
        this.drawPixel(-30, -10, 8, 15);
        this.drawPixel(-22, -12, 6, 17);
        this.drawPixel(22, -10, 8, 15);
        this.drawPixel(16, -12, 6, 17);
        
        // Orange flame tips
        ctx.fillStyle = '#FF8C00';
        this.drawPixel(-30, -5, 4, 8);
        this.drawPixel(26, -5, 4, 8);
        
        // Chrome exhaust
        ctx.fillStyle = '#C0C0C0';
        this.drawPixel(-20, 19, 8, 10);
        this.drawPixel(12, 19, 8, 10);
        
        // Smoke effect
        ctx.fillStyle = 'rgba(128, 128, 128, 0.5)';
        this.drawPixel(-18, 29, 6, 8);
        this.drawPixel(14, 29, 6, 8);
        
        // Fat rear tires
        ctx.fillStyle = '#000000';
        this.drawPixel(-42, 6, 16, 22);
        this.drawPixel(26, 6, 16, 22);
        
        // White wall tires
        ctx.fillStyle = '#FFFFFF';
        this.drawPixel(-40, 10, 12, 14);
        this.drawPixel(28, 10, 12, 14);
        ctx.fillStyle = '#000000';
        this.drawPixel(-38, 12, 8, 10);
        this.drawPixel(30, 12, 8, 10);
        
        // Johnny's slicked hair
        ctx.fillStyle = '#1C1C1C';
        this.drawPixel(-6, -26, 12, 10);
        
        // Skull ornament on back
        ctx.fillStyle = '#FFFFFF';
        this.drawPixel(-4, 0, 8, 8);
        ctx.fillStyle = '#000000';
        this.drawPixel(-2, 2, 2, 2);
        this.drawPixel(0, 2, 2, 2);
        
        ctx.restore();
    }
    
    // Draw Buddy kart - Blue classic with musical notes!
    drawBuddyKart(size, angle) {
        const ctx = this.ctx;
        const scale = size / 96;
        
        ctx.save();
        ctx.translate(size / 2, size / 2);
        ctx.scale(scale, scale);
        ctx.rotate(angle);
        
        // Classic blue body
        ctx.fillStyle = '#4169E1';
        this.drawPixel(-26, -18, 52, 36);
        
        // White racing stripe
        ctx.fillStyle = '#FFFFFF';
        this.drawPixel(-2, -20, 4, 38);
        
        // Musical notes floating around
        ctx.fillStyle = '#FFD700';
        this.drawPixel(-20, -25, 4, 6);
        this.drawPixel(-18, -27, 1, 8);
        this.drawPixel(16, -25, 4, 6);
        this.drawPixel(18, -27, 1, 8);
        
        // Chrome details
        ctx.fillStyle = '#C0C0C0';
        this.drawPixel(-28, 16, 56, 3);
        
        // Guitar shaped exhaust pipes!
        ctx.fillStyle = '#8B4513';
        this.drawPixel(-22, 19, 10, 12);
        this.drawPixel(12, 19, 10, 12);
        ctx.fillStyle = '#FFD700';
        this.drawPixel(-20, 22, 6, 6);
        this.drawPixel(14, 22, 6, 6);
        
        // Classic wheels
        ctx.fillStyle = '#000000';
        this.drawPixel(-36, 8, 12, 18);
        this.drawPixel(24, 8, 12, 18);
        
        // Whitewall detail
        ctx.fillStyle = '#FFFFFF';
        this.drawPixel(-34, 11, 8, 12);
        this.drawPixel(26, 11, 8, 12);
        
        // Buddy's glasses glinting
        ctx.fillStyle = '#000000';
        this.drawPixel(-10, -26, 8, 8);
        this.drawPixel(2, -26, 8, 8);
        ctx.fillStyle = '#87CEEB';
        this.drawPixel(-8, -24, 4, 4);
        this.drawPixel(4, -24, 4, 4);
        
        // "Rock On" text on bumper
        ctx.fillStyle = '#FFFF00';
        this.drawPixel(-12, 8, 24, 6);
        ctx.fillStyle = '#000000';
        ctx.font = 'bold 5px monospace';
        ctx.fillText('ROCK', -10, 13);
        
        ctx.restore();
    }
    
    // Generate sprite sheet with multiple angles for karts
    generateKartSpriteSheet(character) {
        const angles = 16; // Number of rotation frames
        const spriteSize = 288; // Triple size! Was 96
        const sheetWidth = spriteSize * angles;
        
        this.canvas.width = sheetWidth;
        this.canvas.height = spriteSize;
        this.ctx.clearRect(0, 0, sheetWidth, spriteSize);
        
        for (let i = 0; i < angles; i++) {
            const angle = (i / angles) * Math.PI * 2 - Math.PI;
            
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
            
            // Generate kart sprite
            this.generateKartSprite(character, angle);
            
            // Copy to sprite sheet
            originalCtx.drawImage(tempCanvas, i * spriteSize, 0);
            
            // Restore
            this.canvas = originalCanvas;
            this.ctx = originalCtx;
        }
        
        return this.canvas.toDataURL();
    }
}