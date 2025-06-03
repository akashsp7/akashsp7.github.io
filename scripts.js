/**
 * NEURAL PORTFOLIO JAVASCRIPT FRAMEWORK
 * Advanced AI Portfolio with Neural Network Visualizations
 */

// ===========================
// GLOBAL VARIABLES & CONFIG
// ===========================

const config = {
    neural: {
        nodeCount: 50,
        connectionDistance: 150,
        particleCount: 30,
        animationSpeed: 0.5,
        mouseInfluence: 100
    },
    animations: {
        typingSpeed: 100,
        scrollOffset: 0.1,
        transitionDuration: 300
    },
    colors: {
        primary: '#00d4ff',
        secondary: '#6366f1',
        tertiary: '#8b5cf6',
        accent: '#00ff88'
    }
};

let neuralCanvas, neuralCtx;
let particles = [];
let neuralNodes = [];
let mouse = { x: 0, y: 0 };
let isInit = false;
let isNavigating = false; // Flag to prevent scroll interference during navigation
let scrollTimeout = null; // For detecting when scrolling stops

// ===========================
// INITIALIZATION
// ===========================

document.addEventListener('DOMContentLoaded', function() {
    initializePortfolio();
});

function initializePortfolio() {
    if (isInit) return;
    isInit = true;
    
    console.log('🧠 Initializing Neural Portfolio...');
    
    // Initialize all systems
    initializeNeuralBackground();
    initializeParticleSystem();
    initializeNavigation();
    initializeScrollAnimations();
    initializeTypingEffect();
    initializeHeroNeuralNetwork();
    initializeHorizontalNeuralNetwork();
    initializeInteractiveElements();
    initializeMouseTracking();
    
    console.log('✅ Neural Portfolio Initialized Successfully!');
}

// ===========================
// NEURAL BACKGROUND SYSTEM
// ===========================

function initializeNeuralBackground() {
    neuralCanvas = document.getElementById('neural-bg');
    if (!neuralCanvas) return;
    
    neuralCtx = neuralCanvas.getContext('2d');
    
    // Set canvas size
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Create neural nodes
    createNeuralNodes();
    
    // Start animation
    animateNeuralBackground();
}

function resizeCanvas() {
    neuralCanvas.width = window.innerWidth;
    neuralCanvas.height = window.innerHeight;
}

function createNeuralNodes() {
    neuralNodes = [];
    for (let i = 0; i < config.neural.nodeCount; i++) {
        neuralNodes.push({
            x: Math.random() * neuralCanvas.width,
            y: Math.random() * neuralCanvas.height,
            vx: (Math.random() - 0.5) * config.neural.animationSpeed,
            vy: (Math.random() - 0.5) * config.neural.animationSpeed,
            radius: Math.random() * 3 + 1,
            opacity: Math.random() * 0.5 + 0.3
        });
    }
}

function animateNeuralBackground() {
    if (!neuralCtx) return;
    
    // Clear canvas
    neuralCtx.clearRect(0, 0, neuralCanvas.width, neuralCanvas.height);
    
    // Update and draw nodes
    neuralNodes.forEach((node, index) => {
        // Update position
        node.x += node.vx;
        node.y += node.vy;
        
        // Bounce off edges
        if (node.x < 0 || node.x > neuralCanvas.width) node.vx *= -1;
        if (node.y < 0 || node.y > neuralCanvas.height) node.vy *= -1;
        
        // Mouse interaction
        const dx = mouse.x - node.x;
        const dy = mouse.y - node.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < config.neural.mouseInfluence) {
            const force = (config.neural.mouseInfluence - distance) / config.neural.mouseInfluence;
            node.x += dx * force * 0.01;
            node.y += dy * force * 0.01;
        }
        
        // Draw node
        neuralCtx.beginPath();
        neuralCtx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        neuralCtx.fillStyle = `rgba(0, 212, 255, ${node.opacity})`;
        neuralCtx.fill();
        
        // Draw connections
        neuralNodes.slice(index + 1).forEach(otherNode => {
            const dx = node.x - otherNode.x;
            const dy = node.y - otherNode.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < config.neural.connectionDistance) {
                const opacity = (config.neural.connectionDistance - distance) / config.neural.connectionDistance * 0.2;
                
                neuralCtx.beginPath();
                neuralCtx.moveTo(node.x, node.y);
                neuralCtx.lineTo(otherNode.x, otherNode.y);
                neuralCtx.strokeStyle = `rgba(0, 212, 255, ${opacity})`;
                neuralCtx.lineWidth = 1;
                neuralCtx.stroke();
            }
        });
    });
    
    requestAnimationFrame(animateNeuralBackground);
}

// ===========================
// PARTICLE SYSTEM
// ===========================

function initializeParticleSystem() {
    const container = document.getElementById('particles-container');
    if (!container) return;
    
    // Create particles
    for (let i = 0; i < config.neural.particleCount; i++) {
        createParticle(container);
    }
}

