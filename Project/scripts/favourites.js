import { getFavorites, clearFavorites, removeFromFavorites, createBookCard } from './utils.js';

// DOM Elements
const favoritesContainer = document.getElementById('favorites-container');
const favoritesCount = document.getElementById('favorites-count');
const clearFavoritesBtn = document.getElementById('clear-favorites');
const emptyState = document.getElementById('empty-state');

// Initialize favorites page
function initFavoritesPage() {
    updateFavoritesDisplay();
    
    // Add event listener to clear button
    if (clearFavoritesBtn) {
        clearFavoritesBtn.addEventListener('click', () => {
            if (confirm('Are you sure you want to clear all favorites?')) {
                clearFavorites();
                updateFavoritesDisplay();
            }
        });
    }
    
    // Listen for favorites updates from other pages
    window.addEventListener('favoritesUpdated', updateFavoritesDisplay);
}

// Update favorites display
function updateFavoritesDisplay() {
    const favorites = getFavorites();
    
    // Update count
    if (favoritesCount) {
        favoritesCount.textContent = `You have ${favorites.length} favorite book${favorites.length !== 1 ? 's' : ''}`;
    }
    
    // Clear container
    favoritesContainer.innerHTML = '';
    
    if (favorites.length === 0) {
        // Show empty state
        emptyState.style.display = 'block';
        favoritesContainer.appendChild(emptyState);
        return;
    }
    
    // Hide empty state
    emptyState.style.display = 'none';
    
    // Display favorites
    favorites.forEach(book => {
        const bookCard = createBookCard(book, false);
        
        // Modify the card for favorites page
        const removeBtn = document.createElement('button');
        removeBtn.className = 'btn btn-secondary remove-btn';
        removeBtn.innerHTML = '<i class="fas fa-trash"></i> Remove';
        removeBtn.style.marginTop = '10px';
        removeBtn.addEventListener('click', () => {
            removeFromFavorites(book.id);
            bookCard.remove();
            updateFavoritesDisplay();
        });
        
        bookCard.querySelector('.book-actions').appendChild(removeBtn);
        favoritesContainer.appendChild(bookCard);
    });
}

// Hamburger menu functionality
function initHamburgerMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navMobile = document.querySelector('.nav-mobile');
    
    if (hamburger && navMobile) {
        hamburger.addEventListener('click', () => {
            navMobile.classList.toggle('active');
            hamburger.classList.toggle('active');
            
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
    initFavoritesPage();
    initHamburgerMenu();
});

export { initFavoritesPage };