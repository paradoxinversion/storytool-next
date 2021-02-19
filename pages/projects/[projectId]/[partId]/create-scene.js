import { useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Auth from "../../../../hooks/useAuthentication";
import dynamic from "next/dynamic";

const NoSSREditor = dynamic(
  () => import("../../../../componenents/SceneEditor"),
  {
    ssr: false,
  }
);
function CreateScene() {
  const router = useRouter();
  const UserData = Auth.useContainer();
  const [formData, setFormData] = useState(() => ({
    sceneName: "",
  }));
  const [sceneText, setSceneText] = useState("");

  const onChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const result = await axios.post("/api/graphql", {
      query: `
        mutation($sceneName: String!, $text: String!  $projectId: String!, $partId: String!){
          createScene(sceneName:$sceneName, text:$text projectId:$projectId, partId:$partId){
            scene{
              _id
              name
            }
            error
          }
        }

        `,
      variables: {
        ...formData,
        projectId: router.query.projectId,
        partId: router.query.partId,
        text: sceneText,
      },
    });
    router.push(`/projects/${router.query.projectId}/${router.query.partId}`);
  };

  return (
    <form>
      <input
        type="text"
        name="sceneName"
        onChange={onChange}
        placeholder="Scene Name"
      />
      <NoSSREditor setText={setSceneText} />
      <button onClick={onSubmit}>Test</button>
    </form>
  );
}
export default CreateScene;
