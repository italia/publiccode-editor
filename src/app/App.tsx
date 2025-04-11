import "bootstrap-italia/dist/css/bootstrap-italia.min.css";
import { NotificationManager } from "design-react-kit";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import "react-widgets/styles.css";
import "../assets/main.css";
import Editor from "./components/Editor";
import Head from "./components/Head";
import Layout from "./components/Layout";
import SettingsPanel from "./components/SettingsPanel";
import WarningBox from "./components/WarningBox";
import YamlPreview from "./components/YamlPreview";
import { useIsMobile } from "./lib/utils";

const NOTIFICATION_TIMEOUT = 4_000;
export const App = () => {
  const isMobile = useIsMobile();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isLoading] = useState(false);
  const { t } = useTranslation();

  const leftPanel = (
    <div className="content__wrapper">
      <Editor />
    </div>
  );

  const rightPanel = (
    <div className="content__sidebar" id="content-sidebar">
      <WarningBox />
      <YamlPreview />
    </div>
  );

  return (
    <div>
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
          <div className="content__head">
            <Head onSettingsClick={() => setIsSettingsOpen(!isSettingsOpen)} />
          </div>
          <SettingsPanel
            isOpen={isSettingsOpen}
            onClose={() => setIsSettingsOpen(false)}
          />
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
    </div>
  );
};

export default App;
