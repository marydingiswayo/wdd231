// discover.js - Specific functionality for Discover page

// Constants
const LAST_VISIT_KEY = 'chamber-last-visit';
const VISIT_MESSAGE_ID = 'visit-message';

// DOM Elements
let visitMessageEl;

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    visitMessageEl = document.getElementById(VISIT_MESSAGE_ID);
    
    // Load and display business cards from JSON
    loadBusinessCards();
    
    // Display visit message
    displayVisitMessage();
    
    // Set page load time
    setPageLoadTime();
    
    // Initialize lazy loading
    initLazyLoading();
});

// Load business cards from JSON file
async function loadBusinessCards() {
    try {
        const response = await fetch('data/businesses.json');
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const businesses = await response.json();
        displayBusinessCards(businesses);
    } catch (error) {
        console.error('Error loading business data:', error);
        // Fallback to sample data if JSON fails
        displayBusinessCards(getSampleBusinesses());
    }
}

// Display business cards
function displayBusinessCards(businesses) {
    const container = document.getElementById('business-cards');
    
    if (!container || !businesses || businesses.length === 0) {
        console.error('No business data to display');
        container.innerHTML = '<p class="no-data">No business data available at this time.</p>';
        return;
    }
    
    container.innerHTML = businesses.map((business, index) => `
        <article class="card" aria-labelledby="business-title-${index}">
            <picture>
                <source srcset="${business.image.replace('.webp', '-large.webp')}" media="(min-width: 1024px)">
                <source srcset="${business.image.replace('.webp', '-medium.webp')}" media="(min-width: 768px)">
                <img 
                    src="${business.image}" 
                    alt="${business.name} - ${business.category}" 
                    class="card-img" 
                    width="400" 
                    height="300"
                    loading="lazy"
                >
            </picture>
            <div class="card-content">
                <h3 id="business-title-${index}">${business.name}</h3>
                <p class="card-address">
                    <span aria-hidden="true">📍</span>
                    <span>${business.address}</span>
                </p>
                <p class="card-description">${business.description}</p>
            </div>
            <div class="card-actions">
                <button 
                    class="btn-learn-more" 
                    onclick="showBusinessDetails('${business.name.replace(/'/g, "\\'")}', ${index})"
                    aria-label="Learn more about ${business.name}"
                >
                    Learn More
                </button>
            </div>
        </article>
    `).join('');
}

// Sample business data (fallback)
function getSampleBusinesses() {
    return [
        {
            "name": "Green Valley Grocers",
            "address": "456 Market Street, Springfield",
            "description": "Family-owned grocery store specializing in organic produce and local products.",
            "image": "https://tse1.mm.bing.net/th/id/OIP.nzZJAUeIUCKAKiuhZ_UyBgHaFj?w=3600&h=2698&rs=1&pid=ImgDetMain&o=7&rm=3",
            "category": "Retail"
        },
        {
            "name": "Summit Tech Solutions",
            "address": "789 Tech Boulevard, Springfield",
            "description": "Full-service IT consulting and technology solutions for businesses.",
            "image": "https://tse3.mm.bing.net/th/id/OIP.U9ep_REewHfyWrQfCku1vgHaEm?w=926&h=576&rs=1&pid=ImgDetMain&o=7&rm=3",
            "category": "Technology"
        },
        {
            "name": "Heritage Bank",
            "address": "321 Main Street, Springfield",
            "description": "Community-focused banking with personal and business services.",
            "image": "https://tse4.mm.bing.net/th/id/OIP.OAlcb7uwPa9yadcfXEKqPgHaE8?w=6720&h=4480&rs=1&pid=ImgDetMain&o=7&rm=3",
            "category": "Finance"
        },
        {
            "name": "Springfield Medical Center",
            "address": "654 Health Avenue, Springfield",
            "description": "Comprehensive healthcare services for the Springfield community.",
            "image": "https://tse2.mm.bing.net/th/id/OIP.EurFavEE-eOA7CBxGctkRAHaE8?w=600&h=400&rs=1&pid=ImgDetMain&o=7&rm=3",
            "category": "Healthcare"
        },
        {
            "name": "Artisan Coffee Roasters",
            "address": "987 Brew Lane, Springfield",
            "description": "Specialty coffee shop featuring locally roasted beans and artisan pastries.",
            "image": "https://tse4.mm.bing.net/th/id/OIP.2zF4QFCDdWgUdEiO4tSJfgHaE7?w=5705&h=3803&rs=1&pid=ImgDetMain&o=7&rm=3",
            "category": "Food & Beverage"
        },
        {
            "name": "Precision Auto Care",
            "address": "147 Mechanic Street, Springfield",
            "description": "Professional automotive repair and maintenance services.",
            "image": "https://tse4.mm.bing.net/th/id/OIP.WfDHKp5L80Vd0ZWzdkkU7AHaE8?pid=ImgDet&w=178&h=118&c=7&dpr=1.5&o=7&rm=3",
            "category": "Automotive"
        },
        {
            "name": "Horizon Construction",
            "address": "258 Builders Road, Springfield",
            "description": "Residential and commercial construction with 30 years of experience.",
            "image": "https://tse3.mm.bing.net/th/id/OIP.zs32xrj0TVb_sB6Pz6LlgQHaE8?pid=ImgDet&w=178&h=118&c=7&dpr=1.5&o=7&rm=3",
            "category": "Construction"
        },
        {
            "name": "Creative Minds Design",
            "address": "369 Creative Avenue, Springfield",
            "description": "Graphic design and marketing agency helping businesses grow.",
            "image": "https://tse1.mm.bing.net/th/id/OIP.kSeCK2OmevES974fftWi6wHaEK?pid=ImgDet&w=178&h=99&c=7&dpr=1.5&o=7&rm=3",
            "category": "Marketing"
        }
    ];
}

