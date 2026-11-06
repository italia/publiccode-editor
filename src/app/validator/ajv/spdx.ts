// Port of the validity check of github.com/github/go-spdx/v2 spdxexp
// ValidateLicenses (the parser's is_spdx_expression), including its scanner
// quirks: operators are case-sensitive, ids are not, `-only`/`-or-later`
// suffixes and `+` are normalised, deprecated ids are accepted.
import spdx from "./data/vocab/spdx.json";

const byUpper = (ids: string[]) => new Set(ids.map((id) => id.toUpperCase()));

const ACTIVE = byUpper(spdx.licenses);
const DEPRECATED = byUpper(spdx.deprecated);
const EXCEPTIONS = byUpper(spdx.exceptions);

const isActive = (id: string) => ACTIVE.has(id.toUpperCase());
const isDeprecated = (id: string) => DEPRECATED.has(id.toUpperCase());
const isException = (id: string) => EXCEPTIONS.has(id.toUpperCase());

type Role = "operator" | "documentRef" | "licenseRef" | "license" | "exception";
interface Token {
  role: Role;
  value: string;
}

const OPERATORS = ["WITH", "AND", "OR", "(", ")", ":", "+"];
const ID = /^[A-Za-z0-9\-.]+/;

function scan(input: string): Token[] {
  let expression = input;
  let index = 0;
  const tokens: Token[] = [];

  const hasMore = () => index < expression.length;
  const read = (next: string) => {
    if (expression.startsWith(next, index)) {
      index += next.length;
      return true;
    }
    return false;
  };
  const readID = () => {
    const m = ID.exec(expression.slice(index));
    if (!m) throw new Error(`expected id at offset ${index}`);
    index += m[0].length;
    return m[0];
  };
  const lookup = (license: string): Token | null => {
    if (isActive(license)) return { role: "license", value: license };
    if (isException(license)) return { role: "exception", value: license };
    return null;
  };
  const normalize = (license: string): Token | null => {
    const found = lookup(license);
    if (found) return found;

    if (license.endsWith("-only")) {
      const t = lookup(license.slice(0, -5));
      if (t) return t;
    }
    if (hasMore() && expression[index] === "+") {
      const t = lookup(license + "-or-later");
      if (t) {
        index++;
        return t;
      }
    }
    if (license.endsWith("-or-later")) {
      const t = lookup(license.slice(0, -9));
      if (t) {
        // Same rewrite as go-spdx, including dropping the next character.
        let rewritten = expression.slice(0, index - 9) + "+";
        if (hasMore()) rewritten += expression.slice(index + 1);
        expression = rewritten;
        index -= 9;
        return t;
      }
    }

    return isDeprecated(license) ? { role: "license", value: license } : null;
  };

  while (hasMore()) {
    while (expression[index] === " ") index++;
    if (!hasMore()) break;

    const op = OPERATORS.find(read);
    if (op) {
      if (op === "+" && index > 1 && expression[index - 2] === " ") {
        throw new Error("unexpected space before +");
      }
      tokens.push({ role: "operator", value: op });
      continue;
    }
    if (read("DocumentRef-")) {
      tokens.push({ role: "documentRef", value: readID() });
      continue;
    }
    if (read("LicenseRef-")) {
      tokens.push({ role: "licenseRef", value: readID() });
      continue;
    }

    const license = readID();
    const token = normalize(license);
    if (!token) throw new Error(`unknown license '${license}'`);
    tokens.push(token);
  }

  return tokens;
}

function parse(tokens: Token[]) {
  let index = 0;

  const hasMore = () => index < tokens.length;
  const peek = () => {
    // go-spdx dereferences a nil token here (and panics): treat as invalid.
    if (!hasMore()) throw new Error("read past end of tokens");
    return tokens[index];
  };
  const operator = (op: string) => {
    const t = peek();
    if (t.role === "operator" && t.value === op) {
      index++;
      return true;
    }
    return false;
  };

  const licenseRef = () => {
    let hasDocumentRef = false;
    if (peek().role === "documentRef") {
      hasDocumentRef = true;
      index++;
      if (!operator(":")) throw new Error("expected ':' after 'DocumentRef-...'");
    }
    if (peek().role !== "licenseRef") {
      if (hasDocumentRef) throw new Error("expected 'LicenseRef-...'");
      return false;
    }
    index++;
    return true;
  };

  const license = () => {
    if (peek().role !== "license") return false;
    index++;
    if (hasMore()) {
      operator("+");
      if (hasMore() && operator("WITH")) {
        if (!hasMore() || tokens[index].role !== "exception") {
          throw new Error("expected exception after 'WITH'");
        }
        index++;
      }
    }
    return true;
  };

  const atom = (): boolean => {
    if (operator("(")) {
      expression();
      if (!hasMore() || !operator(")")) {
        throw new Error("open parenthesis does not have a matching close parenthesis");
      }
      return true;
    }
    if (licenseRef() || license()) return true;
    throw new Error("syntax error");
  };

  const and = (): void => {
    atom();
    if (!hasMore() || !operator("AND")) return;
    if (!hasMore()) throw new Error("expected expression following AND");
    and();
  };

  const expression = (): void => {
    and();
    if (!hasMore() || !operator("OR")) return;
    if (!hasMore()) throw new Error("expected expression following OR");
    expression();
  };

  if (tokens.length === 0) throw new Error("no tokens to parse");
  expression();
  if (hasMore()) throw new Error("syntax error");
}

export function isSPDXExpression(value: string): boolean {
  if (value.toUpperCase() === "MIT") return true;

  const license = value.trim();

  if (!license.includes(" ")) {
    if (isActive(license) || isDeprecated(license)) return true;
  } else {
    const parts = license.split(/\s+/);
    if (parts.length === 3 && parts[1].toUpperCase() === "WITH") {
      return (
        isException(parts[2]) && (isActive(parts[0]) || isDeprecated(parts[0]))
      );
    }
  }

  if (license === "") return false;

  try {
    parse(scan(license));
    return true;
  } catch {
    return false;
  }
}
