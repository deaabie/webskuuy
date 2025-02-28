
import { useState } from "react";
import Header from "../components/Header";
import Hero from "../components/about/Hero";
import MissionVision from "../components/about/MissionVision";
import ValuesTabs from "../components/about/ValuesTabs";
import CommunityCallout from "../components/about/CommunityCallout";

const About = () => {
  const [darkMode, setDarkMode] = useState(true);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'} transition-colors duration-300`}>
      <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      <div className="container mx-auto py-10 px-4 md:px-6">
        <Hero darkMode={darkMode} />
        <MissionVision />
        <ValuesTabs />
        <CommunityCallout />
      </div>
    </div>
  );
};

export default About;
