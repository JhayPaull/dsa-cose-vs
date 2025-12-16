/**
 * Slider Manager for E-Voting System
 * Handles the dynamic loading and management of slider content
 */

class SliderManager {
    constructor(containerId) {
        this.containerId = containerId;
        this.container = document.getElementById(containerId);
        this.sliderItems = [];
        this.currentIndex = 0;
    }

    /**
     * Initialize the slider
     */
    async init() {
        if (!this.container) {
            console.error(`Slider container with ID '${this.containerId}' not found.`);
            return;
        }

        // For static content (like in voter dashboard), we don't need to load items from Firebase
        if (this.containerId === 'featured-carousel') {
            // Set up carousel for static content
            this.setupStaticCarousel();
            return;
        }

        // Load slider items from Firebase for dynamic content
        await this.loadSliderItems();
        
        // Set up interval for automatic sliding
        this.startAutoSlide();
    }

    /**
     * Load slider items from Firebase
     */
    async loadSliderItems() {
        try {
            // Get token from localStorage
            const token = localStorage.getItem('token');
            
            const response = await fetch('/api/slider', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.ok) {
                // Try to parse JSON response
                try {
                    this.sliderItems = await response.json();
                } catch (jsonError) {
                    console.error('Failed to parse JSON response:', jsonError);
                    // Fallback to mock data if JSON parsing fails
                    this.sliderItems = [];
                }
            } else {
                console.error('Failed to fetch slider items:', response.status);
                // Try to get error message
                let errorMessage = 'Unknown error';
                try {
                    const errorData = await response.json();
                    errorMessage = errorData.error || errorMessage;
                } catch (jsonError) {
                    try {
                        errorMessage = await response.text();
                    } catch (textError) {
                        errorMessage = `HTTP Error: ${response.status}`;
                    }
                }
                console.error('Error message:', errorMessage);
                // Fallback to mock data if fetch fails
                this.sliderItems = [
                    {
                        id: 1,
                        title: "Upcoming Elections",
                        description: "Check out the upcoming student council elections",
                        imageUrl: "https://via.placeholder.com/800x400/800000/FFD700?text=Upcoming+Elections",
                        link: "/pages/elections/"
                    },
                    {
                        id: 2,
                        title: "Voting Guidelines",
                        description: "Review the voting guidelines and procedures",
                        imageUrl: "https://via.placeholder.com/800x400/FFD700/800000?text=Voting+Guidelines",
                        link: "/pages/voting-guidelines/"
                    },
                    {
                        id: 3,
                        title: "Results Announcement",
                        description: "Election results will be announced on December 30, 2025",
                        imageUrl: "https://via.placeholder.com/800x400/800000/FFD700?text=Results+Announcement",
                        link: "/pages/results/"
                    }
                ];
            }
        } catch (error) {
            console.error('Error loading slider items:', error);
            // Fallback to mock data if fetch fails
            this.sliderItems = [
                {
                    id: 1,
                    title: "Upcoming Elections",
                    description: "Check out the upcoming student council elections",
                    imageUrl: "https://via.placeholder.com/800x400/800000/FFD700?text=Upcoming+Elections",
                    link: "/pages/elections/"
                },
                {
                    id: 2,
                    title: "Voting Guidelines",
                    description: "Review the voting guidelines and procedures",
                    imageUrl: "https://via.placeholder.com/800x400/FFD700/800000?text=Voting+Guidelines",
                    link: "/pages/voting-guidelines/"
                },
                {
                    id: 3,
                    title: "Results Announcement",
                    description: "Election results will be announced on December 30, 2025",
                    imageUrl: "https://via.placeholder.com/800x400/800000/FFD700?text=Results+Announcement",
                    link: "/pages/results/"
                }
            ];
        }

        this.renderSlider();
    }

