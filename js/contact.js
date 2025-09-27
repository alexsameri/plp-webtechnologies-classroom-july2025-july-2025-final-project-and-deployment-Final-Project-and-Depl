/**
 * Contact page specific JavaScript
 * Handles form validation, submission, and contact interactions
 */

// ===== CONTACT FORM HANDLER =====
class ContactForm {
    constructor() {
        this.form = document.getElementById('contact-form');
        this.submitBtn = document.getElementById('submit-btn');
        this.successMessage = document.getElementById('form-success');
        
        this.validationRules = {
            name: {
                required: true,
                minLength: 2,
                pattern: /^[a-zA-Z\s]+$/
            },
            email: {
                required: true,
                pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
            },
            subject: {
                required: true
            },
            message: {
                required: true,
                minLength: 10
            }
        };
        
        this.init();
    }
    
    init() {
        if (!this.form) return;
        
        this.bindEvents();
        this.setupRealTimeValidation();
        this.enhanceFormFields();
    }
    
    bindEvents() {
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSubmit();
        });
        
        // Real-time validation
        const inputs = this.form.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearErrors(input));
        });
    }
    
    setupRealTimeValidation() {
        const emailInput = document.getElementById('email');
        const phoneInput = document.getElementById('phone');
        
        if (emailInput) {
            emailInput.addEventListener('input', () => {
                this.validateEmailFormat(emailInput);
            });
        }
        
        if (phoneInput) {
            phoneInput.addEventListener('input', (e) => {
                this.formatPhoneNumber(e.target);
            });
        }
    }
    
    enhanceFormFields() {
        // Add floating label effect
        const formGroups = this.form.querySelectorAll('.form-group');
        formGroups.forEach(group => {
            const input = group.querySelector('input, textarea, select');
            const label = group.querySelector('label');
            
            if (input && label) {
                input.addEventListener('focus', () => {
                    group.classList.add('focused');
                });
                
                input.addEventListener('blur', () => {
                    if (!input.value.trim()) {
                        group.classList.remove('focused');
                    }
                });
                
                // Check if field has value on load
                if (input.value.trim()) {
                    group.classList.add('focused');
                }
            }
        });
    }
    
    validateField(field) {
        const fieldName = field.name;
        const value = field.value.trim();
        const rules = this.validationRules[fieldName];
        
        if (!rules) return true;
        
        let isValid = true;
        let errorMessage = '';
        
        // Required validation
        if (rules.required && !value) {
            isValid = false;
            errorMessage = `${this.getFieldLabel(fieldName)} is required.`;
        }
        
        // Minimum length validation
        if (isValid && rules.minLength && value.length < rules.minLength) {
            isValid = false;
            errorMessage = `${this.getFieldLabel(fieldName)} must be at least ${rules.minLength} characters.`;
        }
        
        // Pattern validation
        if (isValid && rules.pattern && !rules.pattern.test(value)) {
            isValid = false;
            errorMessage = `Please enter a valid ${fieldName}.`;
        }
        
        this.displayFieldError(field, isValid ? '' : errorMessage);
        return isValid;
    }
    
    validateEmailFormat(emailInput) {
        const email = emailInput.value.trim();
        if (!email) return;
        
        const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        
        if (!isValid) {
            this.displayFieldError(emailInput, 'Please enter a valid email address.');
        } else {
            this.displayFieldError(emailInput, '');
        }
    }
    
    formatPhoneNumber(phoneInput) {
        let value = phoneInput.value.replace(/\D/g, '');
        
        if (value.length >= 6) {
            value = value.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
        } else if (value.length >= 3) {
            value = value.replace(/(\d{3})(\d{0,3})/, '($1) $2');
        }
        
        phoneInput.value = value;
    }
    
    displayFieldError(field, message) {
        const errorElement = document.getElementById(`${field.name}-error`);
        const formGroup = field.closest('.form-group');
        
        if (errorElement) {
            errorElement.textContent = message;
        }
        
        if (formGroup) {
            if (message) {
                formGroup.classList.add('error');
                field.setAttribute('aria-invalid', 'true');
            } else {
                formGroup.classList.remove('error');
                field.removeAttribute('aria-invalid');
            }
        }
    }
    
    clearErrors(field) {
        const formGroup = field.closest('.form-group');
        if (formGroup) {
            formGroup.classList.remove('error');
        }
        field.removeAttribute('aria-invalid');
    }
    
    getFieldLabel(fieldName) {
        const labelMap = {
            name: 'Name',
            email: 'Email',
            phone: 'Phone',
            subject: 'Subject',
            message: 'Message'
        };
        return labelMap[fieldName] || fieldName;
    }
    
    validateForm() {
        const requiredFields = this.form.querySelectorAll('input[required], textarea[required], select[required]');
        let isValid = true;
        
        requiredFields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });
        
        return isValid;
    }
    
    async handleSubmit() {
        if (!this.validateForm()) {
            this.showNotification('Please correct the errors above.', 'error');
            return;
        }
        
        this.setSubmitState('loading');
        
        try {
            // Simulate form submission (replace with actual API call)
            await this.submitForm();
            this.showSuccess();
        } catch (error) {
            this.showNotification('Failed to send message. Please try again.', 'error');
            console.error('Form submission error:', error);
        } finally {
            this.setSubmitState('default');
        }
    }
    
    async submitForm() {
        const formData = new FormData(this.form);
        const data = Object.fromEntries(formData.entries());
        
        // Simulate API call
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Simulate success/failure
                Math.random() > 0.1 ? resolve(data) : reject(new Error('Submission failed'));
            }, 2000);
        });
    }
    
    setSubmitState(state) {
        const btnText = this.submitBtn.querySelector('.btn-text');
        const btnLoading = this.submitBtn.querySelector('.btn-loading');
        
        switch (state) {
            case 'loading':
                this.submitBtn.disabled = true;
                btnText.style.display = 'none';
                btnLoading.style.display = 'inline-block';
                break;
            case 'default':
                this.submitBtn.disabled = false;
                btnText.style.display = 'inline-block';
                btnLoading.style.display = 'none';
                break;
        }
    }
    
    showSuccess() {
        this.form.style.display = 'none';
        this.successMessage.style.display = 'block';
        
        // Scroll to success message
        this.successMessage.scrollIntoView({ behavior: 'smooth' });
        
        // Reset form after delay
        setTimeout(() => {
            this.resetForm();
        }, 5000);
    }
    
    resetForm() {
        this.form.reset();
        this.form.style.display = 'block';
        this.successMessage.style.display = 'none';
        
        // Clear all validation states
        const formGroups = this.form.querySelectorAll('.form-group');
        formGroups.forEach(group => {
            group.classList.remove('error', 'focused');
        });
        
        const errorElements = this.form.querySelectorAll('.error-message');
        errorElements.forEach(element => {
            element.textContent = '';
        });
    }
    
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 4000);
    }
}

