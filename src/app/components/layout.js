import React,{ useRef } from "react";
import "../../asset/style.scss";
import "react-widgets/dist/css/react-widgets.css";
import ReactNotify from "react-notify";
import { useSelector } from "react-redux";

export const Layout = (props) => {
  const notifications = useSelector(state => state.notifications);
  const notificationRef = useRef();
  if (
    notifications &&
    notifications != props.notifications &&
    notifications.item
  ) {
    let n = notifications.item;
    let { type, title, msg, millis } = n;
    if (type == "success") {
      notificationRef.current.notificator.success(
        title ? title : "",
        msg,
        millis ? millis : 2000
      );
    } else if (type == "info") {
      notificationRef.current.notificator.info(
        title ? title : "",
        msg,
        millis ? millis : 2000
      );
    } else {
      notificationRef.current.notificator.error(
        title ? title : "",
        msg,
        millis ? millis : 3000
      );
    }
  }

  const loadingRemote = props.loadingRemote;

  const className = loadingRemote ? "wrapper loadingRemote" : "wrapper";
  return (
    <div className={className}>
      <ReactNotify ref={notificationRef} />
      {props.children}
    </div>
  );
};

export default Layout;