function createParticle(container) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    
    // Random initial position
    particle.style.left = Math.random() * window.innerWidth + 'px';
    particle.style.top = Math.random() * window.innerHeight + 'px';
    
    // Random animation duration
    const duration = Math.random() * 4 + 4;
    particle.style.animationDuration = duration + 's';
    
    // Random delay
    particle.style.animationDelay = Math.random() * 2 + 's';
    
    container.appendChild(particle);
    
    // Add mouse interaction
    particle.addEventListener('mouseenter', () => {
        particle.style.background = config.colors.accent;
        particle.style.transform = 'scale(2)';
    });
    
    particle.addEventListener('mouseleave', () => {
        particle.style.background = config.colors.primary;
        particle.style.transform = 'scale(1)';
    });
}

// ===========================
// NAVIGATION SYSTEM
// ===========================

function initializeNavigation() {
    const nav = document.getElementById('main-nav');
    const navLinks = document.querySelectorAll('.nav-link');
    const navToggle = document.getElementById('nav-toggle');
    
    // Smooth scroll navigation
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                // Set navigation flag and update active link immediately
                isNavigating = true;
                updateActiveNavLink(link);
                
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Use a more intelligent way to detect when scrolling stops
                clearTimeout(scrollTimeout);
                scrollTimeout = setTimeout(() => {
                    isNavigating = false;
                }, 1000);
            }
        });
    });
    
    // Scroll-based navigation highlighting with improved detection
    window.addEventListener('scroll', throttle(() => {
        // Reset scroll timeout to detect when scrolling stops
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            isNavigating = false;
        }, 150);
        
        updateNavOnScroll();
    }, 50));
    
    // Mobile navigation toggle
    if (navToggle) {
        navToggle.addEventListener('click', toggleMobileNav);
    }
}

function updateActiveNavLink(activeLink) {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    activeLink.classList.add('active');
}

function updateNavOnScroll() {
    // Don't update navigation during programmatic scrolling
    if (isNavigating) return;
    
    const sections = document.querySelectorAll('section[id]');
    const scrollPosition = window.scrollY + 80; // Slightly reduced offset for better detection
    
    let currentSection = null;
    
    // Find the section that's currently most visible
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPosition >= sectionTop - 50 && scrollPosition < sectionTop + sectionHeight - 50) {
            currentSection = sectionId;
        }
    });
    
    // Update active link if we found a current section
    if (currentSection) {
        const activeLink = document.querySelector(`.nav-link[href="#${currentSection}"]`);
        if (activeLink && !activeLink.classList.contains('active')) {
            updateActiveNavLink(activeLink);
        }
    }
}

function toggleMobileNav() {
    const navLinks = document.querySelector('.nav-links');
    navLinks.classList.toggle('active');
}

// ===========================
// SCROLL ANIMATIONS
// ===========================

function initializeScrollAnimations() {
    const observerOptions = {
        threshold: config.animations.scrollOffset,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                
                // Special animations for different sections
                const sectionId = entry.target.id;
                switch (sectionId) {
                    case 'about':
                        animateAboutSection();
                        break;
                    case 'experience':
                        animateTimelineItems();
                        break;
                    case 'projects':
                        animateProjectCards();
                        break;
                    case 'skills':
                        animateSkillNodes();
                        break;
                    case 'contact':
                        animateContactCards();
                        break;
                }
            }
        });
    }, observerOptions);
    
    // Observe all sections
    document.querySelectorAll('section').forEach(section => {
        observer.observe(section);
    });
}

function animateAboutSection() {
    const profileFrame = document.querySelector('.profile-frame');
    if (profileFrame) {
        setTimeout(() => {
            profileFrame.style.animation = 'profileGlow 2s ease-in-out';
        }, 500);
    }
}

function animateTimelineItems() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    timelineItems.forEach((item, index) => {
        setTimeout(() => {
            item.classList.add('slide-in-left');
        }, index * 200);
    });
}

function animateProjectCards() {
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach((card, index) => {
        setTimeout(() => {
            card.classList.add('fade-in');
        }, index * 150);
    });
}

function animateSkillNodes() {
    const skillNodes = document.querySelectorAll('.skill-node');
    skillNodes.forEach((node, index) => {
        setTimeout(() => {
            node.style.animation = 'pulse 0.5s ease-out';
        }, index * 50);
    });
}

function animateContactCards() {
    const contactCards = document.querySelectorAll('.contact-card');
    contactCards.forEach((card, index) => {
        setTimeout(() => {
            card.classList.add('slide-in-right');
        }, index * 200);
    });
}

// ===========================
// TYPING EFFECT
// ===========================

function initializeTypingEffect() {
    const typedElement = document.getElementById('typed-text');
    if (!typedElement) return;
    
    const text = typedElement.textContent;
    typedElement.textContent = '';
    
    let index = 0;
    
    function typeNextCharacter() {
        if (index < text.length) {
            typedElement.textContent += text.charAt(index);
            index++;
            setTimeout(typeNextCharacter, config.animations.typingSpeed);
        } else {
            // Add blinking cursor
            const cursor = document.querySelector('.title-cursor');
            if (cursor) {
                cursor.style.display = 'inline';
            }
        }
    }
    
    // Start typing after a delay
    setTimeout(typeNextCharacter, 1000);
}

