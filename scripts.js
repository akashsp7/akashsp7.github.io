/**
 * NEURAL PORTFOLIO JAVASCRIPT FRAMEWORK
 * Advanced AI Portfolio with Interactive Elements
 */

// ===========================
// GLOBAL VARIABLES & CONFIG
// ===========================

const config = {
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
    initializeNavigation();
    initializeScrollAnimations();
    initializeTypingEffect();
    initializeInteractiveElements();
    initializeMouseTracking();
    
    console.log('✅ Neural Portfolio Initialized Successfully!');
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
                
                // Close mobile menu when clicking on a link
                const navLinksContainer = document.querySelector('.nav-links');
                if (navLinksContainer && navToggle) {
                    navLinksContainer.classList.remove('active');
                    navToggle.classList.remove('active');
                }
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
    const navToggle = document.getElementById('nav-toggle');
    
    navLinks.classList.toggle('active');
    navToggle.classList.toggle('active');
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
    
    // Create invisible placeholder to reserve space and prevent layout shift
    const placeholder = document.createElement('span');
    placeholder.textContent = text;
    placeholder.style.visibility = 'hidden';
    placeholder.style.position = 'absolute';
    placeholder.style.top = '0';
    placeholder.style.left = '0';
    placeholder.style.right = '0';
    placeholder.style.pointerEvents = 'none';
    
    // Position the typing text absolutely over the placeholder
    typedElement.style.position = 'absolute';
    typedElement.style.top = '0';
    typedElement.style.left = '0';
    typedElement.style.right = '0';
    typedElement.style.textAlign = 'center';
    
    // Add placeholder to reserve space
    typedElement.parentElement.style.position = 'relative';
    typedElement.parentElement.appendChild(placeholder);
    
    typedElement.textContent = '';
    
    // Ensure cursor is always visible in layout to prevent shifting
    const cursor = document.querySelector('.title-cursor');
    if (cursor) {
        cursor.style.display = 'inline';
        cursor.style.opacity = '0'; // Hide during typing
    }
    
    let index = 0;
    
    function typeNextCharacter() {
        if (index < text.length) {
            typedElement.textContent += text.charAt(index);
            index++;
            setTimeout(typeNextCharacter, config.animations.typingSpeed);
        } else {
            // Show blinking cursor by making it visible
            if (cursor) {
                cursor.style.opacity = '1';
            }
        }
    }
    
    // Start typing after a delay
    setTimeout(typeNextCharacter, 1000);
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
`;

// Inject additional styles
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);

// ===========================
// EXPORT FOR MODULES
// ===========================

window.NeuralPortfolio = {
    config,
    initializePortfolio
};

console.log('🚀 Neural Portfolio JavaScript Framework Loaded Successfully!');
