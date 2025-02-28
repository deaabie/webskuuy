
import { Link } from "react-router-dom";

interface Project {
  id: string;
  name: string;
  logo: string;
  status: string;
  categories: string[];
}

interface ProjectsGridProps {
  isLoading: boolean;
  filteredProjects: Project[];
}

const ProjectsGrid = ({ isLoading, filteredProjects }: ProjectsGridProps) => {
  return (
    <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-4">
      {isLoading
        ? // Loading skeleton
          Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="block rounded-lg p-4 bg-gray-800">
              <div className="animate-pulse flex flex-col h-full">
                <div className="h-4 bg-gray-700 rounded w-1/3 mb-2"></div>
                <div className="flex-grow flex items-center justify-center py-4">
                  <div className="w-20 h-20 rounded-full bg-gray-700"></div>
                </div>
                <div className="h-5 bg-gray-700 rounded w-1/2 mt-2"></div>
              </div>
            </div>
          ))
        : filteredProjects.length > 0 ? (
            filteredProjects.map((project) => (
              <Link
                to={`/project/${project.id}`}
                key={project.id}
                className="block rounded-lg p-4 transition-transform duration-300 transform hover:scale-105 bg-gray-800 hover:bg-gray-750 relative"
              >
                {/* Status Badge */}
                <div
                  className={`absolute top-2 right-2 text-xs px-2 py-1 rounded-full ${
                    project.status === "active"
                      ? "bg-green-700 text-white"
                      : project.status === "upcoming"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-500 text-white"
                  }`}
                >
                  {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                </div>

                <div className="flex flex-col h-full">
                  <div className="mb-2 text-sm text-gray-500">
                    {project.categories.join("/")}
                  </div>
                  <div className="flex-grow flex items-center justify-center py-4">
                    <div className="w-20 h-20 rounded-full bg-gray-700 flex items-center justify-center">
                      <img
                        src={project.logo}
                        alt={project.name}
                        className="w-12 h-12 object-contain"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "https://placehold.co/100x100?text=Logo";
                        }}
                      />
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold mt-2">{project.name}</h3>
                </div>
              </Link>
            ))
          ) : (
            <div className="col-span-full text-center py-10">
              <p className="text-gray-500">
                No projects found. Try adjusting your filters.
              </p>
            </div>
          )}
    </div>
  );
};

export default ProjectsGrid;
