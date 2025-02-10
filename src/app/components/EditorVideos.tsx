import { Button, Card, CardBody, CardText, CardTitle, Icon, Input, InputGroup } from "design-react-kit";
import { get } from "lodash";
import { useEffect, useState } from "react";
import { FieldError, useController, useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import PublicCode from "../contents/publiccode";
import isValidUrlFn from "../is-valid-url";

import { getOEmbed, VideoProviderResponse } from "../oembed/oembed-service";

interface VideoOEmbedItemProps {
    url: string
}

const WIDTH = 480
const HEIGHT = 360

const noThumbnail = `https://placehold.co/${WIDTH}x${HEIGHT}?font=roboto&text=No%20Thumbnail`

function VideoOEmbedItem({ url }: VideoOEmbedItemProps) {

    const [embed, setEmbed] = useState<string>();
    const [thumbnail, setThumbnail] = useState<string>(noThumbnail);
    const [title, setTitle] = useState<string>();

    useEffect(() => {
        let isMounted = false

        const loadOEmbed = (async () => {
            if (isMounted) {
                return;
            }

            isMounted = true
            try {
                const oEmbed = await getOEmbed({ url, maxheight: HEIGHT, maxwidth: WIDTH }) as VideoProviderResponse;
                console.log(oEmbed)

                if (oEmbed.html) {
                    setEmbed(oEmbed.html)
                } else if (oEmbed.thumbnail_url)
                    setThumbnail(oEmbed.thumbnail_url)

                if (oEmbed.title)
                    setTitle(oEmbed.title)

            } catch (error) {
                console.error("Failed to load oEmbed:", error);
            }
        })

        loadOEmbed();

        return () => {
            isMounted = false
        }
    }, [url])

    return (
        <Card className='card-img no-after'>
            <CardBody>
                <CardTitle tag='h5'>
                    {title ?? url}
                </CardTitle>
                <CardText>
                    URL: <a href={url}>{url}</a>
                </CardText>
                <div className='img-responsive-wrapper'>
                    <div className='img-responsive'>
                        <figure className='img-wrapper'>
                            {embed
                                ? <div dangerouslySetInnerHTML={{ __html: embed }}></div>
                                : <img
                                    src={thumbnail}
                                    title={title}
                                    alt={title}
                                />}
                        </figure>
                    </div>
                </div>
            </CardBody>
        </Card>
    )
}


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
    const [isValidUrl, setValidUrl] = useState<boolean | undefined>(undefined);

    const label = t(`publiccodeyml.description.videos.label`);
    const description = t(`publiccodeyml.description.videos.description`);

    const errorMessages = control.getFieldState(`description.${lang}.videos`).error as unknown as FieldError[]

    const add = () => {
        onChange([...videos, current.trim()]);
        setCurrent("");
        setValidUrl(undefined)
    };

    const remove = (item: string) => {
        onChange(videos.filter((elem) => elem !== item));
    };

    const onInputChange = (value: string) => {
        setCurrent(value)
        setValidUrl(isValidUrlFn(value, { mandatoryPath: true }))
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
                        <VideoOEmbedItem url={video}></VideoOEmbedItem>
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
                    type="url"
                    value={current}
                    onChange={({ target }) => {
                        onInputChange(target.value)
                    }}
                    valid={isValidUrl}
                />
                <div className="input-group-append">
                    <Button
                        color="primary"
                        disabled={current.trim() === "" || !isValidUrl}
                        onClick={add}
                    >
                        Add video
                    </Button>
                </div>
            </InputGroup>

            <small className="form-text">{description}</small>
            {
                errorMessages && errorMessages.length && (
                    <div className="form-feedback just-validate-error-label">
                        {
                            errorMessages && errorMessages?.map((e, index) =>
                                <small key={index}>{e?.message}</small>
                            )
                        }
                    </div>
                )
            }
        </div >
    );
}
