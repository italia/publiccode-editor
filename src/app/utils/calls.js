import { useCallback } from "react";
import ValidatorWorker from "worker-loader!../validator/validator_worker.js";
import { validatorUrl, validatorRemoteUrl } from "../contents/constants";

export const getReleases = versionsUrl => {
  return fetch(versionsUrl)
    .then(res => res.json())
    .then(data => data.filter(d => d.type == "dir"))
    .then(data => data.map(d => d.name));
};

export const passRemoteURLToValidator = yamlURL => {
  const encodedYamlURL = encodeURIComponent(yamlURL);
  const paramsString = `url=${encodedYamlURL}`;

  const myHeaders = new Headers({
    'Accept': 'application/x-yaml',
    'Content-Type': 'application/x-yaml'
  });
  const url = validatorRemoteUrl;

  const myInit = {
    method: 'POST',
    headers: myHeaders,
    mode: 'cors',
    cache: 'default',
  };

  if (url == '')
    return Promise.reject(new Error('No validator URL specified'));

  return fetch(`${url}?${paramsString}`, myInit)
    .then(res => {
      // 422 should pass as it indicates a failed validation
      if (! res.ok && res.status != 422) {
        throw new Error(`fetch(${url}) returned ${res.status}`);
      }
      return res.text()
    });
};

export const postDataForValidation = async (data, callback) => {
  const validator = new ValidatorWorker();
  validator.postMessage(data);
  console.log(data);

  validator.onmessage = callback;
}
export const postDataForValidationOld = data => {
  var myHeaders = new Headers({
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  });
  const url = validatorUrl;

  var myInit = {
    method: 'POST',
    headers: myHeaders,
    mode: 'cors',
    cache: 'default',
    body: JSON.stringify(data)
  };

  if (url == '')
    return Promise.reject(new Error('No validator URL specified'));

  return fetch(url, myInit)
    .then(res => {
      if (! res.ok && res.status != 422) {
        throw new Error(`fetch(${url}) returned ${res.status}`);
      }
      return res
    });
};
