import { useState } from "react";
import Sidebar from "./components/Sidebar";

function App() {
  const [projects, setProjects] = useState([
    {
      id: 0,
      name: "timeloom",
      icon:'timeloom.svg',
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
      icon:'portfolio.png',
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
        {
          id: 2,
          name: "Developed the about section and added all the details",
          start_time: "00:59:21",
          duration: "00:55:10",
        },
      ],
    },
  ]);

  return (
    <>
      <Sidebar projects={projects} />
    </>
  );
}

export default App;
