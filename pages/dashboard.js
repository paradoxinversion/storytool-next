import useSWR from "swr";
import { useEffect, useState } from "react";
import Auth from "../hooks/useAuthentication";
import Link from "next/link";
import fetcher from "../utils/fetcher";
import { useRouter } from "next/router";
import axios from "axios";
export default function Dashboard() {
  const UserData = Auth.useContainer();
  const router = useRouter();

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
      <p className="text-2xl">Dashboard</p>
      <button
        className="btn"
        onClick={() => {
          router.push("/create-project");
        }}
      >
        New Project
      </button>
      <section id="projects">
        <p>Projects</p>
        <div className="grid grid-cols-3 gap-8">
          {projects.map((project) => (
            <div key={project._id} className="asset-card">
              <Link href={`/projects/${project._id}`}>
                <a className="underline">{project.name} </a>
              </Link>
              <button
                className="block btn"
                onClick={async (e) => {
                  e.preventDefault();
                  if (
                    window.confirm(
                      `You are about to delete ${project.name}. Are you sure you'd like to do that?`
                    )
                  ) {
                    const result = await axios.post("/api/graphql", {
                      query: `
                      mutation($projectId: String!){
                        deleteProject(projectId:$projectId){
                          project{
                            _id
                            name
                          
                          }
                        }
                      }
                      
                      `,
                      variables: {
                        projectId: project._id,
                      },
                    });

                    await mutateProjects();
                    await mutateScenes();
                  }
                }}
              >
                Delete Project
              </button>
            </div>
          ))}
        </div>
      </section>
      <section id="scenes">
        <p>Scenes</p>
        <div className="grid grid-cols-3 gap-8">
          {scenes.map((scene) => (
            <div key={scene._id} className="asset-card">
              <Link
                href={`/projects/${scene.project._id}/${scene.part._id}/${scene._id}`}
              >
                <a className="underline">{`${scene.name.slice(0, 20)}...`} </a>
              </Link>
              <p className="text-sm text-left">
                {`Project: ${scene.project.name.slice(0, 20)}${
                  scene.project.name.length > 20 ? "..." : ""
                }`}
              </p>
              <p className="text-sm text-left">
                {`Part: ${scene.part.name.slice(0, 20)}${
                  scene.part.name.length > 20 ? "..." : ""
                }`}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
