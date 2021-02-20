import { useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { Formik, Form, Field, ErrorMessage } from "formik";

function CreateProject() {
  const router = useRouter();

  const onSubmit = async (values) => {
    const result = await axios.post("/api/graphql", {
      query: `
        mutation($projectName: String!){
          createProject(projectName:$projectName){
            project{
              _id
              name
            
            }
          }
        }
        
        `,
      variables: {
        ...values,
      },
    });
    router.push("/dashboard");
  };

  return (
    <div className="">
      <Formik
        initialValues={{ projectName: "" }}
        onSubmit={(values) => {
          onSubmit(values);
        }}
      >
        <Form className="grid grid-cols-1 auto-rows-min">
          <Field type="text" name="projectName" placeholder="projectName" />
          <button className="btn">Create Project</button>
        </Form>
      </Formik>
    </div>
  );
}
export default CreateProject;
