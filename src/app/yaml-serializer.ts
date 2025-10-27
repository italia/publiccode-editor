import yaml from "js-yaml";
import PublicCode from "./contents/publiccode";

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
    return yaml.load(yamlString);
  } catch (e) {
    console.error(e);
    throw new Error("serializeYml: error on load");
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
