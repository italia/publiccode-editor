# publiccode yml Editor
![Build Status](https://img.shields.io/circleci/project/github/italia/publiccode-editor/master.svg) ![Issues](https://img.shields.io/github/issues/italia/publiccode-editor.svg) ![License](https://img.shields.io/github/license/italia/publiccode-editor.svg)

> A web editor to generate and validate `publiccode.yml` files

🚧 This is the work in progress `develop` branch previewed at **https://publiccode-editor-develop.vercel.app** 🚧

Check out the [`master`](https://github.com/italia/publiccode-editor/tree/master) for the old version in production.

---

## Description

This app helps you create and validate a [`publiccode.yml`](https://github.com/publiccodeyml/publiccode.yml) file for your project.
Simply fill out the form to generate a YAML file that meets the latest standards,
which you can then download or copy to your project's root directory.

You can also use the app to check and correct an existing `publiccode.yml` file.
Just upload the file to import it, and the app will validate and help fix any issues.

## Screenshots

![Screenshot](/screenshot.png)

### Setup
#### Manual

First clone the repository:

```console
git clone https://github.com/italia/publiccode-editor.git
```

Navigate to the created directory, and run:

```console
npm install
npm run build:licenses
npm run build:wasm
```

In order to run the development server locally, you should run:

```console
npm run dev
```

This will expose a webserver listening at [`http://localhost:8080`](http://localhost:8080).

#### Static deploy

The editor is fully static and can be build with:

```console
npm run build
```

and then serve the content of `dist/` in production.

#### Docker

By running:

```console
docker build -t publiccode-editor .
```

you can build a Docker image. Subsequently, by running:

```console
docker run -p 8080:80 publiccode-editor
```

you can run the Docker container and see the results at [`http://localhost:8080`](http://localhost:8080).

## Contributing

We welcome contributions!
If you encounter any issues with the app, please file an issue on GitHub.

For guidance on how to contribute effectively, check the [`CONTRIBUTING.md`](CONTRIBUTING.md) file in the root of the repository.

## License
This project is covered by a [GNU Affero General Public License v3.0 or later](LICENSE.md) license.
