/** @jest-environment node */
import yaml from "js-yaml";
import serializeToPublicCode, { serializeYml } from "./yaml-serializer";

function streamFromChunks(
  chunks: Array<Uint8Array>,
): ReadableStream<Uint8Array> {
  return new ReadableStream<Uint8Array>({
    start(controller) {
      chunks.forEach((chunk) => controller.enqueue(chunk));
      controller.close();
    },
  });
}

function streamFromString(value: string): ReadableStream<Uint8Array> {
  return streamFromChunks([new TextEncoder().encode(value)]);
}

describe("serializeYml", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("throws when given an empty string", () => {
    expect(() => serializeYml("")).toThrow(
      "serializeYml: yamlString is a falsy value",
    );
  });

  it("parses a simple key/value YAML document", () => {
    expect(serializeYml("name: publiccode-editor")).toEqual({
      name: "publiccode-editor",
    });
  });

  it("parses nested objects and arrays", () => {
    const yamlString = [
      "name: publiccode-editor",
      "platforms:",
      "  - web",
      "  - mobile",
      "legal:",
      "  license: AGPL-3.0-or-later",
    ].join("\n");

    expect(serializeYml(yamlString)).toEqual({
      name: "publiccode-editor",
      platforms: ["web", "mobile"],
      legal: { license: "AGPL-3.0-or-later" },
    });
  });

  it("logs and wraps the error when js-yaml fails to parse", () => {
    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => { });
    const loadError = new Error("boom");
    jest.spyOn(yaml, "load").mockImplementation(() => {
      throw loadError;
    });

    expect(() => serializeYml("name: test")).toThrow(
      "serializeYml: error on load",
    );
    expect(consoleErrorSpy).toHaveBeenCalledWith(loadError);
  });
});

describe("default export (serializeToPublicCode)", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("resolves a publiccode object from a single-chunk stream", async () => {
    const stream = streamFromString(
      "name: publiccode-editor\nurl: https://example.com\n",
    );

    await expect(serializeToPublicCode(stream)).resolves.toEqual({
      name: "publiccode-editor",
      url: "https://example.com",
    });
  });

  it("resolves correctly when a multi-byte UTF-8 character is split across chunks", async () => {
    // "à" encodes to 2 UTF-8 bytes; splitting the chunk between them exercises
    // TextDecoder's streaming buffer (decode with {stream: true}) in readStreamAsText.
    const prefix = "name: Citt";
    const accentedChar = "à";
    const suffix = "\nurl: https://example.com\n";

    const prefixBytes = new TextEncoder().encode(prefix);
    const charBytes = new TextEncoder().encode(accentedChar);
    const suffixBytes = new TextEncoder().encode(suffix);

    const chunk1 = new Uint8Array([...prefixBytes, charBytes[0]]);
    const chunk2 = new Uint8Array([...charBytes.slice(1), ...suffixBytes]);

    const stream = streamFromChunks([chunk1, chunk2]);

    await expect(serializeToPublicCode(stream)).resolves.toEqual({
      name: "Città",
      url: "https://example.com",
    });
  });

  it("rejects when the decoded YAML is invalid", async () => {
    jest.spyOn(console, "error").mockImplementation(() => { });
    jest.spyOn(yaml, "load").mockImplementation(() => {
      throw new Error("boom");
    });

    const stream = streamFromString("name: test");

    await expect(serializeToPublicCode(stream)).rejects.toThrow(
      "serializeYml: error on load",
    );
  });

  it("rejects when the stream is empty", async () => {
    const stream = streamFromChunks([]);

    await expect(serializeToPublicCode(stream)).rejects.toThrow(
      "serializeYml: yamlString is a falsy value",
    );
  });
});
