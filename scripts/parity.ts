// Runs publiccode-parser-go's v0 testdata through both editor validators,
// the WASM build of the parser (public/main.wasm, as shipped) and the Ajv
// JSON Schema one, and reports every disagreement.
//
// Usage: npm run build:wasm && tsx scripts/parity.ts \
//          [testdata dir (default ../publiccode-parser-go/testdata/v0)] \
//          [report (default docs/parity-report.md)]
import { execFileSync, execSync } from "child_process";
import fs from "fs";
import { createRequire } from "module";
import path from "path";
import YAML from "yaml";
import { checkFormat, validate as validateAjv } from "publiccode-schema/validator";
import { formatCorpus } from "./formatCorpus";

interface Issue {
  key: string;
  description: string;
}
interface Outcome {
  errors: Issue[];
  warnings: Issue[];
}

const testdata = path.resolve(
  process.argv[2] ?? "../publiccode-parser-go/testdata/v0",
);
const reportPath = path.resolve(process.argv[3] ?? "docs/parity-report.md");
// The Go format oracle lives next to the vocabulary generator.
const oracleDir = path.resolve(
  process.env.JSONSCHEMA_REPO ?? "../publiccode-json-schema",
  "scripts/vocab",
);

interface FormatDiff {
  format: string;
  value: string;
  go: "valid" | "invalid" | "panic";
  ajv: boolean;
}

function compareFormats() {
  const cases = formatCorpus();
  const verdicts = JSON.parse(
    execFileSync("go", ["run", "./oracle"], {
      cwd: oracleDir,
      input: JSON.stringify(cases),
      maxBuffer: 64 * 1024 * 1024,
    }).toString(),
  ) as FormatDiff["go"][];

  const diffs: FormatDiff[] = [];
  const panics: FormatDiff[] = [];
  const totals = new Map<string, number>();
  cases.forEach(({ format, value }, i) => {
    totals.set(format, (totals.get(format) ?? 0) + 1);
    const go = verdicts[i];
    const ajv = checkFormat(format, value);
    if (go === "panic") panics.push({ format, value, go, ajv });
    else if (ajv !== (go === "valid")) diffs.push({ format, value, go, ajv });
  });

  return { totals, diffs, panics };
}

function formatReport({
  totals,
  diffs,
  panics,
}: ReturnType<typeof compareFormats>) {
  const lines = [
    "## Custom formats",
    "",
    "Each custom format of the schema is run on a generated corpus (edge cases,",
    "every SPDX id, every 2-3 letter language code, every 2 letter country code",
    "in each case...) and compared with the parser's own validators",
    "(`publiccode-json-schema/scripts/vocab/oracle`, same module versions as the",
    "WASM).",
    "",
    "| format | values | disagreements | Go panics |",
    "|---|---:|---:|---:|",
  ];
  const n = (list: FormatDiff[], format: string) =>
    list.filter((d) => d.format === format).length;
  for (const [format, total] of totals) {
    lines.push(`| \`${format}\` | ${total} | ${n(diffs, format)} | ${n(panics, format)} |`);
  }
  lines.push("");

  const row = (d: FormatDiff) =>
    `| \`${d.format}\` | \`${esc(JSON.stringify(d.value))}\` | ${d.go} | ${d.ajv ? "valid" : "invalid"} |`;

  if (diffs.length > 0) {
    lines.push("### Disagreements", "", "| format | value | Go | Ajv |", "|---|---|---|---|");
    diffs.forEach((d) => lines.push(row(d)));
    lines.push("");
  }

  if (panics.length > 0) {
    lines.push(
      "### Values that crash the Go validator",
      "",
      "go-spdx dereferences a nil token on these inputs. In the editor the panic",
      "kills the WASM Go runtime, so validation stops working until the page is",
      "reloaded. Ajv rejects them.",
      "",
      "| format | value | Go | Ajv |",
      "|---|---|---|---|",
    );
    panics.forEach((d) => lines.push(row(d)));
    lines.push("");
  }

  return lines.join("\n");
}

declare global {
  var Go: new () => {
    importObject: WebAssembly.Imports;
    run: (i: WebAssembly.Instance) => Promise<void>;
  };
  function IsPublicCodeYmlValid(
    yaml: string,
    branch: string,
    baseURL: string,
  ): Promise<string>;
}

