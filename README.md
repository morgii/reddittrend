# Reddit Trends 🚀

A modern, beautiful web application that lets you discover trending posts from Reddit by category or subreddit. Built with vanilla JavaScript and Express.js, featuring a stunning dark mode UI with smooth animations.

![Reddit Trends](https://img.shields.io/badge/Reddit-Trends-FF4500?style=for-the-badge&logo=reddit&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)

## ✨ Features

- 🔍 **Search Any Subreddit** - Explore trending posts from any subreddit
- 🎨 **Beautiful UI** - Modern dark mode design with glassmorphism effects
- ⚡ **Fast & Responsive** - Optimized performance with smooth animations
- 📱 **Mobile Friendly** - Fully responsive design that works on all devices
- 🔗 **Direct Links** - Click any post to open it directly on Reddit
- 🎯 **Quick Categories** - One-click access to popular subreddits

## 🛠️ Tech Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Backend**: Node.js, Express.js
- **API**: Reddit JSON API
- **Deployment**: Vercel (serverless)

## 📦 Installation

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Local Development

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd reddittrend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

## 🚀 Deploy to Vercel

### Option 1: Deploy with Vercel CLI (Recommended)

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel
   ```
   
   Follow the prompts:
   - Set up and deploy? **Y**
   - Which scope? Select your account
   - Link to existing project? **N**
   - What's your project's name? **reddit-trends** (or your preferred name)
   - In which directory is your code located? **.**
   - Want to override the settings? **N**

4. **Deploy to Production**
   ```bash
   vercel --prod
   ```

### Option 2: Deploy with GitHub Integration

1. **Push your code to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

2. **Import to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - **IMPORTANT**: In the "Framework Preset" dropdown, select **"Express.js"**
   - Click "Deploy"

3. **Done!** 🎉
   Your app will be live at `https://your-project-name.vercel.app`

## 📁 Project Structure

```
reddittrend/
├── public/
│   ├── index.html      # Main HTML file
│   ├── app.js          # Frontend JavaScript
│   └── styles.css      # Styling with CSS variables
├── index.js            # Express server & API routes
├── vercel.json         # Vercel configuration
├── package.json        # Dependencies & scripts
├── .env.example        # Environment variables template
├── .gitignore          # Git ignore rules
└── README.md           # This file
```

**Note**: This is a standard Express.js application. When deploying to Vercel, select **"Express.js"** as the framework.

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory (optional for local development):

```env
PORT=3000
```

For Vercel deployment, environment variables can be set in the Vercel dashboard under Project Settings → Environment Variables.

### API Configuration

The application uses Reddit's public JSON API, which doesn't require authentication. However, be mindful of rate limits:
- Reddit API rate limit: ~60 requests per minute
- The app includes error handling for rate limit responses

## 🎯 Usage

1. **Search for a subreddit**: Enter any subreddit name (e.g., "technology", "gaming", "worldnews")
2. **Use quick categories**: Click on the pre-defined category chips for instant results
3. **Browse posts**: Scroll through the beautiful card layout
4. **Open posts**: Click any card to open the original Reddit post in a new tab

## 🌐 API Endpoints

### GET `/api/trends`

Fetch trending posts from a subreddit.

**Query Parameters:**
- `category` (string, optional): Subreddit name (default: "popular")
- `limit` (number, optional): Number of posts to fetch (default: 25, max: 100)

**Example:**
```
GET /api/trends?category=technology&limit=25
```

**Response:**
```json
{
  "success": true,
  "category": "technology",
  "count": 25,
  "posts": [...]
}
```

## 🎨 Customization

### Changing Colors

Edit the CSS variables in `public/styles.css`:

```css
:root {
    --accent-primary: #6366f1;
    --accent-secondary: #8b5cf6;
    --bg-primary: #0a0a0f;
    /* ... more variables */
}
```

### Adding More Quick Categories

Edit `public/index.html` to add more category chips:

```html
<button class="category-chip" data-category="your-category">Your Category</button>
```

## 🐛 Troubleshooting

### Posts not loading?
- Check your internet connection
- Verify the subreddit name is correct
- Check browser console for errors

### API rate limit exceeded?
- Wait a few minutes before making more requests
- Reddit's rate limit resets after ~1 minute

### Deployment issues?
- Ensure `vercel.json` is properly configured
- Check Vercel deployment logs for errors
- Verify all dependencies are in `package.json`

## 📝 License

ISC

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 👨‍💻 Author

Your Name

---

**Made with ❤️ and Reddit API**
