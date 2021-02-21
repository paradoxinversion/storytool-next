import axios from "axios";

export async function registerUser(formValues) {
  try {
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
        ...formValues,
      },
    });
  } catch (e) {
    throw e;
  }
}

export async function loginUser(formValues) {
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
      ...formValues,
    },
  });
}
