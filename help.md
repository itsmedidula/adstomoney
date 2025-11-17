# Landing Page Generator Admin Panel

A Node.js web application that generates landing pages from a template and automatically deploys them to GitHub.

## 🚀 Features

- Password-protected admin panel
- Simple form interface for landing page generation
- Automatic variable replacement in HTML templates
- GitHub integration for automatic deployment
- Heroku-ready deployment

## 📋 Prerequisites

- Node.js 18.x or higher
- GitHub account with a repository
- GitHub Personal Access Token with `repo` permissions
- Heroku account (for deployment)

## 🛠️ Setup

### 1. Create GitHub Personal Access Token

1. Go to GitHub Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Click "Generate new token (classic)"
3. Give it a name and select the `repo` scope
4. Copy the token (you won't see it again!)

### 2. Prepare Your Repository

Your repository should have a template file at `/index.html` with these variables:
- `$title`
- `$description`
- `$chanel_url`
- `$logo_url`
- `$button_name`
- `$button_url`

### 3. Local Development

```bash
# Install dependencies
npm install

# Create .env file
cp .env .env.local

# Edit .env with your values
GITHUB_TOKEN=your_github_token_here
GITHUB_USER=your_github_username
GITHUB_REPO=your_repository_name
ADMIN_PASSWORD=your_secure_password
PORT=3000

# Run the server
npm start

# For development with auto-reload
npm run dev
```

Visit `http://localhost:3000` to access the admin panel.

## 🌐 Deploy to Heroku

### Method 1: Using Heroku CLI

```bash
# Login to Heroku
heroku login

# Create a new Heroku app
heroku create your-app-name

# Set environment variables
heroku config:set GITHUB_TOKEN=your_github_token_here
heroku config:set GITHUB_USER=your_github_username
heroku config:set GITHUB_REPO=your_repository_name
heroku config:set ADMIN_PASSWORD=your_secure_password

# Deploy
git push heroku main

# Open the app
heroku open
```

### Method 2: Using Heroku Dashboard

1. Go to [Heroku Dashboard](https://dashboard.heroku.com/)
2. Click "New" → "Create new app"
3. Connect your GitHub repository
4. Go to Settings → Config Vars
5. Add these environment variables:
   - `GITHUB_TOKEN`
   - `GITHUB_USER`
   - `GITHUB_REPO`
   - `ADMIN_PASSWORD`
6. Go to Deploy tab and deploy your branch

## 📁 Project Structure

```
├── server.js              # Main Express server
├── package.json           # Dependencies
├── Procfile              # Heroku configuration
├── .env                  # Environment variables (not committed)
├── .gitignore            # Git ignore file
├── public/
│   └── index.html        # Admin panel UI
└── README.md             # This file
```

## 🔒 Security Notes

1. **Never commit `.env` file** - It contains sensitive tokens
2. **Use strong admin password** - This protects your admin panel
3. **GitHub token permissions** - Only grant necessary permissions (repo scope)
4. **HTTPS only** - Heroku provides HTTPS by default

## 📝 How It Works

1. User logs in with admin password
2. Fills out the form with landing page details
3. App fetches template from GitHub (`/index.html`)
4. Replaces all variables with form data
5. Creates new file at `/healthcare/{sanitized-title}.html`
6. Pushes to GitHub repository
7. Returns public URL: `https://gourl.homes/healthcare/{filename}.html`

## 🐛 Troubleshooting

### "Failed to fetch template from GitHub"
- Check your `GITHUB_TOKEN` is valid
- Verify `GITHUB_USER` and `GITHUB_REPO` are correct
- Ensure `/index.html` exists in your repository

### "Failed to push to GitHub"
- Token needs `repo` permissions
- Check repository exists and is accessible
- Verify branch is `main` (not `master`)

### "Invalid password"
- Check `ADMIN_PASSWORD` environment variable is set correctly

## 📊 API Endpoints

- `POST /api/login` - Authenticate admin user
- `POST /api/logout` - Logout admin user
- `POST /api/generate` - Generate and deploy landing page (requires auth)
- `GET /health` - Health check endpoint

## 🎯 Example Template

```html
<!DOCTYPE html>
<html>
<head>
    <title>$title</title>
    <meta name="description" content="$description">
</head>
<body>
    <img src="$logo_url" alt="Logo">
    <h1>$title</h1>
    <p>$description</p>
    <a href="$chanel_url">Channel</a>
    <a href="$button_url">$button_name</a>
</body>
</html>
```

## 📄 License

MIT