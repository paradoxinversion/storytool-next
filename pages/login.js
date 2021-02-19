import { useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Auth from "../hooks/useAuthentication";
function Login() {
  const router = useRouter();
  const UserData = Auth.useContainer();
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [isRegister, setIsRegister] = useState(false);

  const onChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
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
          ...formData,
        },
      });
      UserData.setUser(result.data.data.login.user);
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
          ...formData,
        },
      });

      UserData.setUser(result.data.data.login.user);

      router.push("/dashboard");
    }
  };
  return (
    <form>
      <input
        type="text"
        name="username"
        onChange={onChange}
        placeholder="Username"
      />
      <input
        type="text"
        name="password"
        onChange={onChange}
        placeholder="Username"
      />
      <label htmlFor="register-check">Registering?</label>
      <input
        type="checkbox"
        value={isRegister}
        name="register-check"
        id="register-check"
        onChange={(e) => {
          setIsRegister(e.target.checked);
        }}
      />

      <button onClick={onSubmit}>Test</button>
    </form>
  );
}
export default Login;
