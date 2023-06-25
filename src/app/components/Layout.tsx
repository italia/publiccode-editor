import "../../asset/style.scss";
import { NotificationManager } from "design-react-kit";
import { NOTIFICATION_TIMEOUT } from "../contents/constants";

interface Props {
  children: React.ReactNode;
  isLoading: boolean;
}

const Layout = ({ children, isLoading }: Props): JSX.Element => (
  <div className={isLoading ? "wrapper loadingRemote" : "wrapper"}>
    <NotificationManager duration={NOTIFICATION_TIMEOUT} fix="top" />
    {children}
  </div>
);

export default Layout;
