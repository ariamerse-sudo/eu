function setLanguage(lang) {
    if (lang === 'en') {
      window.location.href = "index.html";
    } else if (lang === 'ka') {
      window.location.href = "geo.html";
    }
}

// Slider functionality
let autoSlideInterval;

function activate(e) {
    const slider = document.querySelector('.slider');
    const items = document.querySelectorAll('.item');
    if (e.target.matches('.next')) {
        slider.append(items[0]);
        resetAutoSlide();
    }
    if (e.target.matches('.prev')) {
        slider.prepend(items[items.length-1]);
        resetAutoSlide();
    }
}

function autoSlide() {
    const slider = document.querySelector('.slider');
    const items = document.querySelectorAll('.item');
    slider.append(items[0]);
}

function resetAutoSlide() {
    clearInterval(autoSlideInterval);
    autoSlideInterval = setInterval(autoSlide, 5000);
}

document.addEventListener('click', activate, false);

// Custom Cursor Circles with hover effects
window.addEventListener("mousemove", e => {
    const cursors = document.querySelectorAll('.cursor');
    cursors.forEach(cursor => {
        cursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
    });
});

// Add hover class to cursors when over interactive elements
document.addEventListener('DOMContentLoaded', function() {
    const interactiveElements = 'a, button, .nav-link, .btn, .scroll-card, .item, .logo, .profile-icon, .language-item';
    const cursor = document.querySelector('.cursor');
    const cursor2 = document.querySelector('.cursor2');
    
    document.querySelectorAll(interactiveElements).forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor?.classList.add('hover');
            cursor2?.classList.add('hover');
        });
        
        el.addEventListener('mouseleave', () => {
            cursor?.classList.remove('hover');
            cursor2?.classList.remove('hover');
        });
    });
});

// Horizontal scroll with mouse wheel
function setupHorizontalScroll() {
    const container = document.getElementById('horizontalScroll');
    const main = document.querySelector('main:not(.slider-main)');
    if (!container || !main) return;
    
    // Listen on window for scroll
    window.addEventListener('wheel', (e) => {
        const mainRect = main.getBoundingClientRect();
        const mainTop = mainRect.top;
        const mainBottom = mainRect.bottom;
        const scrollLeft = container.scrollLeft;
        const maxScroll = container.scrollWidth - container.clientWidth;
        const viewportHeight = window.innerHeight;
        
        // Only trigger horizontal scroll when main section is fully visible (not just half)
        // Check if at least 80% of the section is visible
        const visibleHeight = Math.min(mainBottom, viewportHeight) - Math.max(mainTop, 0);
        const sectionHeight = mainRect.height;
        const visibilityRatio = visibleHeight / sectionHeight;
        
        if (mainTop <= 60 && mainBottom > 0 && visibilityRatio > 0.8) {
            // If scrolling up and at the start, allow vertical scroll
            if (e.deltaY < 0 && scrollLeft <= 0) {
                return; // Allow vertical scroll up
            }
            // If scrolling down and at the end, allow vertical scroll
            if (e.deltaY > 0 && scrollLeft >= maxScroll) {
                return; // Allow vertical scroll down
            }
            // Otherwise, do horizontal scroll
            e.preventDefault();
            container.scrollBy({
                left: e.deltaY * 2,
                behavior: 'auto'
            });
        }
        // Otherwise, allow normal vertical scrolling
    }, { passive: false });
}

// Smooth scroll animation for main section
function setupScrollAnimation() {
    const main = document.querySelector('main:not(.slider-main)');
    if (!main) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                main.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1
    });
    
    observer.observe(main);
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    setupHiddenPicture();
    // Start auto-slide
    autoSlideInterval = setInterval(autoSlide, 5000);
    // Setup scroll spy for navigation
    setupScrollSpy();
    // Setup horizontal scroll
    setupHorizontalScroll();
    // Setup scroll animation
    setupScrollAnimation();
    // Setup spotlight sections fade
    setupSpotlightFade();
    // Setup parallax effects
    setupParallax();
    // Add stagger animation to cards
    setupCardStagger();
});

// Scroll spy for navigation highlighting and smooth scroll with offset
function setupScrollSpy() {
    const sections = document.querySelectorAll('main:not(.slider-main) h2[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    const footerLinks = document.querySelectorAll('.footer-section a[href^="#"]');
    
    // Add click handlers to both nav links and footer links for proper offset
    const allLinks = [...navLinks, ...footerLinks];
    allLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href && href.startsWith('#')) {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    // Get the card that contains this section
                    const card = targetElement.closest('.scroll-card');
                    if (card) {
                        const container = document.getElementById('horizontalScroll');
                        if (container) {
                            // Scroll horizontally to the card
                            const cardLeft = card.offsetLeft;
                            container.scrollTo({
                                left: cardLeft - 50,
                                behavior: 'smooth'
                            });
                        }
                    }
                    
                    // Also scroll vertically to the main section with offset for header
                    const main = document.querySelector('main:not(.slider-main)');
                    if (main) {
                        const mainTop = main.offsetTop;
                        // Scroll to show the full section, accounting for sticky header
                        window.scrollTo({
                            top: mainTop - 100,
                            behavior: 'smooth'
                        });
                    }
                }
            }
        });
    });
    
    window.addEventListener('scroll', function() {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (window.scrollY >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    });
}

