import { useState } from "react";
import { render } from "react-dom";
import { Provider } from "react-redux";

import store from "./store/index";
import "../i18n";
import Layout from "./components/Layout";
import Editor from "./components/Editor";
import { useTranslation } from "react-i18next";

export const App = () => {
  const [isLoading, setLoading] = useState(false);
  const { t } = useTranslation();

  return (
    <Provider store={store}>
      {isLoading && (
        <div className="d-flex align-items-center col-12 position-absolute h-100 w-100">
          <div className="mr-auto ml-auto">
            <h3>{t("validation.inprogress")}</h3>
            <div
              className="spinner-grow text-primary"
              role="status"
              aria-hidden="true"
            ></div>
          </div>
        </div>
      )}
      <Layout isLoading={isLoading}>
        <Editor />
      </Layout>
    </Provider>
  );
};

render(<App />, document.getElementById("app"));
