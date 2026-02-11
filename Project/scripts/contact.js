// DOM Elements
const contactForm = document.getElementById('contactForm');

// Form validation
function validateForm(formData) {
    const errors = [];
    
    // Name validation
    if (!formData.get('name') || formData.get('name').trim().length < 2) {
        errors.push('Name must be at least 2 characters long');
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.get('email'))) {
        errors.push('Please enter a valid email address');
    }
    
    // Message validation
    if (!formData.get('message') || formData.get('message').trim().length < 10) {
        errors.push('Message must be at least 10 characters long');
    }
    
    return errors;
}

// Handle form submission
contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const formData = new FormData(contactForm);
    const errors = validateForm(formData);
    
    if (errors.length > 0) {
        alert('Please fix the following errors:\n\n' + errors.join('\n'));
        return;
    }
    
    // Store form data in localStorage before redirecting
    const formObject = {};
    for (let [key, value] of formData.entries()) {
        formObject[key] = value;
    }
    localStorage.setItem('lastContactForm', JSON.stringify(formObject));
    
    // Submit the form (will redirect to form-action.html)
    contactForm.submit();
});

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
document.addEventListener('DOMContentLoaded', initHamburgerMenu);