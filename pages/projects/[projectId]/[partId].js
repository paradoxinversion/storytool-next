import useSWR from "swr";
import fetcher from "../../../utils/fetcher";
import { useRouter } from "next/router";
import Link from "next/link";
import axios from "axios";
import { useEffect, useState } from "react";
import SceneCard from "../../../componenents/assetCards/SceneCard";
import { updatePartName } from "../../../clientActions/part";
import UserProjects from "../../../hooks/useProjects";
import { getProject } from "../../../clientActions/project";
function PartOverview() {
  const router = useRouter();
  const { partId, projectId } = router.query;
  const [editPartName, setEditPartName] = useState(false);
  const [partNameUpdate, setPartNameUpdate] = useState("");
  const UserProjectData = UserProjects.useContainer();

  // if (!partId) return null;

  // partId will be undefined on the first render.
  // Pass in the value
  const { data: partScenes, mutate: mutateSceneData } = useSWR(
    () =>
      partId
        ? `
    {
      partScenes(partId: "${partId}"){
        _id
        name
      }
    }
  `
        : null,
    fetcher
  );

  const { data: partData, mutate: mutatePartData } = useSWR(
    () =>
      partId
        ? `
    { 
      part(partId: "${partId}"){
        _id
        name
      }
    }
  `
        : null,
    fetcher
  );
  useEffect(() => {
    // if we don't have project data, we need to fetch it
    // we don't normally fetch it on this page otherwise
    // users may have navigated here with that data already in state
    if (UserProjectData.projects.length === 0) {
      if (projectId) {
        getProject(projectId).then(({ data }) => {
          console.log(data.data);
          UserProjectData.setCurrentProject(data.data.project);
        });
      }
    }
  }, [projectId]);

  useEffect(() => {
    // Set our part data
    if (partData) {
      UserProjectData.setCurrentPart(partData.part);
    }
  }, [partData]);
  if (!partData || !partScenes) {
    return (
      <div>
        <p>Loading Part Data and Scenes... Please be patient.</p>
      </div>
    );
  }
  const { part } = partData;
  return (
    <div id="part-page" className=" m-4 grid">
      <header>
        <Link href={`/projects/${projectId}`}>
          <a>Back to Project</a>
        </Link>
        <div>
          {editPartName ? (
            <span>
              <input
                className="text-2xl"
                type="text"
                placeholder={part.name}
                onChange={(e) => setPartNameUpdate(e.target.value)}
              />
              <button
                className="btn mr-4"
                onClick={async () => {
                  await updatePartName(part._id, partNameUpdate);
                  setPartNameUpdate("");
                  setEditPartName(false);
                  mutatePartData();
                }}
                disabled={partNameUpdate.length === 0}
              >
                Save
              </button>
              <button className="btn" onClick={() => setEditPartName(false)}>
                Cancel
              </button>
            </span>
          ) : (
            <span className="text-2xl" onClick={() => setEditPartName(true)}>
              {part.name}
            </span>
          )}
        </div>
      </header>
      <section>
        <header className="flex justify-between">
          <p className="text-xl">Scenes</p>
          <Link href={`/projects/${projectId}/${part._id}/create-scene`}>
            <a className="mb-4 block text-right">New Scene</a>
          </Link>
        </header>
        <div className="bg-gray-100 p-4 border rounded shadow-inner flex-grow overflow-y-scroll sm:grid sm:grid-cols-3 sm:gap-4 sm:auto-rows-min">
          {partScenes.partScenes.map((scene) => (
            <SceneCard
              scene={scene}
              projectId={projectId}
              partId={partId}
              mutateSceneData={mutateSceneData}
            />
          ))}
        </div>
      </section>
    </div>
  );
}

export default PartOverview;
