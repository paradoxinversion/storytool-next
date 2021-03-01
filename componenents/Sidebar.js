import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import Auth from "../hooks/useAuthentication";
import UserProjects from "../hooks/useProjects";

function Sidebar() {
  const router = useRouter();
  const { projectId } = router.query;
  const UserProjectData = UserProjects.useContainer();
  const UserData = Auth.useContainer();
  const [showProjects, setShowProjects] = useState(false);
  const [showParts, setShowParts] = useState(false);

  const filterProjects = () => {
    if (UserProjectData.currentProject === null) {
      return UserProjectData.projects;
    } else {
      return UserProjectData.projects.filter(
        (project) => project._id === UserProjectData.currentProject._id
      );
    }
  };
  const filterParts = () => {
    if (UserProjectData.currentPart === null) {
      return UserProjectData.projectParts;
    } else {
      return UserProjectData.projectParts.filter(
        (part) => part._id === UserProjectData.currentPart._id
      );
    }
  };
  return (
    <div
      id="sidebar"
      className="hidden border-r max-h-full pl-2 pt-2 md:block col-span-2 overflow-y-scroll"
    >
      <p is="sidebar-username" className="font-bold">
        {UserData.user.username}
      </p>

      {/* Projecta tab is always visible */}
      <div id="sidebar-projects-tab">
        <div id="sidebar-projects-tab-projects">
          <button
            className={`w-full text-left py-4 hover:bg-gray-300${
              showProjects ? " bg-gray-100" : ""
            }`}
            onClick={() => setShowProjects(!showProjects)}
          >
            {`${UserProjectData.currentProject ? "Current " : ""}Project${
              UserProjectData.currentProject ? "" : "s"
            }`}
          </button>
          <div className="divide-y">
            {showProjects &&
              filterProjects().map((project) => (
                <div key={project._id}>
                  <div className="pl-4 py-4 hover:bg-gray-300">
                    <Link href={`/projects/${project._id}`}>
                      <a className="no-underline block">{project.name}</a>
                    </Link>
                  </div>
                  {UserProjectData.currentProject && (
                    <div>
                      {/* Parts tab is visible when we're in a project */}
                      {projectId && (
                        <div id="sidebar-project-scenes">
                          <button
                            className={`w-full text-left py-4 hover:bg-gray-300${
                              showProjects ? " bg-gray-100" : ""
                            }`}
                            onClick={() => setShowParts(!showParts)}
                          >
                            Parts
                          </button>
                          <div className="divide-y">
                            {showParts &&
                              filterParts().map((part) => (
                                <div key={part._id}>
                                  <div className="pl-4 py-4 hover:bg-gray-300">
                                    <Link
                                      href={`/projects/${project._id}/${part._id}`}
                                    >
                                      <a className="no-underline block">
                                        {part.name}
                                      </a>
                                    </Link>
                                  </div>
                                </div>
                              ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