// ===========================
// HERO NEURAL NETWORK
// ===========================

function initializeHeroNeuralNetwork() {
    const heroNeural = document.getElementById('hero-neural');
    if (!heroNeural) return;
    
    // Create neural network nodes
    const nodeCount = 12;
    const centerX = 250;
    const centerY = 250;
    const radius = 150;
    
    for (let i = 0; i < nodeCount; i++) {
        const angle = (i / nodeCount) * Math.PI * 2;
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;
        
        const node = document.createElement('div');
        node.className = 'neural-node';
        node.style.cssText = `
            position: absolute;
            left: ${x - 10}px;
            top: ${y - 10}px;
            width: 20px;
            height: 20px;
            background: ${config.colors.primary};
            border-radius: 50%;
            box-shadow: 0 0 15px ${config.colors.primary};
            animation: pulse 2s ease-in-out infinite;
            animation-delay: ${i * 0.2}s;
        `;
        
        heroNeural.appendChild(node);
        
        // Create connections
        if (i < nodeCount - 1) {
            createNeuralConnection(heroNeural, x, y, 
                centerX + Math.cos(((i + 1) / nodeCount) * Math.PI * 2) * radius,
                centerY + Math.sin(((i + 1) / nodeCount) * Math.PI * 2) * radius
            );
        }
    }
    
    // Connect last node to first
    const lastAngle = ((nodeCount - 1) / nodeCount) * Math.PI * 2;
    const lastX = centerX + Math.cos(lastAngle) * radius;
    const lastY = centerY + Math.sin(lastAngle) * radius;
    const firstX = centerX + Math.cos(0) * radius;
    const firstY = centerY + Math.sin(0) * radius;
    
    createNeuralConnection(heroNeural, lastX, lastY, firstX, firstY);
}

function createNeuralConnection(container, x1, y1, x2, y2) {
    const line = document.createElement('div');
    const length = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
    const angle = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;
    
    line.className = 'neural-connection';
    line.style.cssText = `
        position: absolute;
        left: ${x1}px;
        top: ${y1}px;
        width: ${length}px;
        height: 2px;
        background: linear-gradient(90deg, ${config.colors.primary}, ${config.colors.secondary});
        transform-origin: 0 50%;
        transform: rotate(${angle}deg);
        opacity: 0.6;
        animation: flow 3s ease-in-out infinite;
    `;
    
    container.appendChild(line);
}

// ===========================
// HORIZONTAL NEURAL NETWORK
// ===========================

let horizontalCanvas, horizontalCtx, neuralLayers = [], horizontalAnimationId;
let hoveredNode = null;

function initializeHorizontalNeuralNetwork() {
    horizontalCanvas = document.getElementById('horizontal-neural-canvas');
    if (!horizontalCanvas) return;
    
    horizontalCtx = horizontalCanvas.getContext('2d');
    
    // Set canvas size
    resizeHorizontalCanvas();
    window.addEventListener('resize', resizeHorizontalCanvas);
    
    // Define the skills-based neural network structure with your actual skills
    const networkData = [
        // Layer 1: Foundations (Orange)
        { layer: 0, nodes: ['Statistics & Mathematics', 'Python Programming', 'Data Analysis & Pandas', 'SQL & Databases', 'Data Visualization'] },
        // Layer 2: Core ML (Cyan) 
        { layer: 1, nodes: ['Supervised Learning', 'Unsupervised Learning', 'Feature Engineering', 'Model Evaluation', 'Scikit-learn'] },
        // Layer 3: Specializations (Purple)
        { layer: 2, nodes: ['Deep Learning & Neural Networks', 'Natural Language Processing', 'Computer Vision', 'Graph Analysis & Networks', 'Time Series Forecasting'] },
        // Layer 4: Advanced (Green)
        { layer: 3, nodes: ['Large Language Models', 'Hugging Face Ecosystem', 'LangChain & AI Orchestration', 'Parameter-Efficient Training', 'MLOps & Production'] },
        // Layer 5: Applications (Yellow)
        { layer: 4, nodes: ['Full-Stack Development', 'Cloud & Deployment', 'Real-time Systems', 'AI-Powered Applications', 'Research & Innovation'] }
    ];
    
    createNeuralLayers(networkData);
    
    // Add mouse event listeners
    horizontalCanvas.addEventListener('mousemove', handleHorizontalMouseMove);
    horizontalCanvas.addEventListener('mouseleave', handleHorizontalMouseLeave);
    horizontalCanvas.addEventListener('click', handleHorizontalClick);
    
    // Start animation
    animateHorizontalNetwork();
    
    console.log('🧠 Horizontal Neural Network Initialized!');
}

