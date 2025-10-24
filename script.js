// Smooth scrolling and navigation
document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
    
    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
    
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Navbar background on scroll
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.1)';
            navbar.style.boxShadow = 'none';
        }
    });
    
    // Animate skill bars on scroll
    const skillBars = document.querySelectorAll('.skill-progress');
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const skillObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const skillBar = entry.target;
                const width = skillBar.getAttribute('data-width');
                skillBar.style.width = width;
                skillObserver.unobserve(skillBar);
            }
        });
    }, observerOptions);
    
    skillBars.forEach(bar => {
        skillObserver.observe(bar);
    });
    
    // Animate elements on scroll
    const animateElements = document.querySelectorAll('.section-title, .section-subtitle, .about-description, .project-card, .contact-item');
    const elementObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });
    
    animateElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'all 0.6s ease';
        elementObserver.observe(element);
    });
    
    // Project card hover effects
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Contact form handling with JavaScript SMTP
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const data = {
                name: formData.get('name'),
                email: formData.get('email'),
                message: formData.get('message')
            };
            
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            
            // Show loading state
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
            
            try {
                // Initialize email handler
                const emailHandler = new EmailHandler({
                    service: 'gmail',
                    smtp: {
                        host: 'smtp.gmail.com',
                        port: 587,
                        secure: false,
                        auth: {
                            user: 'devarkondasneha@gmail.com',
                            pass: '' // This will be set via environment variables in production
                        }
                    },
                    to: 'devarkondasneha@gmail.com',
                    from: 'devarkondasneha@gmail.com',
                    subject: 'New message from your portfolio website'
                });
                
                // Send email using serverless function
                const result = await emailHandler.sendEmail(data, 'serverless');
                
                if (result.success) {
                    showNotification(result.message, 'success');
                    this.reset();
                } else {
                    showNotification(result.message, 'error');
                    if (result.errors) {
                        console.log('Validation errors:', result.errors);
                    }
                }
            } catch (error) {
                console.error('Error:', error);
                showNotification('Failed to send message. Please try again.', 'error');
            } finally {
                // Reset button state
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }
        });
    }
    
    // Floating particles animation
    createFloatingParticles();
    
    // Wave animation for project cards
    addWaveEffect();
    
    // Parallax effect for hero section
    addParallaxEffect();
});

// Email validation function
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Notification system
function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // Styles for notification
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 25px;
        border-radius: 10px;
        color: white;
        font-weight: 500;
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 300px;
        word-wrap: break-word;
    `;
    
    if (type === 'success') {
        notification.style.background = 'linear-gradient(135deg, #4CAF50, #45a049)';
    } else if (type === 'error') {
        notification.style.background = 'linear-gradient(135deg, #f44336, #d32f2f)';
    }
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Create floating particles
function createFloatingParticles() {
    const particlesContainer = document.querySelector('.floating-particles');
    if (!particlesContainer) return;
    
    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.cssText = `
            position: absolute;
            width: ${Math.random() * 4 + 2}px;
            height: ${Math.random() * 4 + 2}px;
            background: rgba(255, 255, 255, ${Math.random() * 0.5 + 0.3});
            border-radius: 50%;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            animation: float ${Math.random() * 4 + 4}s ease-in-out infinite;
            animation-delay: ${Math.random() * 2}s;
        `;
        particlesContainer.appendChild(particle);
    }
}

// Add wave effect to project cards
function addWaveEffect() {
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const wave = document.createElement('div');
            wave.className = 'wave-ripple';
            wave.style.cssText = `
                position: absolute;
                left: ${x}px;
                top: ${y}px;
                width: 0;
                height: 0;
                background: radial-gradient(circle, rgba(255, 255, 255, 0.3), transparent);
                border-radius: 50%;
                transform: translate(-50%, -50%);
                animation: ripple 0.6s ease-out;
                pointer-events: none;
            `;
            
            this.style.position = 'relative';
            this.appendChild(wave);
            
            setTimeout(() => {
                if (wave.parentNode) {
                    wave.parentNode.removeChild(wave);
                }
            }, 600);
        });
    });
}

// Add parallax effect to hero section
function addParallaxEffect() {
    const hero = document.querySelector('.hero');
    const palmSilhouettes = document.querySelector('.palm-silhouettes');
    const glowingSun = document.querySelector('.glowing-sun');
    
    if (!hero || !palmSilhouettes || !glowingSun) return;
    
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        
        palmSilhouettes.style.transform = `translateY(${rate}px)`;
        glowingSun.style.transform = `translateY(${rate * 0.3}px)`;
    });
}

// Add CSS for wave ripple animation
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        0% {
            width: 0;
            height: 0;
            opacity: 1;
        }
        100% {
            width: 200px;
            height: 200px;
            opacity: 0;
        }
    }
    
    .wave-ripple {
        z-index: 1;
    }
    
    .particle {
        pointer-events: none;
    }
    
    @keyframes float {
        0%, 100% {
            transform: translateY(0px) rotate(0deg);
            opacity: 0.6;
        }
        50% {
            transform: translateY(-20px) rotate(180deg);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);

// Typing effect for hero title
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Initialize typing effect when page loads
window.addEventListener('load', function() {
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        const originalText = heroTitle.textContent;
        typeWriter(heroTitle, originalText, 50);
    }
});

// Add scroll progress indicator
function addScrollProgress() {
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 3px;
        background: linear-gradient(135deg, #ff6b6b, #ffa726);
        z-index: 10000;
        transition: width 0.1s ease;
    `;
    
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', function() {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        
        progressBar.style.width = scrolled + '%';
    });
}

// Initialize scroll progress
addScrollProgress();

