export const validatorWasm = async () => {
  const yaml = `publiccodeYmlVersion: "0.2"
name: Medusa
url: "https://github.com/italia/developers.italia.it.git"
releaseDate: "2017-04-15"

platforms:
- web

categories:
- cloud-management

developmentStatus: development

softwareType: "standalone/other"

description:
eng:
  localisedName: Medusa
  genericName: Text Editor
  shortDescription: >
        A rather short description which
        is probably useless
  longDescription: >
        Very long description of this software, also split
        on multiple rows. You should note what the software
        is and why one should need it. This is 158 characters.
        Very long description of this software, also split
        on multiple rows. You should note what the software
        is and why one should need it. This is 316 characters.
        Very long description of this software, also split
        on multiple rows. You should note what the software
        is and why one should need it. This is 474 characters.
        Very long description of this software, also split
        on multiple rows. You should note what the software
        is and why one should need it. This is 632 characters.
  features:
      - Just one feature

legal:
license: AGPL-3.0-or-later

maintenance:
type: "community"

contacts:
  - name: Francesco Rossi

localisation:
localisationReady: true
availableLanguages:
  - eng
`;

  const path = "validator-wasm/wasm_glue.wasm";
  // eslint-disable-next-line no-undef
  const go = new Go();
  // eslint-disable-next-line no-undef
  WebAssembly.instantiateStreaming(fetch(path), go.importObject).then(
    (obj) => {
      go.run(obj.instance);
      // eslint-disable-next-line no-undef
      console.log(IsPublicCodeYmlValid(yaml));
      // console.log(obj);
      // this.setState({wasm: obj});
      // console.log(obj.instance.exports.main());
    }
  );
};
