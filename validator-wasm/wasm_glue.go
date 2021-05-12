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

func reportErrorr(err error) string {
	var message = Message{Status: "ko", Errors: err}
	out, jsonerr := json.Marshal(message)
	if jsonerr != nil {
		return jsonerr.Error()
	}
	return string(out)
}

// IsPublicCodeYmlValid return a boolean value
// whether the publiccode provided is valid
// or not
func IsPublicCodeYmlValid(this js.Value, args []js.Value) interface{} {
	parser, err := publiccode.NewParser("/dev/null")
	if err != nil {
		return reportErrorr(err)
	}
	parser.DisableNetwork = false

	err = parser.ParseBytes([]byte(args[0].String()))
	if err != nil {
		return reportErrorr(err)
	}
	var message = Message{Status: "ok", Errors: nil}
	out, _ := json.Marshal(message)
	return string(out)
}

func main() {
	done := make(chan struct{}, 0)
	js.Global().Set("IsPublicCodeYmlValid", js.FuncOf(IsPublicCodeYmlValid))
	<-done
}
