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
import WarningBox, { Warning } from "./components/WarningBox";
import PublicCode, {
  PublicCodeWithDeprecatedFields,
} from "./contents/publiccode";
import { getYaml } from "./lib/utils";
import YamlPreview from "./components/YamlPreview";

const NOTIFICATION_TIMEOUT = 4_000;
export const App = () => {
  const [isLoading] = useState(false);
  const [isPublicCodeImported, setPublicCodeImported] = useState(false);
  const [warnings, setWarnings] = useState<Warning[]>([]);
  const [data, setData] = useState<
    PublicCode | PublicCodeWithDeprecatedFields | undefined
  >();
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
            />
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
          {/* <YamlModal
                yaml={getYaml(data)}
                display={isYamlModalVisible}
                toggle={() => setYamlModalVisibility(!isYamlModalVisible)}
              />
              <WarningModal
                display={isWarningModalVisible}
                toggle={() => setWarningModalVisibility(!isWarningModalVisible)}
                warnings={warnings}
                setWarnings={setWarnings}
              /> */}
          <div>
            <Head />
          </div>
          <div className='content'>
            <div className='content__main'>
              <Editor
                setData={(d) => setData(d)}
                setWarnings={setWarnings}
                setPublicCodeImported={setPublicCodeImported}
                isPublicCodeImported={isPublicCodeImported}
              />
            </div>
            <div className='content__sidebar'>
              {warnings && (
                <WarningBox
                  warnings={warnings}
                  setWarnings={(items) => setWarnings(items as Warning[])}
                />
              )}
              {data && (
                <YamlPreview
                  yaml={getYaml(data as PublicCode) as string}
                  toggle={() => console.log("toggle")}
                />
              )}
            </div>
          </div>
        </div>
      </Layout>
    </Provider>
  );
};

export default App;
