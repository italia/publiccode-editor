In order to embed the validator you need to compile it with WASM technology enabled.

```console
GOOS=js GOARCH=wasm go build -o main.wasm main.go
```

Optionally you need to specify the Go sdk home by

```console
GOOS=js GOARCH=wasm ~/sdk/go/bin/go build -o main.wasm main.go
```

This because many distros use older Go versions.