// Add ocean wave effects to footer
function addOceanWaves() {
    const footer = document.querySelector('.footer');
    if (!footer) return;
    
    // Create additional foam particles
    for (let i = 0; i < 8; i++) {
        const foam = document.createElement('div');
        foam.className = 'foam-particle';
        foam.style.cssText = `
            position: absolute;
            width: ${Math.random() * 4 + 3}px;
            height: ${Math.random() * 4 + 3}px;
            background: rgba(255, 255, 255, ${Math.random() * 0.3 + 0.2});
            border-radius: 50%;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            animation: foamFloat ${Math.random() * 4 + 4}s ease-in-out infinite;
            animation-delay: ${Math.random() * 3}s;
            pointer-events: none;
            z-index: 1;
        `;
        footer.appendChild(foam);
    }
}

// Initialize ocean waves
addOceanWaves();

// Add cursor breeze effect
function addCursorBreeze() {
    let mouseX = 0;
    let mouseY = 0;
    let breezeElements = [];
    let lastMouseX = 0;
    let lastMouseY = 0;
    
    // Create breeze particles
    function createBreezeParticle() {
        const particle = document.createElement('div');
        particle.className = 'breeze-particle';
        particle.style.cssText = `
            position: fixed;
            width: 4px;
            height: 4px;
            background: radial-gradient(circle, rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.2));
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            transition: all 0.3s ease;
        `;
        document.body.appendChild(particle);
        breezeElements.push(particle);
        return particle;
    }
    
    // Create breeze trail
    function createBreezeTrail(x, y) {
        const trail = document.createElement('div');
        trail.className = 'breeze-trail';
        trail.style.left = x + 'px';
        trail.style.top = y + 'px';
        document.body.appendChild(trail);
        
        setTimeout(() => {
            if (trail.parentNode) {
                trail.parentNode.removeChild(trail);
            }
        }, 800);
    }
    
    // Track mouse movement
    document.addEventListener('mousemove', function(e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        // Calculate movement speed
        const deltaX = mouseX - lastMouseX;
        const deltaY = mouseY - lastMouseY;
        const speed = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        
        // Create breeze trail based on movement speed
        if (speed > 5) {
            createBreezeTrail(mouseX, mouseY);
        }
        
        // Create new breeze particles occasionally
        if (Math.random() < 0.4 && speed > 2) {
            const particle = createBreezeParticle();
            particle.style.left = mouseX + 'px';
            particle.style.top = mouseY + 'px';
            
            // Animate particle movement in the direction of cursor movement
            setTimeout(() => {
                const breezeX = deltaX * 0.5 + (Math.random() - 0.5) * 50;
                const breezeY = deltaY * 0.5 + (Math.random() - 0.5) * 50;
                particle.style.transform = `translate(${breezeX}px, ${breezeY}px)`;
                particle.style.opacity = '0';
            }, 50);
            
            // Remove particle after animation
            setTimeout(() => {
                if (particle.parentNode) {
                    particle.parentNode.removeChild(particle);
                    const index = breezeElements.indexOf(particle);
                    if (index > -1) {
                        breezeElements.splice(index, 1);
                    }
                }
            }, 1000);
        }
        
        lastMouseX = mouseX;
        lastMouseY = mouseY;
    });
    
    // Create floating breeze particles
    function createFloatingBreeze() {
        if (breezeElements.length < 20) {
            const particle = createBreezeParticle();
            particle.style.left = Math.random() * window.innerWidth + 'px';
            particle.style.top = Math.random() * window.innerHeight + 'px';
            particle.style.animation = `floatBreeze ${Math.random() * 10 + 5}s ease-in-out infinite`;
            particle.style.animationDelay = Math.random() * 2 + 's';
        }
    }
    
    // Create floating particles periodically
    setInterval(createFloatingBreeze, 2000);
    
    // Add breeze effect on hover for interactive elements
    const interactiveElements = document.querySelectorAll('a, button, .project-card, .skill-item, .contact-item');
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', function() {
            // Create a burst of breeze particles
            for (let i = 0; i < 3; i++) {
                setTimeout(() => {
                    const rect = this.getBoundingClientRect();
                    const particle = createBreezeParticle();
                    particle.style.left = (rect.left + rect.width / 2) + 'px';
                    particle.style.top = (rect.top + rect.height / 2) + 'px';
                    particle.style.animation = `breezeFollow 1s ease-out forwards`;
                    
                    setTimeout(() => {
                        if (particle.parentNode) {
                            particle.parentNode.removeChild(particle);
                            const index = breezeElements.indexOf(particle);
                            if (index > -1) {
                                breezeElements.splice(index, 1);
                            }
                        }
                    }, 1000);
                }, i * 100);
            }
        });
    });
}

// Initialize cursor breeze
addCursorBreeze();

// Handle form submission success
function handleFormSuccess() {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('success') === 'true') {
        showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
        // Clean up URL
        window.history.replaceState({}, document.title, window.location.pathname);
    }
}

// Initialize form success handling
handleFormSuccess();

// Add smooth reveal animation for sections
function addRevealAnimation() {
    const revealElements = document.querySelectorAll('.section-title, .section-subtitle, .about-description, .project-card, .contact-item');
    
    const revealObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
            }
        });
    }, { threshold: 0.1 });
    
    revealElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(50px)';
        element.style.transition = 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        revealObserver.observe(element);
    });
}

// Initialize reveal animation
addRevealAnimation();

// Add CSS for reveal animation
const revealStyle = document.createElement('style');
revealStyle.textContent = `
    .revealed {
        opacity: 1 !important;
        transform: translateY(0) !important;
    }
`;
document.head.appendChild(revealStyle);