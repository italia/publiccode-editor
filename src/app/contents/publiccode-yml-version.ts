import { LATEST_VERSION } from "./publiccode";

export const getPubliccodeYmlVersionList = (
  currentPublicodeYmlVersion: string,
) => {
  if (currentPublicodeYmlVersion) {
    return [
      { text: `Latest (${LATEST_VERSION})`, value: LATEST_VERSION },
      {
        text: `Current (${currentPublicodeYmlVersion})`,
        value: currentPublicodeYmlVersion,
      },
    ];
  }

  return [{ text: `Latest (${LATEST_VERSION})`, value: LATEST_VERSION }];
};
