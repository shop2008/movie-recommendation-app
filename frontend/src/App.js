import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import MovieList from "./components/MovieList";
import Auth from "./components/Auth";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "./firebase";

const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:5001/api";

const themes = {
  default: {
    background: "bg-gradient-to-br from-pink-100 to-purple-100",
    primary: "from-pink-500 to-purple-600",
    secondary: "bg-pink-500",
    tertiary: "bg-purple-500",
  },
  ocean: {
    background: "bg-gradient-to-br from-blue-100 to-teal-100",
    primary: "from-blue-500 to-teal-600",
    secondary: "bg-blue-500",
    tertiary: "bg-teal-500",
  },
  sunset: {
    background: "bg-gradient-to-br from-orange-100 to-red-100",
    primary: "from-orange-500 to-red-600",
    secondary: "bg-orange-500",
    tertiary: "bg-red-500",
  },
  forest: {
    background: "bg-gradient-to-br from-green-100 to-emerald-100",
    primary: "from-green-500 to-emerald-600",
    secondary: "bg-green-500",
    tertiary: "bg-emerald-500",
  },
  lavender: {
    background: "bg-gradient-to-br from-purple-100 to-indigo-100",
    primary: "from-purple-500 to-indigo-600",
    secondary: "bg-purple-500",
    tertiary: "bg-indigo-500",
  },
  autumn: {
    background: "bg-gradient-to-br from-yellow-100 to-red-100",
    primary: "from-yellow-500 to-red-600",
    secondary: "bg-yellow-500",
    tertiary: "bg-red-500",
  },
};

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
    });

    return () => unsubscribe();
  }, []);

  const availableLanguages = [
    "English",
    "Spanish",
    "French",
    "German",
    "Japanese",
    "Korean",
    "Chinese",
  ];
  const availableGenres = [
    "Action",
    "Comedy",
    "Drama",
    "Sci-Fi",
    "Horror",
    "Romance",
    "Thriller",
    "Animation",
  ];
  const resultOptions = [5, 10, 15, 20];

  const themeSwatches = {
    default: ["bg-pink-500", "bg-purple-500"],
    ocean: ["bg-blue-500", "bg-teal-500"],
    sunset: ["bg-orange-500", "bg-red-500"],
    forest: ["bg-green-500", "bg-emerald-500"],
    lavender: ["bg-purple-500", "bg-indigo-500"],
    autumn: ["bg-yellow-500", "bg-red-500"],
  };

  const getRecommendation = async () => {
    setButtonLoading(true);
    try {
      const response = await axios.post(
        `${API_BASE_URL}/generate-movie-recommendations`,
        {
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
      setMovieDetails((prev) => ({ ...prev, [title]: response.data }));
    } catch (error) {
      console.error(`Error fetching details for ${title}:`, error);
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
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <div
      className={`${getThemeClass(
        "background"
      )} min-h-screen py-12 px-4 sm:px-6 lg:px-8 relative`}
    >
      {/* Theme selector */}
      <div className="absolute top-4 right-4" ref={themeDropdownRef}>
        <button
          onClick={() => setIsThemeDropdownOpen(!isThemeDropdownOpen)}
          className="flex items-center space-x-2 bg-white bg-opacity-80 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
        >
          <div className="w-6 h-6 rounded-full overflow-hidden border-2 border-white shadow-inner">
            <div
              className={`w-1/2 h-full ${themeSwatches[currentTheme][0]} float-left`}
            ></div>
            <div
              className={`w-1/2 h-full ${themeSwatches[currentTheme][1]} float-right`}
            ></div>
          </div>
          <span className="text-sm font-medium">
            {currentTheme.charAt(0).toUpperCase() + currentTheme.slice(1)}
          </span>
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
        {isThemeDropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
            <div
              className="py-1"
              role="menu"
              aria-orientation="vertical"
              aria-labelledby="options-menu"
            >
              {Object.entries(themeSwatches).map(([theme, colors]) => (
                <button
                  key={theme}
                  onClick={() => {
                    setCurrentTheme(theme);
                    setIsThemeDropdownOpen(false);
                  }}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  role="menuitem"
                >
                  <div className="w-6 h-6 rounded-full overflow-hidden border-2 border-white shadow-inner mr-3">
                    <div
                      className={`w-1/2 h-full ${colors[0]} float-left`}
                    ></div>
                    <div
                      className={`w-1/2 h-full ${colors[1]} float-right`}
                    ></div>
                  </div>
                  {theme.charAt(0).toUpperCase() + theme.slice(1)}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* User authentication */}
      <div className="absolute top-4 left-4">
        {!authChecked ? (
          <div className="bg-white bg-opacity-80 rounded-lg px-3 py-2">
            <div className="animate-pulse flex space-x-4">
              <div className="flex-1 space-y-2 py-1">
                <div className="h-2 bg-slate-200 rounded w-24"></div>
              </div>
            </div>
          </div>
        ) : user ? (
          <div className="flex items-center space-x-2 bg-white bg-opacity-80 rounded-lg px-3 py-2">
            <span className="text-sm font-medium text-gray-700">
              {user.email.split("@")[0]}
            </span>
            <button
              onClick={handleLogout}
              className="text-sm font-medium text-pink-600 hover:text-pink-800 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 rounded"
            >
              Logout
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowAuth(true)}
            className="bg-white bg-opacity-80 rounded-lg px-3 py-2 text-sm font-medium text-pink-600 hover:text-pink-800 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-pink-500"
          >
            Login / Register
          </button>
        )}
      </div>

      {showAuth && (
        <Auth onLogin={handleLogin} onClose={() => setShowAuth(false)} />
      )}

      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
          <div className="px-6 py-8 sm:p-10">
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
          </div>
          {recommendations.length > 0 && (
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
