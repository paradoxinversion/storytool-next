import { useRouter } from "next/router";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as yup from "yup";
import { createProject } from "../clientActions/project";
import Link from "next/link";
const CreateProjectSchema = yup.object().shape({
  projectName: yup
    .string()
    .min(1, "Name should be at least one character.")
    .max(200, "Name must be less than 200 characters.")
    .required("Project Name is required."),
});
function CreateProject() {
  const router = useRouter();

  const onSubmit = async (values) => {
    await createProject(values);
    router.push("/dashboard");
  };

  return (
    <div className="m-4">
      <header className="mb-4">
        <p className="text-2xl">Create a Project</p>
        <p>
          A project is the 'folder' for your story. All it requires is a name.
        </p>
        <Link href="/dashboard">
          <a className="underline">Back to the Dashboard</a>
        </Link>
      </header>
      <Formik
        initialValues={{ projectName: "" }}
        validationSchema={CreateProjectSchema}
        onSubmit={(values) => {
          onSubmit(values);
        }}
      >
        <Form className="grid grid-cols-1 auto-rows-min border rounded p-4">
          <label htmlFor="projectName">Project Name</label>
          <Field
            id="projectName"
            className="input"
            type="text"
            name="projectName"
            placeholder=""
          />
          <ErrorMessage
            className="text-red-600 text-xs"
            name="projectName"
            component="div"
          />
          <button className="btn mt-4">Create Project</button>
        </Form>
      </Formik>
    </div>
  );
}
export default CreateProject;
