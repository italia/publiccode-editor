// Values to test the Ajv custom formats against the Go parser with
// (scripts/parity.ts). Mostly edge cases, plus exhaustive sweeps where the
// space is small (2-3 letter language codes, 2 letter country codes).
import ipaCodes from "publiccode-schema/data/vocab/ipa-codes.json";
import spdx from "publiccode-schema/data/vocab/spdx.json";

export interface FormatCase {
  format: string;
  value: string;
}

const letters = "abcdefghijklmnopqrstuvwxyz".split("");
const pairs = letters.flatMap((a) => letters.map((b) => a + b));
const triples = pairs.flatMap((p) => letters.map((c) => p + c));

const cross = (...lists: string[][]) =>
  lists.reduce((acc, list) => acc.flatMap((a) => list.map((b) => a + b)), [""]);

const URLS = [
  "https://github.com/italia/publiccode-editor",
  "https://github.com/italia/publiccode-editor/",
  "http://example.org",
  "HTTPS://EXAMPLE.ORG/Path",
  "https://example.org:8080/a?b=c#d",
  "https://example.org:port",
  "https://user:pass@example.org",
  "https://exa mple.org",
  "https://example.org/a b",
  "https://example.org/%zz",
  "https://example.org/%20",
  "https://[::1]:80/",
  "https://[::1",
  "https://",
  "http:/example.org",
  "http:example.org",
  "//example.org",
  "example.org",
  "ftp://example.org/file",
  "git@github.com:italia/foo.git",
  "ssh://git@github.com/italia/foo.git",
  "mailto:someone@example.org",
  "urn:isbn:0451450523",
  "file:///etc/passwd",
  "file:///",
  "file:",
  "foo:",
  "foo:#",
  "foo:#bar",
  "#fragment",
  "/relative/path",
  "relative/path",
  "1http://example.org",
  "ht~tp://example.org",
  "https://exämple.org",
  "https://example.org/ü",
  "https://example.org\t",
  "https://example.org/\u0000",
  "",
  " ",
  "https://exa_mple.org",
  "https://example.org?",
  "https://example.org??",
  "https://ex{ample.org",
  "https://example.org/{}",
  "javascript:alert(1)",
  "https://www.youtube.com/watch?v=RaHmGbBOP84",
];

const EMAILS = [
  "dario.bianchi@fornitore.it",
  "a@b",
  "a@b.c",
  "a.b@c.d",
  "a..b@c.d",
  ".a@b.c",
  "a@b..c",
  "a b@c.d",
  "\"a b\"@c.d",
  "a+b@c.d",
  "a@[127.0.0.1]",
  "a@localhost",
  "àèì@example.org",
  "a@exämple.org",
  "Name <a@b.it>",
  "a@b.it ",
  "@b.it",
  "a@",
  "a\\x64b.it",
  "",
];

const MIME = [
  "text/plain",
  "application/x.empty",
  "application/vnd.ms-excel",
  "image/svg+xml",
  " text/plain ",
  "text/plain; charset=utf-8",
  "text",
  "/plain",
  "text/",
  "-text/plain",
  "text/p@in",
  "a".repeat(127) + "/b",
  "a".repeat(128) + "/b",
];

const URIS = [
  "urn:x-italian-pa:pcm",
  "urn:x-italian-pa:PCM",
  "URN:X-ITALIAN-PA:pcm",
  "urn:x-italian-pa:nonexistent",
  "urn:x-italian-pa:",
  "urn:foo:bar",
  "urn:foo",
  "urn:urn:foo",
  "urn:-foo:bar",
  "urn:a234567890123456789012345678901:x",
  "urn:a2345678901234567890123456789012:x",
  "urn:foo:bar%20baz",
  "urn:foo:bar%zz",
  "urn:foo:a/b?c#d",
  "urn:foo:a b",
  "https://www.example.org",
  "https://",
  "mailto:a@b.it",
  "example.org",
  "/path",
  "alias:gdpr",
  "alias:GDPR",
  "alias:nis2",
  "alias:unknown",
  "alias:",
  "",
];

