/**
 * Track Manager for Retro Racing Games
 * Easy track creation, loading, and modification
 * Supports multiple track formats and procedural generation
 */

export class TrackManager {
    constructor() {
        this.tracks = new Map();
        this.currentTrack = null;
        this.segments = [];
        this.trackLength = 0;
        this.segmentLength = 200;
        this.roadWidth = 2000;
        
        // Track themes
        this.themes = {
            desert: {
                sky: ['#FF6B6B', '#FFE66D', '#87CEEB'],
                grass: ['#8FBC8F', '#90EE90', '#32CD32'],
                road: ['#696969', '#808080', '#A9A9A9'],
                objects: ['cactus', 'rock', 'tumbleweed', 'billboard']
            },
            forest: {
                sky: ['#87CEEB', '#98D8E8', '#B0E0E6'],
                grass: ['#228B22', '#32CD32', '#90EE90'],
                road: ['#696969', '#808080', '#A9A9A9'],
                objects: ['tree', 'bush', 'log', 'sign']
            },
            city: {
                sky: ['#4A5C6A', '#5F7A8A', '#87CEEB'],
                grass: ['#556B2F', '#6B8E23', '#9ACD32'],
                road: ['#696969', '#808080', '#A9A9A9'],
                objects: ['building', 'lamp', 'bench', 'fountain']
            },
            snow: {
                sky: ['#F0F8FF', '#E6E6FA', '#B0C4DE'],
                grass: ['#F5F5F5', '#F0F0F0', '#E0E0E0'],
                road: ['#696969', '#808080', '#A9A9A9'],
                objects: ['snowman', 'tree', 'rock', 'sign']
            },
            space: {
                sky: ['#000033', '#000066', '#000099'],
                grass: ['#003300', '#006600', '#009900'],
                road: ['#333333', '#444444', '#555555'],
                objects: ['asteroid', 'satellite', 'nebula', 'planet']
            }
        };
        
        // Predefined track layouts
        this.trackTemplates = {
            oval: this.createOvalTrack.bind(this),
            figure8: this.createFigure8Track.bind(this),
            circuit: this.createCircuitTrack.bind(this),
            drag: this.createDragTrack.bind(this),
            rally: this.createRallyTrack.bind(this)
        };
    }
    
    async init() {
        console.log('🏁 Initializing track manager...');
        
        // Create default tracks
        this.createDefaultTracks();
        
        console.log('✅ Track manager initialized');
    }
    
    /**
     * Create default tracks
     */
    createDefaultTracks() {
        // Create some example tracks
        this.createTrack('oval', {
            name: 'Speedway Oval',
            type: 'oval',
            theme: 'desert',
            length: 100,
            difficulty: 'easy'
        });
        
        this.createTrack('circuit', {
            name: 'Forest Circuit',
            type: 'circuit',
            theme: 'forest',
            length: 150,
            difficulty: 'medium'
        });
        
        this.createTrack('rally', {
            name: 'Mountain Rally',
            type: 'rally',
            theme: 'snow',
            length: 200,
            difficulty: 'hard'
        });
    }
    
    /**
     * Create a new track
     */
    createTrack(id, config) {
        console.log(`Creating track: ${config.name}`);
        
        const track = {
            id,
            name: config.name,
            type: config.type || 'custom',
            theme: config.theme || 'desert',
            length: config.length || 100,
            difficulty: config.difficulty || 'medium',
            segments: [],
            checkpoints: [],
            startLine: 0,
            finishLine: 0
        };
        
        // Generate track segments based on type
        if (this.trackTemplates[config.type]) {
            track.segments = this.trackTemplates[config.type](config);
        } else {
            track.segments = this.generateCustomTrack(config);
        }
        
        // Add track to collection
        this.tracks.set(id, track);
        
        return track;
    }
    
    /**
     * Load a track from data
     */
    async loadTrack(trackData) {
        if (typeof trackData === 'string') {
            // Load from file or URL
            const response = await fetch(trackData);
            trackData = await response.json();
        }
        
        const track = {
            id: trackData.id,
            name: trackData.name,
            type: trackData.type || 'custom',
            theme: trackData.theme || 'desert',
            length: trackData.segments?.length || 100,
            difficulty: trackData.difficulty || 'medium',
            segments: trackData.segments || [],
            checkpoints: trackData.checkpoints || [],
            startLine: trackData.startLine || 0,
            finishLine: trackData.finishLine || 0
        };
        
        this.tracks.set(track.id, track);
        return track;
    }
    
    /**
     * Set current track
     */
    setCurrentTrack(trackId) {
        const track = this.tracks.get(trackId);
        if (!track) {
            throw new Error(`Track '${trackId}' not found`);
        }
        
        this.currentTrack = track;
        this.segments = track.segments;
        this.trackLength = track.segments.length;
        
        console.log(`Current track set to: ${track.name}`);
        return track;
    }
    
    /**
     * Get current track
     */
    getCurrentTrack() {
        return this.currentTrack;
    }
    
