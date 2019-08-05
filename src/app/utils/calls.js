import { SubmissionError } from "redux-form";

export const getReleases = versionsUrl => {
  return fetch(versionsUrl)
    .then(res => res.json())
    .then(data => data.filter(d => d.type == "dir"))
    .then(data => data.map(d => d.name));
};

export const getRemoteYml = url => {
  //return fetch(url).then(res => res.blob());
  // return fetch(url).then(res => res.text());
  return fetch(url)
    .then(res => res.json())
    .then(data => atob(data.content));
};

export const postDataForValidation = data => {
  var myHeaders = new Headers({
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  });
  const url = "http://localhost:5000/pc/payload"

  var myInit = {
    method: 'POST',
    headers: myHeaders,
    mode: 'cors',
    cache: 'default',
    body: JSON.stringify(data)
  };
  return fetch(url, myInit);
};
