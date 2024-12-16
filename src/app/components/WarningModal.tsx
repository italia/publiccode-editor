import { Modal, ModalBody } from "design-react-kit";
import { useTranslation } from "react-i18next";

interface Props {
    display: boolean;
    toggle: () => void;
    warnings: { key: string, message: string }[]
}

export const WarningModal = ({ display, toggle, warnings = [] }: Props): JSX.Element => {
    const { t } = useTranslation();

    return (
        <Modal
            isOpen={display}
            toggle={toggle}>
            <ModalBody>
                <h2>{t("editor.warnings")}</h2>
                <div>
                    {warnings.length
                        ?
                        <ul>
                            {warnings.map(({ key, message }) => <li key={key}><b>{key}:</b> {message}</li>)}
                        </ul>
                        : <p>Non ci sono warning</p>}

                </div>
            </ModalBody>
        </Modal>)
}