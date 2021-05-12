In order to embed the validator you need to compile it with WASM technology enabled.

```bash
$ GOOS=js GOARCH=wasm build wasm_glue.go
$ mv wasm_glue wasm_glue.wasm
```

Optionally you need to specify the Go sdk home by

```bash
$ GOOS=js GOARCH=wasm ~/sdk/go/bin/go build wasm_glue.go
$ mv wasm_glue wasm_glue.wasm
```

This because many distros use older Go versions.