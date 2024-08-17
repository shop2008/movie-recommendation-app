import React, { useState, useEffect } from "react";
import { HeartIcon, ClockIcon, FilmIcon } from "@heroicons/react/24/solid";
import { db, auth } from "../firebase";
import { doc, setDoc, deleteDoc, getDoc } from "firebase/firestore";

const MovieCard = ({ movie, details, isLoading }) => {
  const [isLiked, setIsLiked] = useState(false);

  // Extract IMDb ID from the IMDb link
  const getImdbId = (imdbLink) => {
    if (!imdbLink) return null;
    const parts = imdbLink.split("/");
    return parts[parts.length - 1] || parts[parts.length - 2];
  };

  const imdbId = details ? getImdbId(details.imdbLink) : null;

  useEffect(() => {
    const checkLikedStatus = async () => {
      if (auth.currentUser && imdbId) {
        const likeDoc = doc(
          db,
          "movies",
          imdbId,
          "likes",
          auth.currentUser.uid
        );
        const docSnap = await getDoc(likeDoc);
        setIsLiked(docSnap.exists());
      }
    };
    if (imdbId) {
      checkLikedStatus();
    }
  }, [imdbId]);

  const handleLike = async () => {
    if (!auth.currentUser) {
      alert("Please log in to like movies");
      return;
    }

    if (!imdbId) {
      console.error("IMDb ID is undefined");
      return;
    }

    const likeRef = doc(db, "movies", imdbId, "likes", auth.currentUser.uid);

    try {
      if (isLiked) {
        await deleteDoc(likeRef);
      } else {
        await setDoc(likeRef, {
          userId: auth.currentUser.uid,
          timestamp: new Date(),
        });
      }
      setIsLiked(!isLiked);
    } catch (error) {
      console.error("Error updating like status:", error);
      console.error("Error details:", error.code, error.message);
      alert(`Error: ${error.message}`);
    }
  };

  if (!movie) {
    console.error("Movie is undefined");
    return null; // or return a placeholder component
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl">
      <div className="md:flex h-72">
        <div className="md:flex-shrink-0 relative w-full md:w-56">
          {details && details.image ? (
            <img
              src={details.image}
              alt={movie.title}
              className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
            />
          ) : (
            <div className="h-full w-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-500">No image available</span>
            </div>
          )}
          {details && details.rating && (
            <div className="absolute top-2 right-2 bg-yellow-500 text-white px-2 py-1 rounded-full text-sm font-bold">
              ★ {details.rating}
            </div>
          )}
        </div>
        <div className="p-6 flex flex-col justify-between flex-grow">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-baseline">
                <h3 className="text-2xl font-extrabold text-gray-900 hover:text-pink-600 transition-colors duration-200">
                  {movie.title}
                </h3>
                {details && details.year && (
                  <span className="ml-2 text-lg font-medium text-gray-500">
                    ({details.year})
                  </span>
                )}
              </div>
              {imdbId && (
                <button
                  onClick={handleLike}
                  className={`p-2 rounded-full ${
                    isLiked
                      ? "text-red-500 bg-red-100"
                      : "text-gray-400 bg-gray-100"
                  } hover:bg-gray-200 transition-all duration-200 transform hover:scale-110`}
                  aria-label={isLiked ? "Unlike movie" : "Like movie"}
                >
                  <HeartIcon
                    className={`h-6 w-6 ${
                      isLiked ? "fill-current" : "stroke-current"
                    }`}
                  />
                </button>
              )}
            </div>
            {isLoading ? (
              <p className="text-sm text-gray-500">Loading details...</p>
            ) : (
              <>
                <div className="space-y-1 mb-3">
                  {details && details.director && (
                    <p className="text-sm font-medium text-gray-500 flex items-center">
                      <FilmIcon className="h-4 w-4 mr-1" />
                      {details.director}
                    </p>
                  )}
                  {details && details.runtime && (
                    <p className="text-sm font-medium text-gray-500 flex items-center">
                      <ClockIcon className="h-4 w-4 mr-1" />
                      {details.runtime}
                    </p>
                  )}
                </div>
                <p className="mt-3 text-base text-gray-700 leading-relaxed line-clamp-3 duration-300">
                  {details
                    ? details.description
                    : movie.description || "No description available."}
                </p>
              </>
            )}
          </div>
          {details && details.imdbLink && (
            <div className="mt-4">
              <a
                href={details.imdbLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-semibold rounded-md text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 transition duration-200"
              >
                View on IMDb
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
