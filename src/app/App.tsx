import { useState } from "react";
import { useTranslation } from "react-i18next";
import store from "./store";
import { Provider } from "react-redux";
import Editor from "./components/Editor";
import Layout from "./components/Layout";
import Head from "./components/Head";
import { NotificationManager } from "design-react-kit";
import "bootstrap-italia/dist/css/bootstrap-italia.min.css";
import "react-widgets/styles.css";
import "../assets/main.css";

const NOTIFICATION_TIMEOUT = 4_000;
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
        <div>
          <NotificationManager
            duration={NOTIFICATION_TIMEOUT}
            fix='top'
            closeOnClick={false}
            style={{ zIndex: 10 }}
          />
          <Head />
          <div className='content'>
            <div className='content__main'>
              <Editor />
            </div>
            <div className='content__sidebar'>sidebar</div>
          </div>
        </div>
      </Layout>
    </Provider>
  );
};

export default App;
