// DOM Elements
const subscribeForm = document.getElementById('subscribe-form');
const emailInput = document.getElementById('email');
const subscriptionMessage = document.getElementById('subscription-message');
const updatesContainer = document.getElementById('updates-container');
const currentYearSpan = document.getElementById('current-year');

// Recent updates data
const recentUpdates = [
    {
        title: 'New Boid Simulation Tutorial',
        date: '2024-12-10',
        preview: 'Learn how to implement flocking behavior in your projects.'
    },
    {
        title: 'Fabric Physics Deep Dive',
        date: '2024-12-08',
        preview: 'Exploring the mathematics behind realistic fabric simulation.'
    },
    {
        title: 'Computing Concepts Series',
        date: '2024-12-05',
        preview: 'Starting a new series on fundamental computing concepts.'
    }
];

// Update copyright year
const updateCopyright = () => {
    const currentYear = new Date().getFullYear();
    if (currentYearSpan) {
        currentYearSpan.textContent = currentYear;
    }
};

// Handle newsletter subscription
const handleSubscription = (event) => {
    event.preventDefault();
    const email = emailInput.value.trim();

    // Simple email validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
        showSubscriptionMessage('Please enter a valid email address.', false);
        return;
    }

    // Get existing subscriptions from localStorage
    const subscribers = JSON.parse(localStorage.getItem('subscribers') || '[]');

    // Check if email already exists
    if (subscribers.includes(email)) {
        showSubscriptionMessage('You are already subscribed!', false);
        return;
    }

    // Add new subscriber
    subscribers.push(email);
    localStorage.setItem('subscribers', JSON.stringify(subscribers));
    
    // Show success message
    showSubscriptionMessage('Thank you for subscribing!', true);
    emailInput.value = '';
};

// Display subscription message
const showSubscriptionMessage = (message, isSuccess) => {
    subscriptionMessage.textContent = message;
    subscriptionMessage.className = `message ${isSuccess ? 'success' : 'error'}`;
    subscriptionMessage.classList.remove('hidden');

    // Hide message after 3 seconds
    setTimeout(() => {
        subscriptionMessage.classList.add('hidden');
    }, 3000);
};

// Create and display recent updates
const displayRecentUpdates = () => {
    if (!updatesContainer) return;

    updatesContainer.innerHTML = recentUpdates.map(update => `
        <article class="update-card">
            <h3>${update.title}</h3>
            <time datetime="${update.date}">${formatDate(update.date)}</time>
            <p>${update.preview}</p>
        </article>
    `).join('');
};

// Format date for display
const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
};

// Track page visits using localStorage
const trackPageVisit = () => {
    const visits = parseInt(localStorage.getItem('visitCount') || '0');
    localStorage.setItem('visitCount', visits + 1);
    
    // Show welcome back message for returning visitors
    if (visits > 0) {
        const welcomeMessage = document.createElement('div');
        welcomeMessage.className = 'welcome-message';
        welcomeMessage.textContent = `Welcome back! You've visited ${visits + 1} times.`;
        document.querySelector('.hero').appendChild(welcomeMessage);
    }
};

// Project card interactions
const initializeProjectCards = () => {
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px)';
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
        });

        // Track project card clicks
        card.addEventListener('click', () => {
            const projectName = card.dataset.project;
            const projectClicks = JSON.parse(localStorage.getItem('projectClicks') || '{}');
            projectClicks[projectName] = (projectClicks[projectName] || 0) + 1;
            localStorage.setItem('projectClicks', JSON.stringify(projectClicks));
        });
    });
};

// Initialize all functionality
const init = () => {
    // Add event listeners
    if (subscribeForm) {
        subscribeForm.addEventListener('submit', handleSubscription);
    }

    // Initialize features
    updateCopyright();
    displayRecentUpdates();
    trackPageVisit();
    initializeProjectCards();

    // Add smooth scroll behavior for navigation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
};

// Run initialization when DOM is loaded
document.addEventListener('DOMContentLoaded', init);