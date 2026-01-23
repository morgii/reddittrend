const express = require('express');
const axios = require('axios');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Reddit API endpoint
app.get('/api/trends', async (req, res) => {
    try {
        const { category = 'popular', limit = 25 } = req.query;

        // Construct Reddit JSON API URL
        // If category is a subreddit, use /r/{subreddit}/hot.json
        // Otherwise use /r/{category}/hot.json or /r/popular/hot.json
        let redditUrl;

        if (category.toLowerCase() === 'popular' || category.toLowerCase() === 'all') {
            redditUrl = `https://www.reddit.com/r/${category}/hot.json?limit=${limit}`;
        } else {
            // Try to fetch from specific subreddit
            redditUrl = `https://www.reddit.com/r/${category}/hot.json?limit=${limit}`;
        }

        // Make request to Reddit's public JSON API
        const response = await axios.get(redditUrl, {
            headers: {
                'User-Agent': 'RedditTrendsApp/1.0'
            }
        });

        // Extract relevant post data
        const posts = response.data.data.children.map(child => {
            const post = child.data;
            return {
                id: post.id,
                title: post.title,
                author: post.author,
                subreddit: post.subreddit,
                score: post.score,
                numComments: post.num_comments,
                created: post.created_utc,
                url: `https://www.reddit.com${post.permalink}`,
                thumbnail: post.thumbnail && post.thumbnail.startsWith('http') ? post.thumbnail : null,
                preview: post.preview?.images?.[0]?.source?.url?.replace(/&amp;/g, '&') || null,
                selftext: post.selftext ? post.selftext.substring(0, 200) : '',
                isVideo: post.is_video || false,
                domain: post.domain,
                link: post.url
            };
        });

        res.json({
            success: true,
            category,
            count: posts.length,
            posts
        });

    } catch (error) {
        console.error('Error fetching Reddit data:', error.message);

        if (error.response?.status === 404) {
            res.status(404).json({
                success: false,
                error: 'Subreddit not found. Please check the category name.'
            });
        } else if (error.response?.status === 429) {
            res.status(429).json({
                success: false,
                error: 'Rate limit exceeded. Please try again later.'
            });
        } else {
            res.status(500).json({
                success: false,
                error: 'Failed to fetch Reddit data. Please try again.'
            });
        }
    }
});

// Serve frontend
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Only start server if not in Vercel environment
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
    app.listen(PORT, () => {
        console.log(`🚀 Reddit Trends Server running on http://localhost:${PORT}`);
    });
}

// Export for Vercel
module.exports = app;
