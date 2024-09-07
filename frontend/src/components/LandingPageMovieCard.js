import React from "react";
import { motion } from "framer-motion";

const LandingPageMovieCard = ({ movie }) => {
  const handleClick = () => {
    // Construct the TMDB movie page URL
    const tmdbUrl = `https://www.themoviedb.org/movie/${movie.id}`;
    // Open the TMDB page in a new tab
    window.open(tmdbUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="relative group overflow-hidden rounded-lg shadow-lg cursor-pointer"
      onClick={handleClick}
    >
      <img
        src={movie.image}
        alt={movie.title}
        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      <div className="absolute bottom-0 left-0 right-0 p-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <h3 className="text-lg font-semibold">{movie.title}</h3>
        <p className="text-sm">{new Date(movie.year).getFullYear()}</p>
      </div>
    </motion.div>
  );
};

export default LandingPageMovieCard;
