// API Configuration
const API_BASE_URL = 'http://localhost:3000';

// DOM Elements
const categoryInput = document.getElementById('categoryInput');
const searchBtn = document.getElementById('searchBtn');
const postsGrid = document.getElementById('postsGrid');
const loadingState = document.getElementById('loadingState');
const errorState = document.getElementById('errorState');
const resultsInfo = document.getElementById('resultsInfo');
const resultsTitle = document.getElementById('resultsTitle');
const resultsCount = document.getElementById('resultsCount');
const errorTitle = document.getElementById('errorTitle');
const errorMessage = document.getElementById('errorMessage');
const categoryChips = document.querySelectorAll('.category-chip');

// State
let currentCategory = 'popular';

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    fetchTrends('popular');
    setupEventListeners();
});

// Event Listeners
function setupEventListeners() {
    searchBtn.addEventListener('click', handleSearch);

    categoryInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    });

    categoryChips.forEach(chip => {
        chip.addEventListener('click', () => {
            const category = chip.dataset.category;
            categoryInput.value = category;
            fetchTrends(category);
        });
    });
}

// Handle Search
function handleSearch() {
    const category = categoryInput.value.trim() || 'popular';
    fetchTrends(category);
}

// Fetch Trends from API
async function fetchTrends(category) {
    currentCategory = category;

    // Show loading state
    showLoading();

    try {
        const response = await fetch(`${API_BASE_URL}/api/trends?category=${encodeURIComponent(category)}&limit=25`);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Failed to fetch trends');
        }

        if (data.success && data.posts.length > 0) {
            displayPosts(data.posts, category);
        } else {
            showError('No posts found', 'Try searching for a different category or subreddit.');
        }

    } catch (error) {
        console.error('Error fetching trends:', error);
        showError('Failed to load trends', error.message);
    }
}

// Display Posts
function displayPosts(posts, category) {
    hideStates();
    resultsInfo.classList.remove('hidden');

    // Update results info
    resultsTitle.innerHTML = `Trending in <span class="gradient-text">r/${category}</span>`;
    resultsCount.textContent = `${posts.length} posts found`;

    // Clear previous posts
    postsGrid.innerHTML = '';

    // Create post cards
    posts.forEach((post, index) => {
        const card = createPostCard(post, index);
        postsGrid.appendChild(card);
    });
}

// Create Post Card
function createPostCard(post, index) {
    const card = document.createElement('div');
    card.className = 'post-card';
    card.style.animationDelay = `${index * 0.05}s`;

    // Format numbers
    const formatNumber = (num) => {
        if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'k';
        }
        return num.toString();
    };

    // Format time
    const formatTime = (timestamp) => {
        const now = Date.now() / 1000;
        const diff = now - timestamp;

        if (diff < 3600) {
            return `${Math.floor(diff / 60)}m ago`;
        } else if (diff < 86400) {
            return `${Math.floor(diff / 3600)}h ago`;
        } else {
            return `${Math.floor(diff / 86400)}d ago`;
        }
    };

    // Build card HTML
    let html = '';

    // Add thumbnail if available
    if (post.preview || post.thumbnail) {
        const imageUrl = post.preview || post.thumbnail;
        html += `<img src="${imageUrl}" alt="${post.title}" class="post-thumbnail" onerror="this.style.display='none'">`;
    }

    html += `
        <div class="post-content">
            <div class="post-header">
                <span class="subreddit-badge">r/${post.subreddit}</span>
                <span class="post-meta">by u/${post.author} • ${formatTime(post.created)}</span>
            </div>
            
            <h3 class="post-title">${escapeHtml(post.title)}</h3>
            
            ${post.selftext ? `<p class="post-excerpt">${escapeHtml(post.selftext)}</p>` : ''}
            
            <div class="post-footer">
                <div class="post-stat">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 4L14.5 9.5L20 10L16 14.5L17 20L12 17L7 20L8 14.5L4 10L9.5 9.5L12 4Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    <span class="stat-value">${formatNumber(post.score)}</span>
                </div>
                
                <div class="post-stat">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    <span class="stat-value">${formatNumber(post.numComments)}</span>
                </div>
            </div>
        </div>
    `;

    card.innerHTML = html;

    // Add click handler to open Reddit link
    card.addEventListener('click', () => {
        window.open(post.url, '_blank', 'noopener,noreferrer');
    });

    return card;
}

// Utility Functions
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function showLoading() {
    hideStates();
    loadingState.classList.remove('hidden');
}

function showError(title, message) {
    hideStates();
    errorState.classList.remove('hidden');
    errorTitle.textContent = title;
    errorMessage.textContent = message;
}

function hideStates() {
    loadingState.classList.add('hidden');
    errorState.classList.add('hidden');
    resultsInfo.classList.add('hidden');
}
