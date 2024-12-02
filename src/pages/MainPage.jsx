import { useState, useEffect } from "react";
import { supabase } from "../utils/supabase"; // Import Supabase client
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import TaskInput from "../components/TaskInput";
import Timeline from "../components/Timeline";
import ProjectHeader from "../components/ProjectHeader";

const MainPage = () => {
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Check for authenticated user session and fetch user projects
  useEffect(() => {
    const fetchSessionAndProjects = async () => {
        try {
          // Fetch the session
          const { data: sessionData, error } = await supabase.auth.getSession();
      
          if (error || !sessionData?.session) {
            console.error("Error fetching session or no session found:", error);
            navigate("/login"); // Redirect to login
            return;
          }
      
          const session = sessionData.session;
          if (!session.user) {
            console.log("No user found in session, redirecting to login...");
            navigate("/login");
            return;
          }
      
          setUser(session.user);
      
          // Fetch projects for the user
          const { data: projectsData, error: projectsError } = await supabase
            .from("projects")
            .select("*, timeline_entries(*)") // Fetch related timeline entries
            .eq("user_id", session.user.id);
      
          if (projectsError) {
            console.error("Error fetching projects:", projectsError);
          } else {
            // Include the timeline in the projects data
            const projectsWithTimeline = projectsData.map((project) => ({
              ...project,
              timeline: project.timeline_entries || [], // Map related timeline entries
            }));
            setProjects(projectsWithTimeline);
            setSelectedProjectId(projectsWithTimeline?.length > 0 ? 0 : null);
          }
        } catch (fetchError) {
          console.error("Error in fetchSessionAndProjects:", fetchError);
          navigate("/login");
        }
      };
  
    fetchSessionAndProjects();
  }, [navigate]);
  

  // Handle project creation
  const handleNewProject = async () => {
    if (!user) {
      console.error("User not found");
      return;
    }
  
    try {
      // Step 1: Insert the new project into Supabase
      const { data, error } = await supabase
        .from("projects")
        .insert([
          {
            user_id: user.id, // Use the stored user ID
            name: "New Project", // Default name
            icon: "", // Default icon (can be updated later)
          },
        ])
        .single(); // Fetch a single inserted row
  
      if (error) {
        console.error("Error creating project:", error);
        return;
      }
  
      // Step 2: After the project is created, re-fetch the projects
      const { data: projectsData, error: projectsError } = await supabase
        .from("projects")
        .select("*, timeline_entries(*)") // Fetch related timeline entries
        .eq("user_id", user.id);
  
      if (projectsError) {
        console.error("Error fetching projects:", projectsError);
        return;
      }
  
      // Step 3: Update the state with the newly fetched projects
      const projectsWithTimeline = projectsData.map((project) => ({
        ...project,
        timeline: project.timeline_entries || [], // Map related timeline entries
      }));
  
      setProjects(projectsWithTimeline);
      setSelectedProjectId(projectsWithTimeline?.length > 0 ? 0 : null); // Automatically select the first project
    } catch (err) {
      console.error("Error in handleNewProject:", err);
    }
  };

  // Handle new entry in the timeline
  const handleNewEntry = async (entry) => {
    if (selectedProjectId === null || !projects.length) return;
  
    const project = projects[selectedProjectId];
  
    try {
      const { data, error } = await supabase
        .from("timeline_entries")
        .insert([
          {
            project_id: project.id,
            name: entry.name,
            start_time: new Date().toISOString(),
            duration: entry.duration,
          },
        ])
        .single();
  
      if (error) {
        console.error("Error adding timeline entry:", error);
      } else {
        // Refetch the timeline for the selected project
        const { data: timelineData, error: timelineError } = await supabase
          .from("timeline_entries")
          .select("*")
          .eq("project_id", project.id);
  
        if (timelineError) {
          console.error("Error fetching timeline entries:", timelineError);
          return;
        }
  
        const updatedProjects = [...projects];
        updatedProjects[selectedProjectId] = {
          ...updatedProjects[selectedProjectId],
          timeline: timelineData || [],
        };
        setProjects(updatedProjects);
      }
    } catch (err) {
      console.error("Error in handleNewEntry:", err);
    }
  };
  

  const selectedProject =
    selectedProjectId !== null && projects[selectedProjectId]
      ? projects[selectedProjectId]
      : null;

  if (!user) {
    return <div className="text-center">Loading...</div>;
  }

  return (
    <div className="h-screen flex">
      {projects.length > 0 && (
        <div className="flex items-center justify-center">
          <Sidebar
            projects={projects}
            setSelectedProjectId={setSelectedProjectId}
            handleNewProject={handleNewProject}
            user={user}
            onLogout={async () => {
              await supabase.auth.signOut();
              navigate("/login");
            }}
          />
        </div>
      )}

      <div
        className={`flex flex-col items-center justify-center ${
          projects.length === 0 ? "w-full" : "flex-1"
        }`}
      >
        {projects.length === 0 ? (
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
          <div className="text-center text-gray-500">
            <p>Select a project to view its timeline</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MainPage;
