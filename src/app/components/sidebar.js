import React, { Component } from "react";
import { connect } from "react-redux";
import copy from "copy-to-clipboard";
import validator from "validator";
import { notify } from "../store/notifications";
import { APP_FORM, sampleUrl } from "../contents/constants";
import img_x from "../../asset/img/x.svg";
import img_copy from "../../asset/img/copy.svg";
import img_upload from "../../asset/img/load.svg";
import img_download from "../../asset/img/download.svg";
import img_dots from "../../asset/img/dots.svg";
import img_xx from "../../asset/img/xx.svg";

import { getRemoteYml, passRemoteURLToValidator } from "../utils/calls";
import { getLabel } from "../contents/data";

function mapStateToProps(state) {
  return { form: state.form };
}

const mapDispatchToProps = dispatch => {
  return {
    notify: data => dispatch(notify(data))
  };
};

@connect(
  mapStateToProps,
  mapDispatchToProps
)
class sidebar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dialog: false,
      remoteYml: sampleUrl
    };
  }

  showDialog(dialog) {
    this.setState({ dialog });
  }

  handleChange(e) {
    this.setState({ remoteYml: e.target.value });
  }

  async loadRemoteYaml(e) {
    e.preventDefault();
    const { onLoad, onReset } = this.props;
    let { remoteYml } = this.state;
    this.showDialog(false);

    if (!remoteYml || !validator.isURL(remoteYml)) {
      this.props.notify({ type: 1, msg: "Not a valid url" });
    }

    let ext = remoteYml.split(/[. ]+/).pop();
    if (ext != "yml" && ext != "yaml") {
      this.props.notify({ type: 1, msg: "File type not supported" });
      return;
    }

    onReset();

    let yaml = null;
    try {
      this.setState({ loading: true });
      this.props.onLoadingRemote(true);

      // trying to get file and process it, cors problem
      // yaml = await getRemoteYml(remoteYml);

      // piping url to validator which will returns a fresh
      // and validated copy
      yaml = await passRemoteURLToValidator(remoteYml);

      onLoad(yaml);

      this.setState({ loading: false });
      this.props.onLoadingRemote(false);
    } catch (error) {

      this.setState({ loading: false });
      this.props.onLoadingRemote(false);
      console.error(error);
      alert("error parsing remote yaml");
    }
  }

  load(files) {
    const { onLoad, onReset } = this.props;
    //has dom
    if (!files || !files[0]) {
      this.props.notify({ type: 1, msg: "File not found" });
      return;
    }
    // let ext = files[0].name.split(".")[1];
    let ext = files[0].name.split(/[. ]+/).pop();
    if (ext != "yml" && ext != "yaml") {
      this.props.notify({ type: 1, msg: "File type not supported" });
      return;
    }

    const reader = new FileReader();
    const that = this;

    onReset();

    reader.onload = function () {
      let yaml = reader.result;
      onLoad(yaml);
      document.getElementById("load_yaml").value = "";
      that.showDialog(false);
    };
    reader.readAsText(files[0]);
  }

  download(data) {
    //has dom
    if (!data || data.length == 0) {
      return;
    }
    const blob = new Blob([data], {
      type: "text/yaml;charset=utf-8;"
    });
    let blobURL = window.URL.createObjectURL(blob);
    let tempLink = document.createElement("a");
    tempLink.style = "display:none";
    tempLink.download = "publiccode.yml";
    tempLink.href = blobURL;
    tempLink.setAttribute("download", "publiccode.yml");
    document.body.appendChild(tempLink);
    tempLink.click();
    setTimeout(function () {
      document.body.removeChild(tempLink);
      window.URL.revokeObjectURL(blobURL);
    }, 1000);
  }

  render() {
    let { dialog } = this.state;
    let { yaml, loading, allFields, form } = this.props;
    let errors = null;
    let fail = false;

    if (form && form[APP_FORM]) {
      //was syncErrors
      errors =
        form[APP_FORM] && form[APP_FORM].submitErrors
          ? form[APP_FORM].submitErrors
          : null;
      fail = form[APP_FORM].submitFailed ? form[APP_FORM].submitFailed : false;
    }

    return (
      <div className="sidebar">
        <div className="sidebar__title">
          {fail == true ? "Errors" : "File YAML"}
          {loading && <img src={img_dots} className="loading" />}
        </div>

        <div className="sidebar__body">
          {!fail &&
            !yaml && <div className="sidebar__info">No code generated.</div>}
          {fail &&
            errors && (
              <div className="sidebar__error">
                {Object.keys(errors).map((e, i) => (
                  <div key={i}>
                    <img src={img_x} />
                    {getLabel(allFields, e)}
                  </div>
                ))}
              </div>
            )}
          {!(fail && errors) && (
            <div className="sidebar__code">
              <pre>
                <code>
                  {"\n"}
                  {yaml}
                </code>
              </pre>
            </div>
          )}
        </div>

        {dialog && (
          <div className="sidebar__prefooter">
            <div
              className="sidebar__prefooter__close"
              onClick={() => this.showDialog(false)}
            >
              <img src={img_xx} alt="close" />
            </div>
            <input
              id="load_yaml"
              type="file"
              accept=".yml, .yaml"
              style={{ display: "none" }}
              onChange={e => this.load(e.target.files)}
            />
            <div className="sidebar__prefooter__content">
              <div>
                <div>Browse file from disk</div>
                <div className="sidebar__prefooter__content__form">
                  <button
                    type="button"
                    className="btn btn-primary btn-block"
                    onClick={() => document.getElementById("load_yaml").click()}
                  >
                    <img src={img_upload} alt="upload" />Browse
                  </button>
                </div>
              </div>
              <div>
                <div>Paste remote yaml url</div>
                <div>
                  <form
                    onSubmit={e => this.loadRemoteYaml(e)}
                    className="sidebar__prefooter__content__form"
                  >
                    <input
                      className="form-control"
                      type="url"
                      value={this.state.remoteYml}
                      required={true}
                      onChange={e => this.handleChange(e)}
                    />
                    <button type="submit" className="btn btn-primary btn-block">
                      <img src={img_upload} alt="upload" />Load
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="sidebar__footer">
          <div className="sidebar__footer_item">
            <a href="#">
              <img src={img_copy} alt="copy" />
              <span
                className="action"
                onClick={() => {
                  copy(yaml);
                  this.props.notify({
                    type: "info",
                    title: "",
                    msg: "Copied to clipboard"
                  });
                }}
              >
                Copy
              </span>
            </a>
          </div>
          <div className="sidebar__footer_item">
            <a href="#">
              <img src={img_upload} alt="upload" />
              <span className="action" onClick={() => this.showDialog(true)}>
                Upload
              </span>
            </a>
          </div>
          <div className="sidebar__footer_item">
            <a href="#" className={!yaml ? 'disabled' : 'enabled'}>
              <img src={img_download} alt="dowload" />
              <span className="action" onClick={!yaml ? null : () => this.download(yaml)}>
                Download
              </span>
            </a>
          </div>
        </div>
      </div>
    );
  }
}

export default sidebar;
