import { Modal, ModalBody } from "design-react-kit";
import { createUseStyles } from "react-jss";
import YamlPreview from "./YamlPreview";

const useStyles = createUseStyles({
  modalFullScreen: {
    minWidth: "100% !important",
    minHeight: "100% !important",
    margin: "0 !important",
  },
  modalContent: {
    backgroundColor: "#ffffffc9",
    height: "100vh",
  },
});

interface Props {
  display: boolean;
  toggle: () => void;
  yaml?: string;
}

export const YamlModal = ({ display, toggle, yaml }: Props): JSX.Element => {
  const classes = useStyles();

  return (
    <Modal
      className={classes.modalFullScreen}
      isOpen={display}
      role='dialog'
      toggle={toggle}
      data-testid='yaml-modal'
    >
      <ModalBody className={classes.modalContent}>
        <YamlPreview yaml={yaml} />
      </ModalBody>
    </Modal>
  );
};
