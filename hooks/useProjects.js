import { createContainer } from "unstated-next";
import { useState } from "react";

function useProjects() {
  const [projects, setProjects] = useState([]);
  // at any given time we should only have parts for one project
  const [projectParts, setProjectParts] = useState([]);
  // likewise for scenes to parts
  const [projectScenes, setProjectScenes] = useState([]);

  const [currentProject, setCurrentProject] = useState(null);
  const [currentPart, setCurrentPart] = useState(null);

  const appendProject = (project) => {
    const projectsCopy = JSON.parse(JSON.stringify(projects));
    projectsCopy.push(project);
    setProjects(projectsCopy);
  };

  const appendPart = (part) => {
    const partsCopy = JSON.parse(JSON.stringify(projectParts));
    partsCopy.push(part);
    setProjectParts(partsCopy);
  };
  return {
    projects: projects,
    setProjects: (user) => {
      setProjects(user);
    },
    projectParts,
    setProjectParts: (parts) => {
      setProjectParts(parts);
    },
    projectScenes,
    setProjectScenes: (scenes) => {
      setProjectScenes(scenes);
    },
    currentProject,
    setCurrentProject: (project) => {
      if (projects.length === 0) {
        appendProject(project);
      }
      setCurrentProject(project);
    },
    addProject: (project) => {
      const projectsCopy = JSON.parse(JSON.stringify(projects));
      projectsCopy.push(project);
      setProjects(projectsCopy);
    },
    currentPart,
    setCurrentPart: (part) => {
      if (projectParts.length === 0) {
        appendPart(part);
      }
      setCurrentPart(part);
    },
    addPart: (part) => {
      const partsCopy = JSON.parse(JSON.stringify(projectParts));
      partsCopy.push(part);
      setProjectParts(partsCopy);
    },
  };
}

let UserProjects = createContainer(useProjects);

export default UserProjects;
