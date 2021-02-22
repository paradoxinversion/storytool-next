import useSWR from "swr";
import fetcher from "../../../utils/fetcher";
import { useRouter } from "next/router";
import Link from "next/link";
import axios from "axios";
import { useState } from "react";
import SceneCard from "../../../componenents/assetCards/SceneCard";
import { updatePartName } from "../../../clientActions/part";
function PartOverview() {
  const router = useRouter();
  const { partId, projectId } = router.query;
  const [editPartName, setEditPartName] = useState(false);
  const [partNameUpdate, setPartNameUpdate] = useState("");
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
