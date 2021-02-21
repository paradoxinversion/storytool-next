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
