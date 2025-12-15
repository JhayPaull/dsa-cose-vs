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
    init() {
        if (!this.container) {
            console.error(`Slider container with ID '${this.containerId}' not found.`);
            return;
        }

        // Load slider items (in a real app, this would come from an API)
        this.loadSliderItems();
        
        // Set up interval for automatic sliding
        this.startAutoSlide();
    }

    /**
     * Load slider items
     * In a real application, this would fetch from a database or API
     */
    loadSliderItems() {
        // Mock data for demonstration
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

        this.renderSlider();
    }

    /**
     * Render the slider HTML
     */
    renderSlider() {
        if (this.sliderItems.length === 0) {
            this.container.innerHTML = `
                <div class="slider-placeholder text-center p-5">
                    <p>No slider images configured yet.</p>
                    <a href="/pages/admin/edit-slider/" class="btn btn-gold">Add Slider Images</a>
                </div>
            `;
            return;
        }

        let sliderHtml = `
            <div class="slider-wrapper position-relative">
                <div class="slider-inner">
        `;

        this.sliderItems.forEach((item, index) => {
            const isActive = index === 0 ? 'active' : '';
            sliderHtml += `
                <div class="slider-slide ${isActive}" data-index="${index}">
                    <img src="${item.imageUrl}" alt="${item.title}" class="slider-image w-100">
                    <div class="slider-content position-absolute bottom-0 start-0 w-100 p-4 text-white">
                        <h3 class="slider-title">${item.title}</h3>
                        <p class="slider-description">${item.description}</p>
                        ${item.link ? `<a href="${item.link}" class="btn btn-gold">Learn More</a>` : ''}
                    </div>
                </div>
            `;
        });

        sliderHtml += `
                </div>
                <!-- Slider Controls -->
                <button class="slider-control prev" onclick="sliderManager.prevSlide()">
                    <i class="fas fa-chevron-left"></i>
                </button>
                <button class="slider-control next" onclick="sliderManager.nextSlide()">
                    <i class="fas fa-chevron-right"></i>
                </button>
                
                <!-- Slider Indicators -->
                <div class="slider-indicators position-absolute bottom-0 start-50 translate-middle-x mb-3">
        `;

        this.sliderItems.forEach((_, index) => {
            const isActive = index === 0 ? 'active' : '';
            sliderHtml += `
                <button class="indicator ${isActive}" data-index="${index}" onclick="sliderManager.goToSlide(${index})"></button>
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
        this.currentIndex = (this.currentIndex + 1) % this.sliderItems.length;
        this.updateSlider();
    }

    /**
     * Move to the previous slide
     */
    prevSlide() {
        this.currentIndex = (this.currentIndex - 1 + this.sliderItems.length) % this.sliderItems.length;
        this.updateSlider();
    }

    /**
     * Go to a specific slide
     */
    goToSlide(index) {
        this.currentIndex = index;
        this.updateSlider();
    }

    /**
     * Update the slider display
     */
    updateSlider() {
        const slides = this.container.querySelectorAll('.slider-slide');
        const indicators = this.container.querySelectorAll('.indicator');

        // Update slides
        slides.forEach((slide, index) => {
            if (index === this.currentIndex) {
                slide.classList.add('active');
            } else {
                slide.classList.remove('active');
            }
        });

        // Update indicators
        indicators.forEach((indicator, index) => {
            if (index === this.currentIndex) {
                indicator.classList.add('active');
            } else {
                indicator.classList.remove('active');
            }
        });
    }

    /**
     * Start automatic sliding
     */
    startAutoSlide() {
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
}

// Initialize slider manager when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('slider-container')) {
        window.sliderManager = new SliderManager('slider-container');
        window.sliderManager.init();
    }
});