import { forwardRef } from "react";
import { Input, InputProps } from "design-react-kit";

const Component = forwardRef<HTMLInputElement, Omit<InputProps, "ref">>(
  (props, ref) => <Input {...props} innerRef={ref} />
);
Component.displayName = "Input";

export default Component;
