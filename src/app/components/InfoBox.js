import React, { Component } from "react";
import { connect } from "react-redux";
import { show, hide } from "../store/infobox";
import classNames from "classnames";
import CloseButton from "./CloseButton";

const mapStateToProps = state => {
  return {
    infobox: state.infobox
  };
};

const mapDispatchToProps = dispatch => {
  return {
    show: data => dispatch(show(data)),
    hide: () => dispatch(hide())
  };
};

@connect(
  mapStateToProps,
  mapDispatchToProps
)
class InfoBox extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    const { title, description, visible } = this.props.infobox;
    const className = classNames([
      "info__box",
      { info__box__visible: visible }
    ]);

    return (
      <div className={className}>
        <div className="info__box__body">
          <div className="info__box__close">
            <CloseButton
              href="#"
              className="link"
              onClick={() => this.props.hide(description)}
            />
          </div>

          <div className="info__box__content">
            <p className="info__box__title">{title}</p>
            <p>{description}</p>
          </div>
        </div>
      </div>
    );
  }
}

export default InfoBox;
