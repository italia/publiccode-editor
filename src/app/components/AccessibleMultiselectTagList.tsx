import type { MultiselectTagListProps } from "react-widgets/cjs/MultiselectTagList";

/**
 * Custom `tagListComponent` for react-widgets `<Multiselect>`.
 *
 * The library's default tag list wraps the combobox `<input>` inside a
 * `role="listbox"` and renders each selected tag as a `role="option"` that
 * contains a remove `<button>`. That markup produces two axe failures:
 *
 *   - `aria-required-children`: a `listbox` may only contain `option`/`group`
 *     children, not the nested `combobox` input.
 *   - `nested-interactive`: an interactive control (the remove `<button>`) is
 *     nested inside another interactive element (the `option`).
 *
 * Here we render the tags as plain elements (no `listbox`/`option` roles) with
 * a real, focusable, labelled remove button. The container keeps `id` so the
 * input's `aria-owns` reference still resolves. react-widgets keeps handling
 * keyboard removal (Backspace/Delete) at the input level.
 */
export default function AccessibleMultiselectTagList<TDataItem>({
  id,
  value,
  textAccessor,
  disabled,
  readOnly,
  onDelete,
  children,
  clearTagIcon,
  renderTagValue,
}: MultiselectTagListProps<TDataItem>): JSX.Element {
  return (
    <div id={id} className="rw-multiselect-taglist">
      {value.map((item, i) => {
        const itemDisabled = Array.isArray(disabled)
          ? disabled.includes(item)
          : Boolean(disabled);
        const text = textAccessor(item);
        return (
          <div key={i} className="rw-multiselect-tag">
            <span className="rw-multiselect-tag-label">
              {renderTagValue ? renderTagValue({ item }) : text}
            </span>
            <button
              type="button"
              className="rw-multiselect-tag-btn"
              aria-label={`Remove ${text}`}
              disabled={itemDisabled || readOnly}
              onClick={(event) => {
                if (!itemDisabled && !readOnly) onDelete(item, event);
              }}
            >
              {clearTagIcon}
            </button>
          </div>
        );
      })}
      {children}
    </div>
  );
}
