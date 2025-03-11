import { Modal, ModalBody } from "design-react-kit";
import WarningBox from "./WarningBox";

interface Props {
  display: boolean;
  toggle: () => void;
  warnings: { key: string; message: string }[];
  setWarnings: (data: unknown) => void;
}

export const WarningModal = ({
  display,
  toggle,
  warnings = [],
  setWarnings,
}: Props): JSX.Element => {
  return (
    <Modal isOpen={display} toggle={toggle}>
      <ModalBody>
        <WarningBox warnings={warnings} setWarnings={setWarnings} />
      </ModalBody>
    </Modal>
  );
};
