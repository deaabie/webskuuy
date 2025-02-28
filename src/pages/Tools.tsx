
import { useState, useEffect } from "react";
import Header from "@/components/Header";

const Tools = () => {
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    // Ensure dark mode class is applied on initial load
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'} transition-colors duration-300`}>
      <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-12">Node Operator Tools</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="flex justify-center items-center h-64 border border-dashed rounded-lg">
            <p className="text-center text-gray-500">Coming Soon: Validator ROI Calculator</p>
          </div>
          <div className="flex justify-center items-center h-64 border border-dashed rounded-lg">
            <p className="text-center text-gray-500">Coming Soon: Node Health Monitor</p>
          </div>
          <div className="flex justify-center items-center h-64 border border-dashed rounded-lg">
            <p className="text-center text-gray-500">Coming Soon: Staking Rewards Tracker</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tools;
