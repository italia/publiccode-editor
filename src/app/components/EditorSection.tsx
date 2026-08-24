import { Button, Icon, UncontrolledTooltip } from "design-react-kit";
import { ReactNode, useId, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

type Props = {
  title: string;
  description?: string;
  children: ReactNode;
};

/**
 * A collapsible form section card: title with the blue accent, an optional
 * info tooltip and a small accordion toggle. Sections start expanded; the
 * body is hidden with `d-none` (never unmounted) so react-hook-form keeps
 * every field registered and its value intact while collapsed.
 */
export default function EditorSection({
  title,
  description,
  children,
}: Props): JSX.Element {
  const { t } = useTranslation();
  const [open, setOpen] = useState(true);
  const bodyId = useId();
  const infoRef = useRef<HTMLButtonElement>(null);

  return (
    <fieldset className="editor-section">
      <div
        className={`d-flex align-items-center justify-content-between editor-section-header ${
          open ? "" : "mb-0"
        }`}
      >
        <div>
          <legend className="editor-section-title mb-0">{title}</legend>
        </div>
        <div className="d-flex align-items-center">
          {description && (
            <>
              <Button
                aria-label={`${t("editor.form.moreInfo")}: ${title}`}
                className="p-0 ms-2"
                color="link"
                icon
                innerRef={infoRef}
                size="xs"
                type="button"
              >
                <Icon className="info-icon" icon="it-info-circle" />
              </Button>
              <UncontrolledTooltip placement="bottom" target={infoRef}>
                {description}
              </UncontrolledTooltip>
            </>
          )}
          <Button
            aria-controls={bodyId}
            aria-expanded={open}
            aria-label={`${
              open ? t("editor.form.collapse") : t("editor.form.expand")
            }: ${title}`}
            className="p-0 ms-3 editor-section-toggle"
            color="link"
            icon
            onClick={() => setOpen(!open)}
            size="xs"
            type="button"
          >
            <Icon icon={open ? "it-collapse" : "it-expand"} size="xs" />
          </Button>
        </div>
      </div>
      <div className={open ? undefined : "d-none"} id={bodyId}>
        {children}
      </div>
    </fieldset>
  );
}
