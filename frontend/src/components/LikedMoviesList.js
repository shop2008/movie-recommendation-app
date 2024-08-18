import React, { useState } from "react";
import MovieCard from "./MovieCard";

const LikedMoviesList = ({ likedMovies, getThemeClass }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const moviesPerPage = 5;

  // Get current movies
  const indexOfLastMovie = currentPage * moviesPerPage;
  const indexOfFirstMovie = indexOfLastMovie - moviesPerPage;
  const currentMovies = likedMovies.slice(indexOfFirstMovie, indexOfLastMovie);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div>
      {likedMovies.length === 0 ? (
        <p className="text-gray-600">You haven't liked any movies yet.</p>
      ) : (
        <>
          <ul className="space-y-8">
            {currentMovies.map((movie) => (
              <li key={movie.id}>
                <MovieCard
                  movie={movie.movieDetails}
                  details={movie.movieDetails}
                  isLoading={false}
                  isLikedList={true}
                />
              </li>
            ))}
          </ul>
          <div className="mt-8 flex justify-center">
            <nav className="inline-flex rounded-md shadow">
              {Array.from(
                { length: Math.ceil(likedMovies.length / moviesPerPage) },
                (_, i) => (
                  <button
                    key={i}
                    onClick={() => paginate(i + 1)}
                    className={`px-4 py-2 text-sm font-medium ${
                      currentPage === i + 1
                        ? `${getThemeClass("secondary")} text-white`
                        : "bg-white text-gray-700 hover:bg-gray-50"
                    } ${
                      i === 0
                        ? "rounded-l-md"
                        : i ===
                          Math.ceil(likedMovies.length / moviesPerPage) - 1
                        ? "rounded-r-md"
                        : ""
                    } border border-gray-300 focus:z-10 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500`}
                  >
                    {i + 1}
                  </button>
                )
              )}
            </nav>
          </div>
        </>
      )}
    </div>
  );
};

export default LikedMoviesList;
