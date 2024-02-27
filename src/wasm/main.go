//go:build js && wasm

package main

import (
	"bytes"
	"encoding/json"
	"syscall/js"

	"github.com/italia/publiccode-parser-go/v4"
)

func main() {
	js.Global().Set("IsPublicCodeYmlValid", js.FuncOf(IsPublicCodeYmlValid))
	select {}
}

func IsPublicCodeYmlValid(this js.Value, args []js.Value) interface{} {
	yaml := []byte(args[0].String())
	branch := args[1].String()

	// Handler for the Promise: this is a JS function
	// It receives two arguments, which are JS functions themselves: resolve and reject
	handler := func(this js.Value, args []js.Value) interface{} {
		resolve := args[0]
		reject := args[1]

		// Now that we have a way to return the response to JS, spawn a goroutine
		// This way, we don't block the event loop and avoid a deadlock
		go func() {
			parser, err := publiccode.NewParser(
				publiccode.ParserConfig{
					DisableNetwork: true,
					Branch: branch,
				},
			)
			if err != nil {
				reject.Invoke(js.Global().Get("Error").New(err.Error()))
			}

			publicCode, err := parser.ParseStream(bytes.NewReader(yaml))
			
			var version *uint
			if publicCode == nil {
				version = nil
			} else {
				v := publicCode.Version()
				version = &v
			}

			ret := map[string]any{
				"publicCode": publicCode,
				"results": err,
				"version": version,
			}

			out, jsonerr := json.Marshal(ret)
			if jsonerr != nil {
				reject.Invoke(js.Global().Get("Error").New(jsonerr.Error()))
			}
			resolve.Invoke((string(out)))
		}()

		// The handler of a Promise doesn't return any value
		return nil
	}

	// Create and return the Promise object
	return js.Global().Get("Promise").New(js.FuncOf(handler))
}
