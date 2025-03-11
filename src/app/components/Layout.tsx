import { NotificationManager } from "design-react-kit";
import Head from "./Head";

const NOTIFICATION_TIMEOUT = 4_000;

interface Props {
  children: React.ReactNode;
  isLoading: boolean;
}

const Layout = ({ children, isLoading }: Props): JSX.Element => (
  <div className={isLoading ? "loadingRemote" : ""}>
    <NotificationManager
      duration={NOTIFICATION_TIMEOUT}
      fix='top'
      closeOnClick={false}
      style={{ zIndex: 10 }}
    />
    <Head />
    <div className='content'>
      <div className='content__main'>{children}</div>
      <div className='content__sidebar'>sidebar</div>
    </div>
  </div>
);

export default Layout;