    /**
     * Render the slider HTML
     */
    renderSlider() {
        // For the voter dashboard, we use static content instead of dynamic loading
        // The HTML is already embedded in the page, so we don't need to generate it
        if (this.container.id === 'featured-carousel') {
            // Initialize carousel functionality for static content
            this.setupStaticCarousel();
            return;
        }

        if (this.sliderItems.length === 0) {
            this.container.innerHTML = `
                <div class="carousel-placeholder text-center p-5">
                    <p class="text-muted mb-3">No featured content available yet.</p>
                    <a href="/pages/admin/edit-slider/" class="btn btn-gold">
                        <i class="fas fa-plus-circle me-2"></i>Add Featured Content
                    </a>
                </div>
            `;
            return;
        }

        let sliderHtml = `
            <div class="featured-carousel position-relative">
                <div class="carousel-inner">
        `;

        this.sliderItems.forEach((item, index) => {
            const isActive = index === 0 ? 'active' : '';
            sliderHtml += `
                <div class="carousel-item ${isActive}" data-index="${index}">
                    <img src="${item.imageUrl}" alt="${item.title}" class="carousel-img w-100">
                    <div class="carousel-caption position-absolute bottom-0 start-0 w-100 p-4 text-white">
                        <h3 class="carousel-title">${item.title}</h3>
                        <p class="carousel-description">${item.description}</p>
                        ${item.link ? `<a href="${item.link}" class="btn btn-gold">Learn More</a>` : ''}
                    </div>
                </div>
            `;
        });

        sliderHtml += `
                </div>
                <!-- Carousel Controls -->
                <button class="carousel-btn prev-btn" onclick="sliderManager.prevSlide()" aria-label="Previous">
                    <i class="fas fa-chevron-left"></i>
                </button>
                <button class="carousel-btn next-btn" onclick="sliderManager.nextSlide()" aria-label="Next">
                    <i class="fas fa-chevron-right"></i>
                </button>
                
                <!-- Carousel Indicators -->
                <div class="carousel-indicators position-absolute bottom-0 start-50 translate-middle-x mb-3">
        `;

        this.sliderItems.forEach((_, index) => {
            const isActive = index === 0 ? 'active' : '';
            sliderHtml += `
                <button class="carousel-indicator ${isActive}" data-index="${index}" onclick="sliderManager.goToSlide(${index})"></button>
            `;
        });

        sliderHtml += `
                </div>
            </div>
        `;

        this.container.innerHTML = sliderHtml;
    }

    /**
     * Move to the next slide
     */
    nextSlide() {
        // Handle both dynamic and static carousels
        const totalItems = this.sliderItems ? this.sliderItems.length : (this.carouselItems ? this.carouselItems.length : 0);
        if (totalItems === 0) return;
        
        this.currentIndex = (this.currentIndex + 1) % totalItems;
        this.updateSlider();
    }

    /**
     * Move to the previous slide
     */
    prevSlide() {
        // Handle both dynamic and static carousels
        const totalItems = this.sliderItems ? this.sliderItems.length : (this.carouselItems ? this.carouselItems.length : 0);
        if (totalItems === 0) return;
        
        this.currentIndex = (this.currentIndex - 1 + totalItems) % totalItems;
        this.updateSlider();
    }

    /**
     * Go to a specific slide
     */
    goToSlide(index) {
        // Handle both dynamic and static carousels
        const totalItems = this.sliderItems ? this.sliderItems.length : (this.carouselItems ? this.carouselItems.length : 0);
        if (totalItems === 0 || index >= totalItems || index < 0) return;
        
        this.currentIndex = index;
        this.updateSlider();
    }

    /**
     * Update the slider display
     */
    updateSlider() {
        // Handle both dynamic and static carousels
        const slides = this.container.querySelectorAll('.carousel-item');
        const indicators = this.container.querySelectorAll('.carousel-indicator');

        // Update slides
        slides.forEach((slide, index) => {
            if (index === this.currentIndex) {
                slide.classList.add('active');
            } else {
                slide.classList.remove('active');
            }
        });

        // Update indicators (only if they exist)
        if (indicators.length > 0) {
            indicators.forEach((indicator, index) => {
                if (index === this.currentIndex) {
                    indicator.classList.add('active');
                } else {
                    indicator.classList.remove('active');
                }
            });
        }
    }

    /**
     * Start automatic sliding
     */
    startAutoSlide() {
        // Only start auto sliding if we have more than one item
        const totalItems = this.sliderItems ? this.sliderItems.length : (this.carouselItems ? this.carouselItems.length : 0);
        if (totalItems <= 1) return;
        
        setInterval(() => {
            this.nextSlide();
        }, 5000); // Change slide every 5 seconds
    }

    /**
     * Add a new slider item
     */
    addSliderItem(item) {
        this.sliderItems.push(item);
        this.renderSlider();
    }

    /**
     * Remove a slider item by ID
     */
    removeSliderItem(id) {
        this.sliderItems = this.sliderItems.filter(item => item.id !== id);
        this.currentIndex = 0; // Reset to first slide
        this.renderSlider();
    }

    /**
     * Set up carousel functionality for static content
     */
    setupStaticCarousel() {
        // For static content, we just need to set up the navigation
        // The HTML is already in the page
        
        // Get all carousel items
        this.carouselItems = this.container.querySelectorAll('.carousel-item');
        this.totalItems = this.carouselItems.length;
        this.currentIndex = 0;
        
        // Show the first item
        if (this.carouselItems.length > 0) {
            this.carouselItems[0].classList.add('active');
        }
        
        // Set up automatic sliding
        this.startAutoSlide();
    }
}

// Initialize slider manager when DOM is loaded
// Only initialize if sliderManager hasn't been initialized globally yet
document.addEventListener('DOMContentLoaded', async function() {
    // Check for both slider-container (old) and featured-carousel (new) IDs
    if (window.sliderManager) {
        // Already initialized
        return;
    }
    
    if (document.getElementById('slider-container')) {
        window.sliderManager = new SliderManager('slider-container');
        await window.sliderManager.init();
    } else if (document.getElementById('featured-carousel')) {
        window.sliderManager = new SliderManager('featured-carousel');
        await window.sliderManager.init();
    }
});