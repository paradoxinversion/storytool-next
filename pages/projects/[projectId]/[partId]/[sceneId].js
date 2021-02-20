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
    console.log("Scene data effect in Scene Overview", sceneData);
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
  const saveText = async () => {
    try {
      const result = await axios.post("/api/graphql", {
        query: `
          mutation($text: String!, $sceneId: String!){
            updateSceneText(sceneId:$sceneId, text:$text){
              scene{
                _id
                text
              }
              error
            }
          }
  
          `,
        variables: {
          sceneId: sceneId,
          text: sceneText,
        },
      });

      console.log(result);
      const sceneUpdate = result.data.data.updateSceneText.scene;
      setSceneText(sceneUpdate.text);
    } catch (e) {
      throw e;
    }
  };

  return (
    <div className="container">
      <Link href={`/projects/${projectId}/${partId}`}>
        <a>Back</a>
      </Link>
      {editSceneName ? (
        <div>
          <input
            type="text"
            placeholder={sceneData.scene.name}
            onChange={(e) => setSceneNameUpdate(e.target.value)}
          />
          <button
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
          <button onClick={() => setEditSceneName(false)}>Cancel</button>
        </div>
      ) : (
        <p className="text-2xl" onClick={() => setEditSceneName(true)}>
          {sceneData.scene.name}
        </p>
      )}
      <NoSSREditor initialText={sceneText} setText={setSceneText} />
      <button onClick={saveText}>Save text</button>
    </div>
  );
}

export default SceneOverview;
