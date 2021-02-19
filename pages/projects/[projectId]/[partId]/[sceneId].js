import useSWR from "swr";
import fetcher from "../../../../utils/fetcher";
import { useRouter } from "next/router";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
const NoSSREditor = dynamic(
  () => import("../../../../componenents/SceneEditor"),
  {
    ssr: false,
  }
);
function SceneOverview() {
  const router = useRouter();
  const { sceneId } = router.query;
  const [sceneText, setSceneText] = useState("");
  // if (!sceneId) return null;

  const { data: sceneData, mutate } = useSWR(
    `
    {
      scene(sceneId: "${sceneId}"){
        _id
        name
        text
      }
    }
    `,
    fetcher
  );

  useEffect(() => {
    console.log(sceneData);
    if (sceneData) {
      setSceneText(sceneData.scene.text);
    }
  }, [sceneData]);
  if (sceneData) {
    return (
      <div>
        <p>Loading Part Data and Scenes... Please be patient.</p>
      </div>
    );
  }
  return (
    <div className="container">
      <p>{sceneData.scene.name}</p>
      <NoSSREditor initialText={sceneText} />
    </div>
  );
}

export default SceneOverview;
