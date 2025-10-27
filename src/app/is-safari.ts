/* eslint-disable no-useless-escape */
export default () =>
  typeof navigator !== "undefined" &&
  /Version\/[\d\.]+.*Safari/.test(navigator.userAgent);
