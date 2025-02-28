
import { Moon, Sun, Menu } from "lucide-react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Header = () => {
  const [darkMode, setDarkMode] = useState(true);
  
  // Toggle dark mode
  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    if (newDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  // Initialize dark mode state from actual document class on mount
  useEffect(() => {
    setDarkMode(document.documentElement.classList.contains("dark"));
  }, []);

  return (
    <header className={`sticky top-0 z-50 ${darkMode ? 'bg-gray-900' : 'bg-white'} border-b ${darkMode ? 'border-gray-800' : 'border-gray-200'}`}>
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Link to="/" className="font-bold text-xl flex items-center">
            <span className="text-purple-500">Skuuy.</span>
            <span>com</span>
          </Link>
        </div>
        
        <div className="flex items-center gap-3">
          <button onClick={toggleDarkMode} className="btn btn-ghost btn-circle">
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button className="btn btn-ghost btn-circle md:hidden">
            <Menu size={20} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
