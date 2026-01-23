const axios = require('axios');

module.exports = async (req, res) => {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Accept');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    try {
        const { category = 'popular', limit = 25 } = req.query;

        // Construct Reddit JSON API URL
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

        res.status(200).json({
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
};
