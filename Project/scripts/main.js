import { fetchBooks, displayBooks, addToFavorites } from './utils.js';

// DOM Elements
const featuredBooksContainer = document.getElementById('featured-books');

// Initialize featured books
async function initFeaturedBooks() {
    try {
        // Fetch books data
        const books = await fetchBooks();
        
        // Get first 3 books for featured section
        const featuredBooks = books.slice(0, 3);
        
        // Clear loading message
        featuredBooksContainer.innerHTML = '';
        
        // Display featured books
        displayBooks(featuredBooks, featuredBooksContainer, true);
        
        // Add event listeners to favorite buttons
        document.querySelectorAll('.favorite-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const bookId = parseInt(e.target.closest('.book-card').dataset.id);
                const book = books.find(b => b.id === bookId);
                addToFavorites(book);
                
                // Visual feedback
                e.target.innerHTML = '<i class="fas fa-heart"></i> Added!';
                e.target.style.backgroundColor = '#28a745';
                setTimeout(() => {
                    e.target.innerHTML = '<i class="fas fa-heart"></i> Favorite';
                    e.target.style.backgroundColor = '';
                }, 2000);
            });
        });
        
    } catch (error) {
        console.error('Error loading featured books:', error);
        featuredBooksContainer.innerHTML = '<p class="error">Error loading books. Please try again later.</p>';
    }
}

// Initialize hamburger menu
function initHamburgerMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navMobile = document.querySelector('.nav-mobile');
    
    if (hamburger && navMobile) {
        hamburger.addEventListener('click', () => {
            navMobile.classList.toggle('active');
            hamburger.classList.toggle('active');
            
            // Animate hamburger to X
            const bars = document.querySelectorAll('.bar');
            if (navMobile.classList.contains('active')) {
                bars[0].style.transform = 'rotate(-45deg) translate(-5px, 6px)';
                bars[1].style.opacity = '0';
                bars[2].style.transform = 'rotate(45deg) translate(-5px, -6px)';
            } else {
                bars[0].style.transform = 'none';
                bars[1].style.opacity = '1';
                bars[2].style.transform = 'none';
            }
        });
        
        // Close menu when clicking a link
        document.querySelectorAll('.nav-mobile a').forEach(link => {
            link.addEventListener('click', () => {
                navMobile.classList.remove('active');
                hamburger.classList.remove('active');
                bars.forEach(bar => {
                    bar.style.transform = 'none';
                    bar.style.opacity = '1';
                });
            });
        });
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initFeaturedBooks();
    initHamburgerMenu();
    
    // Update favorites count in header if on index page
    updateFavoritesCount();
});

// Update favorites count display
function updateFavoritesCount() {
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    const favoritesCount = document.getElementById('favorites-count');
    if (favoritesCount) {
        favoritesCount.textContent = `You have ${favorites.length} favorite book${favorites.length !== 1 ? 's' : ''}`;
    }
}

// Export for use in other modules
export { initFeaturedBooks, updateFavoritesCount };


//  Format date
function formatDate(date) {
    return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}