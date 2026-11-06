import {
  binaryTag,
  CORE_SCHEMA,
  load,
  mergeTag,
  omapTag,
  pairsTag,
  setTag,
  timestampTag,
} from "js-yaml";
import PublicCode from "./contents/publiccode";

// js-yaml 5 defaults to the YAML 1.2 core schema: keep the extra types the
// js-yaml 4 default had (e.g. dates are parsed into Date objects).
const SCHEMA = CORE_SCHEMA.withTags(
  timestampTag,
  mergeTag,
  binaryTag,
  omapTag,
  pairsTag,
  setTag,
);

async function readStreamAsText<T extends ArrayBuffer>(
  readableStream: ReadableStream<T>,
) {
  const reader = readableStream.getReader();
  let result = "";
  const decoder = new TextDecoder();

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    result += decoder.decode(value, { stream: true });
  }

  result += decoder.decode(); // Finalize decoding
  return result;
}

export const serializeYml = (yamlString: string) => {
  if (!yamlString) {
    throw new Error("serializeYml: yamlString is a falsy value");
  }
  try {
    return load(yamlString, { schema: SCHEMA });
  } catch (e) {
    console.error(e);
    throw new Error("serializeYml: error on load", { cause: e });
  }
};

const serializeToPublicCode = async (stream: ReadableStream) => {
  return (await readStreamAsText(stream).then(
    serializeYml,
  )) as Promise<PublicCode>;
};

export default async (stream: ReadableStream) => {
  return await serializeToPublicCode(stream);
};
