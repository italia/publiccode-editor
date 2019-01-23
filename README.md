# publiccode.yml Editor
![Build Status](https://img.shields.io/circleci/project/github/italia/publiccode-editor/master.svg) ![Issues](https://img.shields.io/github/issues/italia/publiccode-editor.svg) ![License](https://img.shields.io/github/license/italia/publiccode-editor.svg)

> An editor to generate and/or validate a `publiccode.yml` file 

---

## Table of Contents

- [Description](#description)
- [Demo](#demo)
- [Contributing](#contributing)
- [Setup](#setup)
- [License](#license)


## Description

This node app is meant to be used to generate a valid [`publiccode.yml`](https://github.com/italia/publiccode.yml) file. 
By means of filling all the forms it is possible to automatically generate 
a YAML file compatible with the latest version of the standard. 
Such a file may be copied or downloaded locally in order to be inserterd in the
root of the target repository. 

Furthermore, the app may be used as a validator. In fact, it is possible to
paste an already existing `publiccode.yml` file inside the editor or import it
by means of the *load* button. As such, the editor will validate the imported
document and eventually it will help to fix the existing issues. 

## Demo

It is possible to try a live demo of the editor. 
The demo can be found [here](https://publiccode-editor.developers.italia.it). 
This version of the demo is automatically deployed from the master branch so it
should be considered stable.


## Contributing 

Contributions are always welcome!
If you find some problems or glitches when using the app, we warmly encourage
you to file an issue using GitHub's issue tracking feature. 
However, the `CONTRIBUTING.md` file located inside the root of the repo provides insightful details about how to collaborate in an efficient way with the community. 




### Setup
#### Manual
This is a node app. As such, you need the basic tools to interact with it. 
You can choose [npm](https://www.npmjs.com/) or
[yarn](https://yarnpkg.com/lang/en/). 

First clone (or download) the repository:
```shell
$ git clone https://github.com/italia/publiccode.yml`
```

Then open a shell, navigate to the freshly downloaded folder and digit:
```shell
$ yarn install //or npm install
```
to install the dependencies.
Now, in order to run the development server locally, you should run:

```shell
$ yarn dev //or npm run dev
```
This will expose a webserver listening to port 3000. 
As such, you may browse `http://127.0.0.1:3000` to check the app. 

#### Docker
If you want to fire a docker instance for deployment purposes, you can make use of the `Dockerfile` already in the root of the project. 
By running:
```bash
$ docker build -t publiccode-editor .
```
you can build a docker image. Subsequently, by running:
```shell
$ docker run -p 3000:80 publiccode-editor
```
you can run the docker container and see the results inside the browser at `localhost:80`

## License
This project is covered by a GNU Affero General Public License v3.0 or later. 
