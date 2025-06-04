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
        this.lastBlinkValues = new Map();
        // Mobile detection
        this.isMobile = this.detectMobile();
        
        // PC Configuration (your perfect settings)
        const pcConfig = {
            starCount: 300,
            starSize: { min: 0.5, max: 2.5 },
            starOpacity: { min: 0.1, max: 0.8 },
            twinkleSpeed: 0.2,
            constellationOpacity: 0.25,
            connectionDistance: 75,
            mouseMagnification: 40,
            blinkIntensity: 0,
            blinkSpeed: 1,
            sideWeight: 0.7,
            connectionProbability: 0.25,
            colors: {
                stars: ['#00d4ff', '#6366f1', '#8b5cf6', '#00ff88', '#ffffff'],
                constellations: '#00d4ff'
            }
        };

        // Mobile Configuration (optimized for performance)
        const mobileConfig = {
            starCount: 150, // 50% fewer stars
            starSize: { min: 0.4, max: 2.0 }, // Slightly smaller
            starOpacity: { min: 0.1, max: 0.7 }, // Slightly dimmer
            twinkleSpeed: 0.1, // Slower animations
            constellationOpacity: 0.2, // Dimmer lines
            connectionDistance: 60, // Shorter connections
            mouseMagnification: 30, // Reduced interaction range
            blinkIntensity: 0, // Disable complex blinking
            blinkSpeed: 0, // Disable blinking
            sideWeight: 0.7, // Keep same distribution
            connectionProbability: 0.15, // Fewer connections (60% of PC)
            colors: {
                stars: ['#00d4ff', '#6366f1', '#8b5cf6', '#00ff88', '#ffffff'],
                constellations: '#00d4ff'
            }
        };

        // Use appropriate configuration
        this.config = this.isMobile ? mobileConfig : pcConfig;

        this.init();
    }

    // Mobile detection method
    detectMobile() {
        const userAgent = navigator.userAgent.toLowerCase();
        const mobileKeywords = ['mobile', 'android', 'iphone', 'ipad', 'ipod'];
        const isMobileUA = mobileKeywords.some(keyword => userAgent.includes(keyword));
        const isSmallScreen = window.innerWidth <= 768;
        const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        
        return isMobileUA || (isSmallScreen && isTouchDevice);
    }

    init() {
        console.log(`🌟 Constellation: ${this.isMobile ? 'Mobile' : 'Desktop'} mode detected`);
        console.log(`📊 Config: ${this.config.starCount} stars, ${this.config.connectionProbability} connection probability`);
        
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
                // IMPROVED BLINKING: Better distributed phases to prevent synchronization
                blinkSpeed: this.isMobile ? 0 : (0.3 + this.seededRandom() * 0.6), // Vary speed: 0.3-0.9
                blinkPhase: this.isMobile ? 0 : (this.seededRandom() * Math.PI * 2), // Full range distribution
                blinkAmplitude: this.isMobile ? 0 : (0.4 + this.seededRandom() * 0.4), // Vary amplitude: 0.4-0.8
                blinkOffset: this.seededRandom() * Math.PI * 2
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
                                // IMPROVED CONNECTION BLINKING: More varied timing
                                blinkSpeed: this.isMobile ? 0 : (0.4 + this.seededRandom() * 0.8), // Vary speed: 0.4-1.2
                                blinkPhase: this.isMobile ? 0 : (this.seededRandom() * Math.PI * 2), // Full range
                                blinkAmplitude: this.isMobile ? 0 : (0.3 + this.seededRandom() * 0.5) // Vary amplitude: 0.3-0.8
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
        
        // Re-detect mobile state (useful for device rotation)
        const wasMobile = this.isMobile;
        this.isMobile = this.detectMobile();
        
        // If device type changed, update configuration
        if (wasMobile !== this.isMobile) {
            console.log(`🔄 Device type changed: ${this.isMobile ? 'Mobile' : 'Desktop'} mode`);
            
            // Update config based on new device type
            const pcConfig = {
                starCount: 300,
                connectionDistance: 75,
                connectionProbability: 0.25,
                constellationOpacity: 0.25,
                blinkIntensity: 0,
                blinkSpeed: 1,
                twinkleSpeed: 0.2,
                // ... other PC settings
            };

            const mobileConfig = {
                starCount: 150,
                connectionDistance: 60,
                connectionProbability: 0.15,
                constellationOpacity: 0.2,
                blinkIntensity: 0,
                blinkSpeed: 0,
                twinkleSpeed: 0.1,
                // ... other mobile settings
            };

            // Update only the performance-critical properties
            this.config.starCount = this.isMobile ? mobileConfig.starCount : pcConfig.starCount;
            this.config.connectionDistance = this.isMobile ? mobileConfig.connectionDistance : pcConfig.connectionDistance;
            this.config.connectionProbability = this.isMobile ? mobileConfig.connectionProbability : pcConfig.connectionProbability;
            this.config.constellationOpacity = this.isMobile ? mobileConfig.constellationOpacity : pcConfig.constellationOpacity;
            this.config.twinkleSpeed = this.isMobile ? mobileConfig.twinkleSpeed : pcConfig.twinkleSpeed;
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
        
        // Enhanced mouse/touch tracking based on device
        if (this.isMobile) {
            // Touch events for mobile devices
            document.addEventListener('touchstart', (e) => {
                if (e.touches.length > 0) {
                    this.mouseX = e.touches[0].clientX;
                    this.mouseY = e.touches[0].clientY;
                }
            }, { passive: true });
            
            document.addEventListener('touchmove', (e) => {
                if (e.touches.length > 0) {
                    this.mouseX = e.touches[0].clientX;
                    this.mouseY = e.touches[0].clientY;
                }
            }, { passive: true });
            
            document.addEventListener('touchend', () => {
                // Reset touch position when touch ends
                this.mouseX = 0;
                this.mouseY = 0;
            }, { passive: true });
        } else {
            // Mouse events for desktop
            document.addEventListener('mousemove', (e) => {
                this.mouseX = e.clientX;
                this.mouseY = e.clientY;
            });
        }
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
            
            // Individual star blinking effect (original logic for desktop, simplified for mobile)
            let blinkEffect;
            if (this.isMobile) {
                blinkEffect = 1.0; // No blinking on mobile
            } else {
                // Original desktop blinking logic
                const starBlink = Math.sin(time * star.blinkSpeed + star.blinkPhase) * star.blinkAmplitude;
                blinkEffect = Math.max(0.2, (starBlink + 1.0) * 0.5);
            }
            
            // Regional wave effects (original logic for desktop, simplified for mobile)
            let regionalBonus;
            if (this.isMobile) {
                regionalBonus = 1.0; // No regional effects on mobile
            } else {
                // Original desktop regional logic
                const regionalWave1 = Math.sin(time * 0.007 + star.x * 0.003) * 0.4;
                const regionalWave2 = Math.cos(time * 0.005 + star.y * 0.004) * 0.3;
                regionalBonus = (regionalWave1 + regionalWave2) * 0.6 + 1.0;
            }
            
            // Constellation influence (original logic for desktop, simplified for mobile)
            let constellationBonus = 0;
            if (!this.isMobile) {
                // Original desktop constellation influence logic
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
            }
            
            const baseOpacity = star.opacity * twinkle * blinkEffect * regionalBonus;
            const opacity = baseOpacity + constellationBonus;
            
            // Mouse proximity effect (original for desktop, reduced for mobile)
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
            
            // Shadow effects (original for desktop, disabled for mobile)
            if (!this.isMobile) {
                this.ctx.shadowBlur = enhancedSize * 2 * blinkEffect;
                this.ctx.shadowColor = star.color;
            }
            
            this.ctx.beginPath();
            this.ctx.arc(star.x, star.y, enhancedSize, 0, Math.PI * 2);
            this.ctx.fill();
            
            // Cross-shaped glow for brighter stars (desktop only)
            if (!this.isMobile && enhancedOpacity > 0.6) {
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
            let blinkEffect = 1.0;
            let baseOpacity = 1.0;
            
            if (this.isMobile) {
                // Simple static opacity for mobile (no blinking)
                baseOpacity = 0.8;
                blinkEffect = 1.0;
            } else {
                // SMOOTH DESKTOP BLINKING - Remove Math.abs() for smoother transitions
                const mainBlink = Math.sin(time * constellation.blinkSpeed + constellation.blinkPhase);
                
                // Smooth curve instead of sharp Math.abs() transitions
                blinkEffect = (mainBlink + 1.0) * 0.5; // Maps -1,1 to 0,1 smoothly
                
                // Apply amplitude with smooth curve
                blinkEffect = Math.pow(blinkEffect, 1.5) * constellation.blinkAmplitude; // Slight curve for more organic feel
                const smoothingFactor = 0.1; // Adjust for more/less smoothing
                const constellationId = constellation.stars.join('-');
                const lastBlink = this.lastBlinkValues.get(constellationId) || blinkEffect;
                blinkEffect = lastBlink + (blinkEffect - lastBlink) * smoothingFactor;
                this.lastBlinkValues.set(constellationId, blinkEffect);
                                // Smooth opacity range without sharp cutoffs
                baseOpacity = 0.5 + (blinkEffect * 0.7); // Smoother range: 0.3 to 1.0
            }
            
            const opacity = this.config.constellationOpacity * constellation.brightness * baseOpacity;
            
            this.ctx.save();
            this.ctx.globalAlpha = Math.max(0.05, Math.min(1, opacity)); // Lower minimum for smoother fades
            this.ctx.strokeStyle = this.config.colors.constellations;
            
            // Smooth line width transitions
            if (this.isMobile) {
                this.ctx.lineWidth = 0.4;
            } else {
                // Smoother line width curve
                const smoothWidth = 0.2 + (blinkEffect * 0.6); // More subtle width variation
                this.ctx.lineWidth = smoothWidth;
            }
            
            // Shadow effects (original for desktop, disabled for mobile)
            if (!this.isMobile) {
                this.ctx.shadowBlur = Math.max(0.5, blinkEffect * 4); // Prevent zero shadow blur
                this.ctx.shadowColor = this.config.colors.constellations;
            }
            
            // Draw connections with STAGGERED TIMING to prevent synchronization
            constellation.connections.forEach((connection, connectionIndex) => {
                const fromStar = this.stars[connection.from];
                const toStar = this.stars[connection.to];
                
                if (fromStar && toStar) {
                    if (this.isMobile) {
                        // Simple static rendering for mobile
                        this.ctx.globalAlpha = opacity;
                    } else {
                        // SMOOTH CONNECTION BLINKING with staggered timing
                        const timeOffset = connectionIndex * 0.5; // Stagger connections to avoid sync
                        const connectionBlink = Math.sin(time * connection.blinkSpeed + connection.blinkPhase + timeOffset);
                        
                        // Smooth connection effect (no Math.abs!)
                        const connectionEffect = (connectionBlink + 1.0) * 0.5; // Smooth 0-1 range
                        const smoothConnectionEffect = Math.pow(connectionEffect, 1.2) * connection.blinkAmplitude;
                        
                        // Combine effects smoothly
                        const combinedEffect = (blinkEffect * 0.6) + (smoothConnectionEffect * 0.4);
                        const finalOpacity = Math.max(0.05, combinedEffect * 0.8); // Smoother minimum
                        
                        this.ctx.globalAlpha = finalOpacity;
                        
                        // Smooth line width for this connection
                        const connectionWidth = 0.2 + (smoothConnectionEffect * 0.5);
                        this.ctx.lineWidth = connectionWidth;
                        
                        if (!this.isMobile) {
                            this.ctx.shadowBlur = Math.max(0.3, smoothConnectionEffect * 3);
                        }
                    }
                    
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
