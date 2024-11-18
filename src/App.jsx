import { useState } from "react";
import Sidebar from "./components/Sidebar";
import TaskInput from "./components/TaskInput";
import Timeline from "./components/Timeline";
import ProjectHeader from "./components/ProjectHeader";

function App() {
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState(null);

  const handleNewEntry = (entry) => {
    if (selectedProjectId === null || !projects.length) return;
    
    const updatedProjects = [...projects];
    updatedProjects[selectedProjectId].timeline.push(entry);
    setProjects(updatedProjects);
  };

  const handleNewProject = () => {
    const newProject = {
      id: new Date().getTime(),
      name: 'New Project',
      icon: '',
      timeline: []
    };
    
    setProjects(prev => [...prev, newProject]);
    // Automatically select the new project
    setSelectedProjectId(projects.length);
  };

  // Get the currently selected project safely
  const selectedProject = selectedProjectId !== null && projects[selectedProjectId] 
    ? projects[selectedProjectId] 
    : null;

  return (
    <>
      <div className="h-screen flex">
        {/* Sidebar Section - Only show when there are projects */}
        {projects.length > 0 && (
          <div className="flex items-center justify-center">
            <Sidebar
              projects={projects}
              setSelectedProjectId={setSelectedProjectId}
              handleNewProject={handleNewProject}
            />
          </div>
        )}

        {/* Main Content Section - Adjust width based on sidebar presence */}
        <div className={`flex flex-col items-center justify-center ${projects.length === 0 ? 'w-full' : 'flex-1'}`}>
          {projects.length === 0 ? (
            // Empty state - centered on full width
            <div className="text-center text-gray-500">
              <h2 className="text-2xl font-semibold mb-2">Welcome to Timeloom</h2>
              <p className="mb-4">Get started by creating your first project</p>
              <button
                onClick={handleNewProject}
                className="p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-2 mx-auto"
              >
                Create Your First Project
              </button>
            </div>
          ) : selectedProject ? (
            // Project view
            <>
              <ProjectHeader
                project={selectedProject}
                onUpdate={(updatedProject) => {
                  const updatedProjects = [...projects];
                  updatedProjects[selectedProjectId] = updatedProject;
                  setProjects(updatedProjects);
                }}
              />
              <div className="w-full max-w-2xl">
                <TaskInput setNewEntry={handleNewEntry} />
              </div>
              <div className="w-full max-w-2xl h-1/2">
                <Timeline timeline={selectedProject.timeline} />
              </div>
            </>
          ) : (
            // No project selected state
            <div className="text-center text-gray-500">
              <p>Select a project to view its timeline</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default App;