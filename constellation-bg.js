/**
 * Constellation Background - Animated Starfield
 * Creates a subtle animated starfield with twinkling stars and breathing constellations
 */

class ConstellationBackground {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.stars = [];
        this.constellations = [];
        this.animationId = null;
        this.mouseX = 0;
        this.mouseY = 0;
        this.seededRandom = this.createSeededRandom(42); // Fixed seed for consistent positioning
        this.lastCanvasWidth = 0;
        this.lastCanvasHeight = 0;
        this.resizeTimeout = null;
        
        // Configuration
        this.config = {
            starCount: 300, // Increased for more scattered effect
            starSize: { min: 0.5, max: 2.5 },
            starOpacity: { min: 0.1, max: 0.8 },
            twinkleSpeed: 0.2,
            constellationOpacity: 0.25, // Increased for brighter lines
            connectionDistance: 75, // Reduced to have fewer connections
            mouseMagnification: 40,
            blinkIntensity: 0, // Dramatically increased for obvious blinking
            blinkSpeed: 1, // Much faster blinking for obvious effect
            sideWeight: 0.7, // How much to bias towards left/right sides
            connectionProbability: 0.25, // New: Reduced from 60% to 30% for fewer lines
            colors: {
                stars: ['#00d4ff', '#6366f1', '#8b5cf6', '#00ff88', '#ffffff'],
                constellations: '#00d4ff'
            }
        };

