import Layout from "../componenents/Layout";
import Auth from "../hooks/useAuthentication";
import "../styles/globals.css";
import "draft-js/dist/Draft.css";
import UserProjects from "../hooks/useProjects";

const App = ({ Component, pageProps }) => {
  return (
    <Auth.Provider>
      <UserProjects.Provider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </UserProjects.Provider>
    </Auth.Provider>
  );
};

export default App;
