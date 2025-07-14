// Character definitions with stats and personality
export const CHARACTERS = {
    elvis: {
        id: 'elvis',
        name: 'Elvis "The King" Presley',
        color: '#FF1493',
        stats: {
            speed: 8,        // Top speed
            acceleration: 7, // How fast they reach top speed
            handling: 6,     // Turn radius and control
            drift: 9        // Drift control and boost power
        },
        bio: 'The King of Rock and Roll races in his pink Cadillac!',
        catchphrase: 'Thank you, thank you very much!',
        special: 'Blue Suede Boost - Extra drift power'
    },
    
    betty: {
        id: 'betty',
        name: 'Betty "Bombshell" Page',
        color: '#FF69B4',
        stats: {
            speed: 7,
            acceleration: 9,
            handling: 8,
            drift: 6
        },
        bio: 'The pin-up queen burns rubber in style!',
        catchphrase: "Catch me if you can, sugar!",
        special: 'Bombshell Blast - Better power-up duration'
    },
    
    johnny: {
        id: 'johnny',
        name: 'Johnny "Hot Rod" Cash',
        color: '#000000',
        stats: {
            speed: 9,
            acceleration: 6,
            handling: 5,
            drift: 8
        },
        bio: 'The Man in Black rides the highway to hell!',
        catchphrase: "I walk the line... at 200 MPH!",
        special: 'Ring of Fire - Immune to slicks'
    },
    
    buddy: {
        id: 'buddy',
        name: 'Buddy "The Bopper" Holly',
        color: '#4169E1',
        stats: {
            speed: 6,
            acceleration: 8,
            handling: 9,
            drift: 7
        },
        bio: 'Rock and roll will never die... especially at these speeds!',
        catchphrase: "That'll be the day!",
        special: 'Peggy Sue Speed - Better handling on curves'
    }
};

// Get character by ID
export function getCharacter(id) {
    return CHARACTERS[id] || CHARACTERS.elvis;
}

// Get all characters as array
export function getAllCharacters() {
    return Object.values(CHARACTERS);
}

// Calculate actual stats based on base values
export function calculateStats(character) {
    const stats = character.stats;
    return {
        maxSpeed: 500 + (stats.speed * 20),
        acceleration: 15 + (stats.acceleration * 2),
        turnSpeed: 0.03 + (stats.handling * 0.005),
        driftPower: 1.5 + (stats.drift * 0.2)
    };
}