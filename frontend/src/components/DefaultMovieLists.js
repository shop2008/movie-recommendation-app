import React from "react";
import { motion } from "framer-motion";
import LandingPageMovieCard from "./LandingPageMovieCard";

const MovieList = ({ title, movies }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: 0.2 }}
    className="mb-12"
  >
    <h3 className="text-2xl font-bold mb-4 text-purple-400">{title}</h3>
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
      {movies.map((movie) => (
        <LandingPageMovieCard key={movie.id} movie={movie} />
      ))}
    </div>
  </motion.div>
);

const DefaultMovieLists = ({ trending, topRated, upcoming }) => {
  return (
    <div>
      <MovieList title="Trending Now" movies={trending} />
      <MovieList title="Top Rated" movies={topRated} />
      <MovieList title="Upcoming" movies={upcoming} />
    </div>
  );
};

export default DefaultMovieLists;
