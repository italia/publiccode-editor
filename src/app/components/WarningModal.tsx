import { Icon, Modal, ModalBody } from "design-react-kit";
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
                <h3><Icon icon="it-warning-circle" color="warning" title={t("editor.warnings")} />&nbsp;{t("editor.warnings")}</h3>
                <div className="it-list-wrapper">
                    {warnings.length
                        ?
                        <ul className="it-list">
                            <li>
                                {warnings.map(({ key, message }) =>
                                    <li key={key}>
                                        <div className="list-item">
                                            <div className="it-right-zone">
                                                <div>
                                                    <h4 className="text m-0">{key}</h4>
                                                    <p className="small m-0">{message}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                )}
                            </li>
                        </ul>
                        : <p>Non ci sono warning</p>}

                </div>
            </ModalBody>
        </Modal>)
}