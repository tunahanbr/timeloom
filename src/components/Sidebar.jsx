import React from 'react'

function Sidebar({projects, setSelectedProjectId}) {
  
  const handleClick = (index) => {
    setSelectedProjectId(index);
  };

  return (
    <>
      {/* Sidebar with projects */}
      <div className="mx-2">
        <div className="bg-gray-50 rounded-xl w-16 h-80 my-auto overflow-y-auto scrollbar-hide shadow-sm">
          <div className="flex flex-col items-center my-6 gap-1">
            {projects.map((project,index) => (
              <div onClick={() => handleClick(index)} className="w-12 h-12 rounded-lg bg-white hover:scale-110 transition-transform cursor-pointer">
                <img className="p-1" src={project.icon} />
              </div>
            ))}
            <button className="w-12 h-12 text-black border-dashed border-2 rounded-lg border-black hover:scale-110 transition-transform">+</button>
          </div>
        </div>
      </div>
    </>
  )
}

export default Sidebar