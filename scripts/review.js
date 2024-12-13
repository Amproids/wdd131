// Function to display review count
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
document.addEventListener('DOMContentLoaded', displayReviewCount);