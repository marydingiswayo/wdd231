import { fetchBooks } from './utils.js';

// DOM Elements
const modal = document.getElementById('bookModal');
const closeModalBtn = document.querySelector('.close-modal');

// Initialize modal
function initModal() {
    // Close modal when clicking X
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeModal);
    }
    
    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    // Close modal with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });
    
    // Add event listeners to view details buttons
    document.addEventListener('click', async (e) => {
        if (e.target.closest('.view-details-btn')) {
            const bookId = parseInt(e.target.closest('.view-details-btn').dataset.id);
            await showBookDetails(bookId);
        }
    });
}

// Show book details in modal
async function showBookDetails(bookId) {
    try {
        const books = await fetchBooks();
        const book = books.find(b => b.id === bookId);
        
        if (book) {
            const modalBody = document.getElementById('modal-body');
            modalBody.innerHTML = `
                <div class="modal-book">
                    <div class="modal-book-cover" style="background-color: ${book.coverColor};">
                        <i class="fas fa-book"></i>
                    </div>
                    <div class="modal-book-info">
                        <h2>${book.title}</h2>
                        <p class="modal-author">by ${book.author}</p>
                        <div class="modal-meta">
                            <span class="modal-genre">${book.genre}</span>
                            <span class="modal-year">${book.year}</span>
                            <span class="modal-pages">${book.pages} pages</span>
                            <span class="modal-rating">
                                <i class="fas fa-star"></i> ${book.rating}/5
                            </span>
                        </div>
                        <p class="modal-price">$${book.price.toFixed(2)}</p>
                        <p class="modal-description">${book.description}</p>
                        <button class="btn btn-primary add-to-favorites-modal" data-id="${book.id}">
                            <i class="fas fa-heart"></i> Add to Favorites
                        </button>
                    </div>
                </div>
            `;
            
            openModal();
            
            // Add event listener to modal favorite button
            const favBtn = document.querySelector('.add-to-favorites-modal');
            favBtn.addEventListener('click', () => {
                // Import addToFavorites function dynamically
                import('./utils.js').then(module => {
                    module.addToFavorites(book);
                    favBtn.innerHTML = '<i class="fas fa-heart"></i> Added!';
                    favBtn.style.backgroundColor = '#28a745';
                    
                    setTimeout(() => {
                        favBtn.innerHTML = '<i class="fas fa-heart"></i> Add to Favorites';
                        favBtn.style.backgroundColor = '';
                    }, 2000);
                });
            });
        }
    } catch (error) {
        console.error('Error loading book details:', error);
        const modalBody = document.getElementById('modal-body');
        modalBody.innerHTML = '<p>Error loading book details. Please try again.</p>';
        openModal();
    }
}

// Open modal
function openModal() {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent scrolling
}

// Close modal
function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = 'auto'; // Re-enable scrolling
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initModal);

export { initModal, openModal, closeModal, showBookDetails };


//  Format date
function formatDate(date) {
    return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}