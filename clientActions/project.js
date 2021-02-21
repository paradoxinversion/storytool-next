import axios from "axios";

export async function deleteProject(projectId) {
  await axios.post("/api/graphql", {
    query: `
    mutation($projectId: String!){
      deleteProject(projectId:$projectId){
        project{
          _id
          name
        
        }
      }
    }
    
    `,
    variables: {
      projectId,
    },
  });
}
