import { useState } from "react";
import Sidebar from "./components/Sidebar";
import TaskInput from "./components/TaskInput";
import Timeline from "./components/Timeline";

function App() {
  const [projects, setProjects] = useState([
    {
      id: 0,
      name: "timeloom",
      icon: "timeloom.svg",
      timeline: [
        {
          id: 0,
          name: "Worked on prototyping timeloom",
          start_time: "19:23:00",
          duration: "01:00:00",
        },
        {
          id: 1,
          name: "Worked on developing timeloom",
          start_time: "20:51:00",
          duration: "01:36:10",
        },
      ],
    },
    {
      id: 1,
      name: "Portfolio Website",
      icon: "portfolio.png",
      timeline: [
        {
          id: 0,
          name: "Worked on prototyping the portfolio website",
          start_time: "19:23:00",
          duration: "01:00:00",
        },
        {
          id: 1,
          name: "Setting up project",
          start_time: "21:10:00",
          duration: "00:34:10",
        },
        {
          id: 2,
          name: "Developed the hero section",
          start_time: "23:10:00",
          duration: "01:11:10",
        },
      ],
    },
  ]);

  const [selectedProject, setSelectedProject] = useState({})

  return (
    <>
    <div className="h-screen flex">
      {/* Sidebar Section */}
      <div className="flex items-center justify-center">
        <Sidebar projects={projects} />
      </div>

      {/* Main Content Section */}
      <div className="flex-1 flex flex-col items-center justify-center">
          {/* Input field with controls */}
          <TaskInput />
          <div className="h-1/2">
          {/* Timeline */}
          <Timeline timeline={projects[1].timeline} />
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