    /**
     * Get track length
     */
    getTrackLength() {
        return this.trackLength;
    }
    
    /**
     * Get segment at position
     */
    getSegment(position) {
        const index = Math.floor(position / this.segmentLength) % this.trackLength;
        return this.segments[index] || this.segments[0];
    }
    
    /**
     * Get segment by index
     */
    getSegmentByIndex(index) {
        return this.segments[index % this.trackLength];
    }
    
    /**
     * Create oval track
     */
    createOvalTrack(config) {
        const segments = [];
        const length = config.length || 100;
        
        for (let i = 0; i < length; i++) {
            const segment = {
                index: i,
                curve: 0,
                y: 0,
                color: '#404040',
                sideColor: '#ff0000',
                objects: [],
                isFinishLine: i === 0,
                checkpoint: i === Math.floor(length / 2)
            };
            
            // Create oval shape
            if (i < length * 0.25) {
                // First straight
                segment.curve = 0;
            } else if (i < length * 0.5) {
                // First turn
                segment.curve = 2;
            } else if (i < length * 0.75) {
                // Second straight
                segment.curve = 0;
            } else {
                // Second turn
                segment.curve = -2;
            }
            
            // Add some elevation changes
            segment.y = Math.sin(i * 0.1) * 50;
            
            // Add roadside objects
            if (i % 10 === 0) {
                segment.objects = this.generateRoadsideObjects(config.theme, i);
            }
            
            segments.push(segment);
        }
        
        return segments;
    }
    
    /**
     * Create figure-8 track
     */
    createFigure8Track(config) {
        const segments = [];
        const length = config.length || 120;
        
        for (let i = 0; i < length; i++) {
            const segment = {
                index: i,
                curve: 0,
                y: 0,
                color: '#404040',
                sideColor: '#ff0000',
                objects: [],
                isFinishLine: i === 0,
                checkpoint: i === Math.floor(length / 2)
            };
            
            // Create figure-8 pattern
            const t = (i / length) * Math.PI * 2;
            segment.curve = Math.sin(t * 2) * 3;
            
            // Add elevation
            segment.y = Math.sin(t * 4) * 100;
            
            // Add roadside objects
            if (i % 8 === 0) {
                segment.objects = this.generateRoadsideObjects(config.theme, i);
            }
            
            segments.push(segment);
        }
        
        return segments;
    }
    
    /**
     * Create circuit track
     */
    createCircuitTrack(config) {
        const segments = [];
        const length = config.length || 150;
        
        for (let i = 0; i < length; i++) {
            const segment = {
                index: i,
                curve: 0,
                y: 0,
                color: '#404040',
                sideColor: '#ff0000',
                objects: [],
                isFinishLine: i === 0,
                checkpoint: i === Math.floor(length / 2)
            };
            
            // Create varied circuit
            if (i < length * 0.2) {
                // Start straight
                segment.curve = 0;
            } else if (i < length * 0.4) {
                // First chicane
                segment.curve = Math.sin(i * 0.3) * 2;
            } else if (i < length * 0.6) {
                // Long straight
                segment.curve = 0;
            } else if (i < length * 0.8) {
                // Hairpin turn
                segment.curve = 4;
            } else {
                // Final section
                segment.curve = Math.sin(i * 0.2) * 1.5;
            }
            
            // Add elevation changes
            segment.y = Math.sin(i * 0.05) * 200 + Math.cos(i * 0.08) * 100;
            
            // Add roadside objects
            if (i % 12 === 0) {
                segment.objects = this.generateRoadsideObjects(config.theme, i);
            }
            
            segments.push(segment);
        }
        
        return segments;
    }
    
    /**
     * Create drag track
     */
    createDragTrack(config) {
        const segments = [];
        const length = config.length || 50;
        
        for (let i = 0; i < length; i++) {
            const segment = {
                index: i,
                curve: 0,
                y: 0,
                color: '#404040',
                sideColor: '#ff0000',
                objects: [],
                isFinishLine: i === 0,
                checkpoint: i === length - 1
            };
            
            // Straight line with slight curves
            segment.curve = Math.sin(i * 0.1) * 0.5;
            
            // Add roadside objects
            if (i % 5 === 0) {
                segment.objects = this.generateRoadsideObjects(config.theme, i);
            }
            
            segments.push(segment);
        }
        
        return segments;
    }
    
    /**
     * Create rally track
     */
    createRallyTrack(config) {
        const segments = [];
        const length = config.length || 200;
        
        for (let i = 0; i < length; i++) {
            const segment = {
                index: i,
                curve: 0,
                y: 0,
                color: '#404040',
                sideColor: '#ff0000',
                objects: [],
                isFinishLine: i === 0,
                checkpoint: i % 50 === 0
            };
            
            // Create rally-style track with sharp turns
            const t = (i / length) * Math.PI * 4;
            segment.curve = Math.sin(t) * 4 + Math.cos(t * 2) * 2;
            
            // Add dramatic elevation changes
            segment.y = Math.sin(i * 0.03) * 300 + Math.cos(i * 0.07) * 150;
            
            // Add roadside objects
            if (i % 15 === 0) {
                segment.objects = this.generateRoadsideObjects(config.theme, i);
            }
            
            segments.push(segment);
        }
        
        return segments;
    }
    
