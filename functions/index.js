const functions = require('firebase-functions');
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const admin = require('firebase-admin');
const { genkit, z } = require('genkit');
const { googleAI, gemini15Flash } = require('@genkit-ai/googleai');

// Initialize Firebase Admin SDK
const serviceAccount = require('./movierecommender-b4395-firebase-adminsdk-quu0y-5ce74fcd69.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Initialize Genkit with Google AI plugin
const ai = genkit({
  plugins: [googleAI()],
  model: gemini15Flash,
});

// Define the schema for movie recommendations
const movieRecommendationSchema = z.object({
  recommendations: z.array(
    z.object({
      title: z.string(),
      year: z.number(),
      description: z.string(),
      reason: z.string(),
    })
  ),
});

const app = express();
app.use(cors());
app.use(express.json()); // To handle JSON request bodies

const OMDB_API_KEY = process.env.OMDB_API_KEY;

// Function to fetch movie details from OMDB API
async function fetchMovieDetails(titles) {
  const movieDetails = {};
  const titlesArray = Array.isArray(titles) ? titles : [titles];

  const fetchPromises = titlesArray.map(async (title) => {
    try {
      const response = await axios.get(
        `https://www.omdbapi.com/?t=${encodeURIComponent(
          title
        )}&apikey=${OMDB_API_KEY}`
      );
      if (response.data.Response === 'True') {
        const details = {
          title: response.data.Title,
          image: response.data.Poster !== 'N/A' ? response.data.Poster : null,
          imdbLink: `https://www.imdb.com/title/${response.data.imdbID}`,
          year: response.data.Year,
          rating: response.data.imdbRating,
          runtime: response.data.Runtime,
          director: response.data.Director,
          description: response.data.Plot,
        };
        movieDetails[title] = details;
      }
    } catch (error) {
      console.error(`Error fetching details for ${title}:`, error);
    }
  });

  await Promise.all(fetchPromises);
  return movieDetails;
}

// API endpoint to fetch movie details
app.get('/movie-details', async (req, res) => {
  try {
    const { title } = req.query;
    if (!title) {
      return res.status(400).json({ error: 'Movie title is required' });
    }

    const details = await fetchMovieDetails(title);
    if (Object.keys(details).length > 0) {
      res.json(details);
    } else {
      res.status(404).json({ error: 'Movie details not found' });
    }
  } catch (error) {
    console.error('Error fetching movie details:', error);
    res
      .status(500)
      .json({ error: 'An error occurred while fetching movie details' });
  }
});

app.post('/generate-movie-recommendations', async (req, res) => {
  try {
    const {
      userId,
      preference = [],
      languages = [],
      genres = [],
      maxResults = 5,
    } = req.body;

    let likedMovies = [];

    // Fetch user's liked movies from Firebase
    if (userId) {
      const userLikesRef = admin
        .firestore()
        .collection('users')
        .doc(userId)
        .collection('likes');
      const likesSnapshot = await userLikesRef.get();
      likedMovies = likesSnapshot.docs
        .map((doc) => doc.data().movieDetails.title)
        .filter(Boolean);
    }

    const { output } = await ai.generate({
      prompt: {
        text: `Generate ${maxResults} unique movie recommendations based on the following criteria:
        ${
          likedMovies.length
            ? `\nLiked movies (DO NOT recommend these): ${likedMovies.join(
                ', '
              )}`
            : ''
        }
        ${preference.length ? `\nPreferences: ${preference.join(', ')}` : ''}
        ${languages.length ? `\nLanguages: ${languages.join(', ')}` : ''}
        ${genres.length ? `\nGenres: ${genres.join(', ')}` : ''}
        
        Consider both classic and contemporary films that match the criteria.
        Ensure recommendations are diverse and avoid multiple movies from the same franchise.`,
        role: 'user',
      },
      output: {
        format: 'json',
        schema: movieRecommendationSchema,
      },
    });

    // Fetch additional movie details from OMDB
    const movieTitles = output.recommendations.map((rec) => rec.title);
    const movieDetails = await fetchMovieDetails(movieTitles);

    // Combine Genkit recommendations with OMDB details
    const enhancedRecommendations = output.recommendations.map((rec) => ({
      ...rec,
      ...movieDetails[rec.title],
    }));

    return res.json({ recommendations: enhancedRecommendations });
  } catch (error) {
    console.error('Error generating recommendations:', error);
    if (!res.headersSent) {
      return res.status(500).json({
        error: 'An error occurred while generating recommendations.',
      });
    }
  }
});

exports.api = functions.https.onRequest(app);
