
import { TrendingUp, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { Project } from "@/types/project";

interface FeaturedProjectsProps {
  projects: Project[];
  theme: string;
}

const FeaturedProjects = ({ projects, theme }: FeaturedProjectsProps) => {
  // Take up to 4 projects for the featured section
  const featuredProjects = projects.slice(0, 4);

  return (
    <section className="py-12 max-w-6xl mx-auto px-4">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <TrendingUp size={24} className={theme === "dark" ? "text-purple-400" : "text-purple-600"} />
          <h2 className="text-2xl font-bold">Featured Projects</h2>
        </div>
        <Link 
          to="/projects" 
          className={`text-sm ${theme === "dark" ? "text-purple-400 hover:text-purple-300" : "text-purple-600 hover:text-purple-800"}`}
        >
          View all
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {featuredProjects.map(project => (
          <Link 
            to={`/project/${project.slug}`} 
            key={project.id} 
            className={`block rounded-lg p-6 transition-transform duration-300 transform hover:scale-105 ${
              theme === "dark" 
                ? 'bg-gray-800 hover:bg-gray-750 border border-gray-700' 
                : 'bg-white hover:bg-gray-50 border border-gray-200'
            } relative h-full`}
          >
            {/* Featured badge */}
            <div className="absolute top-3 right-3">
              <Star size={18} className="text-yellow-400 fill-yellow-400" />
            </div>
            
            <div className="flex flex-col h-full">              
              <div className="mb-4 flex items-center justify-center">
                <div className={`w-16 h-16 rounded-full ${theme === "dark" ? 'bg-gray-700' : 'bg-gray-100'} flex items-center justify-center`}>
                  <img 
                    src={project.logo} 
                    alt={project.name} 
                    className="w-10 h-10 object-contain" 
                    onError={e => {
                      const target = e.target as HTMLImageElement;
                      target.src = "https://placehold.co/100x100?text=Logo";
                    }} 
                  />
                </div>
              </div>
              
              <h3 className="text-lg font-semibold text-center mb-2">{project.name}</h3>
              
              <p className={`text-sm ${theme === "dark" ? 'text-gray-400' : 'text-gray-600'} mb-4 line-clamp-2 flex-grow`}>
                {project.description.length > 100 
                  ? `${project.description.substring(0, 100)}...` 
                  : project.description}
              </p>
              
              <div className="flex justify-between items-center mt-auto">
                <span className={`text-xs px-2 py-1 rounded-full ${
                  project.status === 'active' 
                    ? 'bg-green-700 text-white' 
                    : project.status === 'upcoming' 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-500 text-white'
                }`}>
                  {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                </span>
                
                <span className={`text-xs ${theme === "dark" ? 'text-gray-400' : 'text-gray-600'}`}>
                  {project.categories[0]}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default FeaturedProjects;
