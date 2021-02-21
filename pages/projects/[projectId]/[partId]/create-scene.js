import { useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import dynamic from "next/dynamic";
import { Formik, Form, Field, ErrorMessage } from "formik";
import Link from "next/link";
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
    <div className="w-full m-4">
      <header className="mb-4">
        <p className="text-2xl">Create a Scene</p>
        <p>Scenes are the smallest units of your story. What happens?</p>
        <Link
          href={`/projects/${router.query.projectId}/${router.query.partId}`}
        >
          <a className="underline">Back to the Part</a>
        </Link>
      </header>
      <Formik
        initialValues={{ sceneName: "" }}
        onSubmit={(values) => {
          onSubmit(values);
        }}
      >
        <Form className="border rounded p-4">
          <label htmlFor="sceneName">Scene Name</label>
          <Field
            className="input mb-4 w-full"
            type="text"
            id="sceneName"
            name="sceneName"
            placeholder="Scene Name"
          />
          <NoSSREditor setText={setSceneText} />
          <button className="btn mt-4" type="submit">
            Create Scene
          </button>
        </Form>
      </Formik>
    </div>
  );
}
export default CreateScene;