function resizeHorizontalCanvas() {
    const container = horizontalCanvas.parentElement;
    
    // Set canvas size to container width without compression
    horizontalCanvas.width = container.offsetWidth;
    horizontalCanvas.height = container.offsetHeight;
    
    // Allow overflow for golden node expansion
    container.style.overflow = 'visible';
    
    // Recreate layers with new dimensions if already initialized
    if (neuralLayers.length > 0) {
        const networkData = [
            { layer: 0, nodes: ['Statistics & Mathematics', 'Python Programming', 'Data Analysis & Pandas', 'SQL & Databases', 'Data Visualization'] },
            { layer: 1, nodes: ['Supervised Learning', 'Unsupervised Learning', 'Feature Engineering', 'Model Evaluation', 'Scikit-learn'] },
            { layer: 2, nodes: ['Deep Learning & Neural Networks', 'Natural Language Processing', 'Computer Vision', 'Graph Analysis & Networks', 'Time Series Forecasting'] },
            { layer: 3, nodes: ['Large Language Models', 'Hugging Face Ecosystem', 'LangChain & AI Orchestration', 'Parameter-Efficient Training', 'MLOps & Production'] },
            { layer: 4, nodes: ['Full-Stack Development', 'Cloud & Deployment', 'Real-time Systems', 'AI-Powered Applications', 'Research & Innovation'] }
        ];
        createNeuralLayers(networkData);
    }
}

function createNeuralLayers(networkData) {
    neuralLayers = [];
    
    // Positioning to shift network right and provide space for golden node expansion
    const totalLayers = networkData.length + 1; // 5 skill layers + 1 central node
    const centralNodeRadius = horizontalCanvas.width < 600 ? 20 : 28;
    const networkPadding = 40; // Left padding - less space on left
    const rightPadding = centralNodeRadius * 4 + 80; // Much more space on right for golden node
    const availableWidth = horizontalCanvas.width - networkPadding - rightPadding;
    const layerSpacing = availableWidth / (totalLayers - 1); // Distribute remaining space
    
    const colors = ['#ff6b35', '#00d4ff', '#8b5cf6', '#00ff88', '#ffaa00'];
    
    // Adjust node radius based on screen size
    const baseNodeRadius = horizontalCanvas.width < 600 ? 8 : 10;
    
    // Create the 5 skill layers with proper spacing
    networkData.forEach((layerData, layerIndex) => {
        const layer = {
            layerIndex: layerIndex,
            x: networkPadding + layerSpacing * layerIndex,
            nodes: [],
            color: colors[layerIndex]
        };
        
        const nodeSpacing = horizontalCanvas.height / (layerData.nodes.length + 1);
        
        layerData.nodes.forEach((nodeName, nodeIndex) => {
            const node = {
                name: nodeName,
                layerIndex: layerIndex,
                x: layer.x,
                y: nodeSpacing * (nodeIndex + 1),
                baseX: layer.x,
                baseY: nodeSpacing * (nodeIndex + 1),
                radius: baseNodeRadius,
                baseRadius: baseNodeRadius,
                color: layer.color,
                opacity: 0.8,
                glowIntensity: 0,
                pulsePhase: Math.random() * Math.PI * 2,
                hovered: false,
                active: false,
                isCentral: false
            };
            
            layer.nodes.push(node);
        });
        
        neuralLayers.push(layer);
    });
    
    // Add central "AI/ML Engineer" node - positioned at the end with proper spacing
    const centralLayer = {
        layerIndex: 5,
        x: networkPadding + layerSpacing * networkData.length,
        nodes: [],
        color: '#FFD700' // Gold color for distinction
    };
    
    const centralNode = {
        name: 'AI/ML Engineer',
        layerIndex: 5,
        x: centralLayer.x,
        y: horizontalCanvas.height / 2,
        baseX: centralLayer.x,
        baseY: horizontalCanvas.height / 2,
        radius: centralNodeRadius,
        baseRadius: centralNodeRadius,
        color: '#FFD700', // Gold color
        opacity: 1.0,
        glowIntensity: 0.6,
        pulsePhase: 0,
        hovered: false,
        active: false,
        isCentral: true
    };
    
    centralLayer.nodes.push(centralNode);
    neuralLayers.push(centralLayer);
    
    // Add random activation pulses
    setInterval(() => {
        if (Math.random() < 0.3) {
            createDataFlowAnimation();
        }
    }, 2000);
}

