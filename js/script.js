document.addEventListener('DOMContentLoaded', function() {
    // Performance optimizations
    let isScrolling;
    const header = document.querySelector('header');
    
    // Scroll effect for header - optimized with requestAnimationFrame
    let ticking = false;
    window.addEventListener('scroll', function() {
        if (!ticking) {
            window.requestAnimationFrame(function() {
                if (window.scrollY > 10) {
                    header.classList.add('scrolled');
                } else {
                    header.classList.remove('scrolled');
                }
                ticking = false;
            });
            ticking = true;
        }
    });

    // Responsive Menu Toggle with enhanced animations and touch support
    const menuToggle = document.querySelector('.menu-toggle');
    const menuOverlay = document.querySelector('.menu-overlay');
    const nav = document.querySelector('nav .container');
    const menu = document.querySelector('.menu');
    
    // Variable to store the scroll position when menu is opened
    let savedScrollPosition = 0;
    
    if (nav && menu && menuToggle && menuOverlay) {
        // Function to toggle menu
        function toggleMenu() {
            const isActive = menuToggle.classList.contains('active');
            
            if (isActive) {
                closeMenu();
            } else {
                openMenu();
            }
        }
        
        // Function to open menu
        function openMenu() {
            // Save current scroll position before any changes
            savedScrollPosition = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
            
            menuToggle.classList.add('active');
            menu.classList.add('active');
            menuOverlay.classList.add('active');
            document.body.classList.add('menu-open');
            
            // Prevent body scroll while menu is open
            document.body.style.position = 'fixed';
            document.body.style.top = `-${savedScrollPosition}px`;
            document.body.style.width = '100%';
            
            // Add focus trap for accessibility
            menuToggle.focus();
        }
        
        // Function to close menu
        function closeMenu() {
            menuToggle.classList.remove('active');
            menu.classList.remove('active');
            menuOverlay.classList.remove('active');
            document.body.classList.remove('menu-open');
            
            // Restore body styles
            document.body.style.position = '';
            document.body.style.top = '';
            document.body.style.width = '';
            
            // Restore scroll position using the saved value
            window.scrollTo(0, savedScrollPosition);
        }
        
        // Handle menu toggle click
        menuToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            e.preventDefault();
            toggleMenu();
        });
        
        // Handle keyboard navigation for menu toggle
        menuToggle.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleMenu();
            }
        });
        
        // Handle overlay click to close menu
        menuOverlay.addEventListener('click', function() {
            closeMenu();
        });
        
        // Close menu when clicking outside - improved logic
        document.addEventListener('click', function(event) {
            if (menu.classList.contains('active') && 
                !event.target.closest('.menu') && 
                !event.target.closest('.menu-toggle')) {
                closeMenu();
            }
        });
        
        // Close menu when escape key is pressed
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && menu.classList.contains('active')) {
                closeMenu();
            }
        });
        
        // Event delegation for menu clicks - close menu when link is clicked
        menu.addEventListener('click', function(e) {
            if (e.target.tagName === 'A' && window.innerWidth <= 768) {
                closeMenu();
            }
        });
        
        // Enhanced resize handler with debouncing
        let resizeTimer;
        window.addEventListener('resize', function() {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(function() {
                if (window.innerWidth > 768 && menu.classList.contains('active')) {
                    closeMenu();
                }
            }, 100);
        });
        
        // Enhanced touch handling to prevent accidental menu activation
        let touchStartX = 0;
        let touchStartY = 0;
        let touchStartTime = 0;
        let isScrolling = false;
        
        // Prevent accidental menu activation from swipe gestures
        document.addEventListener('touchstart', function(e) {
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
            touchStartTime = Date.now();
            isScrolling = false;
        }, { passive: true });
        
        document.addEventListener('touchmove', function(e) {
            if (!menu.classList.contains('active')) {
                const touchCurrentX = e.touches[0].clientX;
                const touchCurrentY = e.touches[0].clientY;
                const deltaX = touchCurrentX - touchStartX;
                const deltaY = touchCurrentY - touchStartY;
                const absDeltaX = Math.abs(deltaX);
                const absDeltaY = Math.abs(deltaY);
                
                // Determine if this is a horizontal swipe or vertical scroll
                if (!isScrolling) {
                    isScrolling = absDeltaY > absDeltaX;
                }
                
                // If this is clearly a horizontal swipe from the right edge, prevent any interference
                if (absDeltaX > 30 && absDeltaX > absDeltaY && touchStartX > window.innerWidth - 50) {
                    // This is a horizontal swipe from the right edge, prevent any menu activation
                    e.preventDefault();
                }
            }
        }, { passive: false });
        
        // Add specific handling for the navigation area
        const headerElement = document.querySelector('header');
        if (headerElement) {
            headerElement.addEventListener('touchstart', function(e) {
                // Allow normal touch interactions within the header
                e.stopPropagation();
            }, { passive: true });
        }
    }

    // Enhanced image lazy loading with Intersection Observer
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const image = entry.target;
                    if (image.dataset.src) {
                        // Create a new image to preload
                        const img = new Image();
                        
                        // Set up load event before setting src
                        img.onload = function() {
                            // Once image is loaded, update the src and add loaded class
                            image.src = image.dataset.src;
                            image.classList.add('loaded');
                            image.removeAttribute('data-src');
                        };
                        
                        // Set the src to begin loading
                        img.src = image.dataset.src;
                    }
                    observer.unobserve(image);
                }
            });
        }, {
            rootMargin: '200px 0px', // Start loading images before they appear in viewport
            threshold: 0.01 // Trigger when even 1% of the element is visible
        });
        
        // Apply lazy loading to all images with data-src
        document.querySelectorAll('img[data-src]').forEach(img => {
            // Only observe images that aren't already loaded
            if (!img.classList.contains('loaded')) {
                imageObserver.observe(img);
            }
        });
    } else {
        // Fallback for browsers without IntersectionObserver
        document.querySelectorAll('img[data-src]').forEach(img => {
            img.src = img.dataset.src;
            img.classList.add('loaded');
        });
    }
    
    // Add animation to elements when they come into view - optimized for performance
    if ('IntersectionObserver' in window) {
        const animationObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Use requestAnimationFrame to optimize UI updates
                    requestAnimationFrame(() => {
                        entry.target.classList.add('animated');
                    });
                    animationObserver.unobserve(entry.target);
                }
            });
        }, {
            rootMargin: '0px',
            threshold: 0.1
        });
        
        document.querySelectorAll('.animate-on-scroll').forEach(element => {
            animationObserver.observe(element);
        });
    } else {
        // Fallback for browsers without IntersectionObserver
        document.querySelectorAll('.animate-on-scroll').forEach(element => {
            element.classList.add('animated');
        });
    }
});

