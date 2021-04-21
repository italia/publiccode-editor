import React,{ useRef } from "react";
import "../../asset/style.scss";
import "react-widgets/styles.css";
import ReactNotify from "react-notify";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";

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
    if (type === "success") {
      notificationRef.current.success(
        title ? title : "",
        msg,
        millis ? millis : 2000
      );
    } else if (type === "info") {
      notificationRef.current.info(
        title ? title : "",
        msg,
        millis ? millis : 2000
      );
    } else {
      notificationRef.current.error(
        title ? title : "",
        msg,
        millis ? millis : 3000
      );
    }
  }

  const className = props.isLoading ? "wrapper loadingRemote" : "wrapper";
  return (
    <div className={className}>
      <ReactNotify ref={notificationRef} />
      {props.children}
    </div>
  );
};

Layout.propTypes = {
  isLoading: PropTypes.bool.isRequired,
};

export default Layout;
