import { useState } from "react";
import "./App.css";
import { useTranslation } from "react-i18next";
import store from "./store";
import { Provider } from "react-redux";
import Editor from "./components/Editor";
import Layout from "./components/Layout";

export const App = () => {
  const [isLoading] = useState(false);
  const { t } = useTranslation();
  return (
    <Provider store={store}>
      {isLoading && (
        <div className='d-flex align-items-center col-12 position-absolute h-100 w-100'>
          <div className='mr-auto ml-auto'>
            <h3>{t("validation.inprogress")}</h3>
            <div
              className='spinner-grow text-primary'
              role='status'
              aria-hidden='true'
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

export default App;
