require("dotenv").config();
const express = require("express");
const cors = require("cors");
const axios = require("axios");
const admin = require("firebase-admin");

// Initialize Firebase Admin SDK
const serviceAccount = require("../movierecommender-b4395-firebase-adminsdk-quu0y-5ce74fcd69.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const app = express();
app.use(cors());
app.use(express.json()); // To handle JSON request bodies

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const OMDB_API_KEY = process.env.OMDB_API_KEY;

const { GoogleGenerativeAI } = require("@google/generative-ai");

// Access your API key as an environment variable (see "Set up your API key" above)
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  generationConfig: {
    responseMimeType: "application/json",
  },
});

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
      if (response.data.Response === "True") {
        const details = {
          title: response.data.Title,
          image: response.data.Poster !== "N/A" ? response.data.Poster : null,
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
app.get("/movie-details", async (req, res) => {
  try {
    const { title } = req.query;
    if (!title) {
      return res.status(400).json({ error: "Movie title is required" });
    }

    const details = await fetchMovieDetails(title);
    if (Object.keys(details).length > 0) {
      res.json(details);
    } else {
      res.status(404).json({ error: "Movie details not found" });
    }
  } catch (error) {
    console.error("Error fetching movie details:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching movie details" });
  }
});

app.post("/generate-movie-recommendations", async (req, res) => {
  try {
    const {
      userId,
      preference = [],
      languages = [],
      genres = [],
      maxResults = 5,
    } = req.body;

    let likedMovies = [];

    // Fetch user's liked movies from Firebase if userId is provided
    if (userId) {
      const userLikesRef = admin
        .firestore()
        .collection("users")
        .doc(userId)
        .collection("likes");
      const likesSnapshot = await userLikesRef.get();

      for (const doc of likesSnapshot.docs) {
        const movieData = doc.data();
        if (movieData.movieDetails.title) {
          likedMovies.push(movieData.movieDetails.title);
        }
      }
      console.log("likedMovies", likedMovies);
    }

    // Filter out empty strings and join non-empty values
    const preferenceString = preference.filter(Boolean).join(", ");
    const languagesString = languages.filter(Boolean).join(", ");
    const genresString = genres.filter(Boolean).join(", ");
    const likedMoviesString = likedMovies.join(", ");

    let prompt = `Generate ${maxResults} unique movie recommendations based on the following criteria:`;
    if (likedMoviesString) {
      prompt += `\n- User's liked movies (DO NOT recommend these): ${likedMoviesString}`;
      prompt += `\n- Use these liked movies as reference for the user's taste, but recommend new, different movies.`;
    } else {
      prompt += `\n- User has no liked movies record. Focus on the provided preferences, languages, and genres.`;
    }
    if (preferenceString) prompt += `\n- Preferences: ${preferenceString}`;
    if (languagesString) prompt += `\n- Languages: ${languagesString}`;
    if (genresString) prompt += `\n- Genres: ${genresString}`;

    prompt += `\n
Important guidelines:
1. ${
      likedMoviesString
        ? "DO NOT recommend any of the liked movies listed above."
        : "Provide diverse recommendations based on the given criteria."
    }
2. Prioritize recommendations based on the user's preferences${
      likedMoviesString ? " and the themes/styles of their liked movies" : ""
    }.
3. Ensure diversity in recommendations, avoiding multiple movies from the same franchise or director.
4. Consider both classic and contemporary films that match the criteria.
5. If language preferences are provided, prioritize movies in those languages but don't exclude excellent matches in other languages.

For each recommended movie, provide:
1. Title
2. Year
3. Brief description
4. Reason for recommendation (based on ${
      likedMoviesString ? "user's liked movies, " : ""
    }preferences, or input criteria)
Format as JSON:
{
  "recommendations": [
    {
      "title": "Movie Title",
      "year": 2023,
      "description": "Brief description.",
      "reason": "Recommended because it matches [preference or criteria] in terms of [aspect]."
    }
  ]
}`;

    console.log("Sending prompt to Gemini API:", prompt);
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const jsonResponse = response.text();
    console.log("Gemini API response:", jsonResponse);

    // Parse the JSON response
    const recommendations = JSON.parse(jsonResponse);

    const responseData = {
      recommendations: recommendations.recommendations,
    };

    return res.json(responseData);
  } catch (error) {
    console.error("Error calling Gemini API:", error);

    // Only send error response if headers haven't been sent yet
    if (!res.headersSent) {
      return res
        .status(500)
        .json({ error: "An error occurred while generating recommendations." });
    }
  }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
