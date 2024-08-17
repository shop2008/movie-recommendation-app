import React from "react";
import MovieCard from "./MovieCard";

const MovieList = ({ recommendations, movieDetails, isLoadingDetails }) => {
  return (
    <ul className="space-y-6">
      {recommendations.map((rec) => (
        <li key={rec.title}>
          <MovieCard
            movie={rec}
            details={movieDetails[rec.title] || {}}
            isLoading={isLoadingDetails[rec.title]}
          />
        </li>
      ))}
    </ul>
  );
};

export default MovieList;
