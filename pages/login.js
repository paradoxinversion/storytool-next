import { useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { Formik, Form, Field, ErrorMessage } from "formik";
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
    <div className="flex justify-center w-full">
      <Formik
        initialValues={{ username: "", password: "" }}
        onSubmit={(values) => {
          onSubmit(values);
        }}
      >
        {({ values }) => (
          <Form className="grid grid-cols-1 auto-rows-min">
            <Field
              className="input"
              type="text"
              name="username"
              placeholder="Username"
              value={values.username}
            />
            <Field
              className="input"
              type="text"
              name="password"
              placeholder="Password"
              value={values.password}
            />
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