        this.init();
    }

    init() {
        this.createCanvas();
        this.generateStars();
        this.generateConstellations();
        this.bindEvents();
        this.animate();
    }

    // Seeded random number generator for consistent positioning
    createSeededRandom(seed) {
        return function() {
            seed = (seed * 9301 + 49297) % 233280;
            return seed / 233280;
        };
    }

    createCanvas() {
        const container = document.querySelector('.synaptic-background');
        if (!container) {
            console.warn('Constellation background container not found');
            return;
        }

        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.canvas.style.position = 'absolute';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.style.pointerEvents = 'none';
        this.canvas.style.zIndex = '1';

        container.appendChild(this.canvas);
        
        // Set initial canvas size tracking
        this.lastCanvasWidth = window.innerWidth;
        this.lastCanvasHeight = window.innerHeight;
        
        this.resize();
    }

    generateStars() {
        this.stars = [];
        for (let i = 0; i < this.config.starCount; i++) {
            // Bias X position towards left and right sides
            let x;
            const sideRoll = this.seededRandom();
            if (sideRoll < this.config.sideWeight) {
                // Place on sides (left 30% or right 30% of screen)
                if (this.seededRandom() < 0.5) {
                    // Left side (0% to 30% of width)
                    x = this.seededRandom() * (window.innerWidth * 0.3);
                } else {
                    // Right side (70% to 100% of width)
                    x = window.innerWidth * 0.7 + this.seededRandom() * (window.innerWidth * 0.3);
                }
            } else {
                // Scatter some in the middle for natural look
                x = this.seededRandom() * window.innerWidth;
            }

            this.stars.push({
                x: x,
                y: this.seededRandom() * window.innerHeight,
                size: this.seededRandom() * (this.config.starSize.max - this.config.starSize.min) + this.config.starSize.min,
                opacity: this.seededRandom() * (this.config.starOpacity.max - this.config.starOpacity.min) + this.config.starOpacity.min,
                twinkleSpeed: this.seededRandom() * this.config.twinkleSpeed + 0.005,
                twinklePhase: this.seededRandom() * Math.PI * 2,
                color: this.config.colors.stars[Math.floor(this.seededRandom() * this.config.colors.stars.length)],
                pulseOffset: this.seededRandom() * Math.PI * 2,
                // New: Individual blink properties for more varied blinking
                blinkSpeed: this.seededRandom() * this.config.blinkSpeed + 0.005,
                blinkPhase: this.seededRandom() * Math.PI * 2,
                blinkAmplitude: this.seededRandom() * this.config.blinkIntensity + 0.2
            });
        }
    }

    generateConstellations() {
        this.constellations = [];
        
        // Create constellation patterns by grouping nearby stars
        const processed = new Set();
        
        for (let i = 0; i < this.stars.length; i++) {
            if (processed.has(i)) continue;
            
            const constellation = {
                stars: [i],
                connections: [],
                brightness: this.seededRandom() * 0.8 + 0.4,
                pulseSpeed: this.seededRandom() * 0.02 + 0.004,
                pulsePhase: this.seededRandom() * Math.PI * 2,
                pulseAmplitude: this.seededRandom() * 0.7 + 0.5,
                // New: Enhanced blinking properties - much more dramatic
                blinkSpeed: 0.7, // Much faster and more varied
                blinkPhase: (this.seededRandom() * Math.PI) + 4.3,
                blinkAmplitude: 0.8, // Much more dramatic blinking
                blinkOffset: this.seededRandom() * Math.PI * 2 // Unique phase offset for each constellation
                // blinkSpeed: 0, // Much faster and more varied
                // blinkPhase: 0,
                // blinkAmplitude: 0, // Much more dramatic blinking
                // blinkOffset: 0 // Unique phase offset for each constellation
            };

            // Find nearby stars to form constellation - made more scattered
            for (let j = i + 1; j < this.stars.length; j++) {
                if (processed.has(j)) continue;
                
                const distance = this.getDistance(this.stars[i], this.stars[j]);
                
                // More lenient distance check for scattered constellations
                if (distance < this.config.connectionDistance && constellation.stars.length < 5) {
                    constellation.stars.push(j);
                    processed.add(j);
                    
                    // Create connections between stars in this constellation - reduced connection probability
                    for (let k = 0; k < constellation.stars.length - 1; k++) {
                        if (this.seededRandom() < this.config.connectionProbability) { // Reduced to 30% for fewer lines
                            constellation.connections.push({
                                from: constellation.stars[k],
                                to: constellation.stars[constellation.stars.length - 1],
                                // New: Individual connection blinking properties - much more dramatic
                                // blinkSpeed: this.seededRandom() * 1.5 + 2,
                                // blinkPhase: this.seededRandom() * Math.PI * 2,
                                // blinkAmplitude: this.seededRandom() * 1.2 + 0.5
                                blinkSpeed: 0.9, // Smaller = slower. Try between 0.001 and 0.005
                                blinkPhase: (this.seededRandom() * Math.PI) + 4.3 , // Still good to randomize so stars don’t sync
                                blinkAmplitude: 0.8 // Lower amplitude = more subtle. Try between 0.2 and 0.4

                            });
                        }
                    }
                }
            }

            // Only add constellations with multiple stars
            if (constellation.stars.length > 1) {
                this.constellations.push(constellation);
                constellation.stars.forEach(starIndex => processed.add(starIndex));
            }
        }
    }

    getDistance(star1, star2) {
        const dx = star1.x - star2.x;
        const dy = star1.y - star2.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    resize() {
        if (!this.canvas) return;
        
        const newWidth = window.innerWidth;
        const newHeight = window.innerHeight;
        
        // Only resize if there's a significant change (prevents mobile scroll regeneration)
        const widthChange = Math.abs(newWidth - this.lastCanvasWidth);
        const heightChange = Math.abs(newHeight - this.lastCanvasHeight);
        
        if (widthChange < 50 && heightChange < 50) {
            // Just update canvas dimensions without regenerating stars
            this.canvas.width = newWidth;
            this.canvas.height = newHeight;
            return;
        }
        
        this.lastCanvasWidth = newWidth;
        this.lastCanvasHeight = newHeight;
        
        this.canvas.width = newWidth;
        this.canvas.height = newHeight;
        
        // Reset seeded random to maintain consistent positioning
        this.seededRandom = this.createSeededRandom(42);
        
        // Regenerate stars with consistent positioning only on significant resize
        this.generateStars();
        this.generateConstellations();
    }

    bindEvents() {
        // Debounced resize to prevent mobile scroll issues
        window.addEventListener('resize', () => {
            if (this.resizeTimeout) {
                clearTimeout(this.resizeTimeout);
            }
            this.resizeTimeout = setTimeout(() => {
                this.resize();
            }, 100); // 100ms debounce
        });
        
        // Track mouse movement for subtle interactive effect
        document.addEventListener('mousemove', (e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
        });
    }

    animate() {
        if (!this.ctx || !this.canvas) return;
        
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        const time = Date.now() * 0.001;
        
        // Draw constellation connections first (behind stars)
        this.drawConstellations(time);
        
        // Draw stars
        this.drawStars(time);
        
        this.animationId = requestAnimationFrame(() => this.animate());
    }

    drawStars(time) {
        this.stars.forEach((star, index) => {
            // Calculate twinkling effect
            const twinkle = Math.sin(time * star.twinkleSpeed + star.twinklePhase) * 0.3 + 0.7;
            
            // Individual star blinking effect
            const starBlink = Math.sin(time * star.blinkSpeed + star.blinkPhase) * star.blinkAmplitude;
            const blinkEffect = Math.max(0.2, (starBlink + 1.0) * 0.5);
            
            // Add regional wave effects for stars too
            const regionalWave1 = Math.sin(time * 0.007 + star.x * 0.003) * 0.4;
            const regionalWave2 = Math.cos(time * 0.005 + star.y * 0.004) * 0.3;
            const regionalBonus = (regionalWave1 + regionalWave2) * 0.6 + 1.0;
            
            // Add constellation influence for stars that are part of constellations
            let constellationBonus = 0;
            this.constellations.forEach(constellation => {
                if (constellation.stars.includes(index)) {
                    const centerX = constellation.stars.reduce((sum, starIndex) => sum + this.stars[starIndex].x, 0) / constellation.stars.length;
                    const centerY = constellation.stars.reduce((sum, starIndex) => sum + this.stars[starIndex].y, 0) / constellation.stars.length;
                    const spatialWave = Math.sin(time * 0.008 + centerX * 0.004) * 0.4;
                    const constellationPulse = Math.sin(time * constellation.pulseSpeed + constellation.pulsePhase) * 0.5 + 0.7;
                    const constellationBlink = Math.sin(time * constellation.blinkSpeed + constellation.blinkPhase) * constellation.blinkAmplitude;
                    constellationBonus = Math.max(constellationBonus, ((constellationPulse + constellationBlink) * 0.5 + spatialWave) * 0.6);
                }
            });
            
            const baseOpacity = star.opacity * twinkle * blinkEffect * regionalBonus;
            const opacity = baseOpacity + constellationBonus;
            
            // Mouse proximity effect (very subtle)
            const mouseDistance = Math.sqrt(
                Math.pow(star.x - this.mouseX, 2) + Math.pow(star.y - this.mouseY, 2)
            );
            const mouseEffect = Math.max(0, 1 - mouseDistance / this.config.mouseMagnification);
            const enhancedOpacity = Math.min(1, opacity + mouseEffect * 0.3);
            const enhancedSize = star.size + mouseEffect * 0.5 + (constellationBonus * 0.8) + (regionalBonus * 0.3) + (blinkEffect * 0.4);
            
            // Draw star
            this.ctx.save();
            this.ctx.globalAlpha = Math.min(1, enhancedOpacity);
            this.ctx.fillStyle = star.color;
            this.ctx.shadowBlur = enhancedSize * 2 * blinkEffect;
            this.ctx.shadowColor = star.color;
            
            this.ctx.beginPath();
            this.ctx.arc(star.x, star.y, enhancedSize, 0, Math.PI * 2);
            this.ctx.fill();
            
            // Add subtle cross-shaped glow for brighter stars
            if (enhancedOpacity > 0.6) {
                this.ctx.globalAlpha = enhancedOpacity * 0.3 * blinkEffect;
                this.ctx.strokeStyle = star.color;
                this.ctx.lineWidth = 0.5;
                this.ctx.beginPath();
                this.ctx.moveTo(star.x - enhancedSize * 2, star.y);
                this.ctx.lineTo(star.x + enhancedSize * 2, star.y);
                this.ctx.moveTo(star.x, star.y - enhancedSize * 2);
                this.ctx.lineTo(star.x, star.y + enhancedSize * 2);
                this.ctx.stroke();
            }
            
            this.ctx.restore();
        });
    }

    drawConstellations(time) {
        this.constellations.forEach(constellation => {
            // DRAMATIC BLINKING EFFECT - much more obvious
            const mainBlink = Math.sin(time * constellation.blinkSpeed + constellation.blinkPhase);
            const blinkEffect = Math.abs(mainBlink) * constellation.blinkAmplitude; // Use abs for more dramatic on/off effect
            
            // Base opacity that varies dramatically from 0.2 to 1.0 (brighter minimum)
            const baseOpacity = 0.2 + (blinkEffect * 0.8);
            const opacity = this.config.constellationOpacity * constellation.brightness * baseOpacity;
            
            this.ctx.save();
            this.ctx.globalAlpha = Math.max(0.1, Math.min(1, opacity));
            this.ctx.strokeStyle = this.config.colors.constellations;
            
            // Thinner line width that varies less dramatically
            this.ctx.lineWidth = 0.3 + (blinkEffect * 0.8); // Much thinner range (0.3 to 1.1)
            this.ctx.shadowBlur = blinkEffect * 6; // Reduced glow for cleaner look
            this.ctx.shadowColor = this.config.colors.constellations;
            
            // Draw connections with individual dramatic blinking
            constellation.connections.forEach(connection => {
                const fromStar = this.stars[connection.from];
                const toStar = this.stars[connection.to];
                
                if (fromStar && toStar) {
                    // Individual connection blinking - very dramatic
                    const connectionBlink = Math.sin(time * connection.blinkSpeed + connection.blinkPhase);
                    const connectionEffect = Math.abs(connectionBlink) * connection.blinkAmplitude;
                    
                    // Combined effect creates very obvious but cleaner blinking
                    const finalOpacity = Math.max(0.1, (blinkEffect + connectionEffect) * 0.6); // Brighter overall
                    
                    // Set opacity for this specific line
                    this.ctx.globalAlpha = finalOpacity;
                    this.ctx.lineWidth = 0.3 + (connectionEffect * 0.7); // Thinner lines
                    this.ctx.shadowBlur = connectionEffect * 4; // Reduced glow
                    
                    this.ctx.beginPath();
                    this.ctx.moveTo(fromStar.x, fromStar.y);
                    this.ctx.lineTo(toStar.x, toStar.y);
                    this.ctx.stroke();
                }
            });
            
            this.ctx.restore();
        });
    }

    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        if (this.resizeTimeout) {
            clearTimeout(this.resizeTimeout);
        }
        if (this.canvas) {
            this.canvas.remove();
        }
    }
}

// Initialize constellation background when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Small delay to ensure all styles are loaded
    setTimeout(() => {
        try {
            window.constellation = new ConstellationBackground();
            console.log('✨ Constellation background initialized successfully!');
        } catch (error) {
            console.error('❌ Error initializing constellation background:', error);
        }
    }, 100);
});

// Handle page navigation for SPAs
window.addEventListener('beforeunload', () => {
    if (window.constellation) {
        window.constellation.destroy();
    }
});
