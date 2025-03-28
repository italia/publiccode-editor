import "bootstrap-italia/dist/css/bootstrap-italia.min.css";
import { NotificationManager } from "design-react-kit";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Provider } from "react-redux";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import "react-widgets/styles.css";
import "../assets/main.css";
import Editor from "./components/Editor";
import Head from "./components/Head";
import Layout from "./components/Layout";
import WarningBox, { Warning } from "./components/WarningBox";
import YamlPreview from "./components/YamlPreview";
import PublicCode, {
  PublicCodeWithDeprecatedFields,
} from "./contents/publiccode";
import { getYaml, useIsMobile } from "./lib/utils";
import store from "./store";

const NOTIFICATION_TIMEOUT = 4_000;
export const App = () => {
  const isMobile = useIsMobile();
  const [isLoading] = useState(false);
  const [isPublicCodeImported, setPublicCodeImported] = useState(false);
  const [warnings, setWarnings] = useState<Warning[]>([]);
  const [publicCodeData, setPublicCodeData] = useState<
    PublicCode | PublicCodeWithDeprecatedFields | undefined
  >();
  const { t } = useTranslation();

  const leftPanel = (
    <div className="content__wrapper">
      <Editor
        setData={(d) => {
          setPublicCodeData(d);
        }}
        setWarnings={setWarnings}
        setPublicCodeImported={setPublicCodeImported}
        isPublicCodeImported={isPublicCodeImported}
      />
    </div>
  );

  const rightPanel = (
    <div className="content__sidebar" id="content-sidebar">
      {warnings?.length > 0 && (
        <WarningBox
          warnings={warnings}
          setWarnings={(items) => setWarnings(items as Warning[])}
        />
      )}
      <YamlPreview
        yaml={getYaml(publicCodeData as PublicCode) as string}
        toggle={() => console.log("toggle")}
      />
    </div>
  );

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
            />
          </div>
        </div>
      )}
      <Layout isLoading={isLoading}>
        <div>
          <NotificationManager
            duration={NOTIFICATION_TIMEOUT}
            fix="top"
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
          {/* <div>
            <Head />
          </div> */}
          <div className="content__head">
            <Head />
          </div>
          <div className="content">
            {isMobile ? (
              <div className="content__mobile">
                {leftPanel}
                {rightPanel}
              </div>
            ) : (
              <PanelGroup direction="horizontal">
                <Panel defaultSize={100}>{leftPanel}</Panel>
                <PanelResizeHandle className="panel-resize-handle" />
                <Panel defaultSize={80}>{rightPanel}</Panel>
              </PanelGroup>
            )}
          </div>
        </div>
      </Layout>
    </Provider>
  );
};

export default App;
