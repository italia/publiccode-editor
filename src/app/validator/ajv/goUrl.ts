// Minimal port of Go's net/url parsing, enough to reproduce the URL checks
// publiccode-parser-go runs through go-playground/validator (`url`,
// `http_url`) and its own `url.ParseRequestURI` based checks.

export interface GoURL {
  scheme: string;
  opaque: string;
  host: string;
  path: string;
  fragment: string;
}

// Characters allowed unescaped in a host by Go's shouldEscape(c, encodeHost)
// (non-ASCII bytes are never rejected).
const HOST_CHAR = /^[A-Za-z0-9\-._~!$&'()*+,;=:[\]<>"%\u0080-\uffff]*$/;
const PERCENT = /%(?![0-9A-Fa-f]{2})/;

function hasCtl(s: string) {
  for (let i = 0; i < s.length; i++) {
    const c = s.charCodeAt(i);
    if (c < 0x20 || c === 0x7f) return true;
  }
  return false;
}

// getScheme: a scheme is [A-Za-z][A-Za-z0-9+-.]* followed by ':'.
function getScheme(raw: string): [string, string] | null {
  for (let i = 0; i < raw.length; i++) {
    const c = raw[i];
    if (/[A-Za-z]/.test(c)) continue;
    if (/[0-9+\-.]/.test(c)) {
      if (i === 0) return ["", raw];
      continue;
    }
    if (c === ":") {
      if (i === 0) return null; // missing protocol scheme
      return [raw.slice(0, i), raw.slice(i + 1)];
    }
    // Invalid character: no valid scheme, the whole thing is a path.
    return ["", raw];
  }
  return ["", raw];
}

function validHost(host: string) {
  if (PERCENT.test(host)) return false;
  if (host.startsWith("[")) {
    const end = host.lastIndexOf("]");
    if (end < 0) return false;
    const port = host.slice(end + 1);
    return port === "" || /^:[0-9]*$/.test(port);
  }
  const colon = host.lastIndexOf(":");
  if (colon >= 0 && !/^[0-9]*$/.test(host.slice(colon + 1))) return false;
  return HOST_CHAR.test(host);
}

const USERINFO_CHAR = /^[A-Za-z0-9\-._:~!$&'()*+,;=%@]*$/;

function parse(raw: string, viaRequest: boolean): GoURL | null {
  if (hasCtl(raw)) return null;
  if (raw === "" && viaRequest) return null;

  const scheme = getScheme(raw);
  if (!scheme) return null;

  const url: GoURL = {
    scheme: scheme[0].toLowerCase(),
    opaque: "",
    host: "",
    path: "",
    fragment: "",
  };
  let rest = scheme[1];

  if (rest.endsWith("?") && (rest.match(/\?/g) ?? []).length === 1) {
    rest = rest.slice(0, -1);
  } else {
    const q = rest.indexOf("?");
    if (q >= 0) rest = rest.slice(0, q);
  }

  if (!rest.startsWith("/")) {
    if (url.scheme !== "") {
      url.opaque = rest;
      return url;
    }
    if (viaRequest) return null;
    const colon = rest.indexOf(":");
    const slash = rest.indexOf("/");
    if (colon >= 0 && (slash < 0 || colon < slash)) return null;
  }

  if (
    (url.scheme !== "" || (!viaRequest && !rest.startsWith("///"))) &&
    rest.startsWith("//")
  ) {
    let authority = rest.slice(2);
    const slash = authority.indexOf("/");
    rest = slash >= 0 ? authority.slice(slash) : "";
    authority = slash >= 0 ? authority.slice(0, slash) : authority;

    const at = authority.lastIndexOf("@");
    const host = at >= 0 ? authority.slice(at + 1) : authority;
    if (at >= 0 && !USERINFO_CHAR.test(authority.slice(0, at))) return null;
    if (!validHost(host)) return null;
    url.host = host;
  }

  if (PERCENT.test(rest)) return null;
  url.path = rest;

  return url;
}

// url.Parse: splits off the fragment first.
export function goParse(raw: string): GoURL | null {
  const hash = raw.indexOf("#");
  const base = hash >= 0 ? raw.slice(0, hash) : raw;
  const fragment = hash >= 0 ? raw.slice(hash + 1) : "";
  if (PERCENT.test(fragment)) return null;

  const url = parse(base, false);
  if (url) url.fragment = fragment;

  return url;
}

// url.ParseRequestURI: no fragment handling, must be absolute.
export function goParseRequestURI(raw: string): GoURL | null {
  return parse(raw, true);
}