// ===== CONTACT INFO ANIMATIONS =====
class ContactAnimations {
    constructor() {
        this.init();
    }
    
    init() {
        this.setupContactMethodHovers();
        this.setupSocialButtonHovers();
        this.setupFormAnimations();
    }
    
    setupContactMethodHovers() {
        const contactMethods = document.querySelectorAll('.contact-method');
        
        contactMethods.forEach(method => {
            method.addEventListener('mouseenter', () => {
                const icon = method.querySelector('.contact-icon');
                if (icon) {
                    icon.style.transform = 'scale(1.2) rotate(5deg)';
                }
            });
            
            method.addEventListener('mouseleave', () => {
                const icon = method.querySelector('.contact-icon');
                if (icon) {
                    icon.style.transform = 'scale(1) rotate(0deg)';
                }
            });
        });
    }
    
    setupSocialButtonHovers() {
        const socialButtons = document.querySelectorAll('.social-btn');
        
        socialButtons.forEach(button => {
            button.addEventListener('mouseenter', () => {
                button.style.transform = 'translateY(-3px)';
            });
            
            button.addEventListener('mouseleave', () => {
                button.style.transform = 'translateY(0)';
            });
        });
    }
    
    setupFormAnimations() {
        const formGroups = document.querySelectorAll('.form-group');
        
        formGroups.forEach((group, index) => {
            group.style.animationDelay = `${index * 0.1}s`;
            group.classList.add('fade-in-up');
        });
    }
}

// ===== CONTACT MAP (Optional) =====
class ContactMap {
    constructor() {
        this.mapContainer = document.getElementById('contact-map');
        if (this.mapContainer) {
            this.initMap();
        }
    }
    
    initMap() {
        // Simple map placeholder - replace with actual map implementation
        this.mapContainer.innerHTML = `
            <div class="map-placeholder">
                <div class="map-marker">📍</div>
                <p>San Francisco, CA</p>
            </div>
        `;
    }
}

// ===== CONTACT FORM ANALYTICS =====
class ContactAnalytics {
    constructor() {
        this.trackFormInteractions();
    }
    
    trackFormInteractions() {
        const form = document.getElementById('contact-form');
        if (!form) return;
        
        // Track form start
        const inputs = form.querySelectorAll('input, textarea, select');
        let formStarted = false;
        
        inputs.forEach(input => {
            input.addEventListener('focus', () => {
                if (!formStarted) {
                    this.trackEvent('form_started');
                    formStarted = true;
                }
            });
        });
        
        // Track field completion
        inputs.forEach(input => {
            input.addEventListener('blur', () => {
                if (input.value.trim()) {
                    this.trackEvent('field_completed', { field: input.name });
                }
            });
        });
        
        // Track form submission
        form.addEventListener('submit', () => {
            this.trackEvent('form_submitted');
        });
    }
    