// Hidden picture prank effect
function setupHiddenPicture() {
    const hiddenPicture = document.querySelector('.hidden-picture');
    const hiddenLink = hiddenPicture.querySelector('a');
    let lastScrollTop = 0;
    let scrollTimeout;
    let isHovering = false;
    
    // Track hover state
    hiddenPicture.addEventListener('mouseenter', function() {
        isHovering = true;
    });
    
    hiddenPicture.addEventListener('mouseleave', function() {
        isHovering = false;
        hiddenPicture.classList.remove('reveal');
    });
    
    // Hide immediately when clicked
    hiddenLink.addEventListener('click', function() {
        hiddenPicture.classList.remove('reveal');
    });
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight;
        const clientHeight = document.documentElement.clientHeight;
        const scrolledToBottom = scrollTop + clientHeight >= scrollHeight - 5;
        
        // Check if user is at the bottom and trying to scroll further
        if (scrolledToBottom && scrollTop > lastScrollTop) {
            hiddenPicture.classList.add('reveal');
            
            // Clear previous timeout
            clearTimeout(scrollTimeout);
            
            // Hide the picture after user stops scrolling (unless hovering)
            scrollTimeout = setTimeout(function() {
                if (!isHovering) {
                    hiddenPicture.classList.remove('reveal');
                }
            }, 50);
        } else {
            if (!isHovering) {
                hiddenPicture.classList.remove('reveal');
            }
        }
        
        lastScrollTop = scrollTop;
    });
    
    // Handle wheel events for better desktop detection
    let wheelTimeout;
    window.addEventListener('wheel', function(e) {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight;
        const clientHeight = document.documentElement.clientHeight;
        const atBottom = scrollTop + clientHeight >= scrollHeight - 5;
        
        if (atBottom && e.deltaY > 0) {
            hiddenPicture.classList.add('reveal');
            
            clearTimeout(wheelTimeout);
            wheelTimeout = setTimeout(function() {
                hiddenPicture.classList.remove('reveal');
            }, 50);
        }
    });
    
    // Handle touch events for mobile overscroll
    let touchStartY = 0;
    let touchTimeout;
    
    document.addEventListener('touchstart', function(e) {
        touchStartY = e.touches[0].clientY;
    });
    
    document.addEventListener('touchmove', function(e) {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight;
        const clientHeight = document.documentElement.clientHeight;
        const atBottom = scrollTop + clientHeight >= scrollHeight - 5;
        const touchY = e.touches[0].clientY;
        const touchDiff = touchStartY - touchY;
        
        if (atBottom && touchDiff > 0) {
            hiddenPicture.classList.add('reveal');
            
            clearTimeout(touchTimeout);
            touchTimeout = setTimeout(function() {
                hiddenPicture.classList.remove('reveal');
            }, 50);
        }
    });
    
    document.addEventListener('touchend', function() {
        setTimeout(function() {
            hiddenPicture.classList.remove('reveal');
        }, 50);
    });
}

// Scroll-triggered fade animations for spotlight sections
function setupSpotlightFade() {
    const sections = document.querySelectorAll('.fade-section');
    
    // Set background images from data-bg attribute
    sections.forEach(section => {
        const bgUrl = section.getAttribute('data-bg');
        const bgElement = section.querySelector('.spotlight-bg');
        if (bgUrl && bgElement) {
            bgElement.style.backgroundImage = `url('${bgUrl}')`;
        }
    });
    
    // Create intersection observer for fade in/out effect
    const observerOptions = {
        threshold: [0, 0.2, 0.5, 0.8, 1],
        rootMargin: '-10% 0px -10% 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const section = entry.target;
            
            // Fade in when section is visible
            if (entry.isIntersecting && entry.intersectionRatio > 0.3) {
                section.classList.add('visible');
                section.classList.remove('fade-out');
            } 
            // Fade out when section is leaving viewport
            else if (!entry.isIntersecting || entry.intersectionRatio < 0.2) {
                section.classList.remove('visible');
                section.classList.add('fade-out');
            }
        });
    }, observerOptions);
    
    // Observe all spotlight sections
    sections.forEach(section => {
        observer.observe(section);
    });
    
    // Additional scroll listener for smoother transitions
    let lastScrollY = window.scrollY;
    let ticking = false;
    
    window.addEventListener('scroll', () => {
        lastScrollY = window.scrollY;
        
        if (!ticking) {
            window.requestAnimationFrame(() => {
                updateSectionStates(lastScrollY);
                ticking = false;
            });
            ticking = true;
        }
    });
    
    function updateSectionStates(scrollY) {
        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            const viewportHeight = window.innerHeight;
            const sectionMiddle = rect.top + rect.height / 2;
            const viewportMiddle = viewportHeight / 2;
            
            // Calculate distance from viewport center
            const distance = Math.abs(sectionMiddle - viewportMiddle);
            const maxDistance = viewportHeight;
            const proximity = 1 - Math.min(distance / maxDistance, 1);
            
            // Apply subtle scale and opacity based on proximity
            const bgElement = section.querySelector('.spotlight-bg');
            if (bgElement && section.classList.contains('visible')) {
                const scale = 1 + (0.1 * (1 - proximity));
                bgElement.style.transform = `scale(${scale})`;
            }
        });
    }
}

// Parallax effect for header only
function setupParallax() {
    let ticking = false;
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const scrolled = window.pageYOffset;
                const header = document.querySelector('.header');
                
                // Parallax for header
                if (header && scrolled < window.innerHeight) {
                    const opacity = 1 - (scrolled / window.innerHeight) * 0.3;
                    header.style.opacity = Math.max(opacity, 0.7);
                }
                
                ticking = false;
            });
            ticking = true;
        }
    });
}

// Stagger animation for scroll cards
function setupCardStagger() {
    const cards = document.querySelectorAll('.scroll-card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                entry.target.style.animationDelay = `${index * 0.1}s`;
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });
    
    cards.forEach(card => observer.observe(card));
}