// Load non-critical resources after page load
window.addEventListener('load', function() {
    // Preload remaining resources
    setTimeout(() => {
        // Load any deferred scripts or resources here
        
        // Initialize any non-critical features
        initializeNonCriticalFeatures();
    }, 100); // Small delay to ensure main content is interactive first
});

// Non-critical features initialization
function initializeNonCriticalFeatures() {
    // FAQ Accordion functionality - moved to non-critical
    const faqItems = document.querySelectorAll('.faq-item');
    
    if (faqItems.length > 0) {
        faqItems.forEach(item => {
            const question = item.querySelector('h3');
            const answer = item.querySelector('p');
            
            if (answer && question) {
                answer.style.display = 'none';
                
                question.addEventListener('click', () => {
                    const isOpen = answer.style.display === 'block';
                    question.classList.toggle('active', !isOpen);
                    
                    if (isOpen) {
                        answer.style.display = 'none';
                    } else {
                        answer.style.display = 'block';
                    }
                    
                    // Close other answers
                    faqItems.forEach(otherItem => {
                        if (otherItem !== item) {
                            const otherQuestion = otherItem.querySelector('h3');
                            const otherAnswer = otherItem.querySelector('p');
                            
                            if (otherAnswer && otherAnswer.style.display === 'block') {
                                otherQuestion.classList.remove('active');
                                otherAnswer.style.display = 'none';
                            }
                        }
                    });
                });
            }
        });
    }
    
    // Initialize share buttons if they exist
    const shareButtons = document.querySelectorAll('.social-share a');
    
    if (shareButtons.length > 0) {
        shareButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                
                const postTitle = document.querySelector('.post-header h1')?.textContent || document.title;
                const postUrl = window.location.href;
                
                let shareUrl;
                
                if (this.classList.contains('facebook')) {
                    shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(postUrl)}`;
                } else if (this.classList.contains('twitter')) {
                    shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(postTitle)}&url=${encodeURIComponent(postUrl)}`;
                } else if (this.classList.contains('linkedin')) {
                    shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(postUrl)}`;
                } else if (this.classList.contains('whatsapp')) {
                    shareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(postTitle + ' ' + postUrl)}`;
                } else if (this.classList.contains('telegram')) {
                    shareUrl = `https://t.me/share/url?url=${encodeURIComponent(postUrl)}&text=${encodeURIComponent(postTitle)}`;
                }
                
                if (shareUrl) {
                    window.open(shareUrl, '_blank', 'width=600,height=400');
                }
            });
        });
    }
}

