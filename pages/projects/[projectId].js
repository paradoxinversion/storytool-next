import useSWR from "swr";
import fetcher from "../../utils/fetcher";
import { useRouter } from "next/router";
import Link from "next/link";
function ProjectOverview() {
  const router = useRouter();
  const { data: projectData, mutate } = useSWR(
    `
    {
      getProject(projectId: "${router.query.projectId}"){
        _id
        name
      }
    }
  `,
    fetcher
  );

  const { data: projectParts } = useSWR(
    () =>
      `
    { 
      projectParts(projectId: "${projectData.getProject._id}"){
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
  return (
    <div>
      <p>{projectData.getProject.name}</p>
      <button
        onClick={() => {
          router.push(`/projects/${projectData.getProject._id}/create-part`);
        }}
      >
        Create Part
      </button>
      <div>
        {projectParts.projectParts.map((projectPart, index) => (
          <div key={projectPart._id}>
            <p>
              {index + 1}: {projectPart.name}
            </p>
            <Link
              href={`/projects/${router.query.projectId}/${projectPart._id}`}
            >
              <a>Go to</a>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProjectOverview;
