import React, { useState, useRef, useEffect } from 'react';
import { Plus, ChevronUp, ChevronDown } from 'lucide-react';

const Sidebar = ({ projects, setSelectedProjectId, handleNewProject }) => {
  const [showTopScroll, setShowTopScroll] = useState(false);
  const [showBottomScroll, setShowBottomScroll] = useState(false);
  const scrollContainerRef = useRef(null);

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

  // Check scroll position and update indicators
  const checkScroll = () => {
    const container = scrollContainerRef.current;
    if (container) {
      // Show top indicator if we've scrolled down
      setShowTopScroll(container.scrollTop > 20);
      
      // Show bottom indicator if there's more content below
      const hasMoreContent = 
        container.scrollHeight > container.clientHeight &&
        container.scrollTop + container.clientHeight < container.scrollHeight - 20;
      setShowBottomScroll(hasMoreContent);
    }
  };

  // Set up scroll event listener
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', checkScroll);
      // Initial check
      checkScroll();
      
      return () => container.removeEventListener('scroll', checkScroll);
    }
  }, []);

  // Recheck on projects change
  useEffect(() => {
    checkScroll();
  }, [projects]);

  const scrollUp = () => {
    const container = scrollContainerRef.current;
    if (container) {
      container.scrollBy({ top: -100, behavior: 'smooth' });
    }
  };

  const scrollDown = () => {
    const container = scrollContainerRef.current;
    if (container) {
      container.scrollBy({ top: 100, behavior: 'smooth' });
    }
  };

  return (
    <div className="mx-2">
      <div className="rounded-md w-16 h-80 my-auto flex flex-col relative">
        {/* Top scroll indicator */}
        <div 
          className={`absolute top-0 left-0 right-0 z-10 flex justify-center py-1 bg-gradient-to-b from-white to-transparent transition-opacity duration-200 ${
            showTopScroll ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
          onClick={scrollUp}
        >
          <ChevronUp className="w-5 h-5 text-gray-400 hover:text-gray-600 cursor-pointer" />
        </div>

        {/* Projects list with scrolling */}
        <div 
          ref={scrollContainerRef}
          className="flex-1 overflow-y-auto scrollbar-hide"
        >
          <div className="flex flex-col items-center py-6 gap-1">
            {projects.map((project, index) => (
              <div
                key={index}
                onClick={() => handleClick(index)}
                className="w-12 h-12 rounded-lg bg-gray-50 hover:scale-110 transition-transform cursor-pointer"
              >
                {project.icon ? (
                  <img className="w-full h-full p-2 object-cover rounded-lg" src={project.icon} alt={project.name} />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-sm font-semibold text-gray-600">
                      {getInitials(project.name)}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom scroll indicator */}
        <div 
          className={`absolute bottom-16 left-0 right-0 z-10 flex justify-center py-1 bg-gradient-to-t from-white to-transparent transition-opacity duration-200 ${
            showBottomScroll ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
          onClick={scrollDown}
        >
          <ChevronDown className="w-5 h-5 text-gray-400 hover:text-gray-600 cursor-pointer" />
        </div>

        {/* New project button - fixed at bottom */}
        <div className="py-4 flex justify-center bg-white">
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