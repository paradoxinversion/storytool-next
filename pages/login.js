import { useState } from "react";
import { useRouter } from "next/router";
import { Formik, Form, Field, ErrorMessage } from "formik";
import Head from "next/head";
import * as yup from "yup";
import { loginUser, registerUser } from "../clientActions/authentication";

const LoginSchema = yup.object().shape({
  username: yup
    .string()
    .min(1, "Name should be at least one character.")
    .max(60, "Name must be less than 60 characters.")
    .required("Username is required."),
  password: yup
    .string()
    .min(4, "Password should be at least four characters.")
    .max(60, "Password must be less than 60 chaarcters.")
    .required("Password is required."),
});
function Login() {
  const router = useRouter();
  const [isRegister, setIsRegister] = useState(false);

  const onSubmit = async (values) => {
    try {
      if (isRegister) {
        await registerUser(values);
        router.push("/dashboard");
      } else {
        await loginUser(values);
        router.push("/dashboard");
      }
    } catch (e) {
      throw e;
    }
  };

  return (
    <div
      id="authentication-page"
      className="flex flex-col justify-center items-center w-full m-4"
    >
      <Head>
        <title>{isRegister ? "Register" : "Log In"}</title>
      </Head>
      <header className="mb-4">
        <p className="text-2xl">Log In</p>
      </header>
      <p className="mb-4">
        Enter your username and password below to log in. If you don't have an
        account yet, click the checkbox below.
      </p>
      <Formik
        initialValues={{ username: "", password: "" }}
        validationSchema={LoginSchema}
        onSubmit={(values) => {
          onSubmit(values);
        }}
      >
        {({ values }) => (
          <Form className="grid grid-cols-1 auto-rows-min border rounded p-6 w-3/4">
            <label htmlFor="username">Username</label>
            <Field
              className="input mb-2"
              type="text"
              name="username"
              placeholder="Username"
              value={values.username}
            />

            <ErrorMessage
              name="username"
              component="div"
              className="text-red-600 text-xs"
            />
            <label htmlFor="password">Password</label>

            <Field
              className="input mb-2"
              type="password"
              name="password"
              placeholder="Password"
              value={values.password}
            />
            <ErrorMessage
              name="password"
              component="div"
              className="text-red-600 text-xs"
            />
            <div
              className="flex justify-between mb-6"
              id="registration-confirm"
            >
              <label className="" htmlFor="register-check">
                Registering?
              </label>
              <input
                className=""
                type="checkbox"
                value={isRegister}
                name="register-check"
                id="register-check"
                onChange={(e) => {
                  setIsRegister(e.target.checked);
                }}
              />
            </div>
            <button className="btn" type="submit">
              {isRegister ? "Register" : "Login"}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
}
export default Login;
