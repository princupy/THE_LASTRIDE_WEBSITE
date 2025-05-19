// assets/js/main.js

// ===== Smooth Scroll for anchor links =====
document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
        e.preventDefault();
        const target = document.querySelector(link.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// ===== Intersection Observer for scroll animation =====
const sections = document.querySelectorAll('.section');

const observerOptions = {
    threshold: 0.1
};

const fadeInOnScroll = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

sections.forEach(section => {
    section.classList.add('fade-in');
    fadeInOnScroll.observe(section);
});






// ===== Fetch Live Stats from Discord Server =====
async function getLiveStatus() {
    try {
        const response = await fetch('/api/discord-status');
        const data = await response.json();
        const statusContainer = document.getElementById('status-container');

        if (data.status === 'online') {
            statusContainer.innerHTML = `
                <p>Server Status: <span style="color: green;">Online</span></p>
                <p>Server Name: ${data.server_name}</p>
                <p>Total Members: ${data.member_count}</p>
                <p>Online Members: ${data.online_count}</p>
            `;
        } else {
            statusContainer.innerHTML = '<p>Server Status: <span style="color: red;">Offline</span></p>';
        }
    } catch (error) {
        console.error('Error fetching live status:', error);
        const statusContainer = document.getElementById('status-container');
        statusContainer.innerHTML = '<p>Unable to fetch live status.</p>';
    }
}

// ===== Call getLiveStatus when the page is ready =====
document.addEventListener('DOMContentLoaded', getLiveStatus);

// ===== Fetch Discord Stats from Discord Server =====
async function fetchDiscordStats() {
    try {
        const response = await fetch('/api/server-stats');
        const stats = await response.json();

        // Ensure the stats object has the expected structure
        if (stats && stats.totalMembers && stats.onlineMembers && stats.botCount) {
            // Animate the counters (total members, online users, bot count)
            animateCounter('total-members', stats.totalMembers, 2000);
            animateCounter('online-members', stats.onlineMembers, 2000);
            animateCounter('bot-count', stats.botCount, 2000);
        }
    } catch (error) {
        console.error("Error fetching Discord server stats:", error);
    }
}

// ===== Animate Counter Function =====
function animateCounter(id, endValue, duration) {
    const element = document.getElementById(id);
    if (!element) return;

    const startValue = 0;
    const startTime = performance.now();

    function update(currentTime) {
        const elapsedTime = currentTime - startTime;
        const progress = Math.min(elapsedTime / duration, 1);
        const value = Math.floor(progress * endValue);
        element.textContent = value.toLocaleString();

        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }

    requestAnimationFrame(update);
}

// ===== Call fetchDiscordStats when the page is ready =====
document.addEventListener('DOMContentLoaded', fetchDiscordStats);
