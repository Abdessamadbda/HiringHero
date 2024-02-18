const express = require('express');
const axios = require('axios');
const qs = require('qs');
const bodyParser = require('body-parser');
const session = require('express-session');
const crypto = require('crypto');
const cors = require('cors');
const JobOffer = require('./models/jobOffer');
require('dotenv').config();

const app = express();

// Middleware for parsing URL-encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));

// Middleware for managing sessions
app.use(session({
  secret: crypto.randomBytes(64).toString('hex'),
  resave: false,
  saveUninitialized: true
}));

app.use(cors());

// LinkedIn OAuth 2.0 credentials
const clientID = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;

// Use clientID and clientSecret in your code

const redirectURI = 'http://localhost:3001/auth/linkedin/callback';

// Redirect user to LinkedIn authorization page
app.get('/auth/linkedin', (req, res) => {
  const scope = 'r_liteprofile w_member_social';

  res.redirect(`https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${clientID}&redirect_uri=${redirectURI}&scope=${scope}`);
});

// Handle authorization callback from LinkedIn
app.get('/auth/linkedin/callback', async (req, res) => {
  const { code } = req.query;

  try {
    // Exchange authorization code for access token
    const tokenResponse = await axios.post('https://www.linkedin.com/oauth/v2/accessToken', qs.stringify({
      grant_type: 'authorization_code',
      code,
      redirect_uri: redirectURI,
      client_id: clientID,
      client_secret: clientSecret
    }), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    const accessToken = tokenResponse.data.access_token;

    // Store access token securely in session
    req.session.accessToken = accessToken;

    // Retrieve user's LinkedIn ID
    const userInfoResponse = await axios.get('https://api.linkedin.com/v2/me', {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });

    const linkedinUserId = userInfoResponse.data.id;

    // Store user's LinkedIn ID in session
    req.session.linkedinUserId = linkedinUserId;

    // Redirect user to form page
    res.redirect('/form');
  } catch (error) {
    console.error('Error exchanging authorization code for access token:', error.response.data);
    res.status(500).send('An error occurred while processing your request.');
  }
});

// Display form to collect job offer details
app.get('/form', (req, res) => {
  // Display form to collect job offer details
  res.send('Please fill out the form to share a job offer on LinkedIn');
});

// Handle form submission
app.post('/submit', async (req, res) => {
  try {
    // Retrieve form data
    const formData = req.body;

    // Create a new job offer instance
    const newJobOffer = new JobOffer({
      companyName: formData.companyName,
      email: formData.email,
      position: formData.position,
      experience: formData.experience,
      education: formData.education,
      description: formData.description,
      address: formData.address,
    });

    // Save the job offer to the database
    await newJobOffer.save();

    res.send('Job offer saved successfully!');
  } catch (error) {
    console.error('Error saving job offer:', error);
    res.status(500).send('An error occurred while saving the job offer.');
  }
  try {
    // Retrieve form data
    const formData = req.body;

    // Compose post content
    const postContent = `New job offer:\n
      Company: ${formData.companyName}\n
      Email: ${formData.email}\n
      Position: ${formData.position}\n
      Experience Level: ${formData.experience}\n
      Education Requirements: ${formData.education}\n
      Description: ${formData.description}\n
      Address: ${formData.address}\n`;

    // Share post on LinkedIn using access token and LinkedIn ID
    await sharePostOnLinkedIn(req.session.accessToken, req.session.linkedinUserId, postContent);

    res.send('Post shared successfully on LinkedIn!');
  } catch (error) {
    console.error('Error submitting job offer:', error);
    res.status(500).send('An error occurred while submitting the job offer.');
  }
});

// Share post on LinkedIn using access token
async function sharePostOnLinkedIn(accessToken, linkedinUserId, postContent) {
  try {
    const response = await axios.post(
      'https://api.linkedin.com/v2/ugcPosts',
      {
        author: `urn:li:person:${linkedinUserId}`, // Use user's LinkedIn ID
        lifecycleState: 'PUBLISHED',
        specificContent: {
          'com.linkedin.ugc.ShareContent': {
            shareCommentary: {
              text: postContent,
            },
            shareMediaCategory: 'NONE',
          },
        },
        visibility: {
          'com.linkedin.ugc.MemberNetworkVisibility': 'CONNECTIONS',
        },
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('Post shared successfully:', response.data);
  } catch (error) {
    console.error('Error sharing post on LinkedIn:', error.response.data);
  }
}

app.listen(3001, () => {
  console.log('Server is running on port 3001');
});
