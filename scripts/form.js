// Product data array
const products = [
    {
        id: "fc-1888",
        name: "flux capacitor",
        averagerating: 4.5
    },
    {
        id: "fc-2050",
        name: "power laces",
        averagerating: 4.7
    },
    {
        id: "fs-1987",
        name: "time circuits",
        averagerating: 3.5
    },
    {
        id: "ac-2000",
        name: "low voltage reactor",
        averagerating: 3.9
    },
    {
        id: "jj-1969",
        name: "warp equalizer",
        averagerating: 5.0
    }
];

// DOM Elements
const productSelect = document.getElementById('product');
const reviewForm = document.querySelector('form');

// Populate product select options
function populateProductOptions() {
    try {
        products.forEach(product => {
            const option = document.createElement('option');
            option.value = product.id;  // Using ID as value
            option.textContent = product.name;
            productSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Error populating product options:', error);
    }
}

// Handle form submission and review counter
function handleFormSubmit(event) {
    try {
        let reviewCount = parseInt(localStorage.getItem('reviewCount')) || 0;
        
        if (event.target.checkValidity()) {
            reviewCount++;
            localStorage.setItem('reviewCount', reviewCount.toString());
        }
    } catch (error) {
        console.error('Error handling form submission:', error);
    }
}

// Initialize the page
function initializePage() {
    try {
        if (productSelect) {
            populateProductOptions();
        }
        
        if (reviewForm) {
            reviewForm.addEventListener('submit', handleFormSubmit);
        }
    } catch (error) {
        console.error('Error initializing page:', error);
    }
}

// For the review.html page - Display review count
function displayReviewCount() {
    try {
        const reviewCountElement = document.getElementById('reviewCount');
        if (reviewCountElement) {
            const count = parseInt(localStorage.getItem('reviewCount')) || 0;
            reviewCountElement.textContent = count.toString();
        }
    } catch (error) {
        console.error('Error displaying review count:', error);
    }
}

// Run when DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    initializePage();
    displayReviewCount();
});