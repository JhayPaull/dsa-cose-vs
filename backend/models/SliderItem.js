// Slider Item Model Schema for Firestore
class SliderItem {
    constructor(data) {
        this.id = data.id || null;
        this.title = data.title || '';
        this.description = data.description || '';
        this.imageUrl = data.imageUrl || '';
        this.link = data.link || '';
        this.createdAt = data.createdAt || new Date();
        this.updatedAt = data.updatedAt || new Date();
        this.createdBy = data.createdBy || null; // admin user ID
    }

    // Convert to Firestore document data
    toFirestore() {
        return {
            title: this.title,
            description: this.description,
            imageUrl: this.imageUrl,
            link: this.link,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
            createdBy: this.createdBy
        };
    }

    // Validate slider item data
    validate() {
        const errors = [];
        
        if (!this.title) errors.push('Title is required');
        if (!this.imageUrl) errors.push('Image URL is required');
        
        return {
            isValid: errors.length === 0,
            errors
        };
    }
}

module.exports = SliderItem;