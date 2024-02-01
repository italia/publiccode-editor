import "../../asset/style.scss";
import { NotificationManager } from "design-react-kit";

const NOTIFICATION_TIMEOUT = 4_000;

interface Props {
  children: React.ReactNode;
  isLoading: boolean;
}

const Layout = ({ children, isLoading }: Props): JSX.Element => (
  <div className={isLoading ? "wrapper loadingRemote" : "wrapper"}>
    <NotificationManager duration={NOTIFICATION_TIMEOUT} fix="top" closeOnClick={false} style={{zIndex: 10}} />
    {children}
  </div>
);

export default Layout;
