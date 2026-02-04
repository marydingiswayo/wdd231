// DOM Elements
const businessCardsContainer = document.getElementById('business-cards');
const visitMessage = document.getElementById('visit-message');
const currentYearSpan = document.getElementById('current-year');
const lastModifiedSpan = document.getElementById('last-modified');

// Load business data from JSON
async function loadBusinesses() {
    try {
        const response = await fetch('data/businesses.json');
        const businesses = await response.json();
        displayBusinesses(businesses);
    } catch (error) {
        console.error('Error loading businesses:', error);
        businessCardsContainer.innerHTML = '<p>Unable to load business information. Please try again later.</p>';
    }
}

// Create business cards
function displayBusinesses(businesses) {
    businessCardsContainer.innerHTML = '';
    
    businesses.forEach((business, index) => {
        const card = document.createElement('article');
        card.className = 'business-card';
        card.style.setProperty('--card-area', `card${index + 1}`);
        
        card.innerHTML = `
            <div class="business-image">
                <img 
                    src="images/businesses/${business.image}" 
                    alt="${business.name}" 
                    width="400" 
                    height="300"
                    loading="lazy"
                    onload="this.classList.add('loaded')"
                >
            </div>
            <div class="business-content">
                <h3>${business.name}</h3>
                <p class="address">📍 ${business.address}</p>
                <p class="description">${business.description}</p>
                <button class="learn-more" onclick="showBusinessDetails('${business.name}')">
                    Learn More
                </button>
            </div>
        `;
        
        businessCardsContainer.appendChild(card);
    });
}

// Business details modal
function showBusinessDetails(businessName) {
    alert(`More information about ${businessName} would be displayed here.\n\nIn a full implementation, this would open a detailed modal or redirect to the business's page.`);
}

// Visit tracking with localStorage
function trackVisits() {
    const lastVisit = localStorage.getItem('lastVisit');
    const now = new Date();
    const currentDate = now.toDateString();
    
    if (!lastVisit) {
        visitMessage.textContent = "Welcome! Let us know if you have any questions.";
    } else {
        const lastVisitDate = new Date(lastVisit);
        const timeDiff = now.getTime() - lastVisitDate.getTime();
        const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
        
        if (daysDiff === 0) {
            visitMessage.textContent = "Back so soon! Awesome!";
        } else if (daysDiff === 1) {
            visitMessage.textContent = "You last visited 1 day ago.";
        } else {
            visitMessage.textContent = `You last visited ${daysDiff} days ago.`;
        }
    }
    
    localStorage.setItem('lastVisit', currentDate);
}

// Responsive navigation
function setupNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        hamburger.textContent = navMenu.classList.contains('active') ? '✕' : '☰';
    });
    
    // Close menu when clicking a link
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            hamburger.textContent = '☰';
        });
    });
}

// Initialize lazy loading
function initLazyLoading() {
    const images = document.querySelectorAll('img[loading="lazy"]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src || img.src;
                observer.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Set footer information
function setupFooter() {
    currentYearSpan.textContent = new Date().getFullYear();
    lastModifiedSpan.textContent = document.lastModified;
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    loadBusinesses();
    trackVisits();
    setupNavigation();
    setupFooter();
    initLazyLoading();
});