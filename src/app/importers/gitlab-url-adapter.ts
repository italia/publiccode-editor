import PublicCode from "../contents/publiccode";
import { serializeYml } from "../yaml-serializer";

const URL_TEMPLATE = `:ORIGIN/api/v4/projects/:ID/repository/files/:FILE_PATH?ref=:BRANCH_NAME`;

const stripTheFirstSlash = (path: string) => path.replace(/^\//, "");

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

const atobUTF8 = (data: string) => {
  const decodedData = atob(data);
  const utf8data = new Uint8Array(decodedData.length);
  const decoder = new TextDecoder("utf-8");
  for (let i = 0; i < decodedData.length; i++) {
    utf8data[i] = decodedData.charCodeAt(i);
  }
  return decoder.decode(utf8data);
};

const decodingContent = ({ content }: { content: string }) => atobUTF8(content);

export const adaptToGitlabAPIUrl = (url: URL) => {
  const { origin, pathname } = url;

  const [projectId, rest] = pathname.split("/-/");

  const [, branchName, filepath] = rest.split("/");

  const gitlabAPI = URL_TEMPLATE.replace(":ORIGIN", origin)
    .replace(":ID", encodeURIComponent(stripTheFirstSlash(projectId)))
    .replace(":FILE_PATH", encodeURIComponent(filepath))
    .replace(":BRANCH_NAME", branchName);

  return gitlabAPI;
};

export const getContentFromGitlabBodyResponse = async (
  body: ReadableStream,
) => {
  return (await readStreamAsText(body)
    .then(JSON.parse)
    .then(decodingContent)
    .then(serializeYml)) as Promise<PublicCode>;
};
