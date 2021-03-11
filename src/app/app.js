import React, { useState } from "react";
import { render } from "react-dom";
import store from "./store/index";
import { Provider } from "react-redux";
import "../i18n";
import Layout from "./components/layout";
import { Editor } from "./components/editor";
import { useTranslation } from "react-i18next";

import "bootstrap";
import $ from "jquery";
window.jQuery = $;
window.$ = $;

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
        {/* old editor */}
        {/* <Index onLoadingRemote={setLoading} /> */}
        <Editor setLoading={setLoading} isLoading={isLoading}/>
      </Layout>
    </Provider>
  );
};

render(<App />, document.getElementById("app"));
