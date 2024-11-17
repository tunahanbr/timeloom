import React from 'react'

function Sidebar({projects}) {
  return (
    <>
      {/* Sidebar with projects */}
      <div className="flex h-screen mx-2">
        <div className="bg-gray-50 rounded-xl w-20 h-80 my-auto overflow-y-auto scrollbar-hide">
          <div className="flex flex-col items-center my-6 gap-1">
            {projects.map(project => (
              <div className="w-12 h-12 rounded-lg bg-white">
                <img className="p-1" src={project.icon} />
              </div>
            ))}
          <button className="w-12 h-12 text-black border-dashed border-2 rounded-lg border-black">+</button>
          </div>
        </div>
      </div>
    </>
  )
}

export default Sidebar