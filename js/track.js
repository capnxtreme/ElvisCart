// Track generation and management
import { SEGMENT_LENGTH, TRACK_LENGTH, TRACK_WIDTH, ROADSIDE_OBJECTS } from './constants.js';

export const segments = [];

export function initTrack() {
    console.log('Initializing track with', TRACK_LENGTH, 'segments');
    segments.length = 0; // Clear existing
    
    for (let i = 0; i < TRACK_LENGTH; i++) {
        const segment = {
            index: i,
            curve: 0,
            y: 0,
            color: i % 2 === 0 ? '#404040' : '#383838',
            sideColor: i % 2 === 0 ? '#ff0000' : '#ffffff',
            roadside: [],
            isFinishLine: i === 0,  // First segment is start/finish
            checkpoint: i === Math.floor(TRACK_LENGTH / 2)  // Checkpoint at halfway
        };
        
        // Create varied track sections
        if (i > 20 && i < 40) {
            // S-curve section
            segment.curve = Math.sin(i * 0.1) * 5;
        } else if (i > 60 && i < 80) {
            // Sharp right turn
            segment.curve = 4;
        } else if (i > 100 && i < 120) {
            // Sharp left turn
            segment.curve = -4;
        } else if (i > 140 && i < 180) {
            // Winding section
            segment.curve = Math.sin(i * 0.08) * 3 + Math.cos(i * 0.05) * 2;
        }
        
        // Hills
        segment.y = Math.sin(i * 0.04) * 150 + Math.cos(i * 0.07) * 80;
        
        // Add roadside objects
        if (i % 10 === 0) {
            // Left side object
            const leftObj = ['palmTree', 'cactus', 'billboard'][Math.floor(Math.random() * 3)];
            segment.roadside.push({
                type: leftObj,
                x: -TRACK_WIDTH * 0.8,
                sprite: ROADSIDE_OBJECTS[leftObj]
            });
            
            // Right side object
            const rightObj = ['palmTree', 'diner', 'gasStation'][Math.floor(Math.random() * 3)];
            segment.roadside.push({
                type: rightObj,
                x: TRACK_WIDTH * 0.8,
                sprite: ROADSIDE_OBJECTS[rightObj]
            });
        }
        
        segments.push(segment);
    }
    console.log('Track initialized with', segments.length, 'segments');
}

export function getSegment(position) {
    const index = Math.floor(position / SEGMENT_LENGTH) % TRACK_LENGTH;
    return segments[index] || segments[0];
}