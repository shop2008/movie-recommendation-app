export const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:5001/api";

export const themes = {
  default: {
    background: "bg-gradient-to-br from-pink-100 to-purple-100",
    primary: "from-pink-500 to-purple-600",
    secondary: "bg-pink-500",
    tertiary: "bg-purple-500",
    focusRing: "focus:ring-pink-500",
    focusBorder: "focus:border-pink-300",
  },
  ocean: {
    background: "bg-gradient-to-br from-blue-100 to-teal-100",
    primary: "from-blue-500 to-teal-600",
    secondary: "bg-blue-500",
    tertiary: "bg-teal-500",
    focusRing: "focus:ring-blue-500",
    focusBorder: "focus:border-blue-300",
  },
  sunset: {
    background: "bg-gradient-to-br from-orange-100 to-red-100",
    primary: "from-orange-500 to-red-600",
    secondary: "bg-orange-500",
    tertiary: "bg-red-500",
    focusRing: "focus:ring-orange-500",
    focusBorder: "focus:border-orange-300",
  },
  forest: {
    background: "bg-gradient-to-br from-green-100 to-emerald-100",
    primary: "from-green-500 to-emerald-600",
    secondary: "bg-green-500",
    tertiary: "bg-emerald-500",
    focusRing: "focus:ring-green-500",
    focusBorder: "focus:border-green-300",
  },
  lavender: {
    background: "bg-gradient-to-br from-purple-100 to-indigo-100",
    primary: "from-purple-500 to-indigo-600",
    secondary: "bg-purple-500",
    tertiary: "bg-indigo-500",
    focusRing: "focus:ring-purple-500",
    focusBorder: "focus:border-purple-300",
  },
  autumn: {
    background: "bg-gradient-to-br from-yellow-100 to-red-100",
    primary: "from-yellow-500 to-red-600",
    secondary: "bg-yellow-500",
    tertiary: "bg-red-500",
    focusRing: "focus:ring-yellow-500",
    focusBorder: "focus:border-yellow-300",
  },
};

export const availableLanguages = [
  "English",
  "Spanish",
  "French",
  "German",
  "Japanese",
  "Korean",
  "Chinese",
];

export const availableGenres = [
  "Action",
  "Comedy",
  "Drama",
  "Sci-Fi",
  "Horror",
  "Romance",
  "Thriller",
  "Animation",
];

export const resultOptions = [5, 10, 15, 20];

export const themeSwatches = {
  default: ["bg-pink-500", "bg-purple-500"],
  ocean: ["bg-blue-500", "bg-teal-500"],
  sunset: ["bg-orange-500", "bg-red-500"],
  forest: ["bg-green-500", "bg-emerald-500"],
  lavender: ["bg-purple-500", "bg-indigo-500"],
  autumn: ["bg-yellow-500", "bg-red-500"],
};
