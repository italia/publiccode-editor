import type { ComponentType, MouseEvent } from "react";
import type { MultiselectTagListProps } from "react-widgets/cjs/MultiselectTagList";

/**
 * Builds a custom `tagListComponent` for react-widgets `<Multiselect>`.
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
 * We drop the `listbox`/`option` roles entirely and render plain elements with
 * a labelled remove button. Removal does NOT go through react-widgets'
 * `onDelete` (its `handleDelete` bails out unless the tag is registered in the
 * widget's internal focus list, which we can't reliably do from app code);
 * instead it calls the `onRemove` callback supplied here, which updates the
 * controlled value directly. The container keeps `id` so the input's
 * `aria-owns` reference still resolves.
 */
export function createAccessibleMultiselectTagList<TDataItem>(
  onRemove: (item: TDataItem) => void,
): ComponentType<MultiselectTagListProps<unknown>> {
  function AccessibleMultiselectTagList({
    id,
    value,
    textAccessor,
    disabled,
    readOnly,
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

          const remove = (event: MouseEvent<HTMLButtonElement>) => {
            // Run before the widget's own click/focus handling and don't let
            // the click bubble up to open the dropdown.
            event.preventDefault();
            event.stopPropagation();
            if (!itemDisabled && !readOnly) onRemove(item);
          };

          return (
            <div key={i} className="rw-multiselect-tag">
              <span className="rw-multiselect-tag-label">
                {renderTagValue ? renderTagValue({ item }) : textAccessor(item)}
              </span>
              <button
                type="button"
                className="rw-multiselect-tag-btn"
                aria-label={`Remove ${textAccessor(item)}`}
                disabled={itemDisabled || readOnly}
                onMouseDown={remove}
                onClick={(event) => {
                  if (event.detail === 0) remove(event); // keyboard (Enter/Space)
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

  // react-widgets types `tagListComponent` as `ComponentType<…<unknown>>`
  // (and the attached propTypes make it invariant), so a component typed for a
  // concrete item type isn't directly assignable. The cast is safe: react-widgets
  // only ever hands us items of the type the surrounding <Multiselect> uses.
  return AccessibleMultiselectTagList as unknown as ComponentType<
    MultiselectTagListProps<unknown>
  >;
}
