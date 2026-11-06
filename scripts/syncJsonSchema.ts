// Copies from a publiccode-json-schema checkout:
// - the v0 JSON Schema and the vocabularies used by its custom formats into
//   src/app/validator/ajv/data, where the Ajv validator imports them from;
// - its runtime library (versions, deprecations, country packages) and the
//   per-version form schemas into src/vendor/publiccode-schema.
//
// Usage: tsx scripts/syncJsonSchema.ts [path to publiccode-json-schema]
// (default: ../publiccode-json-schema)
import { cp, copyFile, mkdir, readdir, rm, writeFile } from "fs/promises";
import { join, resolve } from "path";

const repo = resolve(process.argv[2] ?? "../publiccode-json-schema");
const ajvData = resolve("src/app/validator/ajv/data");
const vendor = resolve("src/vendor/publiccode-schema");

// What the library needs at runtime: no fluent-json-schema definitions.
const LIBRARY = ["src/index.ts", "src/lib", "src/countries"];

async function main() {
  await mkdir(join(ajvData, "vocab"), { recursive: true });

  // v0: every 0.x version with the parser's rules (the per-version schemas
  // are stricter than the parser).
  await copyFile(
    join(repo, "data/publiccode-schema/publiccode-schema-v0.json"),
    join(ajvData, "publiccode-schema.json"),
  );

  const vocab = (await readdir(join(repo, "data/vocab"))).filter((f) =>
    f.endsWith(".json"),
  );
  for (const file of vocab) {
    await copyFile(
      join(repo, "data/vocab", file),
      join(ajvData, "vocab", file),
    );
  }

  await rm(vendor, { recursive: true, force: true });
  for (const path of LIBRARY) {
    await cp(join(repo, path), join(vendor, path), {
      recursive: true,
      filter: (src) => !src.endsWith(".md"),
    });
  }
  await cp(join(repo, "data/form-schema"), join(vendor, "data/form-schema"), {
    recursive: true,
  });
  // Imported by src/countries to check package ids.
  await mkdir(join(vendor, "data/vocab"), { recursive: true });
  await copyFile(
    join(repo, "data/vocab/countries-alpha3.json"),
    join(vendor, "data/vocab/countries-alpha3.json"),
  );
  await writeFile(
    join(vendor, "README.md"),
    "Vendored from publiccode-json-schema by `npm run sync:jsonschema`: don't edit, change it there.\n",
  );

  console.log(
    `Copied the v0 schema, ${vocab.length} vocabularies, the library and the form schemas from ${repo}`,
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
