// Copies the generated publiccode JSON Schema and the vocabularies used by its
// custom formats from a publiccode-json-schema checkout into
// src/app/validator/ajv/data, where the Ajv validator imports them from.
//
// Usage: tsx scripts/syncJsonSchema.ts [path to publiccode-json-schema]
// (default: ../publiccode-json-schema)
import { copyFile, mkdir, readdir } from "fs/promises";
import { join, resolve } from "path";

const SCHEMA_VERSION = "0.7.0";

const repo = resolve(process.argv[2] ?? "../publiccode-json-schema");
const dest = resolve("src/app/validator/ajv/data");

async function main() {
  await mkdir(join(dest, "vocab"), { recursive: true });

  await copyFile(
    join(repo, `data/publiccode-schema/publiccode-schema-v${SCHEMA_VERSION}.json`),
    join(dest, "publiccode-schema.json"),
  );

  const vocab = (await readdir(join(repo, "data/vocab"))).filter((f) =>
    f.endsWith(".json"),
  );
  for (const file of vocab) {
    await copyFile(join(repo, "data/vocab", file), join(dest, "vocab", file));
  }

  console.log(`Copied schema v${SCHEMA_VERSION} and ${vocab.length} vocabularies from ${repo}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
