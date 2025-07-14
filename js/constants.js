// Game constants and configuration
export const CANVAS_WIDTH = 1024;
export const CANVAS_HEIGHT = 576;

export const SEGMENT_LENGTH = 200;
export const TRACK_LENGTH = 200;
export const TRACK_WIDTH = 2000;

export const PLAYER_MAX_SPEED = 600;
export const PLAYER_ACCELERATION = 25;

export const TOTAL_LAPS = 3;

export const OPPONENT_NAMES = ['Betty Bombshell', 'Johnny Hot Rod', 'Buddy Bopper', 'Peggy Sue'];
export const OPPONENT_COLORS = ['#FF1493', '#4169E1', '#32CD32', '#FFD700'];

export const POWERUP_TYPES = {
    pomadeSlick: { 
        name: 'Pomade Slick', 
        color: '#8B4513', 
        icon: '🛢️',
        duration: 3
    },
    jukeboxBlast: { 
        name: 'Jukebox Blast', 
        color: '#FF1493', 
        icon: '🎵',
        radius: 300
    },
    chromeLightning: { 
        name: 'Chrome Lightning', 
        color: '#00FFFF', 
        icon: '⚡',
        boost: 3
    },
    blueSuedeShield: { 
        name: 'Blue Suede Shield', 
        color: '#4169E1', 
        icon: '🛡️',
        duration: 5
    },
    duckTailDraft: { 
        name: 'Duck Tail Draft', 
        color: '#FFD700', 
        icon: '💨',
        duration: 4
    }
};

export const ROADSIDE_OBJECTS = {
    palmTree: { width: 80, height: 200, color: '#228B22' },
    diner: { width: 300, height: 150, color: '#FF69B4' },
    billboard: { width: 150, height: 100, color: '#FFD700' },
    cactus: { width: 60, height: 100, color: '#2F4F2F' },
    gasStation: { width: 200, height: 120, color: '#DC143C' }
};