async function loadWasm() {
  // What wasm_exec_node.js sets up before loading wasm_exec.js.
  const require = createRequire(import.meta.url);
  Object.assign(globalThis, { require, fs, path });
  require(path.resolve("public/wasm_exec.js"));

  const go = new globalThis.Go();
  const { instance } = await WebAssembly.instantiate(
    fs.readFileSync("public/main.wasm"),
    go.importObject,
  );
  void go.run(instance);
}

// Same baseURL as the editor: the `url` key, if it's a valid URL.
function baseURL(text: string) {
  try {
    return new URL(YAML.parse(text).url).href;
  } catch {
    return "";
  }
}

async function runWasm(text: string): Promise<Outcome> {
  const { results } = JSON.parse(
    await IsPublicCodeYmlValid(text, "main", baseURL(text)),
  ) as { results: Array<Issue & { type: string }> | null };

  const pick = (type: string) =>
    (results ?? [])
      .filter((r) => (type === "error") === (r.type === "error"))
      .map(({ key, description }) => ({ key, description }));

  return { errors: pick("error"), warnings: pick("warning") };
}

// The YAML layer in front of Ajv: the editor always hands it an object, here
// we have to parse the file first (yaml, as the editor's importer does).
// Both validators get the same JS string: invalid UTF-8 can't reach either
// of them in the browser.
function runAjv(text: string): Outcome {
  const docs = YAML.parseAllDocuments(text);
  if (!Array.isArray(docs)) {
    return { errors: [{ key: "", description: "empty stream" }], warnings: [] };
  }
  if (docs.length > 1) {
    return {
      errors: [{ key: "", description: "multiple YAML documents in one file are not supported" }],
      warnings: [],
    };
  }
  const doc = docs[0];
  if (doc && doc.errors.length > 0) {
    return { errors: [{ key: "", description: doc.errors[0].message }], warnings: [] };
  }

  // Keep numbers as written (`genericName: 0123...` would lose digits): the
  // Go decoder sees the source text. Except publiccodeYmlVersion, whose YAML
  // type the parser checks.
  if (doc) {
    YAML.visit(doc, {
      Pair(_, pair) {
        if (YAML.isScalar(pair.key) && pair.key.value === "publiccodeYmlVersion") {
          return YAML.visit.SKIP;
        }
      },
      Scalar(_, node) {
        if (typeof node.value === "number" && node.source) node.value = node.source;
      },
    });
  }

  return validateAjv(doc?.toJS() ?? null);
}

const keys = (issues: Issue[]) => issues.map((i) => i.key);

const WRONG_TYPE = "wrong type for this field";

// Known differences that come from how the Go parser decodes YAML, not from
// a different rule: on the first type error the decoder stops, so the parser
// also reports every later key as missing ("cascade"), and it locates type
// errors by *line*, which often names a neighbouring key ("type error key").
function classify(r: Row): string[] {
  const classes = new Set<string>();
  const wasmTypeErrors = r.wasm.errors.filter((e) => e.description === WRONG_TYPE);
  const ajvTypeErrors = r.ajv.errors.filter((e) => e.description === WRONG_TYPE);

  const unmatched = (issues: Issue[], others: Issue[], key: string) => {
    const same = issues.filter((x) => x.key === key);
    return (
      same.find((x) => !others.some((o) => o.key === key && o.description === x.description)) ??
      same[same.length - 1]
    );
  };

  for (const key of r.missingErrors) {
    const e = unmatched(r.wasm.errors, r.ajv.errors, key);
    if (e.description === WRONG_TYPE && ajvTypeErrors.length > 0) {
      classes.add("type error key");
    } else if (
      wasmTypeErrors.length > 0 &&
      /is a required field|must contain more than 0 items/.test(e.description)
    ) {
      classes.add("decode cascade");
    } else {
      classes.add("other");
    }
  }
  for (const key of r.extraErrors) {
    const e = unmatched(r.ajv.errors, r.wasm.errors, key);
    classes.add(
      e.description === WRONG_TYPE && wasmTypeErrors.length > 0
        ? "type error key"
        : "other",
    );
  }
  if (r.missingWarnings.length + r.extraWarnings.length > 0) classes.add("other");

  return [...classes];
}

