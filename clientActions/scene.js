import axios from "axios";

export async function deleteScene(sceneId) {
  await axios.post("/api/graphql", {
    query: `
            mutation($sceneId: String!){
              deleteScene(sceneId:$sceneId){
                scene{
                  _id
                  name
                
                }
              }
            }
            
            `,
    variables: {
      sceneId,
    },
  });
}
