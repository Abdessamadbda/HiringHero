// pages/_app.js
import { Provider } from "react-redux";
import store from "./lib/store";
import Layout from "../components/Layout"; // Import your layout component

function App({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </Provider>
  );
}

export default App;