function animateHorizontalNetwork() {
    if (!horizontalCtx) return;
    
    // Clear canvas
    horizontalCtx.clearRect(0, 0, horizontalCanvas.width, horizontalCanvas.height);
    
    // Update nodes
    neuralLayers.forEach(layer => {
        layer.nodes.forEach(node => {
            // Subtle floating animation
            node.pulsePhase += 0.01;
            node.x = node.baseX + Math.sin(node.pulsePhase) * 2;
            node.y = node.baseY + Math.cos(node.pulsePhase * 0.8) * 1;
            
            // Hover effects with special handling for central node
            if (node.hovered) {
                if (node.isCentral) {
                    node.radius = Math.min(node.radius + 1.2, node.baseRadius * 1.4);
                    node.glowIntensity = Math.min(node.glowIntensity + 0.05, 1.0);
                } else {
                    node.radius = Math.min(node.radius + 0.5, node.baseRadius * 1.3);
                    node.glowIntensity = Math.min(node.glowIntensity + 0.03, 0.8);
                }
            } else {
                node.radius = Math.max(node.radius - 0.8, node.baseRadius);
                if (!node.isCentral) {
                    node.glowIntensity = Math.max(node.glowIntensity - 0.03, 0);
                } else {
                    node.glowIntensity = Math.max(node.glowIntensity - 0.03, 0.4);
                }
            }
            
            // Active state effects
            if (node.active) {
                node.glowIntensity = Math.max(node.glowIntensity, 0.6);
            }
        });
    });
    
    // Draw connections: all skill nodes to central node + layer-to-layer
    for (let i = 0; i < neuralLayers.length - 1; i++) {
        const currentLayer = neuralLayers[i];
        const nextLayer = neuralLayers[i + 1];
        
        if (i < neuralLayers.length - 2) {
            // Regular layer-to-layer connections for skill progression
            currentLayer.nodes.forEach(node => {
                nextLayer.nodes.forEach(nextNode => {
                    const opacity = (node.hovered || nextNode.hovered) ? 0.3 : 0.08;
                    const gradient = horizontalCtx.createLinearGradient(
                        node.x, node.y, nextNode.x, nextNode.y
                    );
                    gradient.addColorStop(0, node.color + Math.floor(opacity * 255).toString(16).padStart(2, '0'));
                    gradient.addColorStop(1, nextNode.color + Math.floor(opacity * 255).toString(16).padStart(2, '0'));
                    
                    horizontalCtx.beginPath();
                    horizontalCtx.moveTo(node.x + node.radius, node.y);
                    horizontalCtx.lineTo(nextNode.x - nextNode.radius, nextNode.y);
                    horizontalCtx.strokeStyle = gradient;
                    horizontalCtx.lineWidth = (node.active || nextNode.active) ? 1.5 : 0.5;
                    horizontalCtx.stroke();
                });
            });
        }
    }
    
    // Draw connections from all skill nodes to central AI/ML Engineer node
    const centralNode = neuralLayers[neuralLayers.length - 1].nodes[0];
    for (let i = 0; i < neuralLayers.length - 1; i++) {
        const layer = neuralLayers[i];
        layer.nodes.forEach(node => {
            const opacity = (node.hovered || centralNode.hovered) ? 0.4 : 0.12;
            const gradient = horizontalCtx.createLinearGradient(
                node.x, node.y, centralNode.x, centralNode.y
            );
            gradient.addColorStop(0, node.color + Math.floor(opacity * 255).toString(16).padStart(2, '0'));
            gradient.addColorStop(1, centralNode.color + Math.floor(opacity * 255).toString(16).padStart(2, '0'));
            
            horizontalCtx.beginPath();
            horizontalCtx.moveTo(node.x + node.radius, node.y);
            horizontalCtx.lineTo(centralNode.x - centralNode.radius, centralNode.y);
            horizontalCtx.strokeStyle = gradient;
            horizontalCtx.lineWidth = (node.active || centralNode.active) ? 2 : 0.8;
            horizontalCtx.stroke();
        });
    }
    
    // Draw nodes with special handling for central node
    neuralLayers.forEach(layer => {
        layer.nodes.forEach(node => {
            // Enhanced glow for central node
            if (node.glowIntensity > 0 || node.isCentral) {
                const glowRadius = node.isCentral ? node.radius * 3 : node.radius * 2.5;
                const glowOpacity = node.isCentral ? Math.max(node.glowIntensity, 0.3) : node.glowIntensity;
                
                const glowGradient = horizontalCtx.createRadialGradient(
                    node.x, node.y, 0,
                    node.x, node.y, glowRadius
                );
                glowGradient.addColorStop(0, node.color + Math.floor(glowOpacity * 100).toString(16).padStart(2, '0'));
                glowGradient.addColorStop(1, node.color + '00');
                
                horizontalCtx.beginPath();
                horizontalCtx.arc(node.x, node.y, glowRadius, 0, Math.PI * 2);
                horizontalCtx.fillStyle = glowGradient;
                horizontalCtx.fill();
            }
            
            // Main node with enhanced styling for central node
            const nodeGradient = horizontalCtx.createRadialGradient(
                node.x - node.radius * 0.3, node.y - node.radius * 0.3, 0,
                node.x, node.y, node.radius
            );
            
            if (node.isCentral) {
                // Special gold gradient for central node
                nodeGradient.addColorStop(0, '#FFEB3B'); // Bright gold
                nodeGradient.addColorStop(0.3, '#FFD700'); // Standard gold
                nodeGradient.addColorStop(0.7, '#FFA000'); // Darker gold
                nodeGradient.addColorStop(1, '#FF8F00'); // Deep orange-gold
            } else {
                nodeGradient.addColorStop(0, lightenColor(node.color, 40));
                nodeGradient.addColorStop(1, node.color);
            }
            
            horizontalCtx.beginPath();
            horizontalCtx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
            horizontalCtx.fillStyle = nodeGradient;
            horizontalCtx.fill();
            
            // Border with special styling for central node
            horizontalCtx.beginPath();
            horizontalCtx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
            if (node.isCentral) {
                horizontalCtx.strokeStyle = node.hovered ? '#FFEB3B' : '#FFD700';
                horizontalCtx.lineWidth = node.hovered ? 4 : 3;
            } else {
                horizontalCtx.strokeStyle = node.hovered ? '#ffffff' : node.color;
                horizontalCtx.lineWidth = node.hovered ? 2 : 1;
            }
            horizontalCtx.stroke();
            
            // Add text label for central node with better styling and responsive font
            if (node.isCentral) {
                const fontSize = horizontalCanvas.width < 600 ? 9 : 11;
                horizontalCtx.font = `bold ${fontSize}px Inter`;
                horizontalCtx.textAlign = 'center';
                horizontalCtx.textBaseline = 'middle';
                horizontalCtx.fillStyle = '#000000'; // Black text for gold background
                horizontalCtx.strokeStyle = '#FFD700';
                horizontalCtx.lineWidth = 2;
                const textOffset = horizontalCanvas.width < 600 ? 4 : 5;
                const textSpacing = horizontalCanvas.width < 600 ? 6 : 8;
                horizontalCtx.strokeText('AI/ML', node.x, node.y - textOffset);
                horizontalCtx.strokeText('Engineer', node.x, node.y + textSpacing);
                horizontalCtx.fillText('AI/ML', node.x, node.y - textOffset);
                horizontalCtx.fillText('Engineer', node.x, node.y + textSpacing);
            }
        });
    });
    
    // Draw layer labels with updated categories and larger font sizing
    neuralLayers.forEach((layer, index) => {
        if (index < 5) { // Only label the skill layers, not the central node
            const layerLabels = ['BASE', 'CORE ML', 'SPECIALIZATIONS', 'ADVANCED', 'APPLICATIONS'];
            
            // Larger responsive font size
            const fontSize = horizontalCanvas.width < 600 ? 12 : 14;
            horizontalCtx.font = `bold ${fontSize}px Inter`;
            horizontalCtx.textAlign = 'center';
            horizontalCtx.textBaseline = 'top';
            horizontalCtx.fillStyle = layer.color;
            horizontalCtx.fillText(layerLabels[index], layer.x, 8);
        } else if (index === 5) {
            // Label for central node
            const fontSize = horizontalCanvas.width < 600 ? 13 : 15;
            horizontalCtx.font = `bold ${fontSize}px Inter`;
            horizontalCtx.textAlign = 'center';
            horizontalCtx.textBaseline = 'top';
            horizontalCtx.fillStyle = '#FFD700'; // Gold color to match central node
            horizontalCtx.fillText('CULMINATION', layer.x, 8);
        }
    });
    
    horizontalAnimationId = requestAnimationFrame(animateHorizontalNetwork);
}

