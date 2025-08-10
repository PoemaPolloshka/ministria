// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    // Splash screen
    const splash = document.getElementById('splash-screen');
    if (splash) {
        document.body.classList.add('splash-active');

        // Minimum time to display splash (ms)
        const splashDurationMs = 1200; // previously 2500

        // Helper: read CSS transition duration of the splash (handles 's' or 'ms')
        const getFadeDurationMs = () => {
            const durStr = getComputedStyle(splash).transitionDuration.split(',')[0].trim();
            const numeric = parseFloat(durStr);
            if (Number.isNaN(numeric)) return 500;
            return durStr.endsWith('ms') ? numeric : numeric * 1000;
        };

        setTimeout(() => {
            splash.classList.add('hidden');
            document.body.classList.remove('splash-active');
            // Remove from DOM after the fade finishes
            const fadeMs = getFadeDurationMs();
            setTimeout(() => splash.remove(), fadeMs + 50);
        }, splashDurationMs);
    }

    // Get elements
    const burgerMenu = document.getElementById('burger-menu');
    const mobileMenu = document.getElementById('mobile-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    // Burger menu toggle
    burgerMenu.addEventListener('click', function() {
        burgerMenu.classList.toggle('active');
        mobileMenu.classList.toggle('active');
    });

    // Smooth scrolling for navigation links
    function smoothScroll(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            const offsetTop = targetSection.offsetTop - 70; // Account for fixed navbar height
            
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
        
        // Close mobile menu if open
        if (mobileMenu.classList.contains('active')) {
            burgerMenu.classList.remove('active');
            mobileMenu.classList.remove('active');
        }
    }

    // Add smooth scrolling to all navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', smoothScroll);
    });

    mobileLinks.forEach(link => {
        link.addEventListener('click', smoothScroll);
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!burgerMenu.contains(e.target) && !mobileMenu.contains(e.target)) {
            burgerMenu.classList.remove('active');
            mobileMenu.classList.remove('active');
        }
    });

    // Close mobile menu on window resize if screen gets larger
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            burgerMenu.classList.remove('active');
            mobileMenu.classList.remove('active');
        }
    });

    // Add active state to navigation links based on scroll position
    window.addEventListener('scroll', function() {
        const sections = document.querySelectorAll('.section');
        const scrollPos = window.scrollY + 100; // Offset for fixed navbar

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                // Remove active class from all nav links
                navLinks.forEach(link => {
                    link.classList.remove('active');
                });
                
                // Add active class to current section's nav link
                const currentNavLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
                if (currentNavLink) {
                    currentNavLink.classList.add('active');
                }
            }
        });
    });

    // Carousel (clubs)
    const clubsCarousel = document.getElementById('clubs-carousel');
    if (clubsCarousel) {
        const track = clubsCarousel.querySelector('.carousel-track');
        const slides = Array.from(track.children);
        const dots = Array.from(clubsCarousel.querySelectorAll('.carousel-dot'));
        let currentIndex = 0;

        function updateDots() {
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentIndex);
            });
        }

        function goTo(index) {
            const total = slides.length;
            currentIndex = (index + total) % total;
            track.style.transform = `translateX(-${currentIndex * 100}%)`;
            updateDots();
        }

        function prev() { goTo(currentIndex - 1); }
        function next() { goTo(currentIndex + 1); }

        // Click anywhere: left half = prev, right half = next
        clubsCarousel.addEventListener('click', (e) => {
            // Skip if clicked on dot
            if (e.target.classList.contains('carousel-dot')) return;
            
            const rect = clubsCarousel.getBoundingClientRect();
            const x = e.clientX - rect.left;
            if (x > rect.width / 2) {
                next();
            } else {
                prev();
            }
        });

        // Dot click navigation
        dots.forEach((dot, index) => {
            dot.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevent carousel click
                goTo(index);
            });
        });

        // Touch swipe (for phones)
        let touchStartX = null;
        clubsCarousel.addEventListener('touchstart', (e) => {
            if (e.touches && e.touches.length > 0) {
                touchStartX = e.touches[0].clientX;
            }
        }, { passive: true });

        clubsCarousel.addEventListener('touchend', (e) => {
            if (touchStartX === null) return;
            const endX = e.changedTouches[0].clientX;
            const deltaX = endX - touchStartX;
            const threshold = 40; // px
            if (Math.abs(deltaX) > threshold) {
                if (deltaX < 0) next(); else prev();
            }
            touchStartX = null;
        });

        // Prevent image dragging
        slides.forEach(slide => {
            const img = slide.querySelector('img');
            if (img) {
                img.setAttribute('draggable', 'false');
            }
        });

        // Init
        goTo(0);
    }
}); 