// Cookie Consent Functionality
function initializeCookieConsent() {
    // Check if user has already made a choice
    const cookieConsent = localStorage.getItem('cookieConsent');
    
    if (!cookieConsent) {
        // Create cookie consent banner
        const cookieBanner = document.createElement('div');
        cookieBanner.id = 'cookie-consent-banner';
        cookieBanner.innerHTML = `
            <div class="cookie-consent-content">
                <div class="cookie-consent-text">
                    <h3><i class="fas fa-cookie-bite"></i> Cookie Notice</h3>
                    <p>We use cookies to enhance your browsing experience, serve personalized ads or content, and analyze our traffic. By clicking "Accept All", you consent to our use of cookies. <a href="https://awplcompany.in/cookie-policy.html" target="_blank">Learn more</a></p>
                </div>
                <div class="cookie-consent-buttons">
                    <button id="cookie-accept-all" class="btn primary-btn">
                        <i class="fas fa-check"></i> Accept All
                    </button>
                    <button id="cookie-accept-necessary" class="btn secondary-btn">
                        <i class="fas fa-cog"></i> NECESSARY ONLY
                    </button>
                    <button id="cookie-settings" class="btn tertiary-btn">
                        <i class="fas fa-sliders-h"></i> SETTINGS
                    </button>
                </div>
            </div>
        `;
        
        // Add styles for cookie banner
        const cookieStyles = document.createElement('style');
        cookieStyles.textContent = `
            #cookie-consent-banner {
                position: fixed;
                bottom: 0;
                left: 0;
                right: 0;
                background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
                color: white;
                padding: 20px;
                box-shadow: 0 -4px 20px rgba(0,0,0,0.3);
                z-index: 10000;
                transform: translateY(100%);
                transition: transform 0.3s ease-in-out;
                border-top: 3px solid #30c284;
            }
            
            #cookie-consent-banner.show {
                transform: translateY(0);
            }
            
            .cookie-consent-content {
                max-width: 1200px;
                margin: 0 auto;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                gap: 20px;
                text-align: center;
            }
            
            .cookie-consent-text {
                width: 100%;
                background: rgba(255, 255, 255, 0.05);
                padding: 16px;
                border-radius: 12px;
                border: 1px solid rgba(48, 194, 132, 0.2);
                max-width: 800px;
                margin: 0 auto;
            }
            
            .cookie-consent-text h3 {
                font-size: 1.2em;
                margin-bottom: 10px;
                background: linear-gradient(135deg, #30c284, #27a071);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
                font-weight: 600;
            }
            
            .cookie-consent-text p {
                font-size: 0.9em;
                line-height: 1.5;
                margin-bottom: 0;
                color: #ecf0f1;
            }
            
            .cookie-consent-text a {
                color: #30c284;
                font-weight: 500;
                text-decoration: none;
                border-bottom: 1px solid transparent;
                transition: all 0.3s ease;
            }
            
            .cookie-consent-text a:hover {
                border-bottom-color: #30c284;
            }
            
            .cookie-consent-buttons {
                display: grid;
                grid-template-columns: 1fr 1fr;
                grid-template-rows: auto auto;
                gap: 12px;
                flex-shrink: 0;
                justify-items: center;
                max-width: 400px;
                margin: 0 auto;
            }
            
            .cookie-consent-buttons .btn {
                padding: 12px 24px;
                border: none;
                border-radius: 8px;
                cursor: pointer;
                font-size: 0.9em;
                font-weight: 500;
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 8px;
                width: 100%;
                min-height: 48px;
                position: relative;
                overflow: hidden;
            }
            
            .cookie-consent-buttons .primary-btn {
                grid-column: 1 / -1;
                background: linear-gradient(135deg, #30c284 0%, #27a071 100%);
                color: white;
                box-shadow: 0 4px 15px rgba(48, 194, 132, 0.3);
                font-weight: 600;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                max-width: 280px;
                margin: 0 auto;
            }
            
            .cookie-consent-buttons .primary-btn:hover {
                background: linear-gradient(135deg, #27a071 0%, #1e8a5f 100%);
                transform: translateY(-2px);
                box-shadow: 0 6px 20px rgba(48, 194, 132, 0.4);
            }
            
            .cookie-consent-buttons .secondary-btn {
                background: linear-gradient(135deg, #95a5a6 0%, #7f8c8d 100%);
                color: white;
                box-shadow: 0 4px 15px rgba(149, 165, 166, 0.3);
                font-weight: 500;
            }
            
            .cookie-consent-buttons .secondary-btn:hover {
                background: linear-gradient(135deg, #7f8c8d 0%, #6c7b7d 100%);
                transform: translateY(-2px);
                box-shadow: 0 6px 20px rgba(149, 165, 166, 0.4);
            }
            
            .cookie-consent-buttons .tertiary-btn {
                background: rgba(255, 255, 255, 0.1);
                color: #ecf0f1;
                border: 2px solid rgba(236, 240, 241, 0.3);
                backdrop-filter: blur(10px);
                font-weight: 500;
            }
            
            .cookie-consent-buttons .tertiary-btn:hover {
                background: rgba(236, 240, 241, 0.2);
                border-color: rgba(236, 240, 241, 0.5);
                transform: translateY(-2px);
                box-shadow: 0 6px 20px rgba(236, 240, 241, 0.2);
            }
            
            .cookie-consent-buttons .btn::before {
                content: '';
                position: absolute;
                top: 0;
                left: -100%;
                width: 100%;
                height: 100%;
                background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
                transition: left 0.5s;
            }
            
            .cookie-consent-buttons .btn:hover::before {
                left: 100%;
            }
            
            .cookie-consent-buttons .btn i {
                margin-right: 8px;
                font-size: 1em;
            }
                #cookie-consent-banner {
                    padding: 20px 16px;
                    border-top: 3px solid #30c284;
                    background: linear-gradient(135deg, #1a252f 0%, #2c3e50 50%, #34495e 100%);
                    box-shadow: 0 -8px 32px rgba(0,0,0,0.4), 0 0 0 1px rgba(48, 194, 132, 0.2);
                    backdrop-filter: blur(10px);
                }
                
                .cookie-consent-content {
                    flex-direction: column;
                    text-align: center;
                    gap: 20px;
                    max-width: 100%;
                }
            }
            
            @media (max-width: 480px) {
                #cookie-consent-banner {
                    padding: 18px 14px;
                    left: 10px;
                    right: 10px;
                    bottom: 10px;
                    border-radius: 16px;
                    border-top: 3px solid #30c284;
                }
                
                .cookie-consent-content {
                    gap: 18px;
                }
                
                .cookie-consent-text {
                    padding: 14px;
                    border-radius: 10px;
                }
                
                .cookie-consent-text h3 {
                    font-size: 1.1em;
                    margin-bottom: 8px;
                }
                
                .cookie-consent-text p {
                    font-size: 0.85em;
                    line-height: 1.4;
                }
                
                .cookie-consent-buttons {
                    gap: 10px;
                    max-width: 360px;
                    margin: 0 auto;
                }
                
                .cookie-consent-buttons .btn {
                    font-size: 0.85em;
                    padding: 12px 22px;
                    min-height: 46px;
                    border-radius: 10px;
                    width: 100%;
                    min-width: 160px;
                }
                
                .cookie-consent-buttons .btn i {
                    font-size: 0.9em;
                    margin-right: 6px;
                }
            }
            
            @media (max-width: 360px) {
                #cookie-consent-banner {
                    padding: 16px 12px;
                    left: 8px;
                    right: 8px;
                    bottom: 8px;
                    border-radius: 14px;
                }
                
                .cookie-consent-content {
                    gap: 16px;
                }
                
                .cookie-consent-text {
                    padding: 12px;
                    border-radius: 8px;
                }
                
                .cookie-consent-text h3 {
                    font-size: 1em;
                    margin-bottom: 6px;
                }
                
                .cookie-consent-text p {
                    font-size: 0.8em;
                    line-height: 1.3;
                }
                
                .cookie-consent-buttons {
                    gap: 8px;
                    grid-template-columns: 1fr;
                    grid-template-rows: auto auto auto;
                    max-width: 320px;
                    margin: 0 auto;
                }
                
                .cookie-consent-buttons .primary-btn {
                    grid-column: 1;
                }
                
                .cookie-consent-buttons .btn {
                    font-size: 0.8em;
                    padding: 10px 20px;
                    min-height: 44px;
                    border-radius: 8px;
                    width: 100%;
                    min-width: 200px;
                }
                
                .cookie-consent-buttons .btn i {
                    font-size: 0.85em;
                    margin-right: 5px;
                }
            }
        `;
        
        document.head.appendChild(cookieStyles);
        document.body.appendChild(cookieBanner);
        
        // Show banner with animation
        setTimeout(() => {
            cookieBanner.classList.add('show');
        }, 1000);
        
        // Handle button clicks
        document.getElementById('cookie-accept-all').addEventListener('click', function() {
            localStorage.setItem('cookieConsent', 'all');
            localStorage.setItem('cookieConsentDate', new Date().toISOString());
            hideCookieBanner();
            enableAllCookies();
        });
        
        document.getElementById('cookie-accept-necessary').addEventListener('click', function() {
            localStorage.setItem('cookieConsent', 'necessary');
            localStorage.setItem('cookieConsentDate', new Date().toISOString());
            hideCookieBanner();
            enableNecessaryCookies();
        });
        
        document.getElementById('cookie-settings').addEventListener('click', function() {
            window.open('cookie-policy.html', '_blank');
        });
        
        function hideCookieBanner() {
            cookieBanner.classList.remove('show');
            setTimeout(() => {
                cookieBanner.remove();
            }, 300);
        }
    } else {
        // User has already made a choice, apply their preferences
        if (cookieConsent === 'all') {
            enableAllCookies();
        } else {
            enableNecessaryCookies();
        }
    }
}

function enableAllCookies() {
    // Enable other tracking cookies as needed (Google Analytics removed)
    console.log('All cookies enabled');
}

function enableNecessaryCookies() {
    // Only enable essential cookies
    console.log('Only necessary cookies enabled');
}

// Preload critical resources
window.addEventListener('load', function() {
    // Initialize cookie consent
    initializeCookieConsent();
    
    // Preconnect to external domains
    const domains = ['https://cdnjs.cloudflare.com', 'https://fonts.googleapis.com'];
    
    domains.forEach(domain => {
        const link = document.createElement('link');
        link.rel = 'preconnect';
        link.href = domain;
        document.head.appendChild(link);
    });
});