import {
  Button,
  Card,
  CardBody,
  CardTitle,
  Icon,
  Input,
  InputGroup,
  LinkList,
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
const HEIGHT = 270;

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
          { signal: controller.signal },
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
    <Card className="card-img no-after h-100">
      <CardBody className="p-3 d-flex flex-column">
        <CardTitle tag="h6" className="mb-2 text-truncate" title={title ?? url}>
          {title ?? url}
        </CardTitle>
        <div className="img-responsive-wrapper flex-grow-1">
          <div className="img-responsive">
            <figure className="img-wrapper">
              {embed ? (
                <div
                  dangerouslySetInnerHTML={{ __html: embed }}
                  style={{ width: "100%", height: "100%" }}
                ></div>
              ) : (
                <img
                  src={thumbnail}
                  title={title}
                  alt={title}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
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
        <Button
          type="button"
          innerRef={buttonRef}
          className="info-icon-wrapper"
        >
          <Icon icon="it-info-circle" className="info-icon mb-2" />
        </Button>
        <UncontrolledTooltip placement="bottom" target={buttonRef}>
          {description}
        </UncontrolledTooltip>
      </div>
      <div className="form-group">
        {videos.length > 0 && (
          <div className="mb-3">
            <LinkList>
              {videos.map((video, index) => (
                <div
                  key={`${video}-${index}`}
                  className="d-flex justify-content-between align-items-center border-bottom ps-2"
                >
                  <div className="d-flex align-items-center py-2">
                    <a
                      href={video}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="me-2 text-decoration-none"
                    >
                      {video}
                    </a>
                    {get(errors, `description.${lang}.videos.${index}`) && (
                      <span className="form-feedback just-validate-error-label">
                        {" "}
                        *
                      </span>
                    )}
                  </div>
                  <Button
                    color="link"
                    icon
                    onClick={() => remove(video)}
                    size="lg"
                    className="p-0"
                    aria-label={`Remove ${video}`}
                  >
                    <Icon icon="it-close" size="sm" />
                  </Button>
                </div>
              ))}
            </LinkList>
          </div>
        )}
        {videos.length > 0 && (
          <div className="mt-3">
            <h6 className="mb-2">Video Preview:</h6>
            <div className="row g-3">
              {videos.map((video) => (
                <div key={`preview-${video}`} className="col-12 col-lg-6">
                  <VideoOEmbedItem url={video}></VideoOEmbedItem>
                </div>
              ))}
            </div>
          </div>
        )}
        <InputGroup>
          <Input
            type="text"
            value={current}
            onChange={({ target }) => {
              onInputChange(target.value);
            }}
            valid={isValidUrl}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                if (current.trim() !== "" && isValidUrl) {
                  add();
                }
              }
            }}
          />
          <div className="input-group-append">
            <Button
              color="primary"
              disabled={current.trim() === "" || !isValidUrl}
              onClick={add}
            >
              {t("editor.form.add")}
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
