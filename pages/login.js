import { useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { Formik, Form, Field, ErrorMessage } from "formik";
import Head from "next/head";
import * as yup from "yup";

const LoginSchema = yup.object().shape({
  username: yup
    .string()
    .min(1, "Name should be at least one character")
    .max(60, "Name must be less than 60 characters.")
    .required(),
  password: yup
    .string()
    .min(4, "Password should be at least four characters")
    .max(60, "Password must be less than 60 chaarcters.")
    .required(),
});
function Login() {
  const router = useRouter();
  const [isRegister, setIsRegister] = useState(false);

  const onSubmit = async (values) => {
    let result;
    if (isRegister) {
      result = await axios.post("/api/graphql", {
        query: `
        mutation($username: String!, $password: String!){
          register(username:$username, password:$password){
            user{
              _id
              username
            }
            error
          }
        }
        
        `,
        variables: {
          ...values,
        },
      });
      router.push("/dashboard");
    } else {
      result = await axios.post("/api/graphql", {
        query: `
          mutation($username: String!, $password: String!){
            login(username:$username, password:$password){
              user{
                _id
                username
              }
              error
            }
          }
          
        
        `,
        variables: {
          ...values,
        },
      });

      router.push("/dashboard");
    }
  };

  return (
    <div
      id="authentication-page"
      className="flex justify-center items-center w-full"
    >
      <Head>
        <title>{isRegister ? "Register" : "Log In"}</title>
      </Head>
      <Formik
        initialValues={{ username: "", password: "" }}
        validationSchema={LoginSchema}
        onSubmit={(values) => {
          onSubmit(values);
        }}
      >
        {({ values, errors }) => (
          <Form className="grid grid-cols-1 auto-rows-min">
            <Field
              className="input"
              type="text"
              name="username"
              placeholder="Username"
              value={values.username}
            />

            <ErrorMessage name="username" component="div" />

            <Field
              className="input"
              type="text"
              name="password"
              placeholder="Password"
              value={values.password}
            />
            <ErrorMessage name="password" component="div" />
            <label htmlFor="register-check">
              Registering?
              <input
                type="checkbox"
                value={isRegister}
                name="register-check"
                id="register-check"
                onChange={(e) => {
                  setIsRegister(e.target.checked);
                }}
              />
            </label>

            <button type="submit">Submit</button>
          </Form>
        )}
      </Formik>
    </div>
  );
}
export default Login;
