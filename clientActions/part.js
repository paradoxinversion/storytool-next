import axios from "axios";

export async function deletePart(partId) {
  await axios.post("/api/graphql", {
    query: `
    mutation($partId: String!){
      deletePart(partId:$partId){
        part{
          _id
          name
        
        }
      }
    }
    
    `,
    variables: {
      partId,
    },
  });
}

export async function createPart(formValues, projectId) {
  await axios.post("/api/graphql", {
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
      ...formValues,
      projectId,
    },
  });
}

export async function updatePartName(partId, partName) {
  await axios.post("/api/graphql", {
    query: `
    mutation($partId: String!, $partName: String!){
      updatePartName(partId:$partId, partName:$partName){
       name
      }
    }
    
    `,
    variables: {
      partId,
      partName,
    },
  });
}
