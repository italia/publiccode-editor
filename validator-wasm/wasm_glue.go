package main

import (
	"fmt"
	"syscall/js"

	"github.com/italia/publiccode-parser-go"
)

// IsPublicCodeYmlValid return a boolean value
// whether the publiccode provided is valid
// or not
func IsPublicCodeYmlValid(this js.Value, args []js.Value) interface{} {
	parser := publiccode.NewParser()
	parser.DisableNetwork = true

	err := parser.Parse([]byte(args[0].String()))
	if err != nil {
		fmt.Printf("validation ko:\n%v\n", err)
		return js.ValueOf(false)
	}
	fmt.Println("validation ok")

	return js.ValueOf(true)
}

func main() {
	done := make(chan struct{}, 0)
	js.Global().Set("IsPublicCodeYmlValid", js.FuncOf(IsPublicCodeYmlValid))
	<-done
}
