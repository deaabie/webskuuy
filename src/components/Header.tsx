
import { useState } from "react";
import { Moon, Sun, Menu } from "lucide-react";
import { Link } from "react-router-dom";

type HeaderProps = {
  darkMode: boolean;
  toggleDarkMode: () => void;
};

const Header = ({ darkMode, toggleDarkMode }: HeaderProps) => {
  return (
    <header className={`sticky top-0 z-50 ${darkMode ? 'bg-gray-900' : 'bg-white'} border-b ${darkMode ? 'border-gray-800' : 'border-gray-200'}`}>
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="font-bold text-xl flex items-center">
            <Link to="/" className="text-purple-500 hover:text-purple-400 transition-colors">Skuuy.</Link>
            <span>com</span>
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
  );
};

export default Header;
