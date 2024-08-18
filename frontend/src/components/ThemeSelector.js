import React from "react";

function ThemeSelector({
  currentTheme,
  updateUserTheme,
  isThemeDropdownOpen,
  setIsThemeDropdownOpen,
  themeDropdownRef,
  themeSwatches,
}) {
  const handleThemeChange = (theme) => {
    updateUserTheme(theme);
    setIsThemeDropdownOpen(false);
  };

  return (
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
                onClick={() => handleThemeChange(theme)}
                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                role="menuitem"
              >
                <div className="w-6 h-6 rounded-full overflow-hidden border-2 border-white shadow-inner mr-3">
                  <div className={`w-1/2 h-full ${colors[0]} float-left`}></div>
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
  );
}

export default ThemeSelector;