    trackEvent(eventName, data = {}) {
        // Replace with actual analytics implementation
        console.log('Analytics Event:', eventName, data);
        
        // Example: Google Analytics
        // if (typeof gtag !== 'undefined') {
        //     gtag('event', eventName, data);
        // }
    }
}

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    // Initialize contact page functionality
    new ContactForm();
    new ContactAnimations();
    new ContactMap();
    new ContactAnalytics();
    
    console.log('Contact page initialized successfully!');
});

// ===== CSS FOR CONTACT FEATURES =====
const contactStyles = `
    .form-group {
        position: relative;
        margin-bottom: 1.5rem;
    }
    
    .form-group.focused label {
        transform: translateY(-1.5rem) scale(0.875);
        color: var(--primary-color);
    }
    
    .form-group.error input,
    .form-group.error textarea,
    .form-group.error select {
        border-color: #ef4444;
    }
    
    .form-group label {
        position: absolute;
        top: 0.75rem;
        left: 1rem;
        color: var(--text-secondary);
        pointer-events: none;
        transition: all 0.3s ease;
        background: var(--bg-primary);
        padding: 0 0.25rem;
    }
    
    .form-group input,
    .form-group textarea,
    .form-group select {
        width: 100%;
        padding: 0.75rem 1rem;
        border: 2px solid var(--border-color);
        border-radius: 8px;
        background: var(--bg-primary);
        color: var(--text-primary);
        font-size: 1rem;
        transition: border-color 0.3s ease;
    }
    
    .form-group input:focus,
    .form-group textarea:focus,
    .form-group select:focus {
        outline: none;
        border-color: var(--primary-color);
    }
    
    .error-message {
        color: #ef4444;
        font-size: 0.875rem;
        margin-top: 0.25rem;
        display: block;
    }
    
    .checkbox-group {
        display: flex;
        align-items: center;
        gap: 0.75rem;
    }
    
    .checkbox-label {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        cursor: pointer;
        font-size: 0.875rem;
    }
    
    .checkmark {
        width: 20px;
        height: 20px;
        border: 2px solid var(--border-color);
        border-radius: 4px;
        position: relative;
        transition: all 0.3s ease;
    }
    
    .checkbox-label input:checked + .checkmark {
        background: var(--primary-color);
        border-color: var(--primary-color);
    }
    
    .checkbox-label input:checked + .checkmark::after {
        content: '✓';
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        color: white;
        font-size: 12px;
    }
    
    .checkbox-label input {
        display: none;
    }
    
    .submit-btn {
        position: relative;
        overflow: hidden;
    }
    
    .submit-btn:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }
    
    .form-success {
        text-align: center;
        padding: 3rem 2rem;
        background: var(--bg-secondary);
        border-radius: 12px;
        border: 2px solid #10b981;
    }
    
    .success-icon {
        font-size: 3rem;
        margin-bottom: 1rem;
    }
    
    .form-success h3 {
        color: #10b981;
        margin-bottom: 1rem;
    }
    
    .notification {
        position: fixed;
        top: 2rem;
        right: 2rem;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 2000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    }
    
    .notification.show {
        transform: translateX(0);
    }
    
    .notification-error {
        background: #ef4444;
    }
    
    .notification-success {
        background: #10b981;
    }
    
    .notification-info {
        background: var(--primary-color);
    }
    
    .contact-method {
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 1rem;
        border-radius: 8px;
        transition: all 0.3s ease;
        margin-bottom: 1rem;
    }
    
    .contact-method:hover {
        background: var(--bg-secondary);
    }
    
    .contact-icon {
        font-size: 1.5rem;
        transition: transform 0.3s ease;
    }
    
    .social-btn {
        display: inline-block;
        padding: 0.75rem 1.5rem;
        border-radius: 8px;
        text-decoration: none;
        font-weight: 500;
        transition: all 0.3s ease;
        border: 2px solid var(--border-color);
        color: var(--text-primary);
    }
    
    .social-btn:hover {
        border-color: var(--primary-color);
        color: var(--primary-color);
    }
    
    .map-placeholder {
        height: 300px;
        background: var(--bg-secondary);
        border-radius: 8px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        border: 2px dashed var(--border-color);
    }
    
    .map-marker {
        font-size: 3rem;
        margin-bottom: 1rem;
    }
`;

// Inject styles
const styleSheet = document.createElement('style');
styleSheet.textContent = contactStyles;
document.head.appendChild(styleSheet);