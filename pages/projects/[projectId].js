import useSWR from "swr";
import fetcher from "../../utils/fetcher";
import { useRouter } from "next/router";
import Link from "next/link";
import axios from "axios";
import { useState } from "react";
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

  const { data: projectParts, mutate } = useSWR(
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
    <div className="m-4 w-full">
      <header>
        <Link href={`/dashboard`}>
          <a>Back to Dashboard</a>
        </Link>
        {editProjectName ? (
          <div>
            <input
              type="text"
              placeholder={project.name}
              onChange={(e) => setProjectNameUpdate(e.target.value)}
            />
            <button
              onClick={async () => {
                await axios.post("/api/graphql", {
                  query: `
                  mutation($projectId: String!, $projectName: String!){
                    updateProjectName(projectId:$projectId, projectName:$projectName){
                     name
                    }
                  }
                  
                  `,
                  variables: {
                    projectId: project._id,
                    projectName: projectNameUpdate,
                  },
                });
                setProjectNameUpdate("");
                setEditProjectName(false);
                mutateProjectData();
              }}
              disabled={projectNameUpdate.length === 0}
            >
              Save
            </button>
            <button onClick={() => setEditProjectName(false)}>Cancel</button>
          </div>
        ) : (
          <p className="text-2xl" onClick={() => setEditProjectName(true)}>
            {project.name}
          </p>
        )}
        <Link href={`/projects/${project._id}/create-part`}>
          <a>Create a Part</a>
        </Link>
      </header>
      <div className="grid grid-cols-3 gap-8">
        {parts.map((projectPart, index) => (
          <div key={projectPart._id} className="asset-card">
            <p>
              {index + 1}: {projectPart.name}
            </p>
            <Link href={`/projects/${projectId}/${projectPart._id}`}>
              <a>Go to</a>
            </Link>
            <button
              className="block btn"
              onClick={async (e) => {
                e.preventDefault();
                if (
                  window.confirm(
                    `You are about to delete ${projectPart.name}. Are you sure you'd like to do that?`
                  )
                ) {
                  const result = await axios.post("/api/graphql", {
                    query: `
                      mutation($partId: String!){
                        deletePart(partId:$partId){
                          part{
                            _id
                            name
                          
                          }
                        }
                      }
                      
                      `,
                    variables: {
                      partId: projectPart._id,
                    },
                  });

                  await mutate();
                }
              }}
            >
              Delete Part
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProjectOverview;
