/**
 * Portfolio page specific JavaScript
 * Handles project filtering and portfolio interactions
 */

// ===== PORTFOLIO FILTERING =====
class PortfolioFilter {
    constructor() {
        this.filterButtons = document.querySelectorAll('.filter-btn');
        this.projectItems = document.querySelectorAll('.project-item');
        this.projectsContainer = document.getElementById('projects-container');
        
        this.init();
    }
    
    init() {
        if (this.filterButtons.length === 0 || this.projectItems.length === 0) {
            return;
        }
        
        this.bindEvents();
        this.setupProjectOverlays();
    }
    
    bindEvents() {
        this.filterButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const filter = button.getAttribute('data-filter');
                this.filterProjects(filter);
                this.updateActiveButton(button);
            });
        });
    }
    
    filterProjects(filter) {
        this.projectItems.forEach((item, index) => {
            const category = item.getAttribute('data-category');
            const shouldShow = filter === 'all' || category === filter;
            
            if (shouldShow) {
                item.style.display = 'block';
                setTimeout(() => {
                    item.classList.add('aos-animate');
                }, index * 100);
            } else {
                item.classList.remove('aos-animate');
                setTimeout(() => {
                    item.style.display = 'none';
                }, 300);
            }
        });
        
        // Animate container
        if (this.projectsContainer) {
            this.projectsContainer.style.opacity = '0.7';
            setTimeout(() => {
                this.projectsContainer.style.opacity = '1';
            }, 300);
        }
    }
    
    updateActiveButton(activeButton) {
        this.filterButtons.forEach(button => {
            button.classList.remove('active');
        });
        activeButton.classList.add('active');
    }
    
    setupProjectOverlays() {
        this.projectItems.forEach(item => {
            const overlay = item.querySelector('.project-overlay');
            const image = item.querySelector('.project-image');
            
            if (overlay && image) {
                image.addEventListener('mouseenter', () => {
                    overlay.style.opacity = '1';
                });
                
                image.addEventListener('mouseleave', () => {
                    overlay.style.opacity = '0';
                });
            }
        });
    }
}

// ===== PROJECT MODAL =====
class ProjectModal {
    constructor() {
        this.modal = null;
        this.createModal();
        this.bindEvents();
    }
    
    createModal() {
        const modalHTML = `
            <div class="project-modal" id="project-modal">
                <div class="modal-overlay"></div>
                <div class="modal-content">
                    <button class="modal-close" aria-label="Close modal">&times;</button>
                    <div class="modal-body">
                        <div class="modal-image">
                            <img src="" alt="" id="modal-img">
                        </div>
                        <div class="modal-info">
                            <h2 id="modal-title"></h2>
                            <p id="modal-description"></p>
                            <div class="modal-tags" id="modal-tags"></div>
                            <div class="modal-links">
                                <a href="#" class="btn btn-primary" id="modal-live-link" target="_blank">View Live</a>
                                <a href="#" class="btn btn-secondary" id="modal-code-link" target="_blank">View Code</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        this.modal = document.getElementById('project-modal');
    }
    
    bindEvents() {
        // Open modal when project is clicked
        document.addEventListener('click', (e) => {
            if (e.target.closest('.project-card')) {
                e.preventDefault();
                const projectCard = e.target.closest('.project-card');
                this.openModal(projectCard);
            }
        });
        
        // Close modal events
        if (this.modal) {
            const closeBtn = this.modal.querySelector('.modal-close');
            const overlay = this.modal.querySelector('.modal-overlay');
            
            closeBtn.addEventListener('click', () => this.closeModal());
            overlay.addEventListener('click', () => this.closeModal());
            
            // Close on Escape key
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && this.modal.classList.contains('active')) {
                    this.closeModal();
                }
            });
        }
    }
    
    openModal(projectCard) {
        const title = projectCard.querySelector('h3').textContent;
        const description = projectCard.querySelector('p').textContent;
        const tags = Array.from(projectCard.querySelectorAll('.tag')).map(tag => tag.textContent);
        
        // Update modal content
        document.getElementById('modal-title').textContent = title;
        document.getElementById('modal-description').textContent = description;
        
        const modalTags = document.getElementById('modal-tags');
        modalTags.innerHTML = tags.map(tag => `<span class="tag">${tag}</span>`).join('');
        
        // Show modal
        this.modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Focus management
        const closeBtn = this.modal.querySelector('.modal-close');
        closeBtn.focus();
    }
    
    closeModal() {
        this.modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// ===== PROJECT ANIMATIONS =====
class ProjectAnimations {
    constructor() {
        this.init();
    }
    
    init() {
        this.setupHoverEffects();
        this.setupScrollAnimations();
    }
    
    setupHoverEffects() {
        const projectCards = document.querySelectorAll('.project-card');
        
        projectCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                this.animateCard(card, 'enter');
            });
            
            card.addEventListener('mouseleave', () => {
                this.animateCard(card, 'leave');
            });
        });
    }
    
    animateCard(card, action) {
        const image = card.querySelector('.project-image');
        const content = card.querySelector('.project-info');
        
        if (action === 'enter') {
            card.style.transform = 'translateY(-10px)';
            if (image) image.style.transform = 'scale(1.05)';
            if (content) content.style.transform = 'translateY(-5px)';
        } else {
            card.style.transform = 'translateY(0)';
            if (image) image.style.transform = 'scale(1)';
            if (content) content.style.transform = 'translateY(0)';
        }
    }
    
    setupScrollAnimations() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, { threshold: 0.1 });
        
        const projectItems = document.querySelectorAll('.project-item');
        projectItems.forEach(item => observer.observe(item));
    }
}

// ===== PORTFOLIO STATISTICS =====
class PortfolioStats {
    constructor() {
        this.stats = {
            totalProjects: 0,
            categories: {},
            technologies: {}
        };
        this.calculateStats();
        this.displayStats();
    }
    
    calculateStats() {
        const projects = document.querySelectorAll('.project-item');
        this.stats.totalProjects = projects.length;
        
        projects.forEach(project => {
            const category = project.getAttribute('data-category');
            const tags = project.querySelectorAll('.tag');
            
            // Count categories
            this.stats.categories[category] = (this.stats.categories[category] || 0) + 1;
            
            // Count technologies
            tags.forEach(tag => {
                const tech = tag.textContent;
                this.stats.technologies[tech] = (this.stats.technologies[tech] || 0) + 1;
            });
        });
    }
    
    displayStats() {
        // You can use this data to show statistics
        console.log('Portfolio Statistics:', this.stats);
        
        // Update filter button counts
        const filterButtons = document.querySelectorAll('.filter-btn');
        filterButtons.forEach(button => {
            const filter = button.getAttribute('data-filter');
            if (filter !== 'all' && this.stats.categories[filter]) {
                const count = this.stats.categories[filter];
                button.innerHTML += ` <span class="count">(${count})</span>`;
            }
        });
    }
}

// ===== PORTFOLIO SEARCH =====
class PortfolioSearch {
    constructor() {
        this.searchInput = null;
        this.createSearchInput();
        this.bindEvents();
    }
    
    createSearchInput() {
        const filterSection = document.querySelector('.portfolio-filter .container');
        if (!filterSection) return;
        
        const searchHTML = `
            <div class="search-container">
                <input type="text" id="portfolio-search" placeholder="Search projects..." class="search-input">
                <button class="search-clear" id="search-clear" style="display: none;">&times;</button>
            </div>
        `;
        
        filterSection.insertAdjacentHTML('beforeend', searchHTML);
        this.searchInput = document.getElementById('portfolio-search');
    }
    
    bindEvents() {
        if (!this.searchInput) return;
        
        const clearBtn = document.getElementById('search-clear');
        
        this.searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            this.searchProjects(query);
            
            clearBtn.style.display = query ? 'block' : 'none';
        });
        
        clearBtn.addEventListener('click', () => {
            this.searchInput.value = '';
            this.searchProjects('');
            clearBtn.style.display = 'none';
        });
    }
    
    searchProjects(query) {
        const projects = document.querySelectorAll('.project-item');
        
        projects.forEach(project => {
            const title = project.querySelector('h3').textContent.toLowerCase();
            const description = project.querySelector('p').textContent.toLowerCase();
            const tags = Array.from(project.querySelectorAll('.tag'))
                .map(tag => tag.textContent.toLowerCase())
                .join(' ');
            
            const searchText = `${title} ${description} ${tags}`;
            const matches = query === '' || searchText.includes(query);
            
            project.style.display = matches ? 'block' : 'none';
            
            if (matches) {
                project.classList.add('aos-animate');
            } else {
                project.classList.remove('aos-animate');
            }
        });
    }
}

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    // Initialize portfolio functionality
    new PortfolioFilter();
    new ProjectModal();
    new ProjectAnimations();
    new PortfolioStats();
    new PortfolioSearch();
    
    console.log('Portfolio page initialized successfully!');
});

// ===== CSS FOR PORTFOLIO FEATURES =====
const portfolioStyles = `
    .project-modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 2000;
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
    }
    
