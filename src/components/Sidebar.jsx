import React, { useState, useRef, useEffect } from 'react';
import { Plus, ChevronUp, ChevronDown, Settings, LogOut } from 'lucide-react';

const Sidebar = ({ projects, setSelectedProjectId, handleNewProject, user, onLogout }) => {
  const [showTopScroll, setShowTopScroll] = useState(false);
  const [showBottomScroll, setShowBottomScroll] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const scrollContainerRef = useRef(null);
  const profileMenuRef = useRef(null);

  const getInitials = (name = '') => {
    if (!name) return '';
    return name
      .split(' ')
      .map((word) => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };
  

  const getUserInitials = () => {
    if (!user) return '';
    
    if (user.user_metadata?.full_name) {
      return getInitials(user.user_metadata.full_name);
    }
    
    return user.email
      .split('@')[0]
      .slice(0, 2)
      .toUpperCase();
  };

  const handleClick = (index) => {
    setSelectedProjectId(index);
  };

  const checkScroll = () => {
    const container = scrollContainerRef.current;
    if (container) {
      setShowTopScroll(container.scrollTop > 20);
      
      const hasMoreContent = 
        container.scrollHeight > container.clientHeight &&
        container.scrollTop + container.clientHeight < container.scrollHeight - 20;
      setShowBottomScroll(hasMoreContent);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', checkScroll);
      checkScroll();
      return () => container.removeEventListener('scroll', checkScroll);
    }
  }, []);

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
    <div className="mx-2 h-screen flex flex-col justify-between">
      {/* Center container for main sidebar */}
      <div className="flex-1 flex items-center">
        {/* Main sidebar content with fixed height */}
        <div className="rounded-md w-16 h-80 relative">
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
            className="h-full overflow-y-auto scrollbar-hide"
          >
            <div className="flex flex-col items-center py-6 gap-1">
              {projects.map((project, index) => (
                <div
                  key={index}
                  onClick={() => handleClick(index)}
                  className="w-12 h-12 rounded-lg bg-gray-50 hover:scale-110 transition-transform cursor-pointer"
                >
                  {project.icon ? (
                    <img className="w-full h-full object-cover rounded-lg p-2" src={project.icon} alt={project.name} />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-sm font-semibold text-gray-600">
                      {getInitials(project.name || 'Untitled')}
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

          {/* New project button */}
          <div className="absolute bottom-0 w-full py-4 flex justify-center bg-white">
            <button 
              onClick={handleNewProject}
              className="w-12 h-12 text-black border-dashed border-2 rounded-lg border-black hover:scale-110 transition-transform flex items-center justify-center"
            >
              <Plus className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Profile section at bottom */}
      <div className="w-16 py-4" ref={profileMenuRef}>
        <button
          onClick={() => setShowProfileMenu(!showProfileMenu)}
          className="w-12 h-12 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors flex items-center justify-center overflow-hidden"
        >
          {user?.user_metadata?.avatar_url ? (
            <img 
              src={user.user_metadata.avatar_url} 
              alt="Profile" 
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-sm font-semibold text-gray-600">
              {getUserInitials()}
            </span>
          )}
        </button>

        {/* Profile Menu */}
        {showProfileMenu && (
          <div className="absolute bottom-16 left-4 mb-2 w-48 bg-white rounded-lg shadow-lg py-1 border border-gray-200">
            <div className="px-4 py-2 border-b border-gray-200">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user?.user_metadata?.full_name || user?.email}
              </p>
              {user?.user_metadata?.full_name && (
                <p className="text-xs text-gray-500 truncate">{user.email}</p>
              )}
            </div>
            
            <button
              onClick={() => {
                setShowProfileMenu(false);
                // Add settings navigation here
              }}
              className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
            >
              <Settings className="w-4 h-4" />
              Settings
            </button>
            
            <button
              onClick={() => {
                setShowProfileMenu(false);
                onLogout();
              }}
              className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-100 flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;