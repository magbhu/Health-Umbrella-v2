/**
 * This script handles loading reusable components (like navbar, header)
 * and provides global utility functions (like showFeedback).
 */

// Create a custom event to signal when components are loaded
const componentsLoadedEvent = new Event('commonComponentsLoaded');

/**
 * Fetches and injects HTML content into a placeholder element.
 * @param {string} componentPath - The path to the HTML fragment (e.g., '_navbar.html').
 * @param {string} placeholderId - The ID of the div to inject the HTML into.
 * @param {string} [activeLinkId] - The 'data-link-id' of the link to mark as active.
 */
async function loadComponent(componentPath, placeholderId, activeLinkId) {
    try {
        const response = await fetch(componentPath);
        if (!response.ok) {
            throw new Error(`Failed to fetch component: ${response.statusText}`);
        }
        const html = await response.text();
        const placeholder = document.getElementById(placeholderId);
        
        if (placeholder) {
            placeholder.innerHTML = html;
            // After injecting, find the active link and style it
            if (activeLinkId) {
                const activeLink = placeholder.querySelector(`a[data-link-id="${activeLinkId}"]`);
                if (activeLink) {
                    activeLink.classList.add('text-blue-600', 'font-semibold', 'bg-blue-50', 'lg:border-r-4', 'lg:border-blue-500');
                    activeLink.classList.remove('text-gray-600', 'hover:bg-gray-100', 'hover:text-gray-900');
                }
            }
        }
    } catch (error) {
        console.error(`Error loading component ${componentPath}:`, error);
        const placeholder = document.getElementById(placeholderId);
        if(placeholder) {
            placeholder.innerHTML = `<p class="text-red-500 text-center p-4">Error loading ${placeholderId}.</p>`;
        }
    }
}

/**
 * Global function to show a feedback message.
 * @param {string} message - The text to display.
 */
function showFeedback(message) {
    let feedbackEl = document.getElementById('click-feedback');
    
    // Create the feedback element if it doesn't exist on the page
    if (!feedbackEl) {
        feedbackEl = document.createElement('div');
        feedbackEl.id = 'click-feedback';
        feedbackEl.className = 'hidden fixed top-5 right-5 bg-blue-600 text-white p-3 rounded-lg shadow-lg z-50 transition-all duration-300';
        document.body.appendChild(feedbackEl);
    }

    feedbackEl.textContent = message;
    feedbackEl.classList.remove('hidden', 'opacity-0');
    feedbackEl.classList.add('opacity-100');

    // Hide the message after 3 seconds
    setTimeout(() => {
        feedbackEl.classList.remove('opacity-100');
        feedbackEl.classList.add('opacity-0');
        // Wait for fade out before hiding
        setTimeout(() => feedbackEl.classList.add('hidden'), 500);
    }, 3000);
}


// --- Main Execution ---
// Load all common components when the DOM is ready
document.addEventListener('DOMContentLoaded', async () => {
    
    // --- Load Navbar ---
    const navbarPlaceholder = document.getElementById('navbar-placeholder');
    if (navbarPlaceholder) {
        // Get the active link ID from the placeholder's data attribute
        const activeLink = navbarPlaceholder.getAttribute('data-active-link');
        await loadComponent('_navbar.html', 'navbar-placeholder', activeLink);
    }
    
    // --- Load Header ---
    const headerPlaceholder = document.getElementById('header-placeholder');
    if (headerPlaceholder) {
        await loadComponent('_header.html', 'header-placeholder');
    }

    // All components are loaded, dispatch the custom event
    // Any page-specific scripts waiting for this event will now run.
    document.dispatchEvent(componentsLoadedEvent);
});