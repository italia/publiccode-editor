import { cloneDeep, isArray, isEmpty, isObjectLike, isUndefined } from "lodash";
import PublicCode from "./contents/publiccode";

export default function linter(pc: PublicCode): PublicCode {
  return removeEmpty(cloneDeep(pc));
}

function removeEmpty<T>(obj: T): T {
  if (typeof obj !== "object") return obj;

  const ret = obj;

  for (const key in ret) {
    const val = removeEmpty(ret[key]);
    if (
      ((isArray(val) || isObjectLike(val)) && isEmpty(val)) ||
      isUndefined(val)
    ) {
      delete ret[key];
    }
  }

  return ret;
}
