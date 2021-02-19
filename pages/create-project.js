import { useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Auth from "../hooks/useAuthentication";
function CreateProject() {
  const router = useRouter();
  const [formData, setFormData] = useState({ username: "", password: "" });

  const onChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
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
        ...formData,
      },
    });
    router.push("/dashboard");
  };

  return (
    <form>
      <input
        type="text"
        name="projectName"
        onChange={onChange}
        placeholder="projectName"
      />
      <button onClick={onSubmit}>Test</button>
    </form>
  );
}
export default CreateProject;
