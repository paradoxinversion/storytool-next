import { useState } from "react";
import { useRouter } from "next/router";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { createPart } from "../../../clientActions/part";
import Link from "next/link";
import * as yup from "yup";

const CreatePartSchema = yup.object().shape({
  partName: yup
    .string()
    .min(1, "Name should be at least one character.")
    .max(200, "Name must be less than 200 characters.")
    .required("Part Name is required."),
});
function CreatePart() {
  const router = useRouter();

  const onSubmit = async (values) => {
    await createPart(values, router.query.projectId);
    router.push(`/projects/${router.query.projectId}`);
  };

  return (
    <div className="m-4 md:max-w-md md:m-auto">
      <header className="mb-4">
        <p className="text-2xl">Create a Part</p>
        <p>
          A part is a container for your story's scenes. You can think of it
          like a chapter. All it requires is a name.
        </p>
        <Link href={`/projects/${router.query.projectId}`}>
          <a className="underline">Back to the Project</a>
        </Link>
      </header>
      <Formik
        initialValues={{ partName: "" }}
        validationSchema={CreatePartSchema}
        onSubmit={(values) => {
          onSubmit(values);
        }}
      >
        <Form className="grid grid-cols-1 auto-rows-min border roudned p-4">
          <label htmlFor="partName">Part Name</label>
          <Field
            className="input"
            id="partName"
            type="text"
            name="partName"
            placeholder="Part Name"
          />
          <ErrorMessage
            name="partName"
            component="div"
            className="text-red-600 text-xs"
          />
          <button className="btn mt-4" type="submit">
            Create Part
          </button>
        </Form>
      </Formik>
    </div>
  );
}
export default CreatePart;