    .project-modal.active {
        opacity: 1;
        visibility: visible;
    }
    
    .modal-overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
    }
    
    .modal-content {
        position: relative;
        background: var(--bg-primary);
        border-radius: 12px;
        max-width: 800px;
        width: 90%;
        max-height: 90vh;
        overflow-y: auto;
        box-shadow: var(--shadow-heavy);
    }
    
    .modal-close {
        position: absolute;
        top: 1rem;
        right: 1rem;
        background: none;
        border: none;
        font-size: 2rem;
        cursor: pointer;
        color: var(--text-secondary);
        z-index: 1;
    }
    
    .modal-body {
        padding: 2rem;
    }
    
    .modal-image img {
        width: 100%;
        height: 300px;
        object-fit: cover;
        border-radius: 8px;
        margin-bottom: 1.5rem;
    }
    
    .modal-links {
        display: flex;
        gap: 1rem;
        margin-top: 1.5rem;
    }
    
    .search-container {
        position: relative;
        margin-top: 2rem;
        max-width: 400px;
        margin-left: auto;
        margin-right: auto;
    }
    
    .search-input {
        width: 100%;
        padding: 0.75rem 1rem;
        border: 2px solid var(--border-color);
        border-radius: 8px;
        background: var(--bg-primary);
        color: var(--text-primary);
        font-size: 1rem;
    }
    
    .search-clear {
        position: absolute;
        right: 0.5rem;
        top: 50%;
        transform: translateY(-50%);
        background: none;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
        color: var(--text-secondary);
    }
    
    .count {
        font-size: 0.875rem;
        opacity: 0.7;
    }
    
    .animate-in {
        animation: slideInUp 0.6s ease forwards;
    }
    
    @keyframes slideInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .project-overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        transition: opacity 0.3s ease;
    }
    
    .project-actions {
        display: flex;
        gap: 1rem;
    }
    
    .btn-icon {
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: var(--primary-color);
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        text-decoration: none;
        font-size: 1.25rem;
        transition: all 0.3s ease;
    }
    
    .btn-icon:hover {
        background: var(--primary-hover);
        transform: scale(1.1);
    }
`;

// Inject styles
const styleSheet = document.createElement('style');
styleSheet.textContent = portfolioStyles;
document.head.appendChild(styleSheet);