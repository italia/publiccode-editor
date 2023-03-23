package main

import (
	"encoding/json"
	"syscall/js"

	"github.com/italia/publiccode-parser-go"
)

// Message type for data serialized
type Message struct {
	Status string      `json:"status"`
	Errors interface{} `json:"errors,omitempty"`
}

func main() {
	done := make(chan struct{}, 0)
	js.Global().Set("IsPublicCodeYmlValid", IsPublicCodeYmlValid())
	<-done
}

func reportErrorr(err error) string {
	var message = Message{Status: "ko", Errors: err}
	out, jsonerr := json.Marshal(message)
	if jsonerr != nil {
		return jsonerr.Error()
	}
	return string(out)
}

func IsPublicCodeYmlValid() js.Func {
	return js.FuncOf(func(this js.Value, args []js.Value) interface{} {
		var defaultBranch = args[1].String()
		var payload = []byte(args[0].String())
		// Handler for the Promise: this is a JS function
		// It receives two arguments, which are JS functions themselves: resolve and reject
		handler := js.FuncOf(func(this js.Value, args []js.Value) interface{} {
			resolve := args[0]
			reject := args[1]

			// Now that we have a way to return the response to JS, spawn a goroutine
			// This way, we don't block the event loop and avoid a deadlock
			go func() {
				parser, err := publiccode.NewParser("/dev/null")
				if err != nil {
					errorConstructor := js.Global().Get("Error")
					errorObject := errorConstructor.New(reportErrorr(err))
					reject.Invoke(errorObject)
				}
				parser.DisableNetwork = false
				parser.Branch = defaultBranch

				err = parser.ParseBytes(payload)
				if err != nil {
					resolve.Invoke(reportErrorr(err))
				}
				var message = Message{Status: "ok", Errors: nil}
				out, _ := json.Marshal(message)
				resolve.Invoke(string(out))
			}()

			// The handler of a Promise doesn't return any value
			return nil
		})

		// Create and return the Promise object
		promiseConstructor := js.Global().Get("Promise")
		return promiseConstructor.New(handler)
	})
}
