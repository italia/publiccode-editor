import React, { Component } from "react";
import img_close from "../../asset/img/close.svg";

class CloseButton extends Component {
  render() {
    return (
      <div
        className="close__button"
        onClick={this.props.onClick}
      >
        <img src={img_close} />
      </div>
    );
  }
}

export default CloseButton;
