import { Modal, ModalBody } from "design-react-kit";
import WarningBox from "./WarningBox";

interface Props {
  display: boolean;
  toggle: () => void;
}

export const WarningModal = ({ display, toggle }: Props): JSX.Element => {
  return (
    <Modal isOpen={display} toggle={toggle}>
      <ModalBody>
        <WarningBox />
      </ModalBody>
    </Modal>
  );
};