// Display visit message using localStorage
function displayVisitMessage() {
    if (!visitMessageEl) return;
    
    const now = new Date();
    const lastVisit = localStorage.getItem(LAST_VISIT_KEY);
    
    let message = '';
    
    if (!lastVisit) {
        message = 'Welcome! Let us know if you have any questions.';
    } else {
        const lastVisitDate = new Date(parseInt(lastVisit));
        const timeDiff = now - lastVisitDate;
        const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
        
        if (daysDiff === 0) {
            message = 'Back so soon! Awesome!';
        } else if (daysDiff === 1) {
            message = 'You last visited 1 day ago.';
        } else {
            message = `You last visited ${daysDiff} days ago.`;
        }
    }
    
    visitMessageEl.innerHTML = `
        <div class="visit-message-inner">
            <p>${message}</p>
        </div>
    `;
    
    // Store current visit
    localStorage.setItem(LAST_VISIT_KEY, now.getTime().toString());
}

// Show business details
function showBusinessDetails(businessName, index) {
    alert(`Details for ${businessName}\n\nThis would typically open a modal or navigate to a detailed view with:\n- Complete contact information\n- Hours of operation\n- Services offered\n- Customer reviews\n- Map location\n\nIn a production application, this would be implemented with a modal dialog.`);
    
    // Track user interaction (optional)
    console.log(`User clicked on ${businessName} (card ${index + 1})`);
}

// Set page load time
function setPageLoadTime() {
    const loadTime = window.performance.timing.domContentLoadedEventEnd - window.performance.timing.navigationStart;
    const loadTimeElement = document.getElementById('page-load-time');
    
    if (loadTimeElement && loadTime > 0) {
        loadTimeElement.textContent = `${loadTime}ms`;
    }
}

// Initialize lazy loading
function initLazyLoading() {
    if ('loading' in HTMLImageElement.prototype) {
        // Browser supports native lazy loading
        const images = document.querySelectorAll('img[loading="lazy"]');
        images.forEach(img => {
            img.addEventListener('load', function() {
                this.classList.add('loaded');
            });
        });
    } else {
        // Fallback for browsers that don't support lazy loading
        const lazyImages = [].slice.call(document.querySelectorAll('img[loading="lazy"]'));
        
        if ('IntersectionObserver' in window) {
            const lazyImageObserver = new IntersectionObserver(function(entries) {
                entries.forEach(function(entry) {
                    if (entry.isIntersecting) {
                        const lazyImage = entry.target;
                        lazyImage.src = lazyImage.dataset.src;
                        lazyImage.classList.remove('lazy');
                        lazyImageObserver.unobserve(lazyImage);
                    }
                });
            });
            
            lazyImages.forEach(function(lazyImage) {
                lazyImageObserver.observe(lazyImage);
            });
        } else {
            // Fallback for very old browsers
            lazyImages.forEach(function(lazyImage) {
                lazyImage.src = lazyImage.dataset.src;
            });
        }
    }
}

// Utility: Format date
function formatDate(date) {
    return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Utility: Calculate days between dates
function daysBetween(date1, date2) {
    const oneDay = 24 * 60 * 60 * 1000;
    return Math.round(Math.abs((date1 - date2) / oneDay));
}
