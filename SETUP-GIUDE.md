# How To Setup and start

## Instal Deps and patch

use npm as described in readme.
`npm i`

after that run the patch command with

`npm run postinstall`

## Move .env-example to .env

Edit env variables with correct settings.

## Generate Wasm

To do this maybe you need to upgrade your local go version, for me is working currently with "go version go1.21.7 darwin/amd64".

Run the generation command
`npm run build:wasm`

If you receive a message "file or folder not found", create the path and move there the file you can find under `/src/generated/wasm_exec.js`

something like

```zsh
mkdir -p  YOUR_GO_HOME/misc/wasm/

cp ./src/generated/wasm_exec.js YOUR_GO_HOME/misc/wasm/wasm_exec.js
```

PS. Maybe you need root permissions so you have to previx the previous commands with `sudo`.

To know wich is "YOUR_GO_HOME" path you can run

```zsh
echo "$(go env GOROOT)"
```

### Run the project

Now you shold be able to run the frontend with the following command
`npm run dev` and webpack will run on port 8080 on your localhost.

---

For more information on how to use and contribute to this project, please read
the [`README`](README.md).
