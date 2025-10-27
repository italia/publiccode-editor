import yamlSerializer from "../yaml-serializer";

const importStandard = (url: URL) =>
  fetch(url)
    .then((res) => res.body)
    .then((res) => res && yamlSerializer(res));

export default importStandard;
