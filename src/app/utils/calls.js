import ValidatorWorker from "worker-loader!../validator/validator_worker.js";

export const getReleases = (versionsUrl) => {
  return fetch(versionsUrl)
    .then((res) => res.json())
    .then((data) => data.filter((d) => d.type == "dir"))
    .then((data) => data.map((d) => d.name));
};

export const getRemotePubliccode = async (yamlURL) => {
  const myHeaders = new Headers({
    Accept: "application/x-yaml",
    "Content-Type": "application/x-yaml",
  });

  const myInit = {
    method: "GET",
    // headers: myHeaders,
    // mode: "no-cors",
    // cache: "default",
  };

  const res = await fetch(yamlURL, myInit);
  // 422 should pass as it indicates a failed validation
  if (!res.ok && res.status != 422) {
    throw new Error(`fetch(${yamlURL}) returned ${res.status}`);
  }
  return await res.text();
};

export const postDataForValidation = (data) => {
  const validator = new ValidatorWorker();
  validator.postMessage(data);

  return validator;
};
