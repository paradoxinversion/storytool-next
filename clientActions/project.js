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

export async function updateProjectName(projectId, projectName) {
  await axios.post("/api/graphql", {
    query: `
    mutation($projectId: String!, $projectName: String!){
      updateProjectName(projectId:$projectId, projectName:$projectName){
       name
      }
    }
    
    `,
    variables: {
      projectId,
      projectName,
    },
  });
}
