import useSWR from "swr";
import fetcher from "../../utils/fetcher";
import { useRouter } from "next/router";
import Link from "next/link";

function ProjectOverview() {
  const router = useRouter();
  const { projectId } = router.query;
  const { data: projectData } = useSWR(
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

  const { data: projectParts } = useSWR(
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
      <Link href={`/dashboard`}>
        <a>Back to Dashboard</a>
      </Link>
      <p>{project.name}</p>
      <Link href={`/projects/${project._id}/create-part`}>
        <a>Create a Part</a>
      </Link>
      <div>
        {parts.map((projectPart, index) => (
          <div key={projectPart._id}>
            <p>
              {index + 1}: {projectPart.name}
            </p>
            <Link href={`/projects/${projectId}/${projectPart._id}`}>
              <a>Go to</a>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProjectOverview;
