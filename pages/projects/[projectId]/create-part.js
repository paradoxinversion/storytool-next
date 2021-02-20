import { useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Auth from "../../../hooks/useAuthentication";
import { Formik, Form, Field, ErrorMessage } from "formik";

function CreatePart() {
  const router = useRouter();
  const UserData = Auth.useContainer();
  const [formData, setFormData] = useState(() => ({
    partName: "",
  }));

  const onChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const onSubmit = async (values) => {
    const result = await axios.post("/api/graphql", {
      query: `
        mutation($partName: String!,  $projectId: String!){
          createPart(partName:$partName, projectId:$projectId){
            part{
              _id
              name
            }
            error
          }
        }

        `,
      variables: {
        ...values,
        projectId: router.query.projectId,
      },
    });
    router.push(`/projects/${router.query.projectId}`);
  };

  return (
    <div>
      <Formik
        initialValues={{ partName: "" }}
        onSubmit={(values) => {
          onSubmit(values);
        }}
      >
        <Form className="grid grid-cols-1 auto-rows-min">
          <Field type="text" name="partName" placeholder="Part Name" />
          <button className="btn" type="submit">
            Create Part
          </button>
        </Form>
      </Formik>
    </div>
  );
}
export default CreatePart;
