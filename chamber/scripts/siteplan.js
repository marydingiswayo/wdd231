// Set current year and last modified - Simplified
function setPageMetadata() {
    const currentYear = document.getElementById('current-year');
    const lastModified = document.getElementById('last-modified');
    
    if (currentYear) {
        currentYear.textContent = new Date().getFullYear();
    }
    
    if (lastModified) {
        lastModified.textContent = document.lastModified;
    }
    
    // Remove page weight calculation during initial load
    // Calculate it separately if needed
}

// Responsive menu toggle - Optimized
function setupMenuToggle() {
    const menuToggle = document.getElementById('menu-toggle');
    const mainNav = document.getElementById('main-nav');
    
    if (menuToggle && mainNav) {
        // Use event delegation or single handler
        menuToggle.addEventListener('click', function() {
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            this.setAttribute('aria-expanded', !isExpanded);
            mainNav.classList.toggle('show');
        });
    }
}

// Lazy load images
function setupLazyLoading() {
    const lazyImages = document.querySelectorAll('.lazy-image');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy-image');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        lazyImages.forEach(img => imageObserver.observe(img));
    } else {
        // Fallback for older browsers
        lazyImages.forEach(img => {
            img.src = img.dataset.src;
        });
    }
}

// Debounce function for resize events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Initialize the page - Optimized
async function initDirectory() {
    console.log('Initializing Chamber Directory...');
    
    // Set page metadata
    setPageMetadata();
    
    // Setup menu toggle
    setupMenuToggle();
    
    // Setup view toggle
    setupViewToggle();
    
    // Load members
    const members = await getMembers();
    
    if (members && members.length > 0) {
        console.log(`Displaying ${members.length} members`);
        
        // Display in default view (grid)
        displayGrid(members);
        
        // Only prepare list view if needed
        if (listViewBtn) {
            displayList(members);
        }
        
        updateStats(members);
        
        // Setup lazy loading after content is loaded
        setTimeout(setupLazyLoading, 100);
    } else {
        console.warn('No members loaded');
    }
}

// Optimized event listener
document.addEventListener('DOMContentLoaded', () => {
    // RequestIdleCallback for non-critical initialization
    if ('requestIdleCallback' in window) {
        requestIdleCallback(() => {
            initDirectory();
        }, { timeout: 2000 });
    } else {
        // Fallback for browsers without requestIdleCallback
        setTimeout(initDirectory, 100);
    }
});

// Add CSS for better performance
const performanceStyles = `
    .hidden {
        display: none !important;
    }
    
    .lazy-image {
        opacity: 0;
        transition: opacity 0.3s;
    }
    
    .lazy-image.loaded {
        opacity: 1;
    }
    
    .member-card {
        will-change: transform;
    }
`;

// Inject performance CSS
const styleSheet = document.createElement("style");
styleSheet.textContent = performanceStyles;
document.head.appendChild(styleSheet);
