import { writeFile } from "fs/promises";

const SPDX_license_URL = "https://spdx.org/licenses/licenses.json";

interface License {
  text: string;
  value: string;
}

function cmpLicenses(a: License, b: License) {
  if (a.value < b.value) {
    return -1;
  }
  if (a.value > b.value) {
    return 1;
  }
  return 0;
}

async function getUpstreamLicenses() {
  const res = await fetch(SPDX_license_URL);

  if (!res.ok) {
    throw new Error("Network response was not OK");
  }

  const allLicenses = await res.json();
  const licenses: Array<License> = [];

  for (const license of allLicenses.licenses) {
    if (!license.isDeprecatedLicenseId) {
      licenses.push({
        text: license.name as string,
        value: license.licenseId,
      });
    }
  }

  return licenses.sort(cmpLicenses);
}

(async () => {
  try {
    const licenses = await getUpstreamLicenses();
    await writeFile(process.argv[2], JSON.stringify(licenses));
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
})();
