// DOM Ready
document.addEventListener('DOMContentLoaded', function() {
    // Set current year in footer
    document.getElementById('current-year').textContent = new Date().getFullYear();
    
    // Set last modified date
    document.getElementById('last-modified').textContent = document.lastModified;
    
    // Set hidden timestamp field
    const timestampField = document.getElementById('timestamp');
    timestampField.value = new Date().toISOString();
    
    // Mobile Navigation Toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.getElementById('nav-menu');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            this.setAttribute('aria-expanded', !isExpanded);
            navMenu.classList.toggle('active');
            
            // Animate hamburger to X
            const hamburger = this.querySelector('.hamburger');
            if (!isExpanded) {
                hamburger.style.transform = 'rotate(45deg)';
                hamburger.style.backgroundColor = '#0056b3';
                hamburger.before.style.transform = 'rotate(-45deg) translate(-5px, 6px)';
                hamburger.after.style.transform = 'rotate(-45deg) translate(-5px, -6px)';
            } else {
                hamburger.style.transform = 'rotate(0)';
                hamburger.style.backgroundColor = '';
                hamburger.before.style.transform = '';
                hamburger.after.style.transform = '';
            }
        });
    }
    
    // Modal functionality
    const modalButtons = document.querySelectorAll('.benefits-btn');
    const modals = document.querySelectorAll('.benefits-modal');
    const closeButtons = document.querySelectorAll('.close-modal');
    
    // Open modal
    modalButtons.forEach(button => {
        button.addEventListener('click', function() {
            const modalId = this.getAttribute('data-modal');
            const modal = document.getElementById(modalId);
            
            if (modal) {
                modal.showModal();
                
                // Add animation to modal content
                const modalContent = modal.querySelector('.modal-content');
                modalContent.style.animation = 'modalFadeIn 0.3s ease';
            }
        });
    });
    
    // Close modal with button
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const modal = this.closest('dialog');
            if (modal) {
                modal.close();
            }
        });
    });
    
    // Close modal when clicking outside
    modals.forEach(modal => {
        modal.addEventListener('click', function(event) {
            const rect = this.getBoundingClientRect();
            const isInDialog = (
                rect.top <= event.clientY &&
                event.clientY <= rect.top + rect.height &&
                rect.left <= event.clientX &&
                event.clientX <= rect.left + rect.width
            );
            
            if (!isInDialog) {
                this.close();
            }
        });
    });
    
    // Close modal with Escape key
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            modals.forEach(modal => {
                if (modal.open) {
                    modal.close();
                }
            });
        }
    });
    
    // Form validation
    const form = document.getElementById('membership-form');
    
    if (form) {
        // Real-time validation
        const inputs = form.querySelectorAll('input[required], textarea[required]');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });
            
            input.addEventListener('input', function() {
                clearError(this);
            });
        });
        
        // Form submission
        form.addEventListener('submit', function(event) {
            if (!validateForm()) {
                event.preventDefault();
                showFormError('Please correct the errors in the form.');
            } else {
                // Store form data in localStorage for thankyou page
                const formData = new FormData(form);
                const formObject = Object.fromEntries(formData);
                localStorage.setItem('membershipFormData', JSON.stringify(formObject));
            }
        });
        
        // Form reset
        form.addEventListener('reset', function() {
            clearAllErrors();
            // Reset timestamp
            timestampField.value = new Date().toISOString();
        });
    }
    
    // Card click animation
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.addEventListener('click', function() {
            this.style.transform = 'scale(0.98)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
    });
    
    // Helper functions
    function validateField(field) {
        const isValid = field.checkValidity();
        
        if (!isValid) {
            showError(field, getErrorMessage(field));
        } else {
            clearError(field);
        }
        
        return isValid;
    }
    
    function validateForm() {
        let isValid = true;
        const requiredFields = form.querySelectorAll('[required]');
        
        requiredFields.forEach(field => {
            if (!validateField(field)) {
                isValid = false;
            }
        });
        
        return isValid;
    }
    
    function showError(field, message) {
        clearError(field);
        
        const errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        errorElement.textContent = message;
        errorElement.style.color = 'var(--error-color)';
        errorElement.style.fontSize = 'var(--font-size-sm)';
        errorElement.style.marginTop = 'var(--spacing-xs)';
        
        field.parentNode.appendChild(errorElement);
        field.style.borderColor = 'var(--error-color)';
    }
    
    function clearError(field) {
        const errorElement = field.parentNode.querySelector('.error-message');
        if (errorElement) {
            errorElement.remove();
        }
        field.style.borderColor = '';
    }
    
    function clearAllErrors() {
        const errorElements = form.querySelectorAll('.error-message');
        errorElements.forEach(element => element.remove());
        
        const fields = form.querySelectorAll('input, textarea');
        fields.forEach(field => {
            field.style.borderColor = '';
        });
    }
    
    function showFormError(message) {
        // Remove existing form error
        const existingError = form.querySelector('.form-error');
        if (existingError) {
            existingError.remove();
        }
        
        // Create error element
        const errorElement = document.createElement('div');
        errorElement.className = 'form-error';
        errorElement.textContent = message;
        errorElement.style.backgroundColor = 'var(--error-color)';
        errorElement.style.color = 'white';
        errorElement.style.padding = 'var(--spacing-sm)';
        errorElement.style.borderRadius = 'var(--border-radius-sm)';
        errorElement.style.marginBottom = 'var(--spacing-md)';
        errorElement.style.textAlign = 'center';
        
        form.insertBefore(errorElement, form.firstChild);
        
        // Scroll to error
        errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    
    function getErrorMessage(field) {
        if (field.validity.valueMissing) {
            return 'This field is required.';
        }
        
        if (field.validity.typeMismatch) {
            if (field.type === 'email') {
                return 'Please enter a valid email address.';
            }
        }
        
        if (field.validity.patternMismatch) {
            if (field.id === 'title') {
                return 'Title must be at least 7 characters (letters, hyphens, spaces only).';
            }
            if (field.id === 'first-name' || field.id === 'last-name') {
                return 'Name must contain only letters and spaces.';
            }
        }
        
        if (field.validity.tooShort) {
            return `Minimum length is ${field.minLength} characters.`;
        }
        
        return 'Please enter a valid value.';
    }
    
    // Auto-format phone number
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 0) {
                value = '+1 (' + value.substring(0, 3) + ') ' + value.substring(3, 6) + '-' + value.substring(6, 10);
            }
            e.target.value = value.substring(0, 17); // Limit length
        });
    }
    
    // Membership level selection highlight
    const membershipRadios = form.querySelectorAll('input[name="membership-level"]');
    membershipRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            // Remove highlight from all cards
            cards.forEach(card => {
                card.style.boxShadow = '';
                card.style.border = '';
            });
            
            // Highlight selected card
            const selectedCard = document.querySelector(`.${this.value}-card`);
            if (selectedCard) {
                selectedCard.style.boxShadow = '0 0 0 3px var(--primary-color), var(--shadow-lg)';
                selectedCard.style.border = '2px solid var(--primary-color)';
                
                // Scroll to card
                selectedCard.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'center' 
                });
            }
        });
    });
});