    /**
     * Generate custom track
     */
    generateCustomTrack(config) {
        const segments = [];
        const length = config.length || 100;
        
        for (let i = 0; i < length; i++) {
            const segment = {
                index: i,
                curve: 0,
                y: 0,
                color: '#404040',
                sideColor: '#ff0000',
                objects: [],
                isFinishLine: i === 0,
                checkpoint: i % 25 === 0
            };
            
            // Generate random curve pattern
            segment.curve = Math.sin(i * 0.1) * 2 + Math.cos(i * 0.05) * 1.5;
            
            // Generate elevation
            segment.y = Math.sin(i * 0.04) * 150 + Math.cos(i * 0.06) * 80;
            
            // Add roadside objects
            if (i % 10 === 0) {
                segment.objects = this.generateRoadsideObjects(config.theme, i);
            }
            
            segments.push(segment);
        }
        
        return segments;
    }
    
    /**
     * Generate roadside objects based on theme
     */
    generateRoadsideObjects(theme, segmentIndex) {
        const themeData = this.themes[theme] || this.themes.desert;
        const objects = [];
        
        // Add left side object
        if (Math.random() < 0.3) {
            const leftObj = themeData.objects[Math.floor(Math.random() * themeData.objects.length)];
            objects.push({
                type: leftObj,
                x: -this.roadWidth * 0.8,
                y: 0,
                width: 50 + Math.random() * 50,
                height: 100 + Math.random() * 100,
                sprite: leftObj
            });
        }
        
        // Add right side object
        if (Math.random() < 0.3) {
            const rightObj = themeData.objects[Math.floor(Math.random() * themeData.objects.length)];
            objects.push({
                type: rightObj,
                x: this.roadWidth * 0.8,
                y: 0,
                width: 50 + Math.random() * 50,
                height: 100 + Math.random() * 100,
                sprite: rightObj
            });
        }
        
        return objects;
    }
    
    /**
     * Export track to JSON
     */
    exportTrack(trackId) {
        const track = this.tracks.get(trackId);
        if (!track) {
            throw new Error(`Track '${trackId}' not found`);
        }
        
        return JSON.stringify(track, null, 2);
    }
    
    /**
     * Import track from JSON
     */
    importTrack(trackJson) {
        const trackData = JSON.parse(trackJson);
        return this.loadTrack(trackData);
    }
    
    /**
     * Get all available tracks
     */
    getTracks() {
        return Array.from(this.tracks.values());
    }
    
    /**
     * Get track by ID
     */
    getTrack(trackId) {
        return this.tracks.get(trackId);
    }
    
    /**
     * Delete track
     */
    deleteTrack(trackId) {
        if (this.currentTrack && this.currentTrack.id === trackId) {
            this.currentTrack = null;
            this.segments = [];
            this.trackLength = 0;
        }
        
        return this.tracks.delete(trackId);
    }
    
    /**
     * Clone track
     */
    cloneTrack(trackId, newId) {
        const track = this.tracks.get(trackId);
        if (!track) {
            throw new Error(`Track '${trackId}' not found`);
        }
        
        const clonedTrack = {
            ...track,
            id: newId,
            name: `${track.name} (Copy)`,
            segments: track.segments.map(segment => ({ ...segment }))
        };
        
        this.tracks.set(newId, clonedTrack);
        return clonedTrack;
    }
    
    /**
     * Modify track segment
     */
    modifySegment(trackId, segmentIndex, modifications) {
        const track = this.tracks.get(trackId);
        if (!track) {
            throw new Error(`Track '${trackId}' not found`);
        }
        
        const segment = track.segments[segmentIndex];
        if (!segment) {
            throw new Error(`Segment ${segmentIndex} not found`);
        }
        
        Object.assign(segment, modifications);
        
        // Update current track if it's the modified one
        if (this.currentTrack && this.currentTrack.id === trackId) {
            this.segments = track.segments;
        }
        
        return segment;
    }
    
    /**
     * Add checkpoint to track
     */
    addCheckpoint(trackId, segmentIndex) {
        const track = this.tracks.get(trackId);
        if (!track) {
            throw new Error(`Track '${trackId}' not found`);
        }
        
        if (!track.checkpoints.includes(segmentIndex)) {
            track.checkpoints.push(segmentIndex);
            track.checkpoints.sort((a, b) => a - b);
        }
        
        return track.checkpoints;
    }
    
    /**
     * Remove checkpoint from track
     */
    removeCheckpoint(trackId, segmentIndex) {
        const track = this.tracks.get(trackId);
        if (!track) {
            throw new Error(`Track '${trackId}' not found`);
        }
        
        const index = track.checkpoints.indexOf(segmentIndex);
        if (index > -1) {
            track.checkpoints.splice(index, 1);
        }
        
        return track.checkpoints;
    }
}