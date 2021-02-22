import useSWR from "swr";
import fetcher from "../../utils/fetcher";
import { useRouter } from "next/router";
import Link from "next/link";
import axios from "axios";
import { useState } from "react";
import { updateProjectName } from "../../clientActions/project";
import { deletePart } from "../../clientActions/part";
import PartCard from "../../componenents/assetCards/PartCard";
function ProjectOverview() {
  const router = useRouter();
  const { projectId } = router.query;
  const [editProjectName, setEditProjectName] = useState(false);
  const [projectNameUpdate, setProjectNameUpdate] = useState("");
  const { data: projectData, mutate: mutateProjectData } = useSWR(
    () =>
      projectId
        ? `
    {
      project(projectId: "${projectId}"){
        _id
        name
      }
    }
  `
        : null,
    fetcher
  );

  const { data: projectParts, mutate: mutateProjectParts } = useSWR(
    () =>
      `
    { 
      projectParts(projectId: "${projectData.project._id}"){
        _id
        name
      }
    }
  `,
    fetcher
  );

  if (!projectData || !projectParts) {
    return (
      <div>
        Loading User Projects... This may take so time, please be patient.
      </div>
    );
  }

  const { project } = projectData;
  const { projectParts: parts } = projectParts;
  return (
    <div className="m-4 w-full flex flex-col">
      <header>
        <Link href={`/dashboard`}>
          <a>Back to Dashboard</a>
        </Link>
        <div>
          {editProjectName ? (
            <span>
              <input
                className="text-2xl w-40"
                type="text"
                placeholder={project.name}
                onChange={(e) => setProjectNameUpdate(e.target.value)}
              />
              <button
                className="btn mr-4"
                onClick={async () => {
                  await updateProjectName(project._id, projectNameUpdate);
                  setProjectNameUpdate("");
                  setEditProjectName(false);
                  mutateProjectData();
                }}
                disabled={projectNameUpdate.length === 0}
              >
                Save
              </button>
              <button className="btn" onClick={() => setEditProjectName(false)}>
                Cancel
              </button>
            </span>
          ) : (
            <span className="text-2xl" onClick={() => setEditProjectName(true)}>
              {project.name}
            </span>
          )}
        </div>
      </header>
      <section>
        <header className="flex justify-between">
          <p className="text-xl">Parts</p>
          <Link href={`/projects/${project._id}/create-part`}>
            <a className="block mb-4 text-right">Create a Part</a>
          </Link>
        </header>
        <div className="bg-gray-100 p-4 border rounded shadow-inner flex-grow overflow-y-scroll sm:grid sm:grid-cols-3 sm:gap-4 sm:auto-rows-min">
          {parts.map((projectPart, index) => (
            <PartCard
              projectPart={projectPart}
              mutateProjectParts={mutateProjectParts}
              projectId={projectId}
            />
          ))}
        </div>
      </section>
    </div>
  );
}

export default ProjectOverview;
