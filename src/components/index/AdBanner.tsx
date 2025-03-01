
import { useState } from "react";

interface AdBannerProps {
  theme: string;
}

const AdBanner = ({ theme }: AdBannerProps) => {
  const [showAdBanner, setShowAdBanner] = useState(true);

  if (!showAdBanner) return null;

  return (
    <div className={`py-2 px-4 ${theme === "dark" ? "bg-gray-800" : "bg-gray-200"} flex justify-between items-center`}>
      <div className="flex items-center gap-2">
        <span className="text-xs bg-blue-500 text-white px-1 rounded">Ad</span>
        <span className="text-sm">SPACE AVAILABLE * SPACE AVAILABLE * SPACE AVAILABLE</span>
      </div>
      <button 
        className={`${theme === "dark" ? "text-gray-500" : "text-gray-600"}`} 
        onClick={() => setShowAdBanner(false)}
      >
        &times;
      </button>
    </div>
  );
};

export default AdBanner;
