import useSWR from "swr";
import { useEffect, useState } from "react";
import Auth from "../hooks/useAuthentication";
import Link from "next/link";
import fetcher from "../utils/fetcher";
import { useRouter } from "next/router";

export default function Dashboard() {
  const UserData = Auth.useContainer();
  const router = useRouter();

  const { data: userProjects, error } = useSWR(
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

  const { projects } = userProjects;

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
      <div id="projects">
        {projects.map((project) => (
          <div key={project._id}>
            <p>{project.name}</p>
            <button
              onClick={() => {
                router.push(`/projects/${project._id}`);
              }}
            >
              Go To
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