// Multiset difference a - b.
function minus(a: string[], b: string[]) {
  const rest = [...b];
  return a.filter((k) => {
    const i = rest.indexOf(k);
    if (i < 0) return true;
    rest.splice(i, 1);
    return false;
  });
}

function files(dir: string): string[] {
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .flatMap((e) =>
      e.isDirectory()
        ? files(path.join(dir, e.name))
        : e.name.endsWith(".yml")
          ? [path.join(dir, e.name)]
          : [],
    )
    .sort();
}

const expected = (rel: string) =>
  rel.startsWith("invalid/")
    ? "invalid"
    : rel.startsWith("valid_with_warnings/")
      ? "valid_with_warnings"
      : "valid";

const group = (rel: string) => path.dirname(rel);

interface Row {
  file: string;
  group: string;
  expected: string;
  wasm: Outcome;
  ajv: Outcome;
  verdictAgrees: boolean;
  missingErrors: string[];
  extraErrors: string[];
  missingWarnings: string[];
  extraWarnings: string[];
}

const verdict = (o: Outcome) => (o.errors.length === 0 ? "valid" : "invalid");
const fmtKeys = (k: string[]) =>
  k.length === 0 ? "" : k.map((x) => `\`${x || "(root)"}\``).join(", ");
const esc = (s: string) => s.replace(/\|/g, "\\|").replace(/\n/g, " ");

function describe(o: Outcome) {
  return o.errors.length === 0
    ? `valid${o.warnings.length ? ` (${o.warnings.length} warnings)` : ""}`
    : `${o.errors.length} errors`;
}

