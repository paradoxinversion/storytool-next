import useSWR from "swr";
import fetcher from "../../../../utils/fetcher";
import { useRouter } from "next/router";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import axios from "axios";

const NoSSREditor = dynamic(
  () => import("../../../../componenents/SceneEditor"),
  {
    ssr: false,
  }
);
function SceneOverview() {
  const router = useRouter();

  const [editSceneName, setEditSceneName] = useState(false);
  const [sceneNameUpdate, setSceneNameUpdate] = useState("");
  const [sceneText, setSceneText] = useState("");
  const { sceneId, partId, projectId } = router.query;

  const { data: sceneData, mutate: mutateSceneData } = useSWR(
    () =>
      sceneId
        ? `
    {
      scene(sceneId: "${sceneId}"){
        _id
        name
        text
      }
    }
    `
        : null,
    fetcher
  );

  useEffect(() => {
    if (sceneData) {
      setSceneText(sceneData.scene.text);
    }
  }, [sceneData]);

  if (!sceneData) {
    return (
      <div>
        <p>Loading Part Data and Scenes... Please be patient.</p>
      </div>
    );
  }

  return (
    <div id="scene-page" className="m-4 grid">
      <header className="mb-4">
        <Link href={`/projects/${projectId}/${partId}`}>
          <a>Back</a>
        </Link>
        <div>
          {editSceneName ? (
            <span className="inline-block">
              <input
                className="text-2xl"
                type="text"
                placeholder={sceneData.scene.name}
                onChange={(e) => setSceneNameUpdate(e.target.value)}
              />
              <button
                className="btn mr-4"
                onClick={async () => {
                  await axios.post("/api/graphql", {
                    query: `
                  mutation($sceneId: String!, $sceneName: String!){
                    updateSceneName(sceneId:$sceneId, sceneName:$sceneName){
                     name
                    }
                  }
                  
                  `,
                    variables: {
                      sceneId: sceneData.scene._id,
                      sceneName: sceneNameUpdate,
                    },
                  });
                  setSceneNameUpdate("");
                  setEditSceneName(false);
                  mutateSceneData();
                }}
                disabled={sceneNameUpdate.length === 0}
              >
                Save
              </button>
              <button className="btn" onClick={() => setEditSceneName(false)}>
                Cancel
              </button>
            </span>
          ) : (
            <span className="text-2xl" onClick={() => setEditSceneName(true)}>
              {sceneData.scene.name}
            </span>
          )}
        </div>
      </header>

      <NoSSREditor initialText={sceneText} sceneId={sceneId} />
    </div>
  );
}

export default SceneOverview;
