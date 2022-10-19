// SPDX-License-Identifier: AGPL-3.0
// Copyright (C) 2022 E. K. Herman, J. Ainali

const https = require("https");
const fs = require('fs');
const licenses = require('../licenses').default;

const SPDX_license_URL = 'https://spdx.org/licenses/licenses.json';

describe("Compare license.js list with spdx.org", () => {
  it("is true", async () => {
    licenses.sort(strCmp);
    let upstreamLicenses = await getUpstreamLicenses();
    expect(licenses).toStrictEqual(upstreamLicenses);
  });
});

function strCmp(a, b) {
  if (a.value < b.value) {
    return -1;
  }
  if (a.value > b.value) {
    return 1;
  }
  return 0;
}

async function getUpstreamLicenses() {
  let promise = new Promise((resolve, reject) => {
    let data = '';
    https.get(SPDX_license_URL, res => {
      res.on('data', chunk => {
        data += chunk
      })
      res.on('end', () => {
        resolve(JSON.parse(data));
      })
    })
  });
  let allUpstream = await promise;
  let upstreamLicenses = [];

  for (let i = 0; i < allUpstream.licenses.length; ++i) {
    let license = allUpstream.licenses[i];
    if (!license.isDeprecatedLicenseId) {
      upstreamLicenses.push({
        text: license.name,
        value: license.licenseId
      });
    }
  }
  upstreamLicenses.sort(strCmp);

  return upstreamLicenses;
};

function writeLicenses(path, upstreamLicenses) {
  if (!path) {
    path = "upstream-spdx.js";
  }
  let str = "const licenses = [\n";
  for (let i = 0; i < upstreamLicenses.length; ++i) {
    let license = upstreamLicenses[i];
    let add = "  {\n" +
      "    text: \"" + license.text.replaceAll('"', '\\"') + "\",\n" +
      "    value: \"" + license.value + "\",\n" +
      "  },\n";
    str += add;
  }
  str += "];\n\nexport default licenses;\n";
  fs.writeFileSync(path, str);
}
