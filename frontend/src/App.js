import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import MovieList from "./components/MovieList";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth, db } from "./firebase";
import { collection, getDocs } from "firebase/firestore";
import LikedMoviesList from "./components/LikedMoviesList";
import ThemeSelector from "./components/ThemeSelector";
import UserAuth from "./components/UserAuth";
import TabNavigation from "./components/TabNavigation";
import LoginPrompt from "./components/LoginPrompt"; // New import
import {
  API_BASE_URL,
  themes,
  availableLanguages,
  availableGenres,
  resultOptions,
  themeSwatches,
} from "./constants";

function App() {
  const [preference, setPreference] = useState("");
  const [recommendations, setRecommendations] = useState([]);
  const [movieDetails, setMovieDetails] = useState({});
  const [languages, setLanguages] = useState(["English"]);
  const [genres, setGenres] = useState([]);
  const [maxResults, setMaxResults] = useState(5);
  const [currentTheme, setCurrentTheme] = useState("default");
  const [isThemeDropdownOpen, setIsThemeDropdownOpen] = useState(false);
  const themeDropdownRef = useRef(null);
  const [user, setUser] = useState(null);
  const [showAuth, setShowAuth] = useState(false);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [isLoadingDetails, setIsLoadingDetails] = useState({});
  const [authChecked, setAuthChecked] = useState(false);
  const [likedMovies, setLikedMovies] = useState([]);
  const [isLoadingLikedMovies, setIsLoadingLikedMovies] = useState(false);
  const [activeTab, setActiveTab] = useState("recommendations");

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        themeDropdownRef.current &&
        !themeDropdownRef.current.contains(event.target)
      ) {
        setIsThemeDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setAuthChecked(true);
      if (!user) {
        setLikedMovies([]);
      }
    });

    return () => unsubscribe();
  }, []);

  const getRecommendation = async () => {
    setButtonLoading(true);
    try {
      const response = await axios.post(
        `${API_BASE_URL}/generate-movie-recommendations`,
        {
          userId: user ? user.uid : null,
          preference: preference ? [preference] : [],
          languages: languages,
          genres: genres,
          maxResults: maxResults,
        }
      );
      setRecommendations(response.data.recommendations);
      setButtonLoading(false); // Set loading to false immediately after setting recommendations

      // Fetch movie details for each recommendation asynchronously
      response.data.recommendations.forEach((movie) => {
        fetchMovieDetails(movie.title);
      });
    } catch (error) {
      console.error("Error fetching recommendation:", error);
      alert("Error fetching recommendation. Please try again.");
      setButtonLoading(false);
    }
  };

  const fetchMovieDetails = async (title) => {
    setIsLoadingDetails((prev) => ({ ...prev, [title]: true }));
    try {
      const response = await axios.get(
        `${API_BASE_URL}/movie-details?title=${encodeURIComponent(title)}`
      );
      if (response.data && Object.keys(response.data).length > 0) {
        setMovieDetails((prev) => ({ ...prev, [title]: response.data }));
      } else {
        // Remove the movie from recommendations if no details are returned
        setRecommendations((prev) =>
          prev.filter((movie) => movie.title !== title)
        );
        console.log(
          `No details found for ${title}. Removing from recommendations.`
        );
      }
    } catch (error) {
      console.error(`Error fetching details for ${title}:`, error);
      // Remove the movie from recommendations if there's an error
      setRecommendations((prev) =>
        prev.filter((movie) => movie.title !== title)
      );
    } finally {
      setIsLoadingDetails((prev) => ({ ...prev, [title]: false }));
    }
  };

  const handleLanguageChange = (language) => {
    setLanguages((prev) =>
      prev.includes(language)
        ? prev.filter((l) => l !== language)
        : [...prev, language]
    );
  };

  const handleGenreChange = (genre) => {
    setGenres((prev) =>
      prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]
    );
  };

  const getThemeClass = (type) => {
    return themes[currentTheme][type];
  };

  const handleLogin = (userData) => {
    setUser(userData);
    setShowAuth(false);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setActiveTab("recommendations"); // Switch to recommendations tab after logout
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const fetchLikedMovies = async (userId) => {
    setIsLoadingLikedMovies(true);
    try {
      const likedMoviesRef = collection(db, "users", userId, "likes");
      const querySnapshot = await getDocs(likedMoviesRef);

      const likedMovies = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setLikedMovies(likedMovies);
    } catch (error) {
      console.error("Error fetching liked movies:", error);
    } finally {
      setIsLoadingLikedMovies(false);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === "liked" && user) {
      fetchLikedMovies(user.uid);
    }
  };

  return (
    <div
      className={`${getThemeClass(
        "background"
      )} min-h-screen py-12 px-4 sm:px-6 lg:px-8 relative`}
    >
      <ThemeSelector
        currentTheme={currentTheme}
        setCurrentTheme={setCurrentTheme}
        isThemeDropdownOpen={isThemeDropdownOpen}
        setIsThemeDropdownOpen={setIsThemeDropdownOpen}
        themeDropdownRef={themeDropdownRef}
        themeSwatches={themeSwatches}
      />

      <UserAuth
        user={user}
        authChecked={authChecked}
        showAuth={showAuth}
        setShowAuth={setShowAuth}
        handleLogin={handleLogin}
        handleLogout={handleLogout}
        getThemeClass={getThemeClass}
      />

      <div className="max-w-3xl mx-auto mt-16">
        <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
          <TabNavigation
            activeTab={activeTab}
            setActiveTab={handleTabChange}
            user={user}
            getThemeClass={getThemeClass}
          />

          <div className="px-6 py-8 sm:p-10">
            {activeTab === "recommendations" && (
              <>
                <h1
                  className={`text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r ${getThemeClass(
                    "primary"
                  )} mb-8 text-center`}
                >
                  Movie Maestro
                </h1>

                <div className="space-y-6">
                  <div>
                    <label
                      htmlFor="preference"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Movie preference
                    </label>
                    <input
                      id="preference"
                      type="text"
                      placeholder="Enter your movie preference"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition duration-200"
                      value={preference}
                      onChange={(e) => setPreference(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Languages
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {availableLanguages.map((language) => (
                        <button
                          key={language}
                          onClick={() => handleLanguageChange(language)}
                          className={`px-3 py-1 rounded-full text-sm font-medium transition-colors duration-200 ${
                            languages.includes(language)
                              ? `${getThemeClass("secondary")} text-white`
                              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                          }`}
                        >
                          {language}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Genres
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {availableGenres.map((genre) => (
                        <button
                          key={genre}
                          onClick={() => handleGenreChange(genre)}
                          className={`px-3 py-1 rounded-full text-sm font-medium transition-colors duration-200 ${
                            genres.includes(genre)
                              ? `${getThemeClass("tertiary")} text-white`
                              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                          }`}
                        >
                          {genre}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Number of Results
                    </label>
                    <div className="flex gap-2">
                      {resultOptions.map((option) => (
                        <button
                          key={option}
                          onClick={() => setMaxResults(option)}
                          className={`px-4 py-2 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 transition-colors duration-200 ${
                            maxResults === option
                              ? `${getThemeClass("secondary")} text-white`
                              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={getRecommendation}
                    disabled={buttonLoading}
                    className={`w-full bg-gradient-to-r ${getThemeClass(
                      "primary"
                    )} text-white py-3 rounded-lg font-semibold shadow-md hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 transition duration-200`}
                  >
                    {buttonLoading ? (
                      <div className="flex items-center justify-center">
                        <svg
                          className="animate-spin h-5 w-5 mr-3"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Getting Recommendations...
                      </div>
                    ) : (
                      "Get Recommendations"
                    )}
                  </button>
                </div>
              </>
            )}

            {activeTab === "liked" && (
              <>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Your Liked Movies
                </h2>
                {user ? (
                  isLoadingLikedMovies ? (
                    <div className="flex justify-center items-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
                    </div>
                  ) : (
                    <LikedMoviesList
                      likedMovies={likedMovies}
                      getThemeClass={getThemeClass}
                    />
                  )
                ) : (
                  <LoginPrompt
                    setShowAuth={setShowAuth}
                    getThemeClass={getThemeClass}
                  />
                )}
              </>
            )}
          </div>

          {recommendations.length > 0 && activeTab === "recommendations" && (
            <div className="bg-gray-50 px-6 py-8 sm:p-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Your Recommendations
              </h2>
              <MovieList
                recommendations={recommendations}
                movieDetails={movieDetails}
                isLoadingDetails={isLoadingDetails}
                fetchMovieDetails={fetchMovieDetails}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
