/** @jest-environment jsdom */

import { act } from "react";
import { createRoot, Root } from "react-dom/client";
import { FormProvider, useForm } from "react-hook-form";

import PublicCode, {
  publicCodeDummyObjectFactory,
} from "../contents/publiccode";
import EditorDependencies from "./EditorDependencies";

Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });

jest.mock(
  "design-react-kit",
  () => {
    const React = jest.requireActual<typeof import("react")>("react");
    type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
      color?: string;
      icon?: boolean;
      innerRef?: React.Ref<HTMLButtonElement>;
      size?: string;
    };
    type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
      innerRef?: React.Ref<HTMLInputElement>;
      label?: boolean;
      valid?: boolean;
      validationText?: string;
    };
    return {
      Button: (props: ButtonProps) =>
        React.createElement(
          "button",
          {
            "aria-label": props["aria-label"],
            className: props.className,
            disabled: props.disabled,
            onClick: props.onClick,
            ref: props.innerRef,
            type: props.type,
          },
          props.children,
        ),
      Icon: () => React.createElement("span", { "aria-hidden": true }),
      Input: (props: InputProps) =>
        React.createElement("input", {
          "aria-describedby": props["aria-describedby"],
          "aria-label": props["aria-label"],
          id: props.id,
          name: props.name,
          onBlur: props.onBlur,
          onChange: props.onChange,
          ref: props.innerRef,
          type: props.type,
        }),
    };
  },
  { virtual: true },
);

jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string, values?: Record<string, string | number>) => {
      const translations: Record<string, string> = {
        "editor.form.addnew": "Add new",
        "editor.form.false": "No",
        "editor.form.removeDependency": "Remove {{type}} dependency {{number}}",
        "editor.form.true": "Yes",
        "editor.form.unset": "(unset)",
        "publiccodeyml.dependsOn.description": "System dependencies",
        "publiccodeyml.dependsOn.hardware.label": "Hardware dependencies",
        "publiccodeyml.dependsOn.label": "Depends On",
        "publiccodeyml.dependsOn.name.description": "Dependency name",
        "publiccodeyml.dependsOn.name.label": "Name",
        "publiccodeyml.dependsOn.open.label": "Open source dependencies",
        "publiccodeyml.dependsOn.optional.description": "Optional or mandatory",
        "publiccodeyml.dependsOn.optional.label": "Optional",
        "publiccodeyml.dependsOn.proprietary.label": "Proprietary dependencies",
        "publiccodeyml.dependsOn.version.description": "Exact version",
        "publiccodeyml.dependsOn.version.label": "Exact Version",
        "publiccodeyml.dependsOn.versionMax.description": "Latest version",
        "publiccodeyml.dependsOn.versionMax.label": "Version Range Max",
        "publiccodeyml.dependsOn.versionMin.description": "First version",
        "publiccodeyml.dependsOn.versionMin.label": "Version Range Min",
      };
      const translation = translations[key] ?? key;
      return Object.entries(values ?? {}).reduce(
        (result, [name, value]) => result.replace(`{{${name}}}`, String(value)),
        translation,
      );
    },
  }),
}));

function TestForm({
  defaultValues = publicCodeDummyObjectFactory(),
  onSubmit = jest.fn(),
}: {
  defaultValues?: PublicCode;
  onSubmit?: (values: PublicCode) => void;
}) {
  const methods = useForm<PublicCode>({ defaultValues });

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <EditorDependencies />
        <button type="submit">Save</button>
      </form>
    </FormProvider>
  );
}

function getByAriaLabel<T extends HTMLElement>(
  container: HTMLElement,
  label: string,
): T {
  const element = container.querySelector<T>(`[aria-label="${label}"]`);
  if (!element) throw new Error(`No element found with aria-label "${label}"`);
  return element;
}

function getFieldset(
  container: HTMLElement,
  label: string,
): HTMLFieldSetElement {
  const fieldset = Array.from(container.querySelectorAll("fieldset")).find(
    (candidate) => candidate.querySelector("legend")?.textContent === label,
  );
  if (!fieldset) throw new Error(`No fieldset found with legend "${label}"`);
  return fieldset;
}

