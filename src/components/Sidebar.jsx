import React from 'react';
import { Plus } from 'lucide-react';

const Sidebar = ({ projects, setSelectedProjectId, handleNewProject }) => {
  // Generate initials from project name
  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleClick = (index) => {
    setSelectedProjectId(index);
  };

  return (
    <div className="mx-2">
      <div className="rounded-xl w-16 h-80 my-auto overflow-y-auto scrollbar-hide">
        <div className="flex flex-col items-center my-6 gap-1">
          {projects.map((project, index) => (
            <div
              key={index}
              onClick={() => handleClick(index)}
              className="w-12 h-12 rounded-lg bg-gray-50 hover:scale-110 transition-transform cursor-pointer"
            >
              {project.icon ? (
                <img className="w-full h-full p-1 object-cover rounded-lg" src={project.icon} alt={project.name} />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-sm font-semibold text-gray-600">
                    {getInitials(project.name)}
                  </span>
                </div>
              )}
            </div>
          ))}
          <button 
            onClick={handleNewProject}
            className="w-12 h-12 text-black border-dashed border-2 rounded-lg border-black hover:scale-110 transition-transform flex items-center justify-center"
          >
            <Plus className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;