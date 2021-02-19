import { useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Auth from "../../../hooks/useAuthentication";
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

  const onSubmit = async (e) => {
    e.preventDefault();
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
        ...formData,
        projectId: router.query.projectId,
      },
    });
    router.push(`/projects/${router.query.projectId}`);
  };

  return (
    <form>
      <input
        type="text"
        name="partName"
        onChange={onChange}
        placeholder="Part Name"
      />
      <button onClick={onSubmit}>Test</button>
    </form>
  );
}
export default CreatePart;