function changeValue(
  element: HTMLInputElement | HTMLSelectElement,
  value: string,
) {
  const valueSetter = Object.getOwnPropertyDescriptor(
    Object.getPrototypeOf(element),
    "value",
  )?.set;
  valueSetter?.call(element, value);
  element.dispatchEvent(new Event("change", { bubbles: true }));
  element.dispatchEvent(new Event("input", { bubbles: true }));
}

describe("EditorDependencies", () => {
  let container: HTMLDivElement;
  let root: Root;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
    root = createRoot(container);
    Object.defineProperty(window, "requestAnimationFrame", {
      configurable: true,
      value: (callback: FrameRequestCallback) => {
        callback(0);
        return 0;
      },
    });
  });

  afterEach(() => {
    act(() => root.unmount());
    container.remove();
  });

  it("shows imported dependencies in their respective sections", () => {
    const defaultValues = publicCodeDummyObjectFactory();
    defaultValues.dependsOn = {
      open: [{ name: "PostgreSQL", versionMin: "14", optional: false }],
      proprietary: [{ name: "Oracle", version: "19" }],
      hardware: [{ name: "NFC Reader", optional: true }],
    };

    act(() => root.render(<TestForm defaultValues={defaultValues} />));

    expect(
      getByAriaLabel<HTMLInputElement>(
        container,
        "Name, Open source dependencies, 1",
      ).value,
    ).toBe("PostgreSQL");
    expect(
      getByAriaLabel<HTMLInputElement>(
        container,
        "Exact Version, Proprietary dependencies, 1",
      ).value,
    ).toBe("19");
    expect(
      getByAriaLabel<HTMLSelectElement>(
        container,
        "Optional, Hardware dependencies, 1",
      ).value,
    ).toBe("true");
  });

  it("adds, edits and submits a dependency", async () => {
    const onSubmit = jest.fn();
    act(() => root.render(<TestForm onSubmit={onSubmit} />));

    const openDependencies = getFieldset(container, "Open source dependencies");
    act(() =>
      getByAriaLabel<HTMLButtonElement>(
        openDependencies,
        "Add new: Open source dependencies",
      ).click(),
    );

    const name = getByAriaLabel<HTMLInputElement>(
      openDependencies,
      "Name, Open source dependencies, 1",
    );
    expect(document.activeElement).toBe(name);

    act(() => {
      changeValue(name, "PostgreSQL");
      changeValue(
        getByAriaLabel<HTMLInputElement>(
          openDependencies,
          "Version Range Min, Open source dependencies, 1",
        ),
        "14",
      );
      changeValue(
        getByAriaLabel<HTMLSelectElement>(
          openDependencies,
          "Optional, Open source dependencies, 1",
        ),
        "false",
      );
    });
    await act(async () => {
      container
        .querySelector<HTMLButtonElement>('button[type="submit"]')
        ?.click();
    });

    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        dependsOn: expect.objectContaining({
          open: [
            expect.objectContaining({
              name: "PostgreSQL",
              optional: false,
              versionMin: "14",
            }),
          ],
        }),
      }),
      expect.anything(),
    );
  });

  it("returns focus to the add button after removing the last dependency", () => {
    const defaultValues = publicCodeDummyObjectFactory();
    defaultValues.dependsOn = { hardware: [{ name: "NFC Reader" }] };
    act(() => root.render(<TestForm defaultValues={defaultValues} />));

    const hardwareDependencies = getFieldset(
      container,
      "Hardware dependencies",
    );
    act(() =>
      getByAriaLabel<HTMLButtonElement>(
        hardwareDependencies,
        "Remove Hardware dependencies dependency 1",
      ).click(),
    );

    expect(
      hardwareDependencies.querySelector(
        '[aria-label="Name, Hardware dependencies, 1"]',
      ),
    ).toBeNull();
    expect(document.activeElement).toBe(
      getByAriaLabel<HTMLButtonElement>(
        hardwareDependencies,
        "Add new: Hardware dependencies",
      ),
    );
  });
});
