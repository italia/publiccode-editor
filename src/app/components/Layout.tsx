import "bootstrap-italia/dist/css/bootstrap-italia.min.css";
import "react-widgets/styles.css";
import "../../asset/index.css";
import { NotificationManager } from "design-react-kit";

const NOTIFICATION_TIMEOUT = 4_000;

interface Props {
  children: React.ReactNode;
  isLoading: boolean;
}

const Layout = ({ children, isLoading }: Props): JSX.Element => (
  <div className={isLoading ? "loadingRemote" : ""}>
    <NotificationManager
      duration={NOTIFICATION_TIMEOUT}
      fix="top"
      closeOnClick={false}
      style={{ zIndex: 10 }}
    />
    {children}
  </div>
);

export default Layout;
