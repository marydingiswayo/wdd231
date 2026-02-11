import { fetchBooks, displayBooks, addToFavorites } from './utils.js';

// DOM Elements
const booksContainer = document.getElementById('books-container');
const searchInput = document.getElementById('searchInput');
const genreFilter = document.getElementById('genreFilter');
const paginationContainer = document.getElementById('pagination');

// State
let allBooks = [];
let filteredBooks = [];
let currentPage = 1;
const booksPerPage = 6;

// Initialize books page
async function initBooksPage() {
    try {
        // Fetch all books
        allBooks = await fetchBooks();
        filteredBooks = [...allBooks];
        
        // Display first page
        displayBooksPage();
        
        // Add event listeners
        searchInput.addEventListener('input', filterBooks);
        genreFilter.addEventListener('change', filterBooks);
        
        // Add event listeners to favorite buttons
        booksContainer.addEventListener('click', (e) => {
            if (e.target.closest('.favorite-btn')) {
                const bookCard = e.target.closest('.book-card');
                const bookId = parseInt(bookCard.dataset.id);
                const book = allBooks.find(b => b.id === bookId);
                
                if (book) {
                    addToFavorites(book);
                    
                    // Visual feedback
                    const button = e.target.closest('.favorite-btn');
                    button.innerHTML = '<i class="fas fa-heart"></i> Added!';
                    button.style.backgroundColor = '#28a745';
                    
                    setTimeout(() => {
                        button.innerHTML = '<i class="fas fa-heart"></i> Favorite';
                        button.style.backgroundColor = '';
                    }, 2000);
                }
            }
        });
        
    } catch (error) {
        console.error('Error loading books:', error);
        booksContainer.innerHTML = '<p class="error">Error loading books. Please try again later.</p>';
    }
}

// Filter books based on search and genre
function filterBooks() {
    const searchTerm = searchInput.value.toLowerCase();
    const selectedGenre = genreFilter.value;
    
    filteredBooks = allBooks.filter(book => {
        const matchesSearch = book.title.toLowerCase().includes(searchTerm) ||
                            book.author.toLowerCase().includes(searchTerm) ||
                            book.description.toLowerCase().includes(searchTerm);
        
        const matchesGenre = !selectedGenre || book.genre === selectedGenre;
        
        return matchesSearch && matchesGenre;
    });
    
    currentPage = 1;
    displayBooksPage();
}

// Display books for current page
function displayBooksPage() {
    // Calculate start and end indices
    const startIndex = (currentPage - 1) * booksPerPage;
    const endIndex = startIndex + booksPerPage;
    const booksToDisplay = filteredBooks.slice(startIndex, endIndex);
    
    // Clear container
    booksContainer.innerHTML = '';
    
    if (booksToDisplay.length === 0) {
        booksContainer.innerHTML = `
            <div class="empty-state" style="grid-column: 1 / -1;">
                <i class="fas fa-search"></i>
                <h3>No books found</h3>
                <p>Try adjusting your search or filter criteria</p>
            </div>
        `;
        paginationContainer.innerHTML = '';
        return;
    }
    
    // Display books
    displayBooks(booksToDisplay, booksContainer, false);
    
    // Display pagination
    displayPagination();
}

// Display pagination buttons
function displayPagination() {
    const totalPages = Math.ceil(filteredBooks.length / booksPerPage);
    
    if (totalPages <= 1) {
        paginationContainer.innerHTML = '';
        return;
    }
    
    let paginationHTML = '';
    
    // Previous button
    if (currentPage > 1) {
        paginationHTML += `
            <button class="page-btn prev-btn" data-page="${currentPage - 1}">
                <i class="fas fa-chevron-left"></i> Previous
            </button>
        `;
    }
    
    // Page numbers
    const maxPagesToShow = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
    
    if (endPage - startPage + 1 < maxPagesToShow) {
        startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
        paginationHTML += `
            <button class="page-btn ${i === currentPage ? 'active' : ''}" data-page="${i}">
                ${i}
            </button>
        `;
    }
    
    // Next button
    if (currentPage < totalPages) {
        paginationHTML += `
            <button class="page-btn next-btn" data-page="${currentPage + 1}">
                Next <i class="fas fa-chevron-right"></i>
            </button>
        `;
    }
    
    paginationContainer.innerHTML = paginationHTML;
    
    // Add event listeners to pagination buttons
    document.querySelectorAll('.page-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            currentPage = parseInt(e.target.closest('.page-btn').dataset.page);
            displayBooksPage();
            
            // Scroll to top of books section
            booksContainer.scrollIntoView({ behavior: 'smooth' });
        });
    });
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initBooksPage();
    initHamburgerMenu();
});

// Hamburger menu functionality (duplicated from main.js for this page)
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

export { initBooksPage };
