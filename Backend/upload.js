const express = require('express');
const multer = require('multer');
const pdfParser = require('pdf-parse');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 3001;

// Multer configuration for handling file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.use(bodyParser.json());
app.use(cors());


// POST endpoint for uploading files
app.post('/file', upload.array('cvFiles', 3), async (req, res) => {
  try {
    const cvFiles = req.files;

    const results = await Promise.all(cvFiles.map(async (file) => {
      const text = (await pdfParser(file.buffer)).text;
      return { filename: file.originalname, text };
    }));

    res.json(results);
  } catch (error) {
    console.error('Error uploading files:', error);
    res.status(500).json({ error: 'An error occurred while uploading files' });
  }
});



// POST endpoint for uploading CVs and keywords
app.post('/upload-cvs', upload.any(), async (req, res) => {
    try {
    const cvFiles = req.files;
    const keywords = req.body.keywords.split(',');

    const results = await Promise.all(cvFiles.map(async (file) => {
      const text = (await pdfParser(file.buffer)).text;
      const mark = calculateMark(text, keywords);
      return { filename: file.originalname, mark };
    }));

    res.json(results);
  } catch (error) {
    console.error('Error processing CVs:', error);
    res.status(500).json({ error: 'An error occurred while processing CVs' });
  }
});

// Function to calculate mark based on keyword matching
function calculateMark(text, keywords) {
  const words = text.toLowerCase().split(/\W+/);
  const matchingWords = words.filter(word => keywords.includes(word));
  const matchPercentage = (matchingWords.length / words.length) * 100;
  return Math.round(matchPercentage);
}

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
