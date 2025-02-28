
import { useState } from "react";
import { Link } from "react-router-dom";
import { Sun, Moon, Menu } from "lucide-react";

const Header = () => {
  const [darkMode, setDarkMode] = useState(true);

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <>
      {/* Header */}
      <header className={`sticky top-0 z-50 ${darkMode ? 'bg-gray-900' : 'bg-white'} border-b ${darkMode ? 'border-gray-800' : 'border-gray-200'}`}>
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="font-bold text-xl flex items-center">
              <Link to="/" className="text-purple-500 hover:text-purple-600 transition-colors">Skuuy.</Link>
              <Link to="/" className="hover:text-gray-500 transition-colors">com</Link>
            </div>
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
      
      {/* Ad Banner */}
      <div className={`py-2 px-4 ${darkMode ? 'bg-gray-800' : 'bg-gray-100'} flex justify-between items-center`}>
        <div className="flex items-center gap-2">
          <span className="text-xs bg-blue-500 text-white px-1 rounded">Ad</span>
          <span className="text-sm">SPACE AVAILABLE * SPACE AVAILABLE * SPACE AVAILABLE</span>
        </div>
        <button className="text-gray-500">&times;</button>
      </div>
    </>
  );
};

export default Header;
