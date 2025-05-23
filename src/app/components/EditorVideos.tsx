import {
  Button,
  Card,
  CardBody,
  CardText,
  CardTitle,
  Icon,
  Input,
  InputGroup,
  UncontrolledTooltip,
} from "design-react-kit";
import { get } from "lodash";
import { useEffect, useRef, useState } from "react";
import { FieldError, useController, useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import PublicCode from "../contents/publiccode";
import isValidUrlFn from "../is-valid-url";

import { VideoProviderResponse, getOEmbed } from "../oembed";

interface VideoOEmbedItemProps {
  url: string;
}

const WIDTH = 480;
const HEIGHT = 360;

const NO_THUMBNAIL = `https://placehold.co/${WIDTH}x${HEIGHT}?font=roboto&text=No%20Thumbnail`;

function VideoOEmbedItem({ url }: VideoOEmbedItemProps) {
  const [embed, setEmbed] = useState<string>();
  const [thumbnail, setThumbnail] = useState<string>(NO_THUMBNAIL);
  const [title, setTitle] = useState<string>();

  useEffect(() => {
    const controller = new AbortController();

    const loadOEmbed = async () => {
      try {
        const oEmbed = (await getOEmbed(
          { url, maxheight: HEIGHT, maxwidth: WIDTH },
          { signal: controller.signal }
        )) as VideoProviderResponse;
        setEmbed(oEmbed.html ?? null);
        setThumbnail(oEmbed.thumbnail_url ?? NO_THUMBNAIL);
        setTitle(oEmbed.title ?? undefined);
      } catch (error) {
        if ((error as Error).name !== "AbortError") {
          console.error("Failed to load oEmbed:", error);
        }
      }
    };

    loadOEmbed();

    return () => controller.abort();
  }, [url]);

  return (
    <Card className="card-img no-after">
      <CardBody>
        <CardTitle tag="h5">{title ?? url}</CardTitle>
        <CardText>
          URL: <a href={url}>{url}</a>
        </CardText>
        <div className="img-responsive-wrapper">
          <div className="img-responsive">
            <figure className="img-wrapper">
              {embed ? (
                <div dangerouslySetInnerHTML={{ __html: embed }}></div>
              ) : (
                <img src={thumbnail} title={title} alt={title} />
              )}
            </figure>
          </div>
        </div>
      </CardBody>
    </Card>
  );
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

  const errorMessages = control.getFieldState(`description.${lang}.videos`)
    .error as unknown as FieldError[];

  const add = () => {
    onChange([...videos, current.trim()]);
    setCurrent("");
    setValidUrl(undefined);
  };

  const remove = (item: string) => {
    onChange(videos.filter((elem) => elem !== item));
  };

  const onInputChange = (value: string) => {
    setCurrent(value);
    setValidUrl(isValidUrlFn(value, { mandatoryPath: true }));
  };

  const buttonRef = useRef<HTMLButtonElement>(null);

  return (
    <div>
      <div className="position-relative">
        <label
          className="description-label active"
          htmlFor={`description.${lang}.videos`}
        >{`${label}`}</label>
        <Button innerRef={buttonRef} className="info-icon-wrapper">
          <Icon icon="it-info-circle" className="info-icon mb-2" />
        </Button>
        <UncontrolledTooltip placement="bottom" target={buttonRef}>
          {description}
        </UncontrolledTooltip>
      </div>
      <div className="form-group">
        <ul className="list-group list-group-flush">
          {videos.map((video, index) => (
            <li
              className="list-group-item d-flex justify-content-between align-items-center"
              key={video}
            >
              <VideoOEmbedItem url={video}></VideoOEmbedItem>
              {get(errors, `description.${lang}.videos.${index}`) && (
                <p className="form-feedback just-validate-error-label"> *</p>
              )}
              <Button color="link" icon onClick={() => remove(video)} size="xs">
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
              onInputChange(target.value);
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
        {errorMessages && errorMessages.length && (
          <div className="form-feedback just-validate-error-label">
            {errorMessages &&
              errorMessages?.map((e, index) => (
                <small key={index}>{e?.message}</small>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}
