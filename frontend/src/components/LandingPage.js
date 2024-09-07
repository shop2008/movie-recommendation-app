import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import DefaultMovieLists from "./DefaultMovieLists";
import axios from "axios";
import { motion } from "framer-motion";

const TMDB_API_KEY = process.env.REACT_APP_TMDB_API_KEY;
const TMDB_API_BASE_URL = "https://api.themoviedb.org/3";

const fetchTMDBMovies = async (endpoint, limit = 5) => {
  const response = await axios.get(`${TMDB_API_BASE_URL}${endpoint}`, {
    params: {
      api_key: TMDB_API_KEY,
      language: "en-US",
      page: 1,
    },
  });

  return response.data.results.slice(0, limit).map((movie) => ({
    id: movie.id,
    title: movie.title,
    year: movie.release_date,
    image: movie.poster_path,
  }));
};

const LandingPage = () => {
  const [defaultLists, setDefaultLists] = useState({
    trending: [],
    topRated: [],
    upcoming: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const fetchedRef = useRef(false);

  const fetchDefaultLists = async () => {
    try {
      const [configResponse, trendingMovies, topRatedMovies, upcomingMovies] =
        await Promise.all([
          axios.get(`${TMDB_API_BASE_URL}/configuration`, {
            params: { api_key: TMDB_API_KEY },
          }),
          fetchTMDBMovies("/trending/movie/week"),
          fetchTMDBMovies("/movie/top_rated"),
          fetchTMDBMovies("/movie/upcoming"),
        ]);

      const baseUrl = configResponse.data.images.secure_base_url;
      const posterSize = configResponse.data.images.poster_sizes[3];

      const addImageUrl = (movies) =>
        movies.map((movie) => ({
          ...movie,
          image: `${baseUrl}${posterSize}${movie.image}`,
        }));

      console.log(addImageUrl(trendingMovies));

      setDefaultLists({
        trending: addImageUrl(trendingMovies),
        topRated: addImageUrl(topRatedMovies),
        upcoming: addImageUrl(upcomingMovies),
      });
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching default movie lists:", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!fetchedRef.current) {
      console.log("Fetching default lists");
      fetchDefaultLists();
      fetchedRef.current = true;
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 text-white">
      {/* Hero Section */}
      <div className="relative h-screen">
        <div className="absolute inset-0 bg-black opacity-75 z-10"></div>
        <div className="absolute inset-0 overflow-hidden">
          <video
            className="absolute w-full h-full object-cover"
            autoPlay
            loop
            muted
            playsInline
          >
            <source src="/cinema-background.webm" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="relative z-20 flex flex-col items-center justify-center h-full text-center px-4"
        >
          <h1 className="text-6xl md:text-8xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
            Movie Maestro
          </h1>
          <p className="text-xl md:text-2xl mb-12 max-w-2xl">
            Discover your next favorite movie with personalized recommendations.
          </p>
          <Link
            to="/recommendations"
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-3 px-8 rounded-full text-xl hover:from-purple-700 hover:to-pink-700 transition duration-300 transform hover:scale-105 hover:shadow-lg"
          >
            Get Started
          </Link>
        </motion.div>
      </div>

      {/* Movie Lists Section */}
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="text-4xl font-bold mb-12 text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600"
        >
          Featured Movies
        </motion.h2>
        {isLoading ? (
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        ) : (
          <DefaultMovieLists
            trending={defaultLists.trending}
            topRated={defaultLists.topRated}
            upcoming={defaultLists.upcoming}
          />
        )}
      </div>
    </div>
  );
};

export default LandingPage;
