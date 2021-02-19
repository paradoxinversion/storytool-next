import Layout from "../componenents/Layout";
import Auth from "../hooks/useAuthentication";
import "../styles/globals.css";
import "draft-js/dist/Draft.css";

const App = ({ Component, pageProps }) => {
  return (
    <Auth.Provider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </Auth.Provider>
  );
};

export default App;
