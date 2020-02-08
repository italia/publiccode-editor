import { validatorUrl, validatorRemoteUrl } from "../contents/constants";

export const getReleases = versionsUrl => {
  return fetch(versionsUrl)
    .then(res => res.json())
    .then(data => data.filter(d => d.type == "dir"))
    .then(data => data.map(d => d.name));
};

export const getRemoteYml = url => {
  //return fetch(url).then(res => res.blob());
  // return fetch(url).then(res => res.text());
  //it causes cors exception on gitlab domains
  return fetch(url)
    .then(res => res.text());
};

export const passRemoteURLToValidator = yamlURL => {
  const paramsString = "url=" + yamlURL;
  // let searchParams = new URLSearchParams(paramsString);

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
    // body: searchParams // params are sent in query sting url see below in fetch
  };

  if (url == '')
    return Promise.reject(new Error('no validator url specified'));

  return fetch(url + '?' + paramsString, myInit)
    .then(res => res.text());
};

export const postDataForValidation = data => {
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
    return Promise.reject(new Error('no validator url specified'));

  return fetch(url, myInit);
};
