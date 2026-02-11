// Fetch books from JSON file
export async function fetchBooks() {
    try {
        const response = await fetch('data/books.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const books = await response.json();
        return books;
    } catch (error) {
        console.error('Error fetching books:', error);
        throw error;
    }
}

// Display books in a container
export function displayBooks(books, container, isFeatured = false) {
    books.forEach(book => {
        const bookCard = createBookCard(book, isFeatured);
        container.appendChild(bookCard);
    });
}

// Create a book card element
export function createBookCard(book, isFeatured = false) {
    const bookCard = document.createElement('div');
    bookCard.className = 'book-card';
    bookCard.dataset.id = book.id;
    
    const bookCoverStyle = `background-color: ${book.coverColor};`;
    
    bookCard.innerHTML = `
        <div class="book-cover" style="${bookCoverStyle}">
            <i class="fas fa-book"></i>
        </div>
        <div class="book-info">
            <h3 class="book-title">${book.title}</h3>
            <p class="book-author">by ${book.author}</p>
            <span class="book-genre">${book.genre}</span>
            <p class="book-price">$${book.price.toFixed(2)}</p>
            <div class="book-actions">
                <button class="btn btn-secondary view-details-btn" data-id="${book.id}">
                    <i class="fas fa-info-circle"></i> Details
                </button>
                <button class="btn favorite-btn" data-id="${book.id}">
                    <i class="fas fa-heart"></i> Favorite
                </button>
            </div>
            ${isFeatured ? `<p class="book-description">${book.description.substring(0, 100)}...</p>` : ''}
        </div>
    `;
    
    return bookCard;
}

// Add book to favorites in localStorage
export function addToFavorites(book) {
    let favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    
    // Check if book is already in favorites
    if (!favorites.some(fav => fav.id === book.id)) {
        favorites.push(book);
        localStorage.setItem('favorites', JSON.stringify(favorites));
        
        // Dispatch custom event for favorites update
        window.dispatchEvent(new CustomEvent('favoritesUpdated'));
        return true;
    }
    return false;
}

// Remove book from favorites
export function removeFromFavorites(bookId) {
    let favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    favorites = favorites.filter(book => book.id !== bookId);
    localStorage.setItem('favorites', JSON.stringify(favorites));
    
    // Dispatch custom event for favorites update
    window.dispatchEvent(new CustomEvent('favoritesUpdated'));
}

// Get all favorites
export function getFavorites() {
    return JSON.parse(localStorage.getItem('favorites') || '[]');
}

// Clear all favorites
export function clearFavorites() {
    localStorage.removeItem('favorites');
    window.dispatchEvent(new CustomEvent('favoritesUpdated'));
}

// Format currency
export function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
}

// Debounce function for search
export function debounce(func, wait) {
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