import React from "react";

function TabNavigation({ activeTab, setActiveTab, getThemeClass }) {
  return (
    <div className="bg-white shadow-md">
      <nav className="container mx-auto px-4 py-2">
        <div className="flex justify-center">
          <div className="inline-flex rounded-full bg-gray-100 p-1">
            <button
              onClick={() => setActiveTab("recommendations")}
              className={`${
                activeTab === "recommendations"
                  ? `${getThemeClass("secondary")} text-white shadow-sm`
                  : "bg-white text-gray-500 hover:text-gray-700"
              } rounded-full py-2 px-4 font-medium text-sm transition-all duration-200 ease-in-out`}
            >
              Recommendations
            </button>
            <button
              onClick={() => setActiveTab("liked")}
              className={`${
                activeTab === "liked"
                  ? `${getThemeClass("secondary")} text-white shadow-sm`
                  : "bg-white text-gray-500 hover:text-gray-700"
              } rounded-full py-2 px-4 font-medium text-sm transition-all duration-200 ease-in-out`}
            >
              Liked Movies
            </button>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default TabNavigation;
