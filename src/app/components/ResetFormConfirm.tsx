import { Button, Modal, ModalBody, ModalFooter } from "design-react-kit";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";

interface Props {
  display?: boolean;
  submit?: () => void;
  toggle?: () => void;
}

export const ResetFormConfirm = (props: Props): JSX.Element => {
  const { t } = useTranslation();

  return (
    <Modal
      isOpen={props.display}
      role="dialog"
      toggle={props.toggle}
      data-testid="resetform-modal"
    >
      <ModalBody>
        <p className="h5">{t("editor.form.overwritetext")}</p>
      </ModalBody>
      <ModalFooter tag="div">
        <Button
          color="secondary"
          icon={false}
          tag="button"
          onClick={props.toggle}
        >
          {t("editor.cancel")}
        </Button>
        <Button
          color="primary"
          icon={false}
          tag="button"
          onClick={props.submit}
        >
          {t("editor.form.overwrite")}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

ResetFormConfirm.propTypes = {
  display: PropTypes.bool.isRequired,
  submit: PropTypes.func.isRequired,
  toggle: PropTypes.func.isRequired,
};
