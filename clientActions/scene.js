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

export async function updateSceneText(sceneId, text) {
  await axios.post("/api/graphql", {
    query: `
      mutation($text: String!, $sceneId: String!){
        updateSceneText(sceneId:$sceneId, text:$text){
          scene{
            _id
            text
          }
          error
        }
      }

      `,
    variables: {
      sceneId,
      text,
    },
  });
}
