import { useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import dynamic from "next/dynamic";
import { Formik, Form, Field, ErrorMessage } from "formik";

const NoSSREditor = dynamic(
  () => import("../../../../componenents/SceneEditor"),
  {
    ssr: false,
  }
);
function CreateScene() {
  const router = useRouter();

  const [sceneText, setSceneText] = useState("");

  const onSubmit = async (formData) => {
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
    <div className="w-full">
      <Formik
        initialValues={{ sceneName: "" }}
        onSubmit={(values) => {
          onSubmit(values);
        }}
      >
        <Form>
          <Field
            className="input"
            type="text"
            name="sceneName"
            placeholder="Scene Name"
          />
          <NoSSREditor setText={setSceneText} />
          <button className="btn" type="submit">
            Create Scene
          </button>
        </Form>
      </Formik>
    </div>
  );
}
export default CreateScene;
