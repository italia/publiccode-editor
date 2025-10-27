import { isArray, isEmpty, isObjectLike, isString, isUndefined } from "lodash";

const isEmptyArrayOrObjectWithNoProperty = <T>(
  val: (T & object)[Extract<keyof T, string>],
) => (isArray(val) || isObjectLike(val)) && isEmpty(val);

const isEmptyString = <T>(val: (T & object)[Extract<keyof T, string>]) =>
  isString(val) && isEmpty(val);

function removeEmpty<T>(obj: T): T {
  if (typeof obj !== "object") return obj;

  const ret = obj;

  for (const key in ret) {
    const val = removeEmpty(ret[key]);
    if (
      isEmptyArrayOrObjectWithNoProperty(val) ||
      isEmptyString(val) ||
      isUndefined(val)
    ) {
      delete ret[key];
    }
  }

  return ret;
}

export { removeEmpty };
