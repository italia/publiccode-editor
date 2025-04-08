interface Props {
  children: React.ReactNode;
  isLoading: boolean;
}

const Layout = ({ children, isLoading }: Props): JSX.Element => (
  <div className={isLoading ? "loadingRemote" : ""}>{children}</div>
);

export default Layout;