function report(rows: Row[]) {
  const commit = (cwd: string) => {
    try {
      return execSync("git rev-parse --short HEAD", { cwd }).toString().trim();
    } catch {
      return "unknown";
    }
  };
  const goMod = fs.readFileSync("src/wasm/go.mod", "utf8");
  const parserVersion =
    /publiccode-parser-go\/v5 (v[^\s]+)/.exec(goMod)?.[1] ?? "unknown";

  const count = (f: (r: Row) => boolean) => rows.filter(f).length;
  const exact = (r: Row) =>
    r.missingErrors.length +
      r.extraErrors.length +
      r.missingWarnings.length +
      r.extraWarnings.length ===
    0;

  const groups = [...new Set(rows.map((r) => r.group))];
  const onlyArtefacts = (r: Row) =>
    !exact(r) && classify(r).every((c) => c !== "other");
  const lines: string[] = [];

  lines.push(
    "# Validator parity report",
    "",
    "Generated by `scripts/parity.ts`: every `.yml` in publiccode-parser-go's",
    "`testdata/v0` is validated by the WASM validator (`public/main.wasm`,",
    `parser ${parserVersion}, network disabled, as in the editor) and by the Ajv`,
    "JSON Schema validator. Errors and warnings are compared **by key**",
    "(messages are not compared).",
    "",
    `- testdata: publiccode-parser-go @ \`${commit(testdata)}\``,
    `- editor: @ \`${commit(".")}\``,
    "",
    "## Summary",
    "",
    "| | files | WASM matches testdata | Ajv matches testdata | same verdict | same error keys | same warning keys | identical |",
    "|---|---:|---:|---:|---:|---:|---:|---:|",
  );

  const summaryRow = (label: string, rs: Row[]) => {
    const c = (f: (r: Row) => boolean) => rs.filter(f).length;
    const matches = (o: Outcome, r: Row) =>
      r.expected === "invalid"
        ? o.errors.length > 0
        : o.errors.length === 0 &&
          (r.expected === "valid_with_warnings") === o.warnings.length > 0;
    lines.push(
      `| ${label} | ${rs.length} | ${c((r) => matches(r.wasm, r))} | ${c((r) => matches(r.ajv, r))} | ${c((r) => r.verdictAgrees)} | ${c((r) => r.missingErrors.length + r.extraErrors.length === 0)} | ${c((r) => r.missingWarnings.length + r.extraWarnings.length === 0)} | ${c(exact)} |`,
    );
  };
  for (const g of groups) summaryRow(`\`${g}\``, rows.filter((r) => r.group === g));
  summaryRow("**total**", rows);

  lines.push(
    "",
    "\"Matches testdata\" means: `invalid/` has errors, `valid/` has no errors and no",
    "warnings, `valid_with_warnings/` has warnings but no errors.",
    "",
    `**${count((r) => r.verdictAgrees)}/${rows.length}** files get the same valid/invalid verdict, ` +
      `**${count(exact)}/${rows.length}** the exact same error and warning keys, ` +
      `**${count((r) => exact(r) || (r.verdictAgrees && onlyArtefacts(r)))}/${rows.length}** ` +
      "when the parser's decoding artefacts (below) are not counted.",
    "",
    "Classes used below:",
    "",
    "- **decode cascade**: the Go YAML decoder stops at the first type error, so the",
    "  parser also reports every key after it as missing. Ajv reports only the type error.",
    "- **type error key**: the parser locates type errors by line and often names a",
    "  neighbouring key (`fundedBy.name` for a `fundedBy` that is a map). Ajv names the",
    "  key whose value has the wrong type.",
    "- **other**: a real difference in the rules.",
    "",
  );

  const verdictDiff = rows.filter((r) => !r.verdictAgrees);
  lines.push("## Verdict disagreements", "");
  if (verdictDiff.length === 0) {
    lines.push("None.", "");
  } else {
    lines.push(
      "| file | expected | WASM | Ajv | WASM errors | Ajv errors |",
      "|---|---|---|---|---|---|",
    );
    for (const r of verdictDiff) {
      lines.push(
        `| \`${r.file}\` | ${r.expected} | ${describe(r.wasm)} | ${describe(r.ajv)} | ${esc(r.wasm.errors.map((e) => `\`${e.key || "(root)"}\`: ${e.description}`).join("<br>"))} | ${esc(r.ajv.errors.map((e) => `\`${e.key || "(root)"}\`: ${e.description}`).join("<br>"))} |`,
      );
    }
    lines.push("");
  }

  const keyDiff = rows.filter((r) => r.verdictAgrees && !exact(r));
  lines.push(
    "## Key disagreements (same verdict)",
    "",
    "Missing = reported by WASM but not by Ajv; extra = reported by Ajv only.",
    "",
  );
  if (keyDiff.length === 0) {
    lines.push("None.", "");
  } else {
    lines.push(
      "| file | class | missing errors | extra errors | missing warnings | extra warnings |",
      "|---|---|---|---|---|---|",
    );
    for (const r of keyDiff) {
      lines.push(
        `| \`${r.file}\` | ${classify(r).join(", ")} | ${fmtKeys(r.missingErrors)} | ${fmtKeys(r.extraErrors)} | ${fmtKeys(r.missingWarnings)} | ${fmtKeys(r.extraWarnings)} |`,
      );
    }
    lines.push("");
  }

  return lines.join("\n");
}

async function main() {
  await loadWasm();

  const rows: Row[] = [];
  for (const file of files(testdata)) {
    const rel = path.relative(testdata, file);
    const text = fs.readFileSync(file, "utf8");

    const wasm = await runWasm(text);
    const ajv = runAjv(text);

    rows.push({
      file: rel,
      group: group(rel),
      expected: expected(rel),
      wasm,
      ajv,
      verdictAgrees: verdict(wasm) === verdict(ajv),
      missingErrors: minus(keys(wasm.errors), keys(ajv.errors)),
      extraErrors: minus(keys(ajv.errors), keys(wasm.errors)),
      missingWarnings: minus(keys(wasm.warnings), keys(ajv.warnings)),
      extraWarnings: minus(keys(ajv.warnings), keys(wasm.warnings)),
    });
  }

  const formats = compareFormats();

  fs.mkdirSync(path.dirname(reportPath), { recursive: true });
  fs.writeFileSync(reportPath, report(rows) + "\n" + formatReport(formats) + "\n");
  fs.writeFileSync(
    reportPath.replace(/\.md$/, ".json"),
    JSON.stringify(rows, null, 2) + "\n",
  );

  const agree = rows.filter((r) => r.verdictAgrees).length;
  console.log(
    `${agree}/${rows.length} same verdict, ${formats.diffs.length} format disagreements (${formats.panics.length} Go panics), report: ${reportPath}`,
  );
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
