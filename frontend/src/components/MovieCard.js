import React, { useState, useEffect } from "react";
import {
  HeartIcon,
  ClockIcon,
  FilmIcon,
  StarIcon,
} from "@heroicons/react/24/solid";
import { db, auth } from "../firebase";
import { doc, setDoc, deleteDoc, getDoc } from "firebase/firestore";

const MovieCard = ({
  movie,
  details,
  isLoading,
  isLikedList = false,
  recommendReason,
}) => {
  const [isLiked, setIsLiked] = useState(isLikedList);

  // Extract IMDb ID from the IMDb link
  const getImdbId = (imdbLink) => {
    if (!imdbLink) return null;
    const parts = imdbLink.split("/");
    return parts[parts.length - 1] || parts[parts.length - 2];
  };

  const imdbId = details ? getImdbId(details.imdbLink) : null;

  useEffect(() => {
    if (!isLikedList) {
      const checkLikedStatus = async () => {
        if (auth.currentUser && imdbId) {
          const likeDoc = doc(
            db,
            "users",
            auth.currentUser.uid,
            "likes",
            imdbId
          );
          const docSnap = await getDoc(likeDoc);
          setIsLiked(docSnap.exists());
        }
      };
      if (imdbId) {
        checkLikedStatus();
      }
    }
  }, [imdbId, isLikedList]);

  const handleLike = async () => {
    if (!auth.currentUser) {
      alert("Please log in to like movies");
      return;
    }

    if (!imdbId) {
      console.error("IMDb ID is undefined");
      return;
    }

    const likeRef = doc(db, "users", auth.currentUser.uid, "likes", imdbId);

    try {
      if (isLiked) {
        await deleteDoc(likeRef);
      } else {
        await setDoc(likeRef, {
          ...(details &&
            Object.keys(details).length > 0 && { movieDetails: details }),
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

  if (!movie && !details) {
    console.error("Movie or details is undefined");
    return null; // or return a placeholder component
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl">
      <div className="md:flex h-auto">
        <div className="md:flex-shrink-0 relative w-full md:w-56">
          {isLoading ? (
            <div className="h-full w-full bg-gray-200 animate-pulse"></div>
          ) : (
            <img
              src={details.image}
              alt={movie.title || details.title}
              className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
            />
          )}
          {!isLoading && details && details.rating && (
            <div className="absolute top-2 right-2 bg-yellow-500 text-white px-2 py-1 rounded-full text-sm font-bold">
              ★ {details.rating}
            </div>
          )}
        </div>
        <div className="p-6 flex flex-col justify-between flex-grow">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-baseline">
                {isLoading ? (
                  <div className="h-8 w-48 bg-gray-200 rounded animate-pulse"></div>
                ) : (
                  <h3 className="text-2xl font-extrabold text-gray-900 hover:text-pink-600 transition-colors duration-200">
                    {movie.title || details.title}
                  </h3>
                )}
                {!isLoading && details && details.year && (
                  <span className="ml-2 text-lg font-medium text-gray-500">
                    ({details.year})
                  </span>
                )}
              </div>
              {!isLoading && imdbId && (
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
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                </div>
                <div className="space-y-2">
                  <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 w-2/3 bg-gray-200 rounded animate-pulse"></div>
                </div>
                <div className="h-20 w-full bg-gray-200 rounded animate-pulse"></div>
                <div className="h-10 w-32 bg-gray-200 rounded animate-pulse"></div>
              </div>
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
          {!isLoading && recommendReason && (
            <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-md p-3">
              <p className="text-sm text-yellow-800 flex items-start">
                <StarIcon className="h-5 w-5 mr-2 text-yellow-600 flex-shrink-0" />
                <span>
                  <strong className="font-semibold">
                    Why we recommend this:{" "}
                  </strong>
                  {recommendReason}
                </span>
              </p>
            </div>
          )}
          {!isLoading && details && details.imdbLink && (
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
