const express = require('express');
const axios = require('axios');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Environment variables
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_USER = process.env.GITHUB_USER;
const GITHUB_REPO = process.env.GITHUB_REPO;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

// Session storage (in-memory for simplicity)
const sessions = new Set();

// Middleware to check authentication
function isAuthenticated(req, res, next) {
  const sessionToken = req.headers['authorization'];
  if (sessions.has(sessionToken)) {
    next();
  } else {
    res.status(401).json({ error: 'Unauthorized' });
  }
}

// Login endpoint
app.post('/api/login', (req, res) => {
  const { password } = req.body;
  
  if (password === ADMIN_PASSWORD) {
    const sessionToken = Math.random().toString(36).substring(2);
    sessions.add(sessionToken);
    res.json({ success: true, token: sessionToken });
  } else {
    res.status(401).json({ error: 'Invalid password' });
  }
});

// Logout endpoint
app.post('/api/logout', (req, res) => {
  const sessionToken = req.headers['authorization'];
  sessions.delete(sessionToken);
  res.json({ success: true });
});

// Get template from GitHub
async function getTemplate() {
  try {
    const response = await axios.get(
      `https://api.github.com/repos/${GITHUB_USER}/${GITHUB_REPO}/contents/index.html`,
      {
        headers: {
          'Authorization': `token ${GITHUB_TOKEN}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      }
    );
    
    // Decode base64 content
    const content = Buffer.from(response.data.content, 'base64').toString('utf-8');
    return content;
  } catch (error) {
    console.error('Error fetching template:', error.response?.data || error.message);
    throw new Error('Failed to fetch template from GitHub');
  }
}

// Replace variables in template
function replaceVariables(template, data) {
  let result = template;
  result = result.replace(/\$title/g, data.title);
  result = result.replace(/\$description/g, data.description);
  result = result.replace(/\$chanel_url/g, data.chanel_url);
  result = result.replace(/\$logo_url/g, data.logo_url);
  result = result.replace(/\$button_name/g, data.button_name);
  result = result.replace(/\$button_url/g, data.button_url);
  return result;
}

// Push file to GitHub
async function pushToGitHub(content, filename) {
  try {
    const filePath = `healthcare/${filename}`;
    
    // Check if file exists to get SHA
    let sha = null;
    try {
      const existingFile = await axios.get(
        `https://api.github.com/repos/${GITHUB_USER}/${GITHUB_REPO}/contents/${filePath}`,
        {
          headers: {
            'Authorization': `token ${GITHUB_TOKEN}`,
            'Accept': 'application/vnd.github.v3+json'
          }
        }
      );
      sha = existingFile.data.sha;
    } catch (error) {
      // File doesn't exist, that's okay
    }

    // Create or update file
    const response = await axios.put(
      `https://api.github.com/repos/${GITHUB_USER}/${GITHUB_REPO}/contents/${filePath}`,
      {
        message: `Add/Update landing page: ${filename}`,
        content: Buffer.from(content).toString('base64'),
        sha: sha,
        branch: 'main'
      },
      {
        headers: {
          'Authorization': `token ${GITHUB_TOKEN}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error('Error pushing to GitHub:', error.response?.data || error.message);
    throw new Error('Failed to push to GitHub');
  }
}

// Generate landing page endpoint
app.post('/api/generate', isAuthenticated, async (req, res) => {
  try {
    const { title, description, chanel_url, logo_url, button_name, button_url } = req.body;

    // Validate required fields
    if (!title || !description || !chanel_url || !logo_url || !button_name || !button_url) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Get template
    const template = await getTemplate();

    // Replace variables
    const generatedHTML = replaceVariables(template, {
      title,
      description,
      chanel_url,
      logo_url,
      button_name,
      button_url
    });

    // Create filename from title (sanitize)
    const filename = title.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-') + '.html';

    // Push to GitHub
    const result = await pushToGitHub(generatedHTML, filename);

    // Generate final URL
    const finalURL = `https://gourl.homes/healthcare/${filename}`;

    res.json({
      success: true,
      url: finalURL,
      filename: filename,
      github_url: result.content.html_url
    });

  } catch (error) {
    console.error('Error generating page:', error);
    res.status(500).json({ error: error.message });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Serve index.html for root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});