function createDataFlowAnimation() {
    // Create a data flow animation from foundations to central node
    let currentLayer = 0;
    const animationDuration = 2000;
    const startTime = Date.now();
    
    function animateFlow() {
        const elapsed = Date.now() - startTime;
        const progress = elapsed / animationDuration;
        
        if (progress < 1) {
            // Activate nodes in current layer
            if (currentLayer < neuralLayers.length - 1) {
                neuralLayers[currentLayer].nodes.forEach(node => {
                    node.active = true;
                    node.glowIntensity = 0.8;
                });
            }
            
            // Move to next layer based on progress
            const expectedLayer = Math.floor(progress * (neuralLayers.length - 1));
            if (expectedLayer > currentLayer && expectedLayer < neuralLayers.length - 1) {
                currentLayer = expectedLayer;
            }
            
            // Activate central node when we reach 80% progress
            if (progress > 0.8) {
                const centralNode = neuralLayers[neuralLayers.length - 1].nodes[0];
                centralNode.active = true;
                centralNode.glowIntensity = 1.0;
            }
            
            requestAnimationFrame(animateFlow);
        } else {
            // Reset all nodes
            neuralLayers.forEach(layer => {
                layer.nodes.forEach(node => {
                    node.active = false;
                    if (!node.isCentral) {
                        node.glowIntensity = 0;
                    }
                });
            });
        }
    }
    
    animateFlow();
}

function handleHorizontalMouseMove(event) {
    const rect = horizontalCanvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    
    let newHoveredNode = null;
    
    // Check if mouse is over any node
    neuralLayers.forEach(layer => {
        layer.nodes.forEach(node => {
            const dx = mouseX - node.x;
            const dy = mouseY - node.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance <= node.radius + 5) {
                newHoveredNode = node;
            }
            
            node.hovered = (node === newHoveredNode);
        });
    });
    
    // Update tooltip with improved positioning
    const tooltip = document.getElementById('neural-tooltip');
    if (newHoveredNode && tooltip) {
        // Position tooltip closer to cursor with smarter placement
        const offsetX = 8;
        const offsetY = -35; // Place above cursor
        
        let tooltipX = event.clientX + offsetX;
        let tooltipY = event.clientY + offsetY;
        
        // Get tooltip dimensions (estimate)
        const tooltipWidth = 200; // estimated max width
        const tooltipHeight = 35; // estimated height
        
        // Check viewport boundaries and adjust position
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        
        // Adjust horizontal position if tooltip would go off screen
        if (tooltipX + tooltipWidth > viewportWidth) {
            tooltipX = event.clientX - tooltipWidth - offsetX;
        }
        
        // Adjust vertical position if tooltip would go off screen
        if (tooltipY < 0) {
            tooltipY = event.clientY + 25; // Place below cursor instead
        }
        
        tooltip.style.left = tooltipX + 'px';
        tooltip.style.top = tooltipY + 'px';
        tooltip.textContent = newHoveredNode.name;
        tooltip.style.opacity = '1';
        tooltip.style.backgroundColor = newHoveredNode.isCentral ? 'rgba(255, 215, 0, 0.95)' : 'rgba(0, 0, 0, 0.95)';
        tooltip.style.color = newHoveredNode.isCentral ? '#000000' : '#ffffff';
        tooltip.style.borderColor = newHoveredNode.color;
        horizontalCanvas.style.cursor = 'pointer';
    } else if (tooltip) {
        tooltip.style.opacity = '0';
        horizontalCanvas.style.cursor = 'default';
    }
    
    hoveredNode = newHoveredNode;
}

function handleHorizontalMouseLeave() {
    neuralLayers.forEach(layer => {
        layer.nodes.forEach(node => {
            node.hovered = false;
        });
    });
    
    const tooltip = document.getElementById('neural-tooltip');
    if (tooltip) {
        tooltip.style.opacity = '0';
    }
    
    horizontalCanvas.style.cursor = 'default';
    hoveredNode = null;
}

function handleHorizontalClick(event) {
    if (hoveredNode) {
        // Trigger data flow animation from this layer
        createDataFlowAnimation();
        console.log(`🎯 Clicked on: ${hoveredNode.name}`);
    }
}

function lightenColor(color, percent) {
    // Convert hex to RGB
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    
    // Lighten
    const newR = Math.min(255, Math.floor(r + (255 - r) * percent / 100));
    const newG = Math.min(255, Math.floor(g + (255 - g) * percent / 100));
    const newB = Math.min(255, Math.floor(b + (255 - b) * percent / 100));
    
    return `rgb(${newR}, ${newG}, ${newB})`;
}

// ===========================
// INTERACTIVE ELEMENTS
// ===========================

function initializeInteractiveElements() {
    // Project card interactions
    initializeProjectCardEffects();
    
    // Skill node interactions
    initializeSkillNodeEffects();
    
    // Contact card interactions
    initializeContactCardEffects();
    
    // Button effects
    initializeButtonEffects();
}

function initializeProjectCardEffects() {
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-15px) scale(1.02)';
            card.style.boxShadow = '0 25px 50px rgba(0, 212, 255, 0.2)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
            card.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.3)';
        });
    });
}

function initializeSkillNodeEffects() {
    const skillNodes = document.querySelectorAll('.skill-node');
    
    skillNodes.forEach(node => {
        node.addEventListener('mouseenter', () => {
            // Create temporary connections to nearby nodes
            const rect = node.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            
            skillNodes.forEach(otherNode => {
                if (otherNode !== node) {
                    const otherRect = otherNode.getBoundingClientRect();
                    const otherCenterX = otherRect.left + otherRect.width / 2;
                    const otherCenterY = otherRect.top + otherRect.height / 2;
                    
                    const distance = Math.sqrt(
                        (centerX - otherCenterX) ** 2 + (centerY - otherCenterY) ** 2
                    );
                    
                    if (distance < 200) {
                        otherNode.style.transform = 'scale(1.1)';
                        otherNode.style.boxShadow = `0 0 15px ${config.colors.primary}`;
                    }
                }
            });
        });
        
        node.addEventListener('mouseleave', () => {
            skillNodes.forEach(otherNode => {
                otherNode.style.transform = 'scale(1)';
                otherNode.style.boxShadow = 'none';
            });
        });
    });
}

function initializeContactCardEffects() {
    const contactCards = document.querySelectorAll('.contact-card');
    
    contactCards.forEach(card => {
        const icon = card.querySelector('.contact-icon');
        
        card.addEventListener('mouseenter', () => {
            if (icon) {
                icon.style.transform = 'rotate(360deg) scale(1.1)';
                icon.style.transition = 'transform 0.5s ease';
            }
        });
        
        card.addEventListener('mouseleave', () => {
            if (icon) {
                icon.style.transform = 'rotate(0deg) scale(1)';
            }
        });
    });
}