function spdxCases() {
  const ids = spdx.licenses;
  const sample = ids.filter((_, i) => i % 7 === 0);
  const exceptions = spdx.exceptions.slice(0, 10);

  return [
    ...ids,
    ...spdx.deprecated,
    ...spdx.exceptions,
    ...ids.map((id) => id.toLowerCase()),
    ...sample.flatMap((id) => [`${id}+`, `${id} +`, `${id}-only`, `${id}-or-later`]),
    ...sample.flatMap((id) => exceptions.map((e) => `${id} WITH ${e}`)),
    ...sample.flatMap((id) => [
      `${id} AND MIT`,
      `${id} OR MIT`,
      `${id} and MIT`,
      `(${id} OR MIT) AND Apache-2.0`,
      `${id} OR (MIT`,
      `${id})`,
      `${id} MIT`,
      ` ${id} `,
    ]),
    "MIT",
    "mit",
    " MIT",
    "GPL-2.0-or-later AND MIT",
    "GPL-2.0-or-later",
    "GPL-2.0+",
    "LicenseRef-foo",
    "LicenseRef-",
    "DocumentRef-x:LicenseRef-y",
    "DocumentRef-x",
    "MIT WITH",
    "WITH MIT",
    "AND",
    "()",
    "(",
    "",
    "Proprietary",
    "AGPL-3.0-or-later WITH Classpath-exception-2.0",
    "GPL-3.0-only with Classpath-exception-2.0",
    "Classpath-exception-2.0",
    "EUPL-1.2 OR LicenseRef-proprietary",
  ];
}

function bcp47Cases() {
  const bases = ["en", "it", "zh", "sgn", "ar", "de", "zz", "eng", "xx"];
  const scripts = ["", "-latn", "-Hans", "-zyyy", "-abcd"];
  const regions = ["", "-us", "-IT", "-419", "-001", "-150", "-999", "-zz", "-aa", "-qm", "-xk"];
  const variants = ["", "-1901", "-valencia", "-fonipa", "-abcde", "-1901-1996"];

  return [
    ...pairs,
    ...triples,
    ...cross(bases, scripts, regions, variants),
    ...["zh-yue", "zh-yue-hk", "ar-aao", "en-aao", "sgn-ase", "zh-min-nan", "i-klingon", "x-private", "en-x-foo", "en-u-ca-gregory", "en-a-bb", "en-x", "en-", "-en", "EN-us", "en_US", "abcde", "abcd", "en-gb-oed", ""],
  ];
}

function countryCases() {
  const upper = pairs.map((p) => p.toUpperCase());
  return [...pairs, ...upper, ...pairs.map((p) => p[0].toUpperCase() + p[1]), "ITA", "I", ""];
}

function ipaCases() {
  const sample = ipaCodes.filter((_, i) => i % 50 === 0);
  return [...sample, ...sample.map((c) => c.toUpperCase()), "nonexistent", "", " pcm"];
}

const DATES = [
  "2017-04-15",
  "2020-02-29",
  "2021-02-29",
  "2021-13-01",
  "2021-04-31",
  "2021-4-1",
  "21-04-01",
  "2021-04-01T00:00:00Z",
  "0000-01-01",
  "",
];

export function formatCorpus(): FormatCase[] {
  const of = (format: string, values: string[]) =>
    [...new Set(values)].map((value) => ({ format, value }));

  return [
    ...of("url_url", URLS),
    ...of("url_http_url", URLS),
    ...of("email", EMAILS),
    ...of("date", DATES),
    ...of("mime_type", MIME),
    ...of("spdx_expression", spdxCases()),
    ...of("bcp47_strict_language_tag", bcp47Cases()),
    ...of("iso3166_1_alpha2_lower_or_upper", countryCases()),
    ...of("italian_ipa_code", ipaCases()),
    ...of("organisation_uri", URIS),
    ...of("supports_id", URIS),
  ];
}
