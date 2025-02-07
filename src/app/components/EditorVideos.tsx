import { Button, Icon, Input, InputGroup } from "design-react-kit";
import { get } from "lodash";
import { useState } from "react";
import { FieldError, useController, useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import PublicCode from "../contents/publiccode";

interface Props {
    lang: string;
}

export default function EditorVideos({ lang }: Props): JSX.Element {
    const { control } = useFormContext<PublicCode>();
    const {
        field: { onChange, value },
        formState: { errors },
    } = useController<PublicCode>({
        control,
        name: `description.${lang}.videos`,
        shouldUnregister: true,
    });
    const { t } = useTranslation();

    const videos: string[] = value ? (value as string[]) : [];
    const [current, setCurrent] = useState<string>("");

    const label = t(`publiccodeyml.description.videos.label`);
    const description = t(`publiccodeyml.description.videos.description`);

    const errorMessages = control.getFieldState(`description.${lang}.videos`).error as unknown as FieldError[]

    const add = () => {
        onChange([...videos, current.trim()]);
        setCurrent("");
    };

    const remove = (feat: string) => {
        onChange(videos.filter((elem) => elem !== feat));
    };

    return (
        <div className="form-group">
            <label
                className="active"
                htmlFor={`description.${lang}.videos`}
            >{`${label}`}</label>
            <ul className="list-group list-group-flush">
                {videos.map((video, index) => (
                    <li
                        className="list-group-item d-flex justify-content-between align-items-center"
                        key={video}
                    >
                        {video}
                        {
                            get(errors, `description.${lang}.videos.${index}`)
                            && <p className="form-feedback just-validate-error-label" > *</p>
                        }
                        <Button
                            color="link"
                            icon
                            onClick={() => remove(video)}
                            size="xs"
                        >
                            <Icon icon="it-delete" size="sm" title="Remove video" />
                        </Button>
                    </li>
                ))}
            </ul>
            <InputGroup>
                <Input
                    value={current}
                    onChange={({ target }) => setCurrent(target.value)}
                />
                <div className="input-group-append">
                    <Button
                        color="primary"
                        disabled={current.trim() === ""}
                        onClick={add}
                    >
                        Add video
                    </Button>
                </div>
            </InputGroup>

            <small className="form-text">{description}</small>
            {errorMessages && errorMessages.length && (
                <div className="form-feedback just-validate-error-label">
                    {
                        errorMessages && errorMessages?.map((e, index) =>
                            <small key={index}>{e?.message}</small>
                        )
                    }
                </div>
            )}
        </div>
    );
}