function initializeButtonEffects() {
    const buttons = document.querySelectorAll('.btn-primary, .btn-secondary, .contact-btn');
    
    buttons.forEach(button => {
        button.addEventListener('mouseenter', () => {
            button.style.transform = 'translateY(-3px) scale(1.05)';
        });
        
        button.addEventListener('mouseleave', () => {
            button.style.transform = 'translateY(0) scale(1)';
        });
        
        button.addEventListener('click', (e) => {
            // Create ripple effect
            const ripple = document.createElement('span');
            const rect = button.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s ease-out;
                pointer-events: none;
            `;
            
            button.style.position = 'relative';
            button.style.overflow = 'hidden';
            button.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
}

// ===========================
// MOUSE TRACKING
// ===========================

function initializeMouseTracking() {
    document.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
        
        // Update particle positions based on mouse
        updateParticlesOnMouseMove(e);
    });
}

function updateParticlesOnMouseMove(e) {
    const particles = document.querySelectorAll('.particle');
    
    particles.forEach(particle => {
        const rect = particle.getBoundingClientRect();
        const particleX = rect.left + rect.width / 2;
        const particleY = rect.top + rect.height / 2;
        
        const dx = e.clientX - particleX;
        const dy = e.clientY - particleY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 100) {
            const force = (100 - distance) / 100;
            const moveX = dx * force * 0.1;
            const moveY = dy * force * 0.1;
            
            particle.style.transform = `translate(${moveX}px, ${moveY}px) scale(${1 + force * 0.5})`;
        } else {
            particle.style.transform = 'translate(0, 0) scale(1)';
        }
    });
}

// ===========================
// UTILITY FUNCTIONS
// ===========================

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

function debounce(func, wait, immediate) {
    let timeout;
    return function() {
        const context = this, args = arguments;
        const later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

// ===========================
// PERFORMANCE MONITORING
// ===========================

function initializePerformanceMonitoring() {
    // Monitor FPS
    let fps = 0;
    let lastTime = performance.now();
    
    function updateFPS() {
        const currentTime = performance.now();
        fps = 1000 / (currentTime - lastTime);
        lastTime = currentTime;
        
        // Adjust animation quality based on FPS
        if (fps < 30) {
            // Reduce particle count for better performance
            config.neural.particleCount = Math.max(10, config.neural.particleCount - 5);
            config.neural.nodeCount = Math.max(20, config.neural.nodeCount - 5);
        }
        
        requestAnimationFrame(updateFPS);
    }
    
    requestAnimationFrame(updateFPS);
}

// ===========================
// EASTER EGGS & SECRETS
// ===========================

function initializeEasterEggs() {
    // Konami Code
    let konamiCode = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];
    let konamiIndex = 0;
    
    document.addEventListener('keydown', (e) => {
        if (e.keyCode === konamiCode[konamiIndex]) {
            konamiIndex++;
            if (konamiIndex === konamiCode.length) {
                activateMatrixMode();
                konamiIndex = 0;
            }
        } else {
            konamiIndex = 0;
        }
    });
    
    // Double click on logo
    const brandText = document.querySelector('.brand-text');
    if (brandText) {
        brandText.addEventListener('dblclick', () => {
            activateNeuralOverdrive();
        });
    }
}

function activateMatrixMode() {
    document.body.style.filter = 'hue-rotate(120deg)';
    document.body.style.animation = 'matrix 10s ease-in-out';
    
    setTimeout(() => {
        document.body.style.filter = 'none';
        document.body.style.animation = 'none';
    }, 10000);
}

function activateNeuralOverdrive() {
    config.neural.nodeCount *= 2;
    config.neural.particleCount *= 2;
    config.neural.animationSpeed *= 2;
    
    // Reset after 5 seconds
    setTimeout(() => {
        config.neural.nodeCount /= 2;
        config.neural.particleCount /= 2;
        config.neural.animationSpeed /= 2;
    }, 5000);
}

// ===========================
// ADDITIONAL ANIMATIONS
// ===========================

// Add custom CSS animations via JavaScript
const additionalStyles = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    @keyframes profileGlow {
        0%, 100% {
            box-shadow: 0 0 20px rgba(0, 212, 255, 0.3);
        }
        50% {
            box-shadow: 0 0 40px rgba(0, 212, 255, 0.8);
        }
    }
    
    @keyframes flow {
        0%, 100% {
            opacity: 0.3;
        }
        50% {
            opacity: 1;
        }
    }
    
    @keyframes matrix {
        0%, 100% {
            filter: hue-rotate(0deg);
        }
        50% {
            filter: hue-rotate(180deg);
        }
    }
`;

// Inject additional styles
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);

// Initialize easter eggs when DOM is ready
document.addEventListener('DOMContentLoaded', initializeEasterEggs);

// Initialize performance monitoring
document.addEventListener('DOMContentLoaded', initializePerformanceMonitoring);

// ===========================
// EXPORT FOR MODULES
// ===========================

window.NeuralPortfolio = {
    config,
    initializePortfolio,
    activateMatrixMode,
    activateNeuralOverdrive
};

console.log('🚀 Neural Portfolio JavaScript Framework Loaded Successfully!');