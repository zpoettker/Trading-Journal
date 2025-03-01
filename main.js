// Sidebar Toggle
const sidebar = document.querySelector('.sidebar');
const mainContent = document.querySelector('.main-content');
document.getElementById('sidebarToggle').addEventListener('click', () => {
    sidebar.classList.toggle('collapsed');
    mainContent.classList.toggle('expanded');
});

// Dark Mode Toggle
const darkModeToggle = document.getElementById('darkModeToggle');
darkModeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    document.querySelectorAll('.metric-card, .chart-card, .recent-trades, .full-calendar')
        .forEach(card => card.style.backgroundColor = isDark ? '#2a2a3e' : 'white');
});

// Modal Logic (for Dashboard - adjust if needed for Daily Journal)
const modal = document.getElementById('tradeModal');
const addTradeBtn = document.getElementById('addTradeBtn');
const closeModalBtn = document.getElementById('closeModal');
const tradeForm = document.getElementById('tradeForm');

if (addTradeBtn) {
    addTradeBtn.addEventListener('click', () => {
        if (modal) modal.style.display = 'flex';
    });
}

if (closeModalBtn) {
    closeModalBtn.addEventListener('click', () => {
        if (modal) modal.style.display = 'none';
    });
}

// Filter Dropdown (Placeholder)
const filterDropdown = document.querySelector('.filter-dropdown');
if (filterDropdown) {
    filterDropdown.addEventListener('change', (e) => {
        console.log(`Filter changed to: ${e.target.value}`);
    });
}

// Enhanced Navigation handling for sidebar links
document.addEventListener('DOMContentLoaded', () => {
    const sidebarLinks = document.querySelectorAll('.sidebar a');

    sidebarLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href !== '#') {
                e.preventDefault(); // Prevent default anchor behavior
                console.log(`Navigating to: ${href}`); // Debug log

                // Update active class
                document.querySelectorAll('.sidebar li').forEach(li => li.classList.remove('active'));
                link.parentElement.classList.add('active');

                // Navigate to the page
                try {
                    window.location.href = href;
                } catch (error) {
                    console.error('Navigation error:', error);
                    alert('Unable to navigate. Please ensure all files are in the same directory and try using a local server.');
                }
            }
        });
    });

    // Ensure active state on page load
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    sidebarLinks.forEach(link => {
        const linkPath = link.getAttribute('href');
        if (linkPath === currentPath) {
            link.parentElement.classList.add('active');
            console.log(`Active page detected: ${currentPath}`);
        }
    });
});