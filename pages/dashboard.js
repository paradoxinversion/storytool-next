import useSWR from "swr";
import Auth from "../hooks/useAuthentication";
import Link from "next/link";
import fetcher from "../utils/fetcher";
import ProjectCard from "../componenents/assetCards/ProjectCard";
import MiniSceneCard from "../componenents/assetCards/MiniSceneCard";

export default function Dashboard() {
  const UserData = Auth.useContainer();

  const { data: userProjects, mutate: mutateProjects } = useSWR(
    `
    {
      projects{
        _id
        name
      }
    }
  `,
    fetcher
  );

  const { data: userScenes, mutate: mutateScenes } = useSWR(
    () =>
      UserData.user._id
        ? `
    {
      userScenes{
        _id
        name
        project{
          _id
          name
        }
        part{
          _id
          name
        }
      }
    }
  `
        : null,
    fetcher
  );
  if (!UserData.user)
    return (
      <Link href="/login">
        <a className="underline">Log In</a>
      </Link>
    );

  if (!userProjects) {
    return (
      <div>
        Loading User Projects... This may take so time, please be patient.
      </div>
    );
  }
  if (!userScenes) {
    return (
      <div>
        Loading User Scenes... This may take so time, please be patient.
      </div>
    );
  }
  const { projects } = userProjects;
  const { userScenes: scenes } = userScenes;
  return (
    <div id="dashboard" className="m-4 w-full">
      <header className="mb-4">
        <p className="text-2xl">Dashboard</p>
      </header>
      <section id="projects-container" className="mb-4">
        <header className="mb-2 flex justify-between">
          <span className="text-xl">Projects</span>
          <Link href={`/create-project`}>
            <a>Create Project</a>
          </Link>
        </header>
        <div
          id="projects"
          className="bg-gray-100 p-4 border rounded shadow-inner h-48 overflow-y-scroll sm:grid sm:grid-cols-3 sm:gap-4"
        >
          {projects.map((project) => (
            <ProjectCard
              project={project}
              mutateProjects={mutateProjects}
              mutateScenes={mutateScenes}
            />
          ))}
        </div>
      </section>
      <section id="scenes-container" className="mb-4">
        <header className="mb-2">
          <p className="text-xl">Scenes</p>
        </header>
        <div
          id="schenes"
          className="bg-gray-100 border rounded p-4 shadow-inner  h-48 overflow-y-scroll grid grid-cols-2 gap-4 sm:grid-cols-3"
        >
          {scenes.map((scene) => (
            <MiniSceneCard scene={scene} />
          ))}
        </div>
      </section>
    </div>
  );
}
