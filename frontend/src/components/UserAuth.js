import React from "react";
import Auth from "./Auth";

function UserAuth({
  user,
  authChecked,
  showAuth,
  setShowAuth,
  handleLogin,
  handleLogout,
  getThemeClass,
}) {
  const loginButtonClasses = `text-sm font-medium text-white bg-gradient-to-r ${getThemeClass(
    "primary"
  )} hover:opacity-90 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 rounded px-3 py-2`;

  const logoutButtonClasses = `text-sm font-medium text-gray-700 bg-white hover:bg-gray-100 transition-colors duration-200 px-2 py-1`;

  return (
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
          <span
            className={`text-sm font-medium bg-gradient-to-r ${getThemeClass(
              "primary"
            )} text-transparent bg-clip-text`}
          >
            {user.email ? user.email.split("@")[0] : user.displayName}
          </span>
          <button onClick={handleLogout} className={logoutButtonClasses}>
            Logout
          </button>
        </div>
      ) : (
        <button
          onClick={() => setShowAuth(true)}
          className={`bg-white bg-opacity-80 rounded-lg ${loginButtonClasses}`}
        >
          Login / Register
        </button>
      )}

      {showAuth && (
        <Auth onLogin={handleLogin} onClose={() => setShowAuth(false)} />
      )}
    </div>
  );
}

export default UserAuth;
