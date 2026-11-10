import { latestVersion } from "./latestVersion";

export const getPubliccodeYmlVersionList = (
  currentPublicodeYmlVersion: string,
) => {
  if (currentPublicodeYmlVersion) {
    return [
      { text: `Latest (${latestVersion()})`, value: latestVersion() },
      {
        text: `Current (${currentPublicodeYmlVersion})`,
        value: currentPublicodeYmlVersion,
      },
    ];
  }

  return [{ text: `Latest (${latestVersion()})`, value: latestVersion() }];
};
