// Intersection Observer for scroll animations
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target); // Stop observing once animation is triggered
        }
    });
}, observerOptions);

// Navigation active state
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

function updateActiveLink() {
    const scrollPosition = window.scrollY + 100; // Offset for better accuracy

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');

        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

// Add scroll event listener for navigation
window.addEventListener('scroll', updateActiveLink);
// Initial call to set active link on page load
document.addEventListener('DOMContentLoaded', updateActiveLink);

// Original animation code
document.addEventListener('DOMContentLoaded', () => {
    // Elements to animate on scroll
    const animateElements = [
        ...document.querySelectorAll('.features-grid .feature-card'),
        ...document.querySelectorAll('.about-content > *'),
        document.querySelector('.contact-form'),
        ...document.querySelectorAll('.footer-section')
    ];

    // Add fade-in class and observe each element
    animateElements.forEach(element => {
        if (element) {
            element.classList.add('fade-in');
            observer.observe(element);
        }
    });
});

// Function to get URL parameters
function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

// Function to update hero section
function updateHeroSection(deviceData) {
    const heroTitle = document.querySelector('.hero h1');
    const heroDescription = document.querySelector('.hero p');
    const heroImage = document.querySelector('.hero-image img');
    const productIntro = document.querySelector('.product-intro');
    const productDescriptionh3 = document.querySelector('.product-description h3');
    const showcaseImage = document.querySelector('.showcase-image img');

    heroTitle.textContent = deviceData.name;
    heroDescription.textContent = deviceData.description;
    heroImage.src = deviceData.heroImage;
    heroImage.alt = deviceData.name;
    productIntro.textContent = deviceData['product-intro'];
    productDescriptionh3.textContent = deviceData.name;
    // Update showcase image
    showcaseImage.src = deviceData.heroImage;
    showcaseImage.alt = deviceData.name;
}

// Function to update features section
function updateFeaturesSection(deviceData) {
    const featuresContainer = document.querySelector('.features-grid');
    if (!featuresContainer) return; // Exit if features container doesn't exist

    // Clear existing features
    featuresContainer.innerHTML = '';

    // Check if device data has features
    if (!deviceData.features) {
        console.log('No features data available for this device');
        return;
    }

    // Create feature cards based on device data
    Object.entries(deviceData.features).forEach(([key, feature]) => {
        const featureCard = document.createElement('div');
        featureCard.className = 'feature-card';
        featureCard.innerHTML = `
            <div class="feature-icon">${getFeatureIcon(key)}</div>
            <h3>${feature.title}</h3>
            <ul class="feature-list">
                ${feature.items.map(item => `<li>${item}</li>`).join('')}
            </ul>
        `;
        featuresContainer.appendChild(featureCard);
    });
}

// Function to get appropriate icon based on feature category
function getFeatureIcon(category) {
    const icons = {
        display: '📺',
        smart: '🤖',
        audio: '🔊',
        connectivity: '🔌',
        ergonomics: '🪑',
        performance: '⚡'
    };
    return icons[category] || '💡';
}

// Main function to initialize the page
async function initializePage() {
    try {
        // Get device type from URL
        const deviceType = getUrlParameter('device');
        
        // If no device type is specified, use default content
        if (!deviceType) {
            return; // Keep the default content from HTML
        }
        
        // Fetch device data
        const response = await fetch('devices.json');
        const data = await response.json();
        
        // Get device data based on URL parameter
        const deviceData = data.devices[deviceType];
        
        if (deviceData) {
            // Update page content
            updateHeroSection(deviceData);
            updateFeaturesSection(deviceData);
        } else {
            // Handle invalid device type
            console.error('Invalid device type:', deviceType);
            // You can add error handling UI here
        }
    } catch (error) {
        console.error('Error loading device data:', error);
        // You can add error handling UI here
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize page content
    initializePage();
    
    // Initialize scroll animations
    const animateElements = [
        ...document.querySelectorAll('.features-grid .feature-card'),
        ...document.querySelectorAll('.about-content > *'),
        document.querySelector('.contact-form'),
        ...document.querySelectorAll('.footer-section')
    ];

    // Add fade-in class and observe each element
    animateElements.forEach(element => {
        if (element) {
            element.classList.add('fade-in');
            observer.observe(element);
        }
    });

    // Initialize mobile menu
    const menuToggle = document.querySelector('.menu-toggle');
    const mobileNavLinks = document.querySelector('.nav-links');

    if (menuToggle && mobileNavLinks) {
        menuToggle.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent event from bubbling up
            mobileNavLinks.classList.toggle('active');
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!mobileNavLinks.contains(e.target) && !menuToggle.contains(e.target)) {
                mobileNavLinks.classList.remove('active');
            }
        });

        // Close menu when clicking on a link
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                mobileNavLinks.classList.remove('active');
            });
        });
    }

    // Initialize navigation active state
    updateActiveLink();
}); 