import React from "react";
import { UserIcon } from "@heroicons/react/24/outline";

const LoginPrompt = ({ setShowAuth, getThemeClass }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <UserIcon className="mx-auto h-12 w-12 text-gray-400" />
        <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
          Login Required
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          Please log in to view your liked movies.
        </p>
        <div className="mt-8">
          <button
            onClick={() => setShowAuth(true)}
            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r ${getThemeClass(
              "primary"
            )} hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500`}
          >
            Log In
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPrompt;
