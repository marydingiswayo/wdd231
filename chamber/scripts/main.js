// Main JavaScript file
document.addEventListener('DOMContentLoaded', function() {
    // Mobile Navigation Toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navList = document.querySelector('.nav-list');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            this.setAttribute('aria-expanded', !isExpanded);
            navList.classList.toggle('active');
        });
    }
    
    // Update copyright year
    document.getElementById('current-year').textContent = new Date().getFullYear();
    
    // Update last modified date
    document.getElementById('last-modified').textContent = document.lastModified;
    
    // Wayfinding - Highlight current page in nav
    const currentPage = location.pathname.split('/').pop();
    const navLinks = document.querySelectorAll('.nav-list a');
    
    navLinks.forEach(link => {
        const linkPage = link.getAttribute('href');
        if (currentPage === linkPage || (currentPage === '' && linkPage === 'index.html')) {
            link.classList.add('active');
            link.setAttribute('aria-current', 'page');
        } else {
            link.classList.remove('active');
            link.removeAttribute('aria-current');
        